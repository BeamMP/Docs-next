---
description: "Todos los ajustes multijugador de BeamMP explicados: generales, la cola de eventos, el monociclo predeterminado, los blobs, las etiquetas de nombre y el puerto del Launcher."
---
# Ajustes multijugador

Estos son los ajustes de la página de ajustes multijugador de BeamMP. Cada uno es una entrada plegada: ábrela para ver qué hace cuando está activado y cuando está desactivado. Si eres nuevo, empieza por [Ajustes multijugador por primera vez](/es/get-started/multiplayer-settings-quickstart).

## General

::: details Show advanced options
Si está activado, verás todos los ajustes multijugador.
Si está desactivado, solo verás los ajustes multijugador básicos.
:::

::: details Enable config cloning protection
Si está activado, otros jugadores no podrán guardar la configuración del vehículo que has generado.

Si está desactivado, otros jugadores podrán guardar la configuración del vehículo que has generado.
:::

:::: details Disable pausing caused by instabilities
Si está activado, las inestabilidades de la física no harán que tu juego se pause.

Si está desactivado, las inestabilidades de la física harán que tu juego se pause.

::: note
Se recomienda dejarlo desactivado, ya que las inestabilidades repetidas pueden hacer que el juego se cierre.
:::
::::

::: details Use simplified vehicles when available
Si está activado, el juego sustituirá los vehículos de otros jugadores por sus versiones simplificadas (las del tráfico de IA), si existen.

Si está desactivado, el juego usará los modelos de vehículo originales.
:::

