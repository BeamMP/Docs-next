---
description: "Todos los ajustes multijugador de BeamMP explicados: generales, cola de eventos, blobs, interfaz, etiquetas de nombre, jugadores, avanzados y la ventana de chat."
---
# Ajustes multijugador

Estos son los ajustes de la página **BeamMP** de las opciones de BeamNG.drive, tal como están en BeamMP 4.22 para BeamNG.drive 0.39. Para abrirlos, haz clic en **Opciones** y selecciona la pestaña **BeamMP**. Todos los ajustes están siempre visibles: no hay ningún interruptor que oculte los ajustes avanzados.

Cada ajuste de abajo es una entrada plegada. Ábrela para ver su valor predeterminado y qué hace cuando está activado y cuando está desactivado. Los apartados siguen los grupos de la página: **General**, **Vehicle Update Queue**, **Blobs**, **Interfaz de usuario**, **Jugadores** y **Avanzado**. Si eres nuevo, empieza por [Ajustes multijugador por primera vez](/es/get-started/multiplayer-settings-quickstart).

## General

::: details Enable Config Cloning Protection
Valor predeterminado: desactivado.

Si está activado, otros jugadores no pueden clonar ni guardar tus vehículos. Cuando lo intentan, ven **Vehicle Clone Error** o **Vehicle Save Error**. Al cambiar el ajuste también se actualizan los vehículos que ya has generado.

Si está desactivado, otros jugadores pueden clonar y guardar tus vehículos.
:::

::: details Disable switching to other players vehicles
Valor predeterminado: desactivado.

Si está activado, al cambiar de vehículo se saltan los vehículos de otros jugadores mientras tengas un vehículo propio.

Si está desactivado, al cambiar de vehículo se recorren todos los vehículos generados.

Los monociclos de otros jugadores siempre se saltan, sea cual sea este ajuste.
:::

::: details Automatically save your last used Unicycle
Valor predeterminado: activado.

Si está activado, BeamMP guarda la configuración de tu monociclo cuando lo eliminas, y usa esa configuración la próxima vez que generes tu monociclo.

Si está desactivado, la configuración de tu monociclo no se guarda cuando lo eliminas.
:::

## Cola de eventos {#event-queue}

En el juego, este grupo se llama **Vehicle Update Queue**. Cuando otro jugador genera o cambia un vehículo, BeamMP puede retener el cambio en una cola en lugar de cargarlo de inmediato, para que una carga no interrumpa tu conducción.

Mientras hay cambios esperando, un mensaje te dice cuántos son, y la barra de sesión de la parte superior de la pantalla muestra un botón **Events queued**. Los dos números del botón son las apariciones en espera y las ediciones en espera, en ese orden. El botón solo aparece cuando hay algo en cola. Si no tienes ningún vehículo, los cambios en cola se cargan al instante.

Los cambios en cola se cargan cuando:

- haces clic en **Events queued** en la parte superior de la pantalla.
- pulsas la tecla asignada a **Queue Events**. Asígnala en la categoría **BeamMP** de los ajustes de controles.
- haces clic en el nombre de un jugador mientras **Playerlist left click action** es **Queue events**. Esto carga solo los cambios de ese jugador. **Queue events** en el menú del clic derecho del jugador hace lo mismo.
- empieza la carga automática que se describe más abajo.

::: details Enable player vehicle update/edit queuing
Valor predeterminado: activado.

Si está activado, las apariciones y ediciones de vehículos de otros jugadores esperan en la cola hasta que una de las acciones anteriores las carga.

Si está desactivado, las apariciones y ediciones de vehículos de otros jugadores se cargan al instante.
:::

::: details Automatically apply queued vehicle changes
Valor predeterminado: activado. Solo se muestra mientras la cola está activada.

Si está activado, los cambios en cola se cargan cuando tu vehículo ha estado a la velocidad de **Queue apply speed threshold** o por debajo durante el tiempo indicado en **Queue apply timeout**.

Si está desactivado, los cambios en cola solo se cargan cuando los cargas tú.
:::

::: details Queue apply speed threshold
Valor predeterminado: 2 m/s. Un control deslizante de 0 a 10 m/s. Solo se muestra mientras la carga automática está activada.

Tu vehículo tiene que ir a esta velocidad o por debajo durante el tiempo indicado en **Queue apply timeout** para que se carguen los cambios en cola.
:::

