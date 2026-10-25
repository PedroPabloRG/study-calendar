# Calendario interactivo de estudios

Calendario web estático en español, pensado para **GitHub Pages**, con gestión de actividades, descansos, tipos de día e historial. Mide automáticamente el tiempo transcurrido entre la creación de una actividad nueva para hoy y su finalización al marcarla como completada.

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

### Reporte diario ampliado (tres clics)

Haz **tres clics seguidos sobre una misma fecha del calendario** para abrir un reporte en una ventana grande. La detección es propia del calendario y funciona incluso cuando las casillas se actualizan entre los clics. Está disponible en los tres modos de selección, sin reemplazar su funcionamiento habitual.

El reporte muestra:

- **Fecha en grande**, día de la semana y tipo de día (estudio, evaluación, proyecto, viaje, no disponible o no definido).
- **Actividades y descansos nuevos ordenados por su fecha y hora reales de creación**, registradas cuando se pulsa «Agregar»; se incluyen la duración prevista y el estado completado/pendiente.
- **Actividades predefinidas y registros antiguos sin hora registrada** en un apartado independiente, sin atribuirles horas de inicio o fin inventadas.
- **Resumen basado en los registros:** tiempo transcurrido entre creación y completado, tiempo en curso actualizado automáticamente, tareas completadas y tareas sin inicio registrado.
- Las duraciones previstas se muestran aparte de las horas efectivamente registradas; no se genera un horario hipotético.

Para cerrar, pulsa **«Cerrar reporte»** o utiliza **Esc**. En teléfonos y como alternativa accesible al triple clic, abre una fecha normalmente y pulsa **«Ver reporte del día»** en el panel de actividades.

**La vista es de consulta:** abrirla no modifica ninguna actividad, descanso, selección guardada ni registro de SQLite.

### Resumen de periodos e historial de fechas

La sección antigua **«Periodos de planificación»** fue reemplazada por tres vistas que se generan automáticamente:

- **Resumen de periodos y fechas:** cantidad de días clasificados en cada tipo (incluidos los días devueltos intencionalmente a «No definido»), número de periodos consecutivos y progreso acumulado visible.
- **Periodos clasificados:** grupos de fechas consecutivas que actualmente tienen el mismo estado; muestra inicio, fin, número de días, tiempo programado y completado. El botón **«Ver fecha»** abre la fecha inicial del periodo, cambia al mes correspondiente, desplaza la pantalla hasta la casilla y la resalta temporalmente. Se mantiene accesible con el teclado.
- **Historial de selecciones aplicadas:** cada confirmación de la selección múltiple registra la fecha/hora de la operación, el estado aplicado, las fechas exactas seleccionadas, las que cambiaron, y el estado anterior y nuevo de cada fecha. Permite revisar cambios aunque más adelante vuelvas a clasificar los mismos días.

**Importante:** los días ya clasificados antes de esta función aparecen en el resumen actual, pero no se inventan fechas de modificaciones anteriores: el historial de operaciones comienza a registrarse con las nuevas selecciones. Las fechas y la configuración de antiguos periodos permanecen en los datos guardados por compatibilidad con respaldos anteriores, aunque ya no existe el formulario de periodos activos ni limita visualmente las fechas del calendario.

El historial se guarda en el mismo SQLite local y en los respaldos JSON. **«Limpiar selección»** no modifica ni añade registros al historial; únicamente se registran operaciones confirmadas que produzcan cambios reales.

### Días de proyecto y conservación del historial

Después de asignar **Día de proyecto** desde la selección múltiple, abre una de esas fechas en modo normal y agrega actividades con las opciones **Solo este día** o **Todos los días de proyecto**. Las tareas recurrentes de proyecto se mostrarán en las demás fechas que marques con ese estado.

Al cambiar el tipo de día, las tareas completadas, nombres y orden no se eliminan. Las duraciones editadas para estudio y evaluación se recuerdan por separado para recuperarlas al volver a esos modos. Cambiar a **No definido**, **Viaje** o **No disponible** oculta las actividades sin borrar sus registros.

## Tiempo definitivo a partir de los registros guardados

El panel **«Registro automático de tiempo»** calcula el tiempo transcurrido usando las horas de inicio y finalización **efectivamente guardadas**, tanto si el inicio vino del reloj automático como si se corrigió manualmente. No se usa una barra estimada ni controles deslizantes.

