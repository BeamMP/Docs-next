---
description: "Qué significan los códigos de error y los mensajes de la ventana del Launcher de BeamMP, como 10060 o Launcher Update failed, y cómo solucionar cada uno."
---
# Códigos de error

Esta página enumera los códigos de error y los mensajes que puede mostrar el Launcher, y qué hacer en cada caso. Para los errores de la ventana de un servidor, consulta los [Códigos de error del servidor](/es/server-owners/error-codes).


| Código | Descripción | Posible solución |
|---|---|---|
| 10048 | Otra cosa ya está usando el puerto del Launcher | Asegúrate de tener solo UNA instancia de BeamMP-Launcher en ejecución a la vez. Prueba a reiniciar el PC. |
| 10038 / 10060 / 10061 | Ningún servidor ha respondido en esa IP y/o puerto | Si eres el propietario del servidor, revisa la redirección de puertos y las reglas del firewall que encontrarás en [Alojar un servidor](/es/server-owners/host-a-server). Si no eres el propietario del servidor, elige otro servidor o contacta con el propietario, si lo conoces. |
| 10054 | Conexión restablecida por el par | El servidor al que te estás conectando se ha desconectado. |
| Failed to find the game please launch it. Report this if the issue persists code 3. | El Launcher no pudo encontrar la información del juego (directorio del juego, directorio del perfil, versión, etc.) en la entrada del registro | Ejecuta el juego al menos una vez para que se creen los valores del registro. |
| Failed to find the game please launch it. Report this if the issue persists code 4. | El Launcher no pudo leer la información del juego (directorio del juego, directorio del perfil, versión, etc.) en la entrada del registro | Es más probable que este error aparezca en usuarios con **copias piratas** del juego. Si has comprado el juego, ejecútalo al menos una vez para que se creen los valores del registro. |
| Failed to Launch the game! launcher closing soon | El Launcher no pudo encontrar el ejecutable del juego | Ejecuta el juego al menos una vez antes de volver a ejecutar el Launcher. |
| Game Closed! launcher closing soon | Se cerró el juego | Este mensaje aparece cuando se cierra el juego o cuando el juego no pudo iniciarse. |
| Launcher Update failed! | El Launcher no pudo descargar una nueva versión | Comprueba tu conexión a internet y las reglas del firewall / antivirus para que el Launcher no esté bloqueado. |
| Logger file init failed | El Launcher no tiene permiso para crear archivos | Ejecuta el Launcher como administrador. |
| Please close the game and try again | El juego ya está abierto y el Launcher no puede vaciar la carpeta `multiplayer/mods` | Cierra el juego y vuelve a intentarlo. |
| Please launch the game at least once | El Launcher intentó modificar el directorio del juego y no lo consiguió | Ejecuta el juego al menos una vez antes de volver a ejecutar el Launcher. |
| Primary Servers Offline! Sorry for the inconvenience! | El Launcher no pudo comprobar si hay una actualización | Comprueba tu conexión a internet y las reglas del firewall. Si no hay ningún problema por tu parte, consulta el [canal de actualizaciones de BeamMP](<https://discord.com/channels/601558901657305098/697596153943949352>) en nuestro Discord. |
| Sorry Backend System Outage! Don't worry it will back on soon! | El backend de BeamMP no respondió | Comprueba tu conexión a internet y las reglas del firewall. Si no hay ningún problema por tu parte, consulta el [canal de actualizaciones de BeamMP](<https://discord.com/channels/601558901657305098/697596153943949352>) en nuestro Discord. |
| Stuck on updating | El Launcher se ha quedado atascado actualizando y no continúa con el siguiente paso | Ejecuta el Launcher como administrador y revisa las reglas de tu antivirus para que el Launcher no esté bloqueado. |

Si el Launcher se cierra de inmediato, revisa el archivo `Launcher.log` en la carpeta donde instalaste BeamMP.
