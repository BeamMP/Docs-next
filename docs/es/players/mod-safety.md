---
description: "La advertencia de seguridad de mods, por qué los mods locales pueden impedir que BeamMP funcione y cuatro formas de solucionar los problemas causados por mods."
---
# Seguridad de mods

Los servidores de BeamMP pueden enviar mods a tu juego. Esta página explica la advertencia que ves antes de que eso ocurra, por qué los mods locales pueden impedir que BeamMP funcione y cómo solucionarlo.

## La advertencia de seguridad de mods {#the-mod-security-warning}

Cuando te conectas a un servidor que tiene mods, BeamMP muestra la ventana **Server Mods Detected** antes de descargar nada. Te avisa de que:

- los mods del servidor se descargan e instalan automáticamente.
- los mods pueden contener código que se ejecuta en tu PC, y ese código podría ser dañino.
- debes confiar en los propietarios del servidor antes de continuar, y continúas bajo tu propia responsabilidad.
- BeamMP no se hace responsable del contenido que envíe un servidor.

Haz clic en **Download & Join** para descargar los mods y unirte. Haz clic en **Cancel & Return** para no entrar en el servidor.

Si confías en los servidores a los que te unes, puedes desactivar la advertencia con **Skip the mod security warning popup**, como se explica en [Ajustes multijugador](/es/players/multiplayer-settings). Un servidor sin mods nunca muestra la advertencia.

## ¿Por qué tengo que desactivar o quitar mis mods?

En BeamMP, el servidor al que te conectas proporciona los mods necesarios. Se descargan y se activan automáticamente al conectarte, y se quitan del juego otra vez cuando sales.

Durante una sesión, BeamMP desactiva todos los mods que el servidor no ha enviado. Las excepciones son `multiplayerbeammp`, `beammp` y `translations`. Aun así, los mods locales pueden causar problemas, aunque solo tengas uno además de BeamMP, por ejemplo cuando modifican archivos del juego. Cuando sales de un servidor que envió mods, el juego recarga su Lua.

Hay cuatro formas de solucionar los problemas causados por mods cuando usas BeamMP.

### Desactivar los mods

Antes de unirte a cualquier servidor, asegúrate de que no tienes activado ningún mod aparte de `multiplayerbeammp`. Si esto no funciona, por ejemplo porque el juego se congela o muestra una pantalla negra, o sigues teniendo problemas, prueba la siguiente solución.

### Crear una carpeta de usuario nueva

Así el juego tiene una carpeta de usuario limpia.

1. Cierra BeamNG.drive.
2. Abre el launcher de BeamNG y haz clic en **Manage User Folder** y luego en **Open user folder**.
3. Cambia el nombre de la carpeta `current`, por ejemplo a `current_old`.

![Los tres pasos: Manage User Folder en el launcher de BeamNG, Open user folder y, por último, cambiar el nombre de la carpeta current](../../assets/content/new-userfolder.png)

La próxima vez que se inicie, el juego creará una carpeta de usuario nueva y limpia.

::: warning ¡Mis ajustes y configuraciones han desaparecido! ¿Cómo los restauro?
Si has cambiado el nombre de la carpeta de usuario, has obligado al juego a crear una carpeta de usuario nueva y limpia. Puedes copiar las carpetas `settings` y `vehicles` de la carpeta a la que cambiaste el nombre (por ejemplo, `current_old`) a la carpeta nueva.
Asegúrate de que BeamNG.drive está cerrado y reemplaza todos los elementos de la carpeta de destino. Ahora deberías tener todas tus configuraciones y ajustes como estaban antes.
:::

::: warning Ten cuidado al devolver archivos a la carpeta de usuario nueva.
Si cambiar el nombre de la carpeta de usuario resolvió tus problemas, devolver los archivos antiguos podría hacer que vuelvan a aparecer.
:::

Cuando termines, inicia BeamNG.drive con el Launcher de BeamMP. `multiplayerbeammp` debería ser el único mod activo en **Repositorio** > **Gestor de modificaciones**, y el menú **Más...** debería tener la entrada **BeamMP**.
Si sigues teniendo problemas para unirte a servidores con mods, es probable que el servidor envíe mods rotos o desactualizados.

### Vaciar la caché del Launcher

El Launcher guarda en una caché los mods que ha descargado. Para vaciarla, abre la carpeta donde está instalado el Launcher de BeamMP. La caché es la carpeta `Resources` que hay dentro. Si `Launcher.cfg` tiene una entrada `CachingDirectory`, la caché está en esa carpeta.

Elimina la carpeta para borrar todos los mods en caché. Esto ayuda si necesitas más espacio en el disco o quieres limpiar mods desactualizados. El Launcher volverá a descargar los mods la próxima vez que te unas a un servidor que los necesite.

### Quitar mods de la carpeta content

Si has colocado mods en la carpeta `content`, quítalos. Abre la carpeta de instalación de BeamNG.drive, haz clic derecho en la carpeta `content` y elimínala. Después, verifica los archivos del juego desde Steam o Epic Games. Así se volverán a descargar los archivos base.

::: quote DO_NOT_INSTALL_MODS_HERE.txt
NO copies mods en esta carpeta: puede provocar mods rotos, una instalación de actualizaciones más lenta, un gestor de mods roto, un Modo seguro roto y otros problemas.
:::