| Indicador | Cómo se calcula |
| --- | --- |
| **Tiempo definitivo de actividades** | Suma de los intervalos entre inicio y finalización de las **actividades completadas** que tienen ambas horas válidas; incluye inicios o finales corregidos manualmente. |
| **Tiempo definitivo de descansos** | Suma equivalente de los **descansos completados**, tanto automáticos como personalizados. |
| **Actividades en curso** | Tiempo desde el inicio registrado (automático o ajustado) hasta el reloj actual, si no están completadas y no tienen hora de cierre. |
| **Descansos en curso** | Tiempo equivalente de pausas abiertas con un inicio registrado. |
| **Sin inicio registrado** | Se indica cuántas actividades y pausas carecen de un comienzo válido. No se les asigna una hora hipotética. |

La interfaz actualiza los contadores de tiempo abierto **cada segundo**, sin sobrescribir los formularios ni guardar datos mientras solo corre el reloj. El reporte diario ampliado muestra los mismos totales y las horas definitivas por elemento.

**Ejemplo:** si corriges la hora inicial de una actividad a las **13:00** y la marcas como completada a las **14:30**, su tiempo definitivo pasa a ser **1 hora y 30 minutos**, aunque inicialmente se hubiera creado a otra hora. Si un descanso empezó a las **13:45** y terminó a las **14:15**, queda registrado aparte como **30 minutos**.

**Procedencia de los datos:** las horas ajustadas conservan `startSource: "manual"` o `finishSource: "manual"`. Sus intervalos **sí se incluyen** en el total definitivo correspondiente y también se identifican en el desglose manual; **no hay que sumar ambas cifras de nuevo**. Las duraciones previstas siguen siendo informativas y no se usan como tiempo registrado.

Los intervalos de actividades y descansos pueden solaparse y contener inactividad, por lo que **no deben sumarse como si fueran horas de trabajo efectivas sin interrupciones**. Para fechas antiguas sin finalización registrada, el sistema permite establecer una finalización manual verificada por el usuario sin inventar el historial.

## Registro real de fecha y hora de creación

Al pulsar **«Agregar actividad»** o **«Agregar descanso»**, el navegador captura la fecha y hora **de ese instante** mediante `new Date().toISOString()` y la almacena en los datos del calendario. Para mostrarla se usa la hora local configurada en tu dispositivo (formato de 24 horas). No hay un horario ficticio que empiece a las 05:00 ni se deduce una hora real a partir de la duración.

- **Actividad creada:** almacena el campo `createdAt` en el catálogo de actividades. Una actividad recurrente mantiene la **misma fecha y hora de creación originales** cuando aparece en otros días.
- **Descanso personalizado creado:** almacena `createdAt` dentro del registro de descansos de esa fecha.
- **Duración prevista:** permanece editable en minutos, pero no se interpreta como una hora real de inicio o de finalización ni como tiempo efectivo trabajado.
- **Registros anteriores:** las actividades predefinidas, actividades antiguas sin `createdAt` y pausas automáticas aparecen como **«Sin hora de creación registrada»**. No se generan fechas retroactivas inventadas.
- **Reporte diario ampliado:** separa registros con marcas de tiempo reales (en orden cronológico de creación) de los registros históricos sin marca de tiempo.
- **Persistencia:** los campos nuevos se conservan en SQLite local, en su copia JSON y en las exportaciones posteriores. La precisión depende del reloj del dispositivo, por lo que conviene mantenerlo correctamente configurado.

**Importante:** para las actividades nuevas creadas y programadas hoy, el sistema **usa la creación como inicio del contador automático** y el clic en «Completada» como finalización. Esto mide el intervalo entre ambos eventos, no necesariamente trabajo continuo.

## Inicio automático desde la creación y finalización al completar

1. **Crear una actividad para hoy:** al pulsar **«Agregar actividad»** en la fecha actual, el navegador guarda el instante de creación (`createdAt`) y establece automáticamente el inicio de esa actividad (`activityTimes[ID].startedAt`). El reloj empieza a transcurrir sin tocar ningún control de tiempo.
2. **Marcar «Completada»:** al marcar la casilla de la actividad, se captura la fecha y hora actual del dispositivo en `finishedAt`. La medición deja de crecer y se muestra el intervalo transcurrido.
3. **Desmarcarla:** se retira la hora de finalización, pero **se conserva el inicio original**. El contador vuelve a avanzar desde ese instante hasta la próxima finalización.
4. **Consultar el reporte:** muestra las fechas de creación, inicio y finalización, el intervalo transcurrido y el estado de cada actividad; cuando está abierta, la cuenta del intervalo se actualiza automáticamente.
5. **Conservar datos antiguos:** las horas ajustadas con los antiguos deslizadores **no se borran**. Si tienen un inicio y finalización válidos y el elemento está completado, se incluyen en el tiempo definitivo, identificadas como correcciones manuales.

