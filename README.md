# Calendario interactivo de estudios

Calendario web estático en español, pensado para **GitHub Pages**, con estudios entre las **05:00 y las 21:00** y seguimiento de tareas, periodos y evaluaciones.

## Abrir la aplicación

- Repositorio: https://github.com/PedroPabloRG/study-calendar
- Sitio (una vez habilitado GitHub Pages): https://pedropablorg.github.io/study-calendar/
- Publicación: **Settings → Pages → Deploy from a branch → main → /(root) → Save**.

Para una prueba local, sirve este directorio mediante un servidor HTTP sencillo (por ejemplo `python -m http.server 8000`) y abre `http://localhost:8000`. La página necesita acceso inicial a la biblioteca sql.js alojada en CDN.

## Tipos de día

**Los días sin asignación explícita se muestran como «No definido»**, y no contienen tareas pendientes. El panel de cada fecha muestra su estado sin duplicar todos los tipos en un selector.

- **No definido:** sin actividades programadas.
- **Libre / estudio:** cursos y materias normales.
- **Evaluación:** aparecen las dos actividades universitarias y se prioriza su tiempo; las demás actividades inicialmente usan la mitad de su duración.
- **Día de proyecto:** jornada para desarrollar proyectos, con tareas propias del proyecto en lugar de los cursos regulares.
- **Viaje:** sin tareas programadas.
- **No disponible:** sin tareas programadas.

### Definir o quitar un día de proyecto

1. Pon **«Seleccionar» en «Un día (normal)»** y haz clic en la fecha deseada.
2. En el panel del día, pulsa **«Marcar día de proyecto»**. El calendario mostrará ese día en azul verdoso y habilitará sus tareas de proyecto.
3. Añade actividades con **«Solo este día»** o **«Todos los días de proyecto»**. Las tareas con esta segunda opción reaparecen en otros días que también marques como proyecto.
4. Para desmarcarlo, pulsa **«Quitar día de proyecto»**: la fecha vuelve a **«No definido»**, sin borrar las actividades ni su progreso histórico.
5. Si una fecha estaba marcada como estudio, evaluación, viaje o no disponible, se pedirá confirmación antes de convertirla en proyecto; sus registros se conservarán.

Las materias habituales (Coursera, física, matemáticas, etc.) y las tareas universitarias no se muestran automáticamente durante un día de proyecto. Las tareas de proyecto tampoco se mezclan con los días de estudio.

### Selección directa de viaje, días no disponibles o días no definidos

En el calendario, utiliza el selector **«Seleccionar»** situado sobre las fechas:

1. Elige **«Varios días»** para marcar fechas separadas. Un segundo clic desmarca una fecha. En computadora, **Mayús + clic** marca todas las fechas entre la última seleccionada y la actual.
2. O elige **«Intervalo (dos clics)»** para indicar la fecha inicial y final de un rango continuo. También funciona sin teclado en teléfonos y permite navegar entre meses.
3. En **«Definir como»**, selecciona una de las tres opciones:
   - **Viaje:** marca las fechas como viaje.
   - **No disponible:** marca las fechas como no disponibles.
   - **No definido (limpiar días):** elimina la clasificación de los días seleccionados, incluso si antes eran de estudio, evaluación, viaje o no disponibles. **No borra actividades, duraciones ni progreso.**
4. Pulsa **«Aplicar a días seleccionados»** (o **«Dejar N días como «No definido»»**). Confirma el cambio para guardarlo en SQLite local y en el respaldo JSON.
5. **«Limpiar selección»** únicamente desmarca las fechas resaltadas. No modifica el estado de los días. Volver a **«Un día (normal)»** permite abrir las actividades de cada fecha.

Puedes seleccionar días de varios meses antes de aplicar los cambios. La selección temporal no se guarda: solo se guardan las asignaciones confirmadas.

### Días de estudio y evaluaciones

La sección **«Definir días de estudio y evaluación por intervalo»** se conserva solo para asignar **Libre / estudio** o **Evaluación**. Se eliminó su control redundante de limpieza: para volver un rango a **No definido**, usa la selección múltiple directamente sobre el calendario.

Así quedan organizadas las responsabilidades para evitar duplicaciones:

- **Un día (normal):** ver el estado actual, tareas y marcar/desmarcar **Día de proyecto**.
- **Selección múltiple:** asignar **Viaje**, **No disponible** o **No definido** a varios días, incluidos intervalos entre meses.
- **Intervalo de estudio/evaluación:** asignar **Libre / estudio** o **Evaluación** para periodos específicos.

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
