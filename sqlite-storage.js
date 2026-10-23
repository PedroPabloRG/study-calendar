/* SQLite persistence for the GitHub Pages study calendar.
 * sql.js executes genuine SQLite in WebAssembly; IndexedDB stores the SQLite file.
 * No server or cross-device synchronization is provided.
 */
(function (global) {
  'use strict';

  const IDB_NAME = 'study-calendar-sqlite-v1';
  const IDB_STORE = 'database_files';
  const IDB_KEY = 'study-calendar.sqlite';
  const WASM_BASE = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.13.0/';
  const MAX_IMPORT_BYTES = 20 * 1024 * 1024;
  let sqlModule = null;
  let sqlite = null;
  let browserDB = null;
  let writes = Promise.resolve();

  function openStorage() {
    return new Promise(function (resolve, reject) {
      if (!global.indexedDB) return reject(new Error('IndexedDB no está disponible.'));
      const request = global.indexedDB.open(IDB_NAME, 1);
      request.onupgradeneeded = function () {
        const db = request.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) db.createObjectStore(IDB_STORE);
      };
      request.onsuccess = function () { resolve(request.result); };
      request.onerror = function () { reject(request.error || new Error('Error al abrir IndexedDB.')); };
      request.onblocked = function () { reject(new Error('IndexedDB bloqueado por otra pestaña.')); };
    });
  }

  function readStoredBytes() {
    return new Promise(function (resolve, reject) {
      const tx = browserDB.transaction(IDB_STORE, 'readonly');
      const req = tx.objectStore(IDB_STORE).get(IDB_KEY);
      req.onsuccess = function () { resolve(req.result || null); };
      req.onerror = function () { reject(req.error || new Error('No se pudo leer la base de datos.')); };
      tx.onerror = function () { reject(tx.error || new Error('Falló la lectura de IndexedDB.')); };
    });
  }

  function writeStoredBytes(bytes) {
    return new Promise(function (resolve, reject) {
      const tx = browserDB.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).put(new Uint8Array(bytes), IDB_KEY);
      tx.oncomplete = function () { resolve(); };
      tx.onerror = function () { reject(tx.error || new Error('Error al guardar SQLite en IndexedDB.')); };
      tx.onabort = function () { reject(tx.error || new Error('Transacción de IndexedDB cancelada.')); };
    });
  }

  function prepareSchema(connection) {
    connection.run('CREATE TABLE IF NOT EXISTS calendar_meta (key TEXT PRIMARY KEY, value TEXT NOT NULL)');
    connection.run('CREATE TABLE IF NOT EXISTS calendar_days (day TEXT PRIMARY KEY, payload TEXT NOT NULL)');
    connection.run('CREATE TABLE IF NOT EXISTS calendar_activities (id INTEGER PRIMARY KEY, payload TEXT NOT NULL)');
    connection.run('PRAGMA user_version = 1');
  }

  function getState(connection) {
    let stmt = connection.prepare('SELECT value FROM calendar_meta WHERE key = ?');
    let row = null;
    try {
      stmt.bind(['state']);
      if (stmt.step()) row = stmt.get()[0];
    } finally { stmt.free(); }
    if (row === null) return null;

    const state = JSON.parse(row);
    if (!state || typeof state !== 'object') {
      throw new Error('Datos de calendario no válidos en SQLite.');
    }
    state.days = {};
    stmt = connection.prepare('SELECT day, payload FROM calendar_days');
    try {
      while (stmt.step()) {
        const record = stmt.get();
        state.days[record[0]] = JSON.parse(record[1]);
      }
    } finally { stmt.free(); }

    state.catalog = [];
    stmt = connection.prepare('SELECT id, payload FROM calendar_activities ORDER BY id');
    try {
      while (stmt.step()) {
        const record = stmt.get();
        if (!Number.isInteger(record[0]) || record[0] < 0 || record[0] > 50000) {
          throw new Error('Índice de actividad no válido.');
        }
        state.catalog[record[0]] = JSON.parse(record[1]);
      }
    } finally { stmt.free(); }
    return state;
  }

  function putState(connection, state) {
    if (!state || typeof state !== 'object' || !state.days || typeof state.days !== 'object') {
      throw new Error('No se puede guardar un calendario inválido.');
    }
    const meta = Object.assign({}, state);
    delete meta.days;
    delete meta.catalog;
    connection.run('BEGIN TRANSACTION');
    try {
      connection.run('DELETE FROM calendar_meta');
      connection.run('DELETE FROM calendar_days');
      connection.run('DELETE FROM calendar_activities');

      let stmt = connection.prepare('INSERT INTO calendar_meta(key, value) VALUES (?, ?)');
      try { stmt.run(['state', JSON.stringify(meta)]); } finally { stmt.free(); }

      stmt = connection.prepare('INSERT INTO calendar_days(day, payload) VALUES (?, ?)');
      try {
        for (const day of Object.keys(state.days)) {
          stmt.run([day, JSON.stringify(state.days[day])]);
        }
      } finally { stmt.free(); }

      stmt = connection.prepare('INSERT INTO calendar_activities(id, payload) VALUES (?, ?)');
      try {
        const list = Array.isArray(state.catalog) ? state.catalog : [];
        for (let i = 0; i < list.length; i++) {
          stmt.run([i, JSON.stringify(list[i] === undefined ? null : list[i])]);
        }
      } finally { stmt.free(); }
      connection.run('COMMIT');
    } catch (error) {
      try { connection.run('ROLLBACK'); } catch (_) { /* SQLite already rolled back. */ }
      throw error;
    }
  }

  function queueWrite(bytes) {
    writes = writes.catch(function () { /* Retry a fresh snapshot after earlier failure. */ })
      .then(function () { return writeStoredBytes(bytes); });
    return writes;
  }

  async function initialize(legacyState) {
    if (typeof global.initSqlJs !== 'function') {
      throw new Error('No se pudo cargar sql.js. Revisa la conexión a Internet.');
    }
    sqlModule = await global.initSqlJs({
      locateFile: function (name) { return WASM_BASE + name; }
    });
    browserDB = await openStorage();
    const bytes = await readStoredBytes();
    sqlite = bytes ? new sqlModule.Database(new Uint8Array(bytes)) : new sqlModule.Database();
    prepareSchema(sqlite);

    let loaded = getState(sqlite);
    const incomingRev = Number(legacyState && legacyState._revision) || 0;
    const storedRev = Number(loaded && loaded._revision) || 0;
    if (!loaded || incomingRev > storedRev) {
      const migrated = legacyState && typeof legacyState === 'object' ? legacyState : {days: {}};
      putState(sqlite, migrated);
      await queueWrite(sqlite.export());
      loaded = migrated;
    }
    return loaded;
  }

  function save(state) {
    if (!sqlite || !browserDB) return Promise.reject(new Error('SQLite no inicializado.'));
    putState(sqlite, state);
    const snapshot = sqlite.export();
    return queueWrite(snapshot);
  }

  function exportDatabase() {
    if (!sqlite) throw new Error('SQLite no está disponible.');
    return sqlite.export();
  }

  async function importDatabase(bytes) {
    if (!sqlite || !sqlModule) throw new Error('SQLite no está disponible.');
    if (!bytes || bytes.byteLength < 100 || bytes.byteLength > MAX_IMPORT_BYTES) {
      throw new Error('El archivo SQLite no tiene un tamaño admitido (máx. 20 MB).');
    }
    const header = Array.from(new Uint8Array(bytes).slice(0, 16));
    const signature = 'SQLite format 3\u0000';
    if (header.map(function (c) { return String.fromCharCode(c); }).join('') !== signature) {
      throw new Error('El archivo no tiene una cabecera SQLite válida.');
    }
    const candidate = new sqlModule.Database(new Uint8Array(bytes));
    let incoming;
    try {
      const integrity = candidate.exec('PRAGMA integrity_check');
      if (!integrity.length || integrity[0].values[0][0] !== 'ok') {
        throw new Error('El archivo SQLite está dañado.');
      }
      incoming = getState(candidate);
      if (!incoming) throw new Error('Esta base SQLite no contiene un calendario compatible.');
      prepareSchema(candidate);
    } catch (error) {
      candidate.close();
      throw error;
    }

    await writes.catch(function () {});
    await writeStoredBytes(candidate.export());
    const old = sqlite;
    sqlite = candidate;
    if (old) old.close();
    return incoming;
  }

  function ready() { return !!sqlite && !!browserDB; }
  global.StudySQLite = {
    initialize: initialize,
    save: save,
    exportDatabase: exportDatabase,
    importDatabase: importDatabase,
    ready: ready
  };
})(window);