::: details Queue apply timeout
Valor predeterminado: 3 s. Un control deslizante de 0 a 20 s. Solo se muestra mientras la carga automática está activada.

Tu vehículo tiene que ir a la velocidad de **Queue apply speed threshold** o por debajo durante este tiempo para que se carguen los cambios en cola.
:::

::: details Enable automatic part sync
Valor predeterminado: activado.

Si está activado, un cambio que haces en las piezas de tu vehículo se envía a los demás jugadores unos 15 segundos después de tu último cambio.

Si está desactivado, los cambios de piezas no se envían automáticamente.
:::

::: details Skip queue if spectating others
Valor predeterminado: desactivado.

Si está activado, los cambios en cola se cargan al instante mientras el vehículo en el que estás no es el tuyo.

Si está desactivado, los cambios en cola esperan en la cola, igual que cuando conduces tu propio vehículo.
:::

::: details Don't queue Unicycles (Snowmen/Beamlings)
Valor predeterminado: activado.

Si está activado, las apariciones y ediciones de monociclos de otros jugadores se cargan al instante.

Si está desactivado, los monociclos se ponen en cola como los demás vehículos.
:::

## Blobs

Un blob es una esfera de color que ocupa el lugar de un vehículo que aún no ha aparecido para ti. Tiene uno de cuatro colores:

- El color de en cola: el vehículo está esperando en la cola.
- El color de ilegal: el vehículo no se puede generar, porque falta su mod.
- El color de eliminado: eliminaste el vehículo. Para recuperarlo, haz clic derecho en su propietario en la lista de jugadores y selecciona **Queue deleted vehicles**.
- Magenta: cualquier otro vehículo que aún no ha aparecido. No puedes cambiar este color.

::: details Enable blobs for unspawned vehicles
Valor predeterminado: activado.

Si está activado, ves un blob en lugar de cada vehículo que aún no ha aparecido.

Si está desactivado, un vehículo que aún no ha aparecido es invisible.
:::

::: details Queued vehicle
Valor predeterminado: visible, `#FF6400`.

