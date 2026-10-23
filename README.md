# Calendario interactivo de estudios

Calendario web estático en español, pensado para **GitHub Pages**, con estudios entre las **05:00 y las 21:00** y seguimiento de tareas, periodos y evaluaciones.

## Abrir la aplicación

- Repositorio: https://github.com/PedroPabloRG/study-calendar
- Sitio (una vez habilitado GitHub Pages): https://pedropablorg.github.io/study-calendar/
- Publicación: **Settings → Pages → Deploy from a branch → main → /(root) → Save**.

Para una prueba local, sirve este directorio mediante un servidor HTTP sencillo (por ejemplo `python -m http.server 8000`) y abre `http://localhost:8000`. La página necesita acceso inicial a la biblioteca sql.js alojada en CDN.

## Tipos de día y asignación múltiple

Todas las fechas sin asignación explícita se muestran como **No definido**. Los **seis estados** del calendario se configuran desde una **única selección múltiple**, situada encima de las fechas:

| Estado | Qué muestra el calendario |
| --- | --- |
| **No definido (limpiar días)** | Deja las fechas sin una clasificación activa y sin tareas pendientes visibles. |
| **Libre / estudio** | Cursos y actividades habituales. |
| **Evaluación** | Incluye las dos actividades universitarias; las restantes tienen inicialmente duraciones reducidas. |
| **Día de proyecto** | Muestra las actividades de proyectos, sin mezclar automáticamente los cursos o actividades universitarias. |
| **Viaje** | Día sin actividades programadas. |
| **No disponible** | Día sin actividades programadas. |

### Cómo seleccionar y asignar fechas

1. En **Seleccionar**, elige **Varios días** para marcar fechas separadas (el segundo clic desmarca) o **Intervalo (dos clics)** para seleccionar todos los días entre una fecha inicial y final.
2. Es posible cambiar de mes sin perder la selección temporal; en computadora también puedes usar **Mayús + clic** en el modo de varios días para seleccionar un tramo.
3. En **Definir como**, elige cualquiera de los seis estados, incluido **Día de proyecto**.
4. Pulsa **Aplicar a días seleccionados** y confirma. Los cambios se guardan en SQLite local y en el respaldo JSON.
5. **Limpiar selección** únicamente desmarca los días resaltados. Para cambiar su estado a **No definido**, usa esa opción del selector y después pulsa el botón de aplicar.

El modo **Un día (normal)** sigue sirviendo para abrir una fecha y consultar o gestionar sus actividades. La sección separada de clasificación por intervalos y el botón individual de proyecto se retiraron por ser redundantes. **Periodos de planificación** sigue permitiendo modificar el inicio y el fin del periodo activo y recuperar periodos anteriores; no cambia los tipos de día.

### Días de proyecto y conservación del historial

Después de asignar **Día de proyecto** desde la selección múltiple, abre una de esas fechas en modo normal y agrega actividades con las opciones **Solo este día** o **Todos los días de proyecto**. Las tareas recurrentes de proyecto se mostrarán en las demás fechas que marques con ese estado.

Al cambiar el tipo de día, las tareas completadas, nombres y orden no se eliminan. Las duraciones editadas para estudio y evaluación se recuerdan por separado para recuperarlas al volver a esos modos. Cambiar a **No definido**, **Viaje** o **No disponible** oculta las actividades sin borrar sus registros.

## Persistencia SQLite (local al navegador)

Esta aplicación usa **SQLite real** mediante **sql.js 1.13.0 (WebAssembly)**. El archivo binario de la base de datos SQLite se guarda en **IndexedDB del navegador**, sin necesidad de un servidor de aplicaciones.

- `sqlite-storage.js`: carga SQLite, crea las tablas, migra los datos antiguos y almacena el fichero binario.
- `index.html`: calendario y gestión de días, tareas, intervalos y respaldos.
- Al iniciar, se migran automáticamente los datos anteriores de `localStorage` a SQLite cuando la base todavía está vacía. Una copia JSON en `localStorage` continúa como mecanismo de recuperación si SQLite o IndexedDB fallan.
- Los cambios se guardan en SQLite y en un espejo JSON local, conservando las fechas, tareas completadas, tiempos, catálogos y periodos anteriores.
- El indicador superior informa si **SQLite está activo** o si la aplicación está operando sin él.
- Si sql.js o WebAssembly no se pueden cargar, la aplicación sigue disponible con persistencia JSON local y una advertencia visible, pero **no** está utilizando SQLite.

### Esquema SQLite

| Tabla | Contenido |
| --- | --- |
| `calendar_meta` | Configuración global, periodo activo, historial, nombres y otros ajustes (JSON por clave). |
| `calendar_days` | Un registro por fecha ISO `YYYY-MM-DD`, con su tipo de día, duraciones, tareas completas y orden. |
| `calendar_activities` | Un registro por índice de actividad personalizada, incluida la marca para elementos eliminados. |

Se escriben las tablas de forma transaccional. El archivo SQLite completo se serializa y se conserva en IndexedDB.

### Respaldos y recuperación

- **Exportar SQLite:** descarga `calendario-estudios.sqlite`, que puedes abrir con una herramienta SQLite estándar.
- **Importar SQLite:** restaura un fichero compatible (sustituye el estado actual tras confirmar).
- **Exportar JSON / Importar JSON:** siguen disponibles para compatibilidad y recuperación.
- Haz respaldos antes de importar otro archivo o eliminar actividades definitivamente.

**Limitaciones importantes:** GitHub Pages **no ejecuta un backend SQLite**. La base de datos se guarda únicamente en el navegador y equipo utilizado; no hay sincronización automática entre dispositivos ni cuentas. Borrar los datos del sitio o usar otro perfil del navegador puede eliminar el acceso a la base local. El CDN de sql.js requiere red la primera vez que se carga (o que los archivos ya estén en caché). Una instalación con base de datos **centralizada** necesitaría un backend aparte.

## Otras funciones

- Selección automática de la fecha actual al abrir el calendario.
- Duraciones editables; actividades completadas y pendientes, horarios y tiempo disponible.
- Añadir tareas para una fecha, días de estudio, días de evaluación o todos los días de proyecto.
- Subir/bajar y renombrar actividades; se conservan los registros asociados.
- Quitar y restaurar una tarea de un solo día, o eliminarla de **todas las fechas** después de confirmación.
- Guardar un nuevo periodo sin borrar los registros de otros periodos; limpiar los campos de fecha sin eliminar los datos; recuperar intervalos anteriores.
- Respaldo periódico del calendario completo.

## Dependencia

El proyecto usa [sql.js](https://github.com/sql-js/sql.js) (licencia MIT) cargado desde `cdnjs.cloudflare.com`, en versión 1.13.0. No se incluyen archivos de fuentes ni claves privadas.
