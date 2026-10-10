---
description: "Qué significan los códigos de error y los mensajes de la ventana del Launcher de BeamMP, como 10060, 10048 o Failed to find the game, y cómo solucionar cada uno."
---
# Códigos de error

Esta página enumera los códigos de error y los mensajes que puede mostrar el Launcher, y qué hacer en cada caso. Los mensajes son de la versión 2.8.1 del Launcher. Para los errores de la ventana de un servidor, consulta los [Códigos de error del servidor](/es/server-owners/error-codes).

El Launcher también escribe todo lo que muestra en `Launcher.log`, en la carpeta donde está el Launcher. El archivo empieza vacío cada vez que se inicia el Launcher, así que solo contiene la última ejecución. Si el Launcher se cierra de inmediato, lee ese archivo.

## Códigos de red

El número que aparece después de `error:` o `Error code:` es un código de socket de Windows. En Linux es, en su lugar, el número de error del sistema.

| Windows (Linux) | Descripción | Posible solución |
|---|---|---|
| 10048 (98) | `bind failed with error`: otra cosa ya está usando el puerto del Launcher o el siguiente. Los puertos por defecto son `4444` y `4445` | Ejecuta solo un Launcher a la vez y reinicia el PC. Si otro programa usa los puertos, [cambia el puerto del Launcher](/es/troubleshooting/launcher-port). En Linux, esto también ocurre cuando te unes a un segundo servidor: cierra el juego y el Launcher y vuelve a iniciarlos |
| 10060, 10061 (110, 111) | `Client: connect failed! Error code`: ningún servidor ha respondido en esa dirección IP y ese puerto | Si eres el propietario del servidor, revisa la redirección de puertos y las reglas del firewall en [Alojar un servidor](/es/server-owners/host-a-server). Si no lo eres, elige otro servidor o ponte en contacto con el propietario |
| 10054 (104) | La conexión ha sido restablecida por el otro extremo | El servidor al que estabas conectado se ha desconectado o se ha reiniciado. Inténtalo de nuevo más tarde |
| 10038 | `(Game) send failed with error`: el Launcher intentó enviar datos al juego después de que el juego se desconectara. La versión 2.8.0 del Launcher lo muestra | Actualiza al último Launcher |
| `DNS lookup failed! on` seguido de un nombre | El Launcher no pudo encontrar la dirección del nombre de servidor que escribiste | Comprueba el nombre. Usa en su lugar la dirección IP del servidor |

## Iniciar el juego

