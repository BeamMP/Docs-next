---
description: "Mantén en marcha un servidor de BeamMP: lee el archivo de registro del servidor, actualiza el servidor en Windows o Linux y comprueba si hay versiones nuevas."
---
# Mantenimiento del servidor

Cómo mantener un servidor de BeamMP que ya está en marcha: el archivo de registro y la actualización. Para los ajustes de `ServerConfig.toml`, consulta [Configuración del servidor](/es/server-owners/configuration).

## El archivo de registro del servidor

Este archivo se genera mientras el servidor se ejecuta. Es un reflejo de los mensajes que ves en la consola cuando ejecutas el servidor. El archivo se llama `Server.log`. Cuando el servidor arranca, cambia el nombre del registro de la ejecución anterior a `Server.old.log` y sustituye al `Server.old.log` anterior. Debes adjuntar este archivo siempre que necesites ayuda de nuestro equipo de soporte, y nunca muestra tu AuthKey, así que normalmente puedes enviarlo sin modificarlo.

El formato es el siguiente (el prefijo $ significa «variable», que se explica a continuación):

```
[$DATE $TIME] $CONTEXT [$LOG_LEVEL] $MESSAGE
```

Donde:

- `$DATE` es la fecha del mensaje en formato día/mes/año, por ejemplo 21/07/21
- `$TIME` es la hora del mensaje, por ejemplo 11:05:23. En modo Debug también muestra los milisegundos, por ejemplo 11:05:23.142
- `$CONTEXT` (solo visible en modo Debug y relevante sobre todo para los desarrolladores) es el contexto del mensaje, que puede ser:
	- `(Player ID) “Player Name”`, donde el ID del jugador es útil para la moderación
	- Un nombre corto como «HeartbeatThread»
- `$LOG_LEVEL` es uno de los niveles de importancia de un mensaje:
	- `DEBUG`: solo visible en modo Debug, suele ser muy verboso y solo importa a los desarrolladores
	- `EVENT`: solo visible en modo Debug, un evento de Lua que ha activado el servidor
	- `INFO`: información general
	- `LUA`: mensaje de un plugin de Lua
	- `LUA WARN` y `LUA ERROR`: una advertencia o un error del sistema de plugins de Lua, como un error en el código de un plugin
	- `WARN`: describe algo que, normalmente, no debería ocurrir
	- `ERROR`: algo ha ido muy mal o ha sido muy inesperado
- `$MESSAGE` es el mensaje en sí, normalmente algo a lo que debes prestar atención y que debes entender. En algunos casos puede ser críptico, pero la regla general es que, mientras no haya nada visiblemente mal en el servidor y no haya ERRORs, todo va bien.

## Actualizar el servidor {#updating-the-server}

### Por qué actualizar

Siempre que se publique una actualización, te aconsejamos actualizar tu servidor. Normalmente incluye correcciones de errores y mejoras de estabilidad y de seguridad, además de las nuevas funciones que se añadan.

Para recibir noticias sobre las actualizaciones cuando salgan, sigue el canal «update» del servidor de Discord, estate atento en el foro o consulta (o pregunta en) la [página de versiones de GitHub](https://github.com/BeamMP/BeamMP-Server/releases).

### Cómo actualizar

#### Si usas un proveedor de alojamiento asociado de BeamMP

Si usas un proveedor de alojamiento asociado de BeamMP, es probable que las instrucciones de abajo no funcionen. Te recomendamos esperar a recibir más detalles de tu proveedor o ponerte en contacto con él para que te ayude.

#### Si gestionas el servidor tú mismo

El servidor se actualiza sustituyendo el ejecutable antiguo por el nuevo. Si no sabes cómo hacerlo, más abajo tienes instrucciones paso a paso para Windows y Linux.

Si lo compilaste a partir del código fuente, solo tienes que volver a compilarlo. Asegúrate de ejecutar `git submodule update --init --recursive` antes de recompilar.

#### En Windows

1. Asegúrate de haber instalado los [Visual C++ Redistributables](https://aka.ms/vs/17/release/vc_redist.x64.exe) para poder ejecutar el servidor.
2. Ve a [BeamMP.com](https://beammp.com/) y haz clic en el botón «Download Server».
3. Cuando termine la descarga, deberías ver un archivo llamado `BeamMP-Server.exe`. Lo llamaremos el «ejecutable nuevo».
4. Ve a la carpeta donde está tu ejecutable `BeamMP-Server.exe` actual (normalmente, la misma carpeta donde está tu `ServerConfig.toml`). Lo llamaremos el «ejecutable antiguo».
5. Sustituye el ejecutable antiguo por el nuevo (por ejemplo, copiando o moviendo el ejecutable nuevo a la carpeta).

#### En Linux

1. Ve a [BeamMP.com](https://beammp.com/) y haz clic en el botón «Download Server»; se te redirigirá a la página de versiones del servidor en GitHub.
2. Descarga el archivo para tu distribución y tu tipo de procesador. Su nombre tiene este aspecto: `BeamMP-Server.debian.12.x86_64`. No descargues los archivos `debuginfo`. Para simplificar, de ahora en adelante la llamaremos `BeamMP-Server-xxx`, donde `xxx` indica la versión para la distribución que uses.
3. Cuando termine la descarga, deberías ver un archivo llamado `BeamMP-Server-xxx`, según la versión que hayas descargado. Lo llamaremos el «ejecutable nuevo».
4. Ve a la carpeta donde está tu ejecutable `BeamMP-Server-xxx` actual (normalmente, la misma carpeta donde está tu `ServerConfig.toml`). Lo llamaremos el «ejecutable antiguo».
5. Sustituye el ejecutable antiguo por el nuevo (por ejemplo, copiando o moviendo el ejecutable nuevo a la carpeta).
6. Abre una ventana de terminal en la carpeta donde acabas de sustituir el ejecutable y ejecuta `sudo chmod +x BeamMP-Server-xxx`. Así te aseguras de que el servidor se pueda ejecutar.

### Avisos de actualización

El servidor no se actualiza solo. Comprueba si hay una versión más reciente cuando arranca e imprime un mensaje si la hay. Vuelve a imprimir el mensaje con el intervalo que establece `UpdateReminderTime`, salvo que `ImScaredOfUpdates` sea `true`, que es el valor por defecto. Ambos ajustes están en [Configuración del servidor](/es/server-owners/configuration#the-misc-section). Un proveedor de alojamiento puede sustituir el mensaje: consulta los ajustes de proveedor en el [Manual del servidor](/es/server-owners/manual#provider-settings).

Para comprobar si hay una versión nueva desde un script, consulta a la API de GitHub cuál es la última versión comparando la versión del servidor con las etiquetas (tags). Puedes obtenerlas haciendo un GET a `https://api.github.com/repos/BeamMP/BeamMP-Server/git/refs/tags`.