:::: details New chat menu
Si está activado, el chat del juego se mostrará en una ventana de [IMGUI](https://github.com/ocornut/imgui) que, por ejemplo, se puede arrastrar fuera del juego hasta otro monitor.

Si está desactivado, el chat del juego se mostrará en la aplicación de la IU.

::: note
Arrastrar las ventanas de IMGUI fuera de la ventana principal del juego puede causar problemas de rendimiento, además de engañar al software de grabación de pantalla para que grabe la ventana del chat en lugar de la ventana principal del juego.
:::
::::

::: details Enable vehicle position smoothing
Si está activado, BeamMP usará un algoritmo para suavizar las actualizaciones de posición de los vehículos a intervalos regulares. Puede ser útil entre jugadores con un ping alto o cuando la conexión pierde muchos paquetes.

Si está desactivado, BeamMP actualizará la posición de los vehículos a medida que la reciba.
:::

::: details Skip the mod security warning popups
Si está activado, no se mostrará la ventana de seguridad de mods al intentar conectarte a un servidor con mods.

Si está desactivado, la ventana de seguridad de mods se mostrará siempre que te conectes a un servidor con mods.
:::

::: details Enable player vehicle update/edit queuing
Si está activado, las apariciones y ediciones de vehículos de otros jugadores se pondrán en una cola. Consulta la sección [Cola de eventos](#event-queue) para más detalles.

Si está desactivado, el juego cargará al instante las apariciones y ediciones de vehículos de otros jugadores.
:::

::: details Enable automatic part sync
Si está activado, las piezas de tus vehículos se sincronizarán automáticamente con los demás jugadores pasados unos segundos.

Si está desactivado, tienes que hacer clic en el botón de sincronización de piezas del selector de piezas para enviar una sincronización a los demás jugadores.
:::

::: details Disable switching to other players' vehicles
Si está activado, al cambiar de vehículo con el tabulador se saltarán los vehículos de otros jugadores.

Si está desactivado, al cambiar de vehículo con el tabulador se recorrerán todos los vehículos generados.
:::

:::: details Fade out vehicles as they get closer
Si está activado, los demás vehículos se desvanecerán a medida que se acerquen.

Si está desactivado, los demás vehículos seguirán totalmente visibles sin importar la distancia.

::: note
Esto solo afecta a la malla 3D visible de un vehículo, no a su malla física de nodos y vigas. Para desactivar también la física, tienes que activar `Simplified collision physics` en los ajustes de Gameplay.
:::
::::

::: details Show the player IDs
Si está activado, la lista de jugadores del juego tendrá una columna adicional con el ID de cada jugador. Es útil para el desarrollo o la moderación.

Si está desactivado, la lista de jugadores del juego solo mostrará las columnas del nombre del jugador y el ping.
:::

::: details Allow the serverlist to refresh ingame
Si está activado, la lista de servidores se actualizará a intervalos regulares mientras juegas. Esto puede causar picos de lag.

Si está desactivado, la lista de servidores solo se actualizará cuando abras el menú principal.
:::

## Cola de eventos {#event-queue}

::: details Highlight queued players
Si está activado, los jugadores con un evento en cola se resaltarán en la lista de jugadores del juego.

Si está desactivado, los jugadores no se resaltarán de forma individual.
:::

::: details Apply vehicle changes with
Si se establece en `Left mouse button`, al hacer clic con el botón izquierdo del ratón en el nombre de un jugador de la lista de jugadores se cargarán los eventos en cola. Al hacer clic con el botón derecho se observará a ese jugador.

Si se establece en `Right mouse button`, al hacer clic con el botón derecho del ratón en el nombre de un jugador de la lista de jugadores se cargarán los eventos en cola. Al hacer clic con el botón izquierdo se observará a ese jugador.
:::

::: details Automatically apply queued vehicle changes
Si está activado, los eventos en cola se cargarán automáticamente cuando lleves el tiempo establecido como tiempo de espera por debajo del umbral de velocidad.

Si está desactivado, los eventos en cola solo se cargarán manualmente, haciendo clic en el botón `Events` de la parte superior de la pantalla o en el nombre de un jugador de la lista de jugadores.
:::

::: details Queue apply speed threshold
Este ajuste define el umbral de velocidad de la carga automática de la cola de eventos. Tu vehículo tiene que ir más despacio que este umbral durante más tiempo que `Queue apply timeout` para que se carguen los eventos en cola.
:::

::: details Queue apply timeout
Este ajuste define el retraso de la carga automática de la cola de eventos. Tu vehículo tiene que ir más despacio que `Queue apply speed threshold` durante este tiempo para que se carguen los eventos en cola.
:::

::: details Skip queue if spectating others
Si está activado, un evento se cargará al instante si estás observando a otro jugador.

Si está desactivado, un evento se pondrá en cola igual que cuando estás centrado en tu propio vehículo.
:::

::: details Don't queue Unicycles (Snowmen/Beamlings)
Si está activado, un evento que afecte a un muñeco de nieve o a un beamling se cargará al instante.

Si está desactivado, los muñecos de nieve y los beamlings se pondrán en cola igual que los demás vehículos.
:::

## Monociclo predeterminado

::: details Default Unicycle config
Este ajuste define la variante de monociclo que se carga por defecto. Puedes elegir entre las configuraciones prediseñadas y las tuyas, si has guardado configuraciones de monociclo personalizadas.
:::

::: details Automatically save your last used Unicycle
Si está activado, tu último monociclo usado se guardará automáticamente y se volverá a cargar cuando lo generes de nuevo.

Si está desactivado, se generará tu configuración de monociclo predeterminada cada vez.
:::

## Blobs

::: details Enable blobs for unspawned vehicles
Si está activado, verás un orbe que hace de marcador de posición, o blob, en lugar de un vehículo que aún no ha aparecido.

Si está desactivado, un vehículo que aún no ha aparecido será invisible.
:::

:::: details Tune colors
::: details Visible
Si está activado, se dibujará un blob con el color indicado debajo.

Si está desactivado, no se dibujará ningún blob para la función indicada.
:::

::: details RGB HEX values
Queued vehicle: el color que usará un blob si un vehículo está en cola para aparecer. Valor predeterminado: #FF6400.

Illegal vehicle: el color que usará un blob si un vehículo es ilegal, por ejemplo por un mod que se haya cargado por otra vía. Valor predeterminado: #000000.

Deleted vehicle: el color que usará un blob si el usuario ha eliminado un vehículo. Valor predeterminado: #333333.
:::
::::

## Etiquetas de nombre

::: details Hide player nametags
Si está activado, no se dibujarán las etiquetas de nombre de los jugadores.

Si está desactivado, las etiquetas de nombre de los jugadores se dibujarán según la posición relativa de sus vehículos.
:::

::: details Show distance from other players
Si está activado, la etiqueta de nombre irá precedida de la distancia al vehículo correspondiente.

Si está desactivado, no se mostrará ninguna distancia adicional en la etiqueta de nombre.
:::

::: details Fade nametags in/out
Si está activado, las etiquetas de nombre aparecerán o se desvanecerán según `Fade distance` e `Invert nametag fade direction`.

Si está desactivado, las etiquetas de nombre se dibujarán con la opacidad estándar sin importar la distancia al vehículo correspondiente.
:::

:::: details Fade distance/Invert nametag fade direction
::: details Fade out
Las etiquetas de nombre se vuelven menos visibles cuanto más lejos está un jugador.

`Fade distance` define la distancia a la que una etiqueta de nombre se dibuja con la opacidad mínima.
:::

::: details Fade in
Las etiquetas de nombre se vuelven más visibles cuanto más lejos está un jugador.

`Fade distance` define la distancia a la que una etiqueta de nombre se dibuja con la opacidad máxima.
:::
::::

::: details Don't fully hide nametags
Si está activado, una etiqueta de nombre no puede llegar a ser totalmente invisible: conservará una opacidad mínima sin importar la distancia.

Si está desactivado, las etiquetas de nombre pueden llegar a ser totalmente invisibles.
:::

::: details Shorten nametag and role tags
Si está activado, `Nametag length limit` recortará las etiquetas de nombre y de rol al número de caracteres establecido.

Si está desactivado, las etiquetas de nombre y de rol se mostrarán completas.
:::

::: details Show spectators' nametag under vehicle nametags
Si está activado, el nombre de un espectador se añadirá debajo de la etiqueta de nombre del jugador.

Si está desactivado, no se añadirá ningún nombre de espectador a las etiquetas de nombre.
:::

::: details Same color for spectator nametags
Si está activado, el nombre de un espectador siempre tendrá un fondo gris.

Si está desactivado, el nombre de un espectador tendrá un fondo de color que refleje el rol del espectador.
:::

## Otros ajustes

:::: details Show network activity in the console
Si está activado, la actividad de red de BeamMP se mostrará en la consola.

Si está desactivado, no se mostrará más actividad de red en la consola.

::: danger
Ten cuidado con este ajuste, ya que toda la salida de la consola también se escribe en los archivos de registro.

Con este ajuste activado, pueden crecer cientos de MB en cuestión de minutos.
:::
::::

:::: details Launcher port
Este ajuste define el puerto que se usa para comunicarse con el Launcher.

Solo debe cambiarse si no se puede usar el puerto estándar, el 4444.

No olvides cambiarlo también en el lado del Launcher, modificando `Launcher.cfg`.

::: tip
El puerto indicado es solo el primero de dos: el segundo puerto que se usa es el siguiente, es decir, el puerto + 1.

El primer puerto transporta los paquetes de red principales y el segundo, los paquetes de red del juego, ambos por TCP.
:::
::::
