---
description: "Por qué los mods locales pueden impedir que BeamMP funcione y cuatro formas de solucionarlo: desactivar mods, crear una carpeta de usuario nueva, vaciar la caché del Launcher y limpiar la carpeta content."
---
# Seguridad de mods

BeamMP puede dejar de funcionar cuando tienes mods locales instalados. Esta página explica por qué ocurre y cómo solucionarlo.

## ¿Por qué tengo que desactivar o quitar mis mods?

En BeamMP, el servidor al que decides conectarte proporciona los mods necesarios. Se descargan y se activan automáticamente al conectarte.
Tener mods locales instalados y activos suele hacer que BeamMP no funcione bien, aunque solo tengas un mod adicional además de BeamMP.


Hay cuatro formas de solucionar los problemas causados por mods cuando usas BeamMP.

### Desactivar los mods
Antes de unirte a cualquier servidor, asegúrate de que no tienes activado ningún mod aparte de 'multiplayerbeammp'.
Si este método no funciona, por ejemplo porque el juego se congela o muestra una pantalla negra, o sigues teniendo problemas, prueba la siguiente solución.

### Crear una carpeta de usuario nueva

Así el juego tiene una carpeta de usuario limpia.

1. Cierra BeamNG.drive.
2. Abre el launcher de BeamNG y haz clic en **Manage User Folder** y luego en **Open user folder**.
3. Cambia el nombre de la carpeta `current`, por ejemplo a `current_old`.

![Los tres pasos: Manage User Folder en el launcher de BeamNG, Open user folder y, por último, cambiar el nombre de la carpeta current](../../assets/content/new-userfolder.png)

La próxima vez que se inicie, el juego creará una carpeta de usuario nueva y limpia.

::: warning ¡Mis ajustes y configuraciones han desaparecido! ¿Cómo los restauro?
Si has cambiado el nombre de la carpeta de usuario, has obligado al juego a crear una carpeta de usuario nueva y limpia. Puedes copiar las carpetas 'settings' y 'vehicles' de la carpeta a la que cambiaste el nombre (por ejemplo, `current_old`) a la nueva carpeta que ha creado.
Asegúrate de que BeamNG.Drive está cerrado y reemplaza todos los elementos en la ubicación a la que quieras copiar las carpetas. Ahora deberías tener todas tus configuraciones y ajustes como estaban antes.
:::

::: warning Ten cuidado al devolver archivos o carpetas a la carpeta de usuario nueva.
Si resolviste algún problema cambiando el nombre de la carpeta de usuario, devolver los archivos antiguos podría hacer que los problemas que tenías vuelvan a aparecer.
:::



Cuando termines, inicia BeamNG.Drive mediante el BeamMP-Launcher y deberías tener 'multiplayerbeammp' como único mod activado disponible en el repositorio, además del botón del menú principal para entrar en BeamMP.
Si sigues teniendo problemas para unirte a servidores con mods, es probable que esos servidores proporcionen mods rotos o desactualizados.

### Vaciar la caché del Launcher
Para limpiar los mods en caché de los directorios de BeamMP, ve a la ubicación de instalación de tu BeamMP-Launcher. Por defecto, la ruta sería 'C:\Users\AppData\BeamMP-Launcher\'. Allí encontrarás una carpeta 'Resources'.
Elimina esa carpeta para borrar todos los mods en caché. Esto puede ser útil si necesitas más espacio en el disco o quieres limpiar mods de BeamNG desactualizados.

### Quitar mods de la carpeta content
Si has colocado mods en la carpeta content, debes quitarlos.
Para acceder a la carpeta Beamng.drive\content\ y limpiarla de mods, abre la ubicación de instalación de BeamNG.drive.
Haz clic derecho en la carpeta `content` y elimínala. Después, verifica los archivos del juego desde Steam o Epic Games. Así se volverán a descargar los archivos base.

::: quote DO_NOT_INSTALL_MODS_HERE.txt
NO copies mods en esta carpeta: puede provocar mods rotos, una instalación de actualizaciones más lenta, un gestor de mods roto, un Modo seguro roto y otros problemas.
:::