| Mensaje | Descripción | Posible solución |
|---|---|---|
| `Failed to find the game please launch it. Report this if the issue persists code 3` | Windows. `%LocalAppData%\BeamNG\BeamNG.Drive.ini` existe, pero el Launcher no puede leerlo | Inicia BeamNG.drive una vez para que vuelva a escribir el archivo |
| `... code 4` | Windows. `installPath` en `BeamNG.Drive.ini` apunta a una carpeta que no existe | Inicia BeamNG.drive una vez desde su carpeta actual, o corrige `installPath` en el archivo |
| `... code 5` | Windows. `BeamNG.Drive.ini` no tiene `installPath` | Inicia BeamNG.drive una vez |
| `... code 6` | Windows. No hay `BeamNG.Drive.ini` y la clave del registro `HKEY_CURRENT_USER\Software\BeamNG\BeamNG.drive` no tiene el valor `rootpath` | Inicia BeamNG.drive una vez |
| `... code 7` | Windows. No hay `BeamNG.Drive.ini` y la clave del registro `HKEY_CURRENT_USER\Software\BeamNG\BeamNG.drive` no existe | Inicia BeamNG.drive una vez |
| `Unsupported Steam installation.` | Linux. Ninguna de las carpetas de Steam que conoce el Launcher tiene una carpeta `steamapps` | Consulta [Antes de empezar](/es/get-started/install-beammp#before-you-start) para ver las carpetas. Enlaza la tuya con una de ellas |
| `libraryfolders.vdf is missing.` | Linux. La carpeta de Steam no tiene el archivo `libraryfolders.vdf` | Inicia Steam una vez y vuelve a intentarlo |
| `The game directory was not found.` | Linux. BeamNG.drive no está en ninguna biblioteca de Steam de las que enumera `libraryfolders.vdf` | Instala BeamNG.drive a través de Steam |
| `Failed to Launch the game! launcher closing soon` | El Launcher no pudo iniciar `BeamNG.drive.exe` (Windows) o `BinLinux/BeamNG.drive.x64` (Linux) en la carpeta del juego. En Windows, a continuación aparecen el código de error y el texto de Windows | Verifica los archivos del juego en Steam e inicia el juego una vez antes de iniciar el Launcher |
| `Game Closed! launcher closing soon` | El juego ha terminado. El Launcher se cierra 5 segundos después | Es normal cuando cierras el juego. Si el juego se ha cerrado solo, vuelve a iniciar el Launcher |
| `We were unable to clean the multiplayer mods folder! Is the game still running or do you have something open in that folder?` | El Launcher vacía la carpeta `mods/multiplayer` de la carpeta de usuario del juego cuando se inicia, y no pudo hacerlo | Cierra el juego y cualquier programa que use esa carpeta, y vuelve a iniciar el Launcher |

## Los archivos propios del Launcher

| Mensaje | Descripción | Posible solución |
|---|---|---|
| `logger file init failed!` | El Launcher no puede crear `Launcher.log` en su carpeta | Mueve el Launcher a una carpeta en la que puedas escribir |
| `Config failed to parse make sure it's valid JSON!` | `Launcher.cfg` no es un JSON válido. El Launcher se cierra | Corrige el archivo o bórralo. El Launcher crea uno nuevo con los ajustes por defecto |
| `Failed to open Launcher.cfg!`, `Failed to write config on disk!` | El Launcher no puede leer ni crear `Launcher.cfg` en la carpeta desde la que se ejecuta | Ejecútalo desde una carpeta en la que puedas escribir |
| `Failed to create caching directory` | El Launcher no puede crear la carpeta de caché de mods, que es `Resources` salvo que establezcas `CachingDirectory` en `Launcher.cfg` | Establece `CachingDirectory` con una carpeta en la que puedas escribir |
| `Exception in main()` | Un error fatal. El Launcher se cierra a los 5 segundos | Lee el texto que aparece a continuación y pregunta en el [foro](https://forum.beammp.com) o en el [servidor de Discord](https://discord.gg/beammp) |

## Actualizaciones y los servidores de BeamMP

| Mensaje | Descripción | Posible solución |
|---|---|---|
| `Failed to download the launcher update! Please try manually updating it` | Windows. El Launcher no pudo descargar su actualización | Consulta [Problemas de actualización del Launcher](/es/troubleshooting/launcher-update) |
| `The authenticity of the updated launcher could not be verified, it was corrupted or tampered with.` | Windows. La actualización descargada no tiene una firma válida, así que el Launcher la borró | Descarga el Launcher desde la [página de versiones de GitHub](https://github.com/BeamMP/BeamMP-Launcher/releases/latest), como se explica en [Problemas de actualización del Launcher](/es/troubleshooting/launcher-update) |
| `Auto update is NOT implemented for the Linux version.` | Linux. Existe un Launcher más reciente | Vuelve a compilar el Launcher: consulta [Actualizar el Launcher en Linux](/es/get-started/install-beammp#update-the-launcher-on-linux) |
| `GET to ... failed` o `POST to ... failed`, y después `Curl error` | El Launcher no pudo comunicarse con un servidor de BeamMP. El texto que sigue indica el motivo, como un tiempo de espera agotado o un error de certificado | Comprueba tu conexión a internet y las reglas del firewall. Si no hay ningún problema por tu parte, consulta el [canal de actualizaciones de BeamMP](<https://discord.com/channels/601558901657305098/697596153943949352>) en nuestro Discord |
| `Invalid hash from backend, skipping update check.` | El backend de BeamMP no dio una respuesta válida. El Launcher se salta la comprobación y continúa | Comprueba tu conexión a internet y las reglas del firewall |
| `Failed to communicate with the auth system!` | El servidor de inicio de sesión no respondió | Comprueba tu conexión a internet y las reglas del firewall, y vuelve a intentarlo |
| `Invalid answer from authentication servers, please try again later!` | El servidor de inicio de sesión dio una respuesta que el Launcher no puede leer | Inténtalo de nuevo más tarde |

## Mods

| Mensaje | Descripción | Posible solución |
|---|---|---|
| `Mod '...' is protected and therefore must be placed in the Resources/Caching folder manually here:` seguido de una ruta | El servidor usa un mod protegido, que el Launcher no descarga | Consigue el archivo de su creador y ponlo en la carpeta que indica el mensaje, conservando su nombre de archivo |
| `Server cannot find` seguido de un nombre de archivo | El servidor no tiene el archivo de mod que incluyó en su lista | Avisa al propietario del servidor |
| `Failed to write or download the entire file ... (hash mismatch)` | El archivo del mod no se descargó correctamente | Vuelve a unirte. El Launcher vuelve a comprobar el archivo y lo descarga de nuevo |
| `Failed copy to the mods folder!` | El Launcher no pudo copiar un mod en la carpeta `mods/multiplayer` del juego | Cierra el juego y cualquier programa que use esa carpeta, y vuelve a unirte |
