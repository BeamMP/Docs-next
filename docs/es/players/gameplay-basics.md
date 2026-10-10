---
description: "Lo que ves y puedes hacer en BeamMP: la lista de servidores, la barra de sesión, la lista de jugadores, las etiquetas de nombre, el chat y la cola de eventos."
---
# Fundamentos de jugabilidad

Esta página explica qué cambia en BeamNG.drive cuando juegas en un servidor de BeamMP. Los ajustes de cada apartado están en [Ajustes multijugador](/es/players/multiplayer-settings).

## La lista de servidores

Después de iniciar sesión, el menú de BeamMP se abre en la lista de servidores. Los botones de la izquierda eligen qué muestra la lista:

- **Public Servers**: todos los servidores. Los servidores oficiales aparecen primero.
- **Official Servers**, **Featured Servers** y **Partner Servers**: solo los servidores con ese estado.
- **Favorites**: los servidores que añadiste con **Add Favorite**.
- **Recent**: los últimos 50 servidores a los que te conectaste, del más reciente al más antiguo. **Clear Recents** vacía la lista.
- **Direct Connect**: conéctate a un servidor por su dirección.

Para encontrar un servidor:

- Escribe en el cuadro de búsqueda para buscar por nombre de servidor.
- Haz clic en el encabezado de una columna (**Location**, **Title**, **Map** o **Players**) para ordenar. Haz clic otra vez para invertir el orden.
- Usa **Search Filters** para acotar la lista por número de jugadores (**Empty only**, **Not empty**, **Not full**, o un mínimo y un máximo con **Advanced Player Count**), **Total Mod Size**, etiquetas, versiones del servidor, ubicaciones del servidor y mapas. Con **Match all filters** activado, un servidor debe tener todas las etiquetas que selecciones. **Reset Filters** las borra.
- Haz clic en **Refresh** para volver a cargar la lista.

Haz clic en un servidor para ver sus detalles: el propietario, el mapa, la descripción, las etiquetas, los jugadores que hay en él y sus mods con su **Total Filesize:**. **Connect** te une al servidor. **Add Favorite** y **Remove Favorite** cambian tus favoritos.

En **Direct Connect**, introduce la **Server IP** y el **Server Port**, o haz clic en **Paste from Clipboard** para pegar una dirección con el formato `ip:puerto`. Si los dejas vacíos, BeamMP usa `127.0.0.1` y el puerto `30814`. **Connect** te une al servidor y **Save as Favorite** lo añade a tus favoritos.

