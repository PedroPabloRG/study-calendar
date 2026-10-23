# Calendario interactivo de estudios

Aplicación web en español para planificar los días de estudio de **05:00 a 21:00**, con descansos y sábados de viaje.

## Cómo usar

Abre el archivo `index.html` en Chrome, Edge o Firefox. Selecciona fechas y marca tareas terminadas. Cada día puede tener un modo y duraciones diferentes. Los cambios se guardan en `localStorage` de tu navegador.

## Publicación en GitHub Pages

1. Ve a **Settings → Pages** del repositorio.
2. En **Build and deployment**, selecciona **Deploy from a branch**.
3. Configura **main** y **/(root)**. Guarda.
4. Una vez publicado, visita **https://pedropablorg.github.io/study-calendar/**.

## Funciones

- Calendario mensual y navegación entre fechas.
- Modos estudio, evaluación, viaje y no disponible.
- Tiempos editables y actividades completas/pendientes por día.
- Actividades universitarias visibles únicamente durante evaluaciones.
- Creación de actividades personalizadas para un día, todos los días de estudio o evaluaciones.
- Reordenamiento de actividades por día y opción de quitarlas y restaurarlas.
- **Eliminar permanentemente desde cada actividad:** junto a cada tarea verás los botones `↑`, `↓`, `Quitar`, `✎ Renombrar` y `🗑 Eliminar`. Pulsa `🗑 Eliminar` y confirma para borrar la actividad y su progreso de **todas las fechas**. También se puede borrar desde la lista de actividades quitadas, o desde «Administrar actividades» cuando la tarea no esté visible en el día actual. Para ocultarla solamente en la fecha seleccionada utiliza `Quitar`.
- **Renombrar actividades:** pulsa `✎ Renombrar` junto a una actividad visible, en la lista de quitadas o en «Administrar actividades». Introduce un nombre de 1 a 80 caracteres. Se actualizará en todas las fechas y se conservarán las duraciones, el orden y el progreso. Funciona con actividades originales y personalizadas.
- **Periodo de planificación persistente:** «Periodo guardado» muestra las fechas activas; modifica inicio y fin y pulsa `Guardar nuevo periodo` para reemplazarlas. El historial de fechas, actividades y evaluaciones anteriores no se borra.
- **Limpiar fechas sin perder datos:** `Limpiar campos` deja vacíos los dos campos de planificación, pero no modifica el periodo activo hasta que guardes uno nuevo. `Recuperar fechas guardadas` rellena los campos con el periodo activo.
- **Historial de periodos:** abre `Periodos anteriores guardados` y pulsa `Usar este periodo` para volver a seleccionar un intervalo. Los cambios se conservan en `localStorage` y también se incluyen en los respaldos JSON.
- **Persistencia de fechas de evaluación:** los campos «Evaluación desde» y «Evaluación hasta» se guardan cuando cambian. `Limpiar campos de evaluación` borra solamente esos campos, no los días ya marcados como evaluación; utiliza `Quitar evaluación` para modificar los días.
- **Verificar la actualización:** bajo el título del calendario debe aparecer `Actualización 23/10/2026 · Fechas persistentes, limpiar campos y recuperar periodos anteriores`. Si no aparece, actualiza con `Ctrl + F5` y verifica GitHub Pages.
- Evaluaciones por rango de fechas.
- Visualización del tiempo ocupado, descansos y tiempo restante.
- Exportación e importación de respaldos JSON.

**Aviso:** Los datos se guardan en el navegador local y no se sincronizan con GitHub ni con otros equipos. Exporta copias de seguridad periódicamente. Una actividad eliminada permanentemente no se recupera desde la página ni al restablecer un día. Importar un respaldo anterior puede recuperar datos borrados, porque reemplaza el almacenamiento local.