**Fechas y repeticiones:** un inicio automático solo se establece cuando la actividad nueva está programada en **el mismo día real de su creación**. Una actividad recurrente utiliza un registro de ejecución independiente por fecha; no se presume que trabajaste en otra fecha simplemente porque la tarea ya existía. Si una actividad antigua no tiene un inicio verificable, puede guardarse su hora de finalización al marcarla, pero el sistema no inventa una hora de comienzo ni un tiempo transcurrido.

### Editar la hora de inicio de una actividad

Debajo de cada actividad aparece **«Editar hora de inicio (HH:MM)»**. Usa el selector de hora para corregir el inicio de **esa fecha**, sin modificar la fecha de creación original ni la duración prevista. Al cambiar el valor se guarda automáticamente:

- Se acepta una hora que **ya haya ocurrido**, no un inicio futuro. Para una fecha pasada puedes corregir la hora dentro de ese día; una fecha futura no admite todavía una hora de ejecución.
- Si la actividad ya tiene una finalización, el inicio corregido no puede quedar **después** de esa hora. Si hay un error, se avisa y se conserva el valor anterior.
- Se registra `startSource: "manual"`. El tiempo transcurrido se recalcula y **sí alimenta los totales de tiempo definitivo o en curso**. Un desglose adicional lo identifica como ajustado manualmente, sin duplicarlo.
- Las actividades antiguas sin inicio pueden recibir una corrección explícita; no se les asigna una hora retrospectiva automáticamente.

### Hora definitiva de finalización de una actividad

Cada actividad incorpora **«Editar finalización (HH:MM)»** junto a su hora de inicio. Al introducir una hora definitiva, la actividad queda marcada como **completada** y se recalcula su tiempo desde el inicio que esté guardado (incluido un ajuste manual). Si la completas **hoy** pulsando su casilla, se guarda la hora real del dispositivo. En una fecha pasada, la casilla modifica el progreso, pero **no inventa una finalización de aquel día**: puedes introducirla explícitamente si la conoces.

La finalización debe estar dentro de la fecha seleccionada, haber ocurrido ya y no ser anterior al inicio. El cambio se guarda en `finishedAt`, con `finishSource: "manual"` o `"clock"`, según proceda. Si desmarcas la actividad, se borra su finalización, pero se conserva su inicio.

Los datos se mantienen en `calendar_days[fecha].activityTimes[ID]`, con `startedAt`, `finishedAt`, `startSource` y `finishSource`, y se exportan tanto en SQLite como en JSON. La hora mostrada depende del reloj y la zona horaria de tu computadora.

## Formulario de descansos y comidas

En una fecha marcada como **Libre / estudio**, **Evaluación** o **Día de proyecto**, el panel de actividades incluye el formulario **«Descansos y comidas»**.

1. En **«Descansar después de»**, elige una actividad programada para ese día.
2. Escribe un **nombre**, por ejemplo «Desayuno», «Comida», «Caminar» o «Descanso».
3. Indica una **duración en minutos** (de 5 a 960, en múltiplos de 5) y pulsa **«Agregar descanso»**. Se puede repetir para programar varias pausas, incluso después de la misma actividad.
4. Cada descanso dispone de una casilla **«Completado»**, tanto en la lista de descansos personalizados como junto a su registro diario. Marca o desmarca una pausa sin modificar los minutos previstos; las dos vistas se mantienen sincronizadas.
5. En **«Editar hora de inicio»** de cada descanso puedes corregir su hora (HH:MM), tanto si es **personalizado** como si procede del reparto **automático**. El cambio se guarda por fecha como un ajuste manual, preservando la hora original de creación cuando exista. No se permiten inicios futuros ni posteriores a una finalización registrada.
6. Pulsa **«Eliminar descanso»** en su lista de edición o **«Eliminar»** junto a la pausa en el horario. La eliminación solicita confirmación y afecta **solo a la fecha seleccionada**, nunca a las actividades. Esto funciona para pausas personalizadas y automáticas.
7. Los descansos automáticos eliminados dejan de contarse en el día y puedes recuperarlos con **«Restaurar descansos automáticos eliminados»**. Los personalizados se eliminan de su lista y pueden volver a crearse con el formulario.
8. Cada descanso tiene ahora un campo **«Hora definitiva de finalización»** (HH:MM). Puedes establecer la hora final manualmente tanto para pausas **automáticas** como **personalizadas**; al guardarla se marca el descanso como completado y se recalcula el intervalo a partir de su inicio guardado, incluyendo ajustes manuales.
9. Al marcar como completado un descanso **hoy**, se guarda su hora real de finalización. Desmarcarlo retira esa finalización y conserva el inicio. En una fecha pasada, marcar la casilla por sí solo **no inventa una hora histórica**; usa el campo de finalización para registrarla.