Mientras te conectas, **Connecting to server…** muestra el progreso, incluido cada mod que se descarga. Haz clic en **Cancel** para detenerlo. Si el servidor tiene mods, primero ves la advertencia de seguridad de mods, descrita en [Seguridad de mods](/es/players/mod-safety#the-mod-security-warning).

## La barra de sesión

En una sesión, la aplicación de HUD **BeamMP Session**, en la parte superior de la pantalla, muestra el nombre del servidor, el número de **Players**, tu **Ping** en ms y un botón **Leave**. **Leave** te desconecta y te devuelve al menú principal. El botón **Events queued** aparece cuando hay cambios esperando para cargarse, como se explica en [La cola de eventos](#the-event-queue).

El menú de pausa también tiene una pestaña **BeamMP**. **Player List** muestra a todos los jugadores con su ping, y botones para copiar un nombre y abrir el perfil del jugador. **Server Details** muestra la información del servidor. La dirección del servidor está oculta hasta que haces clic en **Reveal**.

Si el servidor te echa, un mensaje muestra el motivo, con **Return to menu** y **Continue offline**.

## La lista de jugadores

La aplicación de HUD **BeamMP Player List** muestra el nombre y el ping de cada jugador. Está oculta hasta que haces clic en su botón de flecha (**<** o **>**), y el mismo botón la vuelve a ocultar. **↔** y **↕** mueven la lista en horizontal y en vertical dentro de su marco. Si **Show the player ID's** está activado, también tiene una columna con el ID de cada jugador. Un jugador con cambios en cola aparece resaltado cuando **Highlight queued players** está activado.

Una etiqueta de rol sigue al nombre cuando el jugador tiene un rol, por ejemplo `[EA]`. Las etiquetas de rol se describen en [Etiquetas de nombre](#nametags).

Al hacer clic en un nombre se ejecuta la acción que elegiste en **Playerlist left click action**. El valor predeterminado es **Queue events**. Un clic derecho en un nombre abre un menú con estas acciones:

- **Copy name**
- **Delete all vehicles**: elimina los vehículos del jugador en tu juego.
- **Queue events**
- **Switch camera to**: observa al jugador.
- **Open profile**: abre el perfil del jugador en el foro.
- **Queue deleted vehicles**: recupera los vehículos de ese jugador que eliminaste.

Los mods pueden añadir botones propios a este menú.

## Etiquetas de nombre {#nametags}

Cada jugador tiene una etiqueta de nombre sobre su vehículo. Lleva la etiqueta de rol y, opcionalmente, la distancia y los nombres de los jugadores que están observando el vehículo. Puedes ocultar las etiquetas de nombre, desvanecerlas con la distancia y mostrar la distancia. La acción de teclas **Player Nametags** oculta y muestra todas ellas.

El rol de la cuenta de BeamMP de un jugador define la etiqueta:

| Etiqueta | Etiqueta corta |
|---|---|
| `[Early Access]` | `[EA]` |
| `[Contributor]` | `[CO]` |
| `[Content Creator]` | `[CC]` |
| `[Events Team]` | `[Events]` |
| `[Support]` | `[Staff]` |
| `[BeamMP Staff]` | `[Staff]` |
| `[Moderator]` | `[Mod]` |
| `[Admin]` | `[Adm]` |
| `[BeamMP Dev]` | `[Dev]` |
| `[BeamNG Developer]`, `[BeamNG Staff]`, `[BeamNG Affiliate]` | `[BNG]` |

Los jugadores sin rol no tienen etiqueta. Un servidor también puede dar una etiqueta propia a un jugador o a un vehículo.

## Chat

El chat está de forma predeterminada en la aplicación de HUD **BeamMP Chat**. Escribe en el cuadro y envía con **Send**. Un mensaje puede tener hasta 500 caracteres. Pulsa `↑` en el cuadro para recuperar tu último mensaje. Los mensajes se desvanecen tras unos segundos y vuelven a aparecer cuando mueves el ratón sobre el chat. **↔** y **↕** mueven el chat.

Con **New chat menu** activado, el chat está en una ventana aparte que puedes sacar del juego. Consulta [La ventana de chat](/es/players/multiplayer-settings#the-chat-window) para ver sus ajustes.

## Vehículos de otros jugadores

- Los vehículos de los demás jugadores aparecen en tu juego y sus cambios de piezas se sincronizan contigo. Tus propios cambios de piezas se envían automáticamente a los demás jugadores, unos 15 segundos después de tu último cambio, cuando **Enable automatic part sync** está activado.
- Al cambiar de vehículo puedes saltarte los vehículos de otros jugadores. Activa **Disable switching to other players vehicles** para ello. Los monociclos de otros jugadores siempre se saltan.
- Si cambias de tu monociclo al vehículo de otro jugador, la cámara pasa a una vista de pasajero.
- Un vehículo que todavía no ha aparecido para ti se muestra como una esfera de color, llamada blob. Consulta [Blobs](/es/players/multiplayer-settings#blobs).
- Si un jugador genera un vehículo que usa un mod que no tienes, BeamMP lo omite y muestra un mensaje. El vehículo se queda como blob.
- Con **Show Player names on license plates** activado, una matrícula muestra el nombre del jugador al que pertenece el vehículo.
- Para proteger tu creación, activa **Enable Config Cloning Protection**. Así, los demás jugadores no podrán clonar ni guardar tu vehículo. Verán **Vehicle Clone Error** o **Vehicle Save Error**.

## La cola de eventos {#the-event-queue}

Cuando otro jugador genera o edita un vehículo, tu juego puede poner el cambio en cola en lugar de cargarlo de inmediato, para que una carga no interrumpa tu conducción. Un mensaje te avisa de que hay un cambio en cola, y el botón **Events queued** aparece en la barra de sesión. Muestra el número de apariciones en espera y después el de ediciones en espera, por ejemplo `2|1`.

Los cambios en cola se cargan cuando:

- haces clic en **Events queued**.
- pulsas la tecla que asignaste a **Queue Events**.
- haces clic en el nombre de un jugador, o seleccionas **Queue events** en su menú. Esto carga solo los cambios de ese jugador.

También se cargan automáticamente cuando llevas conduciendo despacio el tiempo suficiente, y al instante si no tienes ningún vehículo. Consulta [los ajustes de la cola de eventos](/es/players/multiplayer-settings#event-queue).

## Vehículos inestables

Las inestabilidades de la física no pausan el juego en una sesión. En su lugar, BeamMP reinicia la física de un vehículo inestable. Esto se aplica a cualquier vehículo de la sesión, tuyo o de otro jugador.

Si un mismo vehículo sigue volviéndose inestable, BeamMP lo desactiva un momento y muestra una advertencia, y luego lo vuelve a activar. Un vehículo que sigue siendo inestable después de eso se elimina, y un mensaje lo indica. Para recuperar el vehículo de otro jugador, haz clic derecho en el jugador en la lista de jugadores y selecciona **Queue deleted vehicles**.

## Acciones de teclas

En los ajustes de controles, la categoría **BeamMP** tiene estas acciones. Asígnalas a las teclas que quieras:

| Acción | Qué hace |
|---|---|
| **Bring to Front** | Vuelve a mostrar la ventana de chat después de que se haya desvanecido |
| **Player Nametags** | Muestra u oculta todas las etiquetas de nombre de los jugadores |
| **Queue Events** | Carga todos los cambios en cola |
| **Toggle Chat** | Muestra u oculta la ventana de chat |

## Servidores con mods

Cuando te conectas a un servidor que tiene mods, BeamMP muestra primero una advertencia de seguridad de mods. Lee [Seguridad de mods](/es/players/mod-safety) antes de aceptarla.