La casilla **Queued vehicle** activa o desactiva el blob de los vehículos en cola. El campo **HEX color value (ex: #FF6400)** define su color.
:::

::: details Illegal vehicle
Valor predeterminado: visible, `#000000`.

La casilla **Illegal vehicle** activa o desactiva el blob de los vehículos que no se pueden generar. El campo **HEX color value (ex: #FF6400)** define su color.
:::

::: details Deleted vehicle
Valor predeterminado: visible, `#333333`.

La casilla **Deleted vehicle** activa o desactiva el blob de los vehículos que eliminaste. El campo **HEX color value (ex: #FF6400)** define su color.
:::

## Interfaz de usuario

::: details Skip the mod security warning popup
Valor predeterminado: desactivado.

Si está activado, la advertencia de seguridad de mods no se muestra cuando te conectas a un servidor con mods. Los mods se descargan sin preguntar.

Si está desactivado, la advertencia se muestra cada vez que te conectas a un servidor con mods. Consulta [Seguridad de mods](/es/players/mod-safety#the-mod-security-warning).
:::

::: details Allow the serverlist to refresh ingame
Valor predeterminado: desactivado.

Si está activado, la lista de servidores se puede actualizar mientras estás en una sesión. Esto puede causar picos de lag.

Si está desactivado, la lista de servidores sigue mostrando la lista de antes de unirte hasta que sales de la sesión.
:::

::: details HUD App Style
Valor predeterminado: **Old**. Las opciones son **Old** y **Redesign**.

Esto define el aspecto de las aplicaciones de HUD de BeamMP: la barra de sesión, la lista de jugadores y el chat.
:::

:::: details New chat menu
Valor predeterminado: desactivado.

Si está activado, el chat del juego se muestra en una ventana de [ImGui](https://github.com/ocornut/imgui) que puedes arrastrar fuera del juego hasta otro monitor. Consulta [La ventana de chat](#the-chat-window).

Si está desactivado, el chat del juego se muestra en la aplicación de HUD **BeamMP Chat**.

::: warning
Arrastrar una ventana de ImGui fuera de la ventana principal del juego puede causar problemas de rendimiento, y puede hacer que el software de grabación de pantalla grabe la ventana del chat en lugar del juego.
:::
::::

### Etiquetas de nombre

Los demás ajustes de las etiquetas de nombre no están disponibles mientras **Hide player nametags** está activado.

::: details Hide player nametags
Valor predeterminado: desactivado.

Si está activado, no se dibuja ninguna etiqueta de nombre.

Si está desactivado, la etiqueta de nombre de cada jugador se dibuja sobre su vehículo. La acción de teclas **Player Nametags** de los ajustes de controles oculta y muestra todas las etiquetas de nombre hasta que reinicias el juego.
:::

::: details Show distance from other players
Valor predeterminado: activado.

Si está activado, una etiqueta de nombre termina con la distancia al vehículo cuando está a más de 10 m. La distancia usa el sistema de unidades del juego.

Si está desactivado, una etiqueta de nombre no muestra la distancia.
:::

::: details Hide nametags behind objects
Valor predeterminado: desactivado.

Si está activado, los objetos, como los edificios, ocultan una etiqueta de nombre que queda detrás de ellos.

Si está desactivado, las etiquetas de nombre se dibujan por encima de todo.
:::

::: details Shorten nametag and role tags
Valor predeterminado: desactivado.

Si está activado, los nombres largos se recortan a **Nametag length limit**, y las etiquetas de rol usan su forma corta, como `[EA]` en lugar de `[Early Access]`.

Si está desactivado, los nombres y las etiquetas de rol se muestran completos.
:::

::: details Nametag length limit
Valor predeterminado: 32. Un control deslizante de 0 a 50. Disponible mientras **Shorten nametag and role tags** está activado.

Es el mayor número de caracteres de un nombre que se muestra. Un nombre que supera el límite en más de tres caracteres se recorta al límite y termina en `...`.
:::

::: details Show spectators' nametag under vehicle nametags
Valor predeterminado: activado.

Si está activado, los nombres de los jugadores que están observando un vehículo se muestran debajo de su etiqueta de nombre.

Si está desactivado, no se muestra a los espectadores.
:::

::: details Same color for spectator nametags
Valor predeterminado: desactivado. Disponible mientras **Show spectators' nametag under vehicle nametags** está activado.

Si está activado, todas las etiquetas de nombre de espectadores tienen el mismo fondo gris.

Si está desactivado, la etiqueta de nombre de un espectador tiene un fondo que refleja el rol del espectador.
:::

::: details Fade nametags in/out
Valor predeterminado: desactivado.

Si está activado, una etiqueta de nombre se desvanece con la distancia a su vehículo, según **Fade distance**. **Invert nametag fade direction** define en qué sentido se desvanece.

Si está desactivado, una etiqueta de nombre se dibuja con total opacidad a cualquier distancia.
:::

::: details Fade distance
Valor predeterminado: 40 m. Un control deslizante de 0 a 1500 m. Disponible mientras **Fade nametags in/out** está activado.

Una etiqueta de nombre es totalmente visible junto al vehículo y totalmente transparente a esta distancia. Con **Invert nametag fade direction** activado, ocurre al revés.
:::

::: details Don't fully hide nametags
Valor predeterminado: desactivado. Disponible mientras **Fade nametags in/out** está activado.

Si está activado, una etiqueta de nombre conserva una opacidad mínima del 30 por ciento, a cualquier distancia.

Si está desactivado, una etiqueta de nombre puede llegar a ser totalmente transparente.
:::

::: details Invert nametag fade direction
Valor predeterminado: desactivado. Disponible mientras **Fade nametags in/out** está activado.

Si está activado, las etiquetas de nombre son transparentes cerca del vehículo y se vuelven más visibles cuanto más lejos está.

Si está desactivado, las etiquetas de nombre son visibles cerca del vehículo y se desvanecen cuanto más lejos está.
:::

### Lista de jugadores

::: details Show the player ID's
Valor predeterminado: activado.

Si está activado, la lista de jugadores tiene una columna adicional con el ID de cada jugador. El ID es útil para el personal del servidor.

Si está desactivado, la lista de jugadores solo muestra los nombres y el ping.
:::

::: details Highlight queued players
Valor predeterminado: activado.

Si está activado, un jugador que tiene cambios en cola aparece resaltado en la lista de jugadores.

Si está desactivado, no se resalta a ningún jugador.
:::

::: details Playerlist left click action
Valor predeterminado: **Queue events**.

Esto define qué hace un clic izquierdo en el nombre de un jugador de la lista de jugadores. Las opciones son:

- **Queue events**: carga los cambios en cola de ese jugador.
- **Switch camera to**: observa al jugador.
- **Open profile**: abre el perfil del jugador en el foro.
- **Delete all vehicles**: elimina todos los vehículos del jugador en tu juego.
- **Queue deleted vehicles**: pone en cola los vehículos del jugador que eliminaste.
- **Copy name**: copia el nombre del jugador.

Un clic derecho en un nombre siempre abre un menú con todas estas acciones.
:::

## Jugadores {#players}

::: details Show Player names on license plates
Valor predeterminado: activado.

Si está activado, la matrícula del vehículo de otro jugador muestra el nombre de ese jugador.

Si está desactivado, BeamMP no cambia el texto de la matrícula.
:::

:::: details Fade out vehicles as they get closer
Valor predeterminado: desactivado.

Si está activado, los vehículos de otros jugadores se desvanecen a medida que se acercan. Son totalmente visibles a partir de 20 m y totalmente transparentes en tu posición. Esto solo funciona mientras se muestran las etiquetas de nombre.

Si está desactivado, los vehículos de otros jugadores siguen totalmente visibles a cualquier distancia.

::: info
Esto solo cambia el aspecto del vehículo, no su física. Está pensado para usarse con las colisiones desactivadas. El ajuste del propio juego para eso está en las opciones de **Jugabilidad**.
:::
::::

::: details Use simplified vehicles when available
Valor predeterminado: desactivado.

Si está activado, los vehículos de otros jugadores se sustituyen por las versiones simplificadas de tráfico de BeamNG.drive, en los vehículos que tienen una. Esto reduce la precisión de las colisiones y de los efectos visuales y mejora el rendimiento.

Si está desactivado, el juego usa los modelos de vehículo que eligió el otro jugador.
:::

## Avanzado

::: details Enable vehicle position smoothing
Valor predeterminado: desactivado.

Si está activado, BeamMP suaviza los datos de posición de los jugadores con una conexión inestable. Esto reduce los saltos de los vehículos y el efecto de goma elástica (rubber banding).

Si está desactivado, BeamMP actualiza la posición de los vehículos a medida que llega.
:::

:::: details Show network activity in the console
Valor predeterminado: desactivado.

Si está activado, la actividad de red de BeamMP se muestra en la consola.

Si está desactivado, la consola no la muestra.

::: danger
La salida de la consola también se escribe en los archivos de registro. Con este ajuste activado, pueden crecer cientos de megabytes en cuestión de minutos.
:::
::::

:::: details Launcher port
Valor predeterminado: 4444.

Este es el puerto que usa el juego para comunicarse con el Launcher. En el juego, el ajuste se muestra como **Launcher port:**, con la nota «Don't change unless you have to». Cámbialo solo si no se puede usar el puerto 4444. Pon en `Port` de `Launcher.cfg` el mismo número.

::: tip
El puerto que introduces es el primero de dos. El juego también usa el siguiente puerto: con 4444, el 4445. El primero transporta los paquetes de red principales y el segundo, los paquetes de red del juego.
:::
::::

## La ventana de chat {#the-chat-window}

Cuando **New chat menu** está activado, el chat es una ventana de ImGui con sus propios ajustes. Haz clic en el icono de engranaje de la barra de título de la ventana para abrirlos. Tienen dos pestañas, cada una con los botones **Reset to default** y **Save**. Los ajustes se guardan en `settings/BeamMP/chat.json`.

::: details Pestaña General
**Inactive fade**: activado de forma predeterminada. Si está activado, la ventana se desvanece cuando no la usas.

**Fade time**: 2,5 s de forma predeterminada, mínimo 0,1 s. Cuánto espera la ventana antes de desvanecerse.

**Fade when collapsed**: desactivado de forma predeterminada. Si está activado, la ventana también se desvanece cuando está contraída.

**Show on message**: activado de forma predeterminada. Si está activado, la ventana vuelve a aparecer cuando llega un mensaje.

**Keep active on Enter**: activado de forma predeterminada. Si está activado, el cursor se queda en el cuadro de mensaje después de pulsar `Enter`.
:::

::: details Pestaña Theming
Define los colores de la ventana: **Window Background**, **Button Background**, **Button Hovered**, **Button Active**, **Text Color**, **Primary Color** y **Secondary Color**.
:::

Las acciones de teclas **Bring to Front** y **Toggle Chat** de los ajustes de controles hacen que la ventana vuelva a aparecer después de desvanecerse, y la ocultan.
