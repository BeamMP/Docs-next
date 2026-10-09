---
description: "Mantén en marcha un servidor de BeamMP: lee el archivo de registro del servidor, actualiza el servidor en Windows o Linux y comprueba si hay versiones nuevas."
---
# Mantenimiento del servidor

Cómo mantener un servidor de BeamMP que ya está en marcha: el archivo de registro y la actualización. Para los ajustes de `ServerConfig.toml`, consulta [Configuración del servidor](/es/server-owners/configuration).

## El archivo de registro del servidor

Este archivo se genera mientras el servidor se ejecuta. Es un reflejo de los mensajes que ves en la consola cuando ejecutas el servidor. Debes adjuntar este archivo siempre que necesites ayuda de nuestro equipo de soporte, y nunca muestra tu AuthKey, así que normalmente puedes enviarlo sin modificarlo.

El formato es el siguiente (el prefijo $ significa «variable», que se explica a continuación):
```
[$DATE $TIME] $CONTEXT [$LOG_LEVEL] $MESSAGE
```
Donde:

- `$DATE` es la fecha del mensaje, por ejemplo 21/07/2021
- `$TIME` es la hora del mensaje, por ejemplo 11:05:23
- `$CONTEXT` (solo visible en modo Debug y relevante sobre todo para los desarrolladores) es el contexto del mensaje, que puede ser:
	- `(Player ID) “Player Name”`, donde el ID del jugador es útil para la moderación
	- Un nombre corto como «HeartbeatThread»
- `$LOG_LEVEL` es uno de los niveles de importancia de un mensaje:
	- `DEBUG`: solo visible en modo Debug, suele ser muy verboso y solo importa a los desarrolladores
	- `INFO`: información general
	- `LUA`: mensaje de un plugin de Lua
	- `WARN`: describe algo que, normalmente, no debería ocurrir
	- `ERROR`: algo ha ido muy mal o ha sido muy inesperado
	- `FATAL`: ha ocurrido algo que hace que el servidor se apague
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
2. Descarga la versión correcta para tu distribución. Para simplificar, de ahora en adelante la llamaremos `BeamMP-Server-xxx`, donde `xxx` indica la versión para la distribución que uses.
3. Cuando termine la descarga, deberías ver un archivo llamado `BeamMP-Server-xxx`, según la versión que hayas descargado. Lo llamaremos el «ejecutable nuevo».
4. Ve a la carpeta donde está tu ejecutable `BeamMP-Server-xxx` actual (normalmente, la misma carpeta donde está tu `ServerConfig.toml`). Lo llamaremos el «ejecutable antiguo».
5. Sustituye el ejecutable antiguo por el nuevo (por ejemplo, copiando o moviendo el ejecutable nuevo a la carpeta).
6. Abre una ventana de terminal en la carpeta donde acabas de sustituir el ejecutable y ejecuta `sudo chmod +x BeamMP-Server-xxx`. Así te aseguras de que el servidor se pueda ejecutar.

### Actualizaciones automáticas

El servidor no admite actualizaciones automáticas ni avisos de actualización (todavía).

Sin embargo, puedes consultar a la API de GitHub cuál es la última versión comparando la versión del servidor con las etiquetas (tags). Puedes obtenerlas haciendo un GET a `https://api.github.com/repos/BeamMP/BeamMP-Server/git/refs/tags`.
