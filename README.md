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

Los tres modos admiten trabajar con una sola fecha:

1. **Un día (consultar y asignar):** modo inicial. Haz **un solo clic** sobre una fecha: se abre su panel de actividades, queda resaltada como seleccionada y se habilita el botón **Aplicar**. No es necesario pasar a «Varios días» para clasificar una sola fecha.
2. **Varios días:** permite seleccionar **una o varias fechas** con clics independientes; un segundo clic sobre una fecha seleccionada la desmarca. En computadora, **Mayús + clic** selecciona un intervalo desde la fecha anterior.
3. **Intervalo (dos clics):** desde el **primer clic** la fecha ya está seleccionada y puedes aplicar el estado solamente a ese día. Si haces un segundo clic en otra fecha, se selecciona el intervalo completo entre ambas, incluso entre meses.
4. En **Definir como**, elige cualquiera de los seis estados (No definido, Libre / estudio, Evaluación, Día de proyecto, Viaje o No disponible), pulsa **Aplicar** y confirma. Las asignaciones se guardan en SQLite local y en el respaldo JSON.
5. **Limpiar selección** solo desmarca fechas resaltadas sin modificar sus estados. Para clasificar fechas como **No definido**, elige ese estado y pulsa **Aplicar**.

La selección activa se destaca visualmente en el calendario. Las actividades del día, las duraciones y el progreso se conservan al cambiar su clasificación. Los cambios confirmados quedan registrados en el historial de selecciones.

### Resumen de periodos e historial de fechas

La sección antigua **«Periodos de planificación»** fue reemplazada por tres vistas que se generan automáticamente:

- **Resumen de periodos y fechas:** cantidad de días clasificados en cada tipo (incluidos los días devueltos intencionalmente a «No definido»), número de periodos consecutivos y progreso acumulado visible.
- **Periodos clasificados:** grupos de fechas consecutivas que actualmente tienen el mismo estado; muestra inicio, fin, número de días, tiempo programado y completado. El botón **«Ver fecha»** abre una de sus fechas.
- **Historial de selecciones aplicadas:** cada confirmación de la selección múltiple registra la fecha/hora de la operación, el estado aplicado, las fechas exactas seleccionadas, las que cambiaron, y el estado anterior y nuevo de cada fecha. Permite revisar cambios aunque más adelante vuelvas a clasificar los mismos días.

**Importante:** los días ya clasificados antes de esta función aparecen en el resumen actual, pero no se inventan fechas de modificaciones anteriores: el historial de operaciones comienza a registrarse con las nuevas selecciones. Las fechas y la configuración de antiguos periodos permanecen en los datos guardados por compatibilidad con respaldos anteriores, aunque ya no existe el formulario de periodos activos ni limita visualmente las fechas del calendario.

El historial se guarda en el mismo SQLite local y en los respaldos JSON. **«Limpiar selección»** no modifica ni añade registros al historial; únicamente se registran operaciones confirmadas que produzcan cambios reales.

### Días de proyecto y conservación del historial

Después de asignar **Día de proyecto** desde la selección múltiple, abre una de esas fechas en modo normal y agrega actividades con las opciones **Solo este día** o **Todos los días de proyecto**. Las tareas recurrentes de proyecto se mostrarán en las demás fechas que marques con ese estado.

Al cambiar el tipo de día, las tareas completadas, nombres y orden no se eliminan. Las duraciones editadas para estudio y evaluación se recuerdan por separado para recuperarlas al volver a esos modos. Cambiar a **No definido**, **Viaje** o **No disponible** oculta las actividades sin borrar sus registros.

## Formulario de descansos y comidas

En una fecha marcada como **Libre / estudio**, **Evaluación** o **Día de proyecto**, el panel de actividades incluye el formulario **«Descansos y comidas»**.