### Compatibilidad y recuperación de los descansos anteriores

- Los días existentes conservan sus **90 minutos de descansos automáticos previstos**, pero esos minutos ya no alimentan la medición de tiempo transcurrido de las actividades. Al eliminar una pausa automática se excluyen sus minutos de ese día sin redistribuirlos entre las restantes; su total previsto puede modificarse desde el campo automático.
- **Al agregar el primer descanso personalizado**, ese día utiliza solamente los descansos que definas: ya no se suman automáticamente los 90 minutos anteriores.
- La lista permite **eliminar incluso descansos cuya actividad asociada esté temporalmente oculta**. Esto no elimina la actividad ni sus registros.
- **«Usar distribución automática»** permite descartar las pausas personalizadas de ese día y recuperar el reparto automático, previa confirmación.
- Si quitas temporalmente una actividad, cualquier descanso colocado después de ella se conserva, pero deja de contarse mientras esa actividad no esté programada.
- En días **No definido**, **Viaje** o **No disponible** no se programan descansos.
- Cada fecha guarda sus descansos, marcas de completado, `startedAt`, `startSource`, `finishedAt` y `finishSource` en `calendar_days` de SQLite y en el respaldo JSON. Los descansos automáticos guardan sus horas en `autoBreakTimes`; las exclusiones están en `autoBreakRemoved`. Los descansos personalizados mantienen estos campos en `breakSchedule`. Los datos son independientes por fecha y conservan el historial anterior.

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
| `calendar_days` | Un registro por fecha ISO `YYYY-MM-DD`, con su tipo de día, duraciones, tareas completas, orden, descansos y marcas de inicio y finalización por actividad. |
| `calendar_activities` | Un registro por índice de actividad personalizada, incluida la fecha y hora real de creación de nuevas tareas y las marcas de eliminación. |

Se escriben las tablas de forma transaccional. El archivo SQLite completo se serializa y se conserva en IndexedDB.

### Respaldos y recuperación

- **Exportar SQLite:** descarga `calendario-estudios.sqlite`, que puedes abrir con una herramienta SQLite estándar.
- **Importar SQLite:** restaura un fichero compatible (sustituye el estado actual tras confirmar).
- **Exportar JSON / Importar JSON:** siguen disponibles para compatibilidad y recuperación.
- Haz respaldos antes de importar otro archivo o eliminar actividades definitivamente.

**Limitaciones importantes:** GitHub Pages **no ejecuta un backend SQLite**. La base de datos se guarda únicamente en el navegador y equipo utilizado; no hay sincronización automática entre dispositivos ni cuentas. Borrar los datos del sitio o usar otro perfil del navegador puede eliminar el acceso a la base local. El CDN de sql.js requiere red la primera vez que se carga (o que los archivos ya estén en caché). Una instalación con base de datos **centralizada** necesitaría un backend aparte.

## Otras funciones

- Selección automática de la fecha actual al abrir el calendario.
- Duraciones previstas editables; inicio automático al crear una actividad para hoy, finalización al marcarla como completada y un contador en vivo basado en registros.
- Añadir tareas para una fecha, días de estudio, días de evaluación o todos los días de proyecto.
- Subir/bajar y renombrar actividades; se conservan los registros asociados.
- Quitar y restaurar una tarea de un solo día, o eliminarla de **todas las fechas** después de confirmación.
- Consultar periodos consecutivos calculados desde las fechas clasificadas, su progreso y el historial de cambios de estado por selección múltiple.
- Respaldo periódico del calendario completo.

## Dependencia

El proyecto usa [sql.js](https://github.com/sql-js/sql.js) (licencia MIT) cargado desde `cdnjs.cloudflare.com`, en versión 1.13.0. No se incluyen archivos de fuentes ni claves privadas.