1. En **«Descansar después de»**, elige una actividad programada para ese día.
2. Escribe un **nombre**, por ejemplo «Desayuno», «Comida», «Caminar» o «Descanso».
3. Indica una **duración en minutos** (de 5 a 960, en múltiplos de 5) y pulsa **«Agregar descanso»**. Se puede repetir para programar varias pausas, incluso después de la misma actividad.
4. Cada descanso dispone ahora de una casilla **«Completado»**, tanto en la lista de descansos personalizados como junto a su horario. Marca o desmarca una pausa sin modificar los minutos programados; las dos vistas se mantienen sincronizadas.
5. En la lista de descansos puedes editar el **nombre**, la **actividad después de la que ocurre** y la **duración**, o pulsar **«Eliminar pausa»**.
6. Los descansos aparecen en el horario con sus horas de inicio y fin. El resumen indica **«Descansos completados: X/Y»** por separado de las actividades completadas. Si las actividades y pausas superan las 16 horas disponibles, aparece una advertencia.

### Compatibilidad y recuperación de los descansos anteriores

- Los días existentes mantienen sus **90 minutos de descanso automático**, repartidos entre actividades. El total automático se puede modificar desde el mismo panel. **Los descansos automáticos también pueden marcarse como completados directamente en el horario.**
- **Al agregar el primer descanso personalizado**, ese día utiliza solamente los descansos que definas: ya no se suman automáticamente los 90 minutos anteriores.
- **«Usar distribución automática»** permite descartar las pausas personalizadas de ese día y recuperar el reparto automático, previa confirmación.
- Si quitas temporalmente una actividad, cualquier descanso colocado después de ella se conserva, pero deja de contarse mientras esa actividad no esté programada.
- En días **No definido**, **Viaje** o **No disponible** no se programan descansos.
- Cada fecha guarda sus propios descansos y su estado de completado en el registro `calendar_days` del SQLite local y en el respaldo JSON. Los horarios anteriores se mantienen sin necesidad de modificar sus datos originales; las pausas anteriores comienzan sin marcar salvo que ya tengan una marca de completado guardada.

## Persistencia SQLite (local al navegador)

Esta aplicación usa **SQLite real** mediante **sql.js 1.13.0 (WebAssembly)**. El archivo binario de la base de datos SQLite se guarda en **IndexedDB del navegador**, sin necesidad de un servidor de aplicaciones.

- `sqlite-storage.js`: carga SQLite, crea las tablas, migra los datos antiguos y almacena el fichero binario.
- `index.html`: calendario y gestión de días, tareas, intervalos y respaldos.
- Al iniciar, se migran automáticamente los datos anteriores de `localStorage` a SQLite cuando la base todavía está vacía. Una copia JSON en `localStorage` continúa como mecanismo de recuperación si SQLite o IndexedDB fallan.
- Los cambios se guardan en SQLite y en un espejo JSON local, conservando las fechas, tareas completadas, tiempos, descansos personalizados por fecha, catálogos, periodos resumidos e historial de asignaciones.
- El indicador superior informa si **SQLite está activo** o si la aplicación está operando sin él.
- Si sql.js o WebAssembly no se pueden cargar, la aplicación sigue disponible con persistencia JSON local y una advertencia visible, pero **no** está utilizando SQLite.

### Esquema SQLite

| Tabla | Contenido |
| --- | --- |
| `calendar_meta` | Configuración global, historial de asignaciones de fechas, nombres y ajustes anteriores conservados por compatibilidad (JSON por clave). |
| `calendar_days` | Un registro por fecha ISO `YYYY-MM-DD`, con su tipo de día, duraciones, tareas completas, orden y descansos personalizados. |
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
- Duraciones editables; actividades completadas y pendientes, horarios, descansos configurables con casillas de completado y tiempo disponible.
- Añadir tareas para una fecha, días de estudio, días de evaluación o todos los días de proyecto.
- Subir/bajar y renombrar actividades; se conservan los registros asociados.
- Quitar y restaurar una tarea de un solo día, o eliminarla de **todas las fechas** después de confirmación.
- Consultar periodos consecutivos calculados desde las fechas clasificadas, su progreso y el historial de cambios de estado por selección múltiple.
- Respaldo periódico del calendario completo.

## Dependencia

El proyecto usa [sql.js](https://github.com/sql-js/sql.js) (licencia MIT) cargado desde `cdnjs.cloudflare.com`, en versión 1.13.0. No se incluyen archivos de fuentes ni claves privadas.
