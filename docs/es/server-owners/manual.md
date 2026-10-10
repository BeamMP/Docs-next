---
description: "Referencia del servidor de BeamMP: la carpeta Resources, las variables de entorno, los argumentos de línea de comandos, los comandos de consola y los límites del backend."
---
# Manual del servidor

Esta página es la referencia de cómo se comporta el servidor de BeamMP. Para configurar uno, consulta [Alojar un servidor](/es/server-owners/host-a-server). Para los ajustes de `ServerConfig.toml`, consulta [Configuración del servidor](/es/server-owners/configuration).

## Qué afecta al servidor

El servidor se ve afectado por el estado de estos parámetros externos:

- La carpeta `Resources`
- El entorno (las variables de entorno del proceso)
- Los argumentos de línea de comandos
- El archivo `ServerConfig.toml`
- El directorio de trabajo

## Carpeta Resources

El servidor crea la carpeta `Resources` al iniciarse, con las subcarpetas `Client` y `Server`.

- `Server` contiene carpetas, cada una con al menos un archivo `.lua`. Cada carpeta es un «plugin». El servidor carga los plugins por orden alfabético, sin distinguir mayúsculas de minúsculas, y omite todo lo que haya en `Server` que no sea una carpeta. Los archivos `.lua` del nivel superior de un plugin se recargan en caliente cuando cambian. Para escribir plugins, consulta la [Referencia de scripting del servidor](/es/developers/beammp-scripting/server/latest).
- `Client` contiene archivos `.zip`, que los jugadores descargan al unirse. El servidor los lee cuando se inicia e ignora, con una advertencia, cualquier archivo que no sea un `.zip`. Para que el servidor detecte mods añadidos, modificados o eliminados mientras se ejecuta, usa el [comando de consola](#console-commands) `reloadmods`.

El servidor también mantiene en `Client` un archivo llamado `mods.json`. Guarda el hash SHA-256 de cada mod y si el mod está protegido, para que el servidor no vuelva a calcular el hash de un mod que no ha cambiado. El servidor reescribe el archivo cuando hace falta. No lo edites.

## Variables de entorno

### Ajustes generales {#general-settings}

Desde la versión v3.2.0 del servidor, este acepta variables de entorno que **anulan** los ajustes de `ServerConfig.toml`. Todos los ajustes tienen una. Los nombres de los ajustes están en PascalCase. La variable es el nombre en MAYÚSCULAS, con un guion bajo donde empieza cada palabra nueva, y el prefijo `BEAMMP_`. Por ejemplo, `MaxPlayers` pasa a ser `MAX_PLAYERS` y, con el prefijo, `BEAMMP_MAX_PLAYERS`. Existen estas variables («Desde» es la primera versión del servidor que lee cada una):

| Variable | Ajuste | Desde |
|---|---|---|
| `BEAMMP_DEBUG` | `Debug` | v3.2.0 |
| `BEAMMP_PRIVATE` | `Private` | v3.2.0 |
| `BEAMMP_PORT` | `Port` | v3.2.0 |
| `BEAMMP_MAX_CARS` | `MaxCars` | v3.2.0 |
| `BEAMMP_MAX_PLAYERS` | `MaxPlayers` | v3.2.0 |
| `BEAMMP_MAP` | `Map` | v3.2.0 |
| `BEAMMP_NAME` | `Name` | v3.2.0 |
| `BEAMMP_DESCRIPTION` | `Description` | v3.2.0 |
| `BEAMMP_TAGS` | `Tags` | v3.2.0 |
| `BEAMMP_RESOURCE_FOLDER` | `ResourceFolder` | v3.2.0 |
| `BEAMMP_AUTH_KEY` | `AuthKey` | v3.2.0 |
| `BEAMMP_LOG_CHAT` | `LogChat` | v3.2.0 |
| `BEAMMP_ALLOW_GUESTS` | `AllowGuests` | v3.5.0 |
| `BEAMMP_INFORMATION_PACKET` | `InformationPacket` | v3.7.0 |
| `BEAMMP_IM_SCARED_OF_UPDATES` | `ImScaredOfUpdates` (la sección `[Misc]`) | v3.8.2 |
| `BEAMMP_UPDATE_REMINDER_TIME` | `UpdateReminderTime` (la sección `[Misc]`) | v3.8.2 |
| `BEAMMP_IP` | `IP` | v3.8.3 |

Para los ajustes que son cadenas de texto o números, el valor es una cadena, por ejemplo `BEAMMP_NAME="Cool Server"`, `BEAMMP_NAME=Server1` o `BEAMMP_PORT=12345`.

Para los ajustes que son verdadero o falso (activado o desactivado), el valor `true` o `1` significa activado. Cualquier otro valor significa desactivado.

Una variable vacía o no definida se ignora. El servidor vuelve a escribir en `ServerConfig.toml`, al iniciarse, los valores que acaba usando, incluidos estos, salvo que `BEAMMP_PROVIDER_DISABLE_CONFIG` esté definida.

### Ajustes del proveedor {#provider-settings}

Estas variables permiten que los proveedores de alojamiento, y cualquiera que tenga muchos servidores, anulen ajustes específicos del proveedor.

#### `BEAMMP_PROVIDER_PORT_ENV` (de v3.3.0 a v3.4.1, y desde v3.7.2)

Cuando se establece en una cadena no vacía, indica el nombre de otra variable de la que leer el puerto, en lugar de `BEAMMP_PORT`. Los servidores de la v3.5.0 a la v3.7.1 no la leen. Por ejemplo, Pterodactyl puede exponer el puerto como `SERVER_PORT`. Podrías establecer `BEAMMP_PORT=${SERVER_PORT}`, pero es más sencillo establecer `BEAMMP_PROVIDER_PORT_ENV="SERVER_PORT"`, y el servidor lee su puerto de la variable `SERVER_PORT`.

#### `BEAMMP_PROVIDER_IP_ENV` (desde v3.8.4)

Cuando se establece en una cadena no vacía, indica el nombre de otra variable de la que leer la dirección IP, en lugar de `BEAMMP_IP`. Funciona igual que `BEAMMP_PROVIDER_PORT_ENV`.

#### `BEAMMP_PROVIDER_DISABLE_CONFIG` (desde v3.3.0)

Si se establece en `1` o `true`, `ServerConfig.toml` **no se genera** y **no se lee** si ya existe. Debes establecer `BEAMMP_AUTH_KEY` para que el servidor funcione.

#### `BEAMMP_PROVIDER_UPDATE_MESSAGE` (desde v3.2.2)

Cuando se establece en una cadena no vacía, sustituye todo el mensaje de actualización, que por defecto empieza por «NEW VERSION IS OUT! Please update to the new…».

Tu mensaje **debe** contener `{}` en algún punto. El servidor lo sustituye por el número de la nueva versión. Por ejemplo:

```sh
BEAMMP_PROVIDER_UPDATE_MESSAGE="NEW VERSION of the BeamMP-Server has been released: {}! Please follow the update guide here: https://example.com/update-guide"
```

Esto da un mensaje de actualización como:

```text
NEW VERSION of the BeamMP-Server has been released: v5.0.2! Please follow the update guide here: https://example.com/update-guide
```

Deja claro a los usuarios que deben actualizar y explica cómo.

#### `BEAMMP_PROVIDER_DISABLE_MP_SET` (desde v3.9.2)

Si se establece en `1` o `true`, los plugins de Lua no pueden cambiar los ajustes del servidor con `MP.Set`. Un plugin que lo intente recibe un error que indica que el proveedor de tu servidor ha bloqueado la llamada.

#### `BEAMMP_MAX_CONCURRENT_CONNECTIONS` (desde v3.9.4)

Establece el número máximo de conexiones que el servidor acepta al mismo tiempo desde una misma dirección IP. Es un número entero de 1 a 128, y el valor por defecto es 10. Un valor fuera de rango, o que no sea un número, se ignora con una advertencia. El servidor también acepta como máximo 128 conexiones al mismo tiempo en total, algo que no puedes cambiar. El comando `status` muestra ambos límites.

## Argumentos de línea de comandos

Ejecuta el servidor con `--help` para verlos: `./BeamMP-Server --help`. Los argumentos son:

| Argumento | Qué hace |
|---|---|
| `--help` | Muestra la ayuda y sale |
| `--version` | Imprime la versión del servidor y sale |
| `--port=1234` | Establece el puerto TCP y UDP en el que escucha el servidor. Anula el entorno y `ServerConfig.toml` |
| `--config=/path/to/ServerConfig.toml` | La ruta absoluta o relativa al archivo de configuración del servidor, incluido el nombre del archivo. Pon comillas alrededor de una ruta con espacios |
| `--working-directory=/path/to/folder` | Establece el directorio de trabajo del servidor. Todas las rutas, incluida la de `--config`, son relativas a él |

Por ejemplo, `BeamMP-Server --config=../MyWestCoastServerConfig.toml` ejecuta el servidor con el archivo de configuración que está una carpeta más arriba.

## Comandos de consola {#console-commands}

Escríbelos en la consola del servidor. Pulsa `Tab` para completar un comando.

| Comando | Qué hace |
|---|---|
| `help` | Muestra los comandos |
| `exit` | Apaga el servidor |
| `kick <name> [reason]` | Expulsa a un jugador, con un motivo opcional. El nombre coincide con el principio del nombre de un jugador, sin distinguir mayúsculas de minúsculas. Sin motivo, el jugador ve «Kicked by server console» |
| `list` | Enumera todos los jugadores, con su ID y su número de coches |
| `say <message>` | Envía el mensaje a todos los jugadores en el chat |
| `lua [state id]` | Cambia a la consola de Lua, opcionalmente al estado con ese id. Consulta [Depuración](/es/developers/beammp-scripting/server/latest#debugging) |
| `settings [command]` | Establece u obtiene los ajustes del servidor. Ejecuta `settings help` para más información. Consulta [Comando settings](#settings-command) |
| `status` | Muestra cómo está funcionando el servidor: jugadores, coches, tiempo en marcha, estados de Lua, temporizadores y manejadores de eventos, los límites de conexiones y el estado de cada parte del servidor |
| `clear` | Limpia la ventana de la consola |
| `version` | Muestra la plataforma, la versión del servidor y las versiones de Lua y OpenSSL |
| `protectmod <name> <value>` | Establece si un mod está protegido. El nombre es el nombre de archivo del mod, incluido `.zip`. El valor es `true` o `false` |
| `reloadmods` | Recarga todos los mods de la carpeta `Resources/Client` |
| `nettest` | Le pregunta al servicio de comprobación del servidor de BeamMP si los jugadores pueden llegar a tu servidor por su puerto, e imprime la respuesta. `help` no lo muestra. Desde v3.8.5 |

Un plugin puede añadir comandos propios con el evento `onConsoleInput`. Consulta [Comandos personalizados](/es/developers/beammp-scripting/server/latest#custom-commands).

### Comando settings {#settings-command}

`settings` tiene cuatro subcomandos:

- `settings list` enumera los ajustes y sus valores.
- `settings get <category> <setting>` imprime un valor, por ejemplo `settings get General MaxPlayers`.
- `settings set <category> <setting> <value>` cambia un valor, por ejemplo `settings set General MaxPlayers 12`. Pon comillas alrededor de un valor con espacios.
- `settings help` muestra estos subcomandos.

Un cambio dura hasta que el servidor se detiene. No se escribe en `ServerConfig.toml`. Puedes cambiar `Description`, `Tags`, `MaxPlayers`, `Name`, `Map`, `MaxCars`, `Debug`, `AllowGuests` e `InformationPacket` en `General`, y `ImScaredOfUpdates` y `UpdateReminderTime` en `Misc`. `Private`, `IP`, `Port`, `LogChat` y `ResourceFolder` se pueden leer pero no cambiar. `AuthKey` no se puede leer ni cambiar.

## ServerConfig.toml

El servidor genera este archivo la primera vez que se inicia. Los comentarios del propio archivo explican brevemente cada ajuste, y el servidor vuelve a escribir el archivo cada vez que se inicia. Consulta [Configuración del servidor](/es/server-owners/configuration).

Si `AuthKey` está vacía, el servidor imprime un error y se cierra a los 10 segundos. Esto también ocurre si el archivo tiene un error, como unas comillas que faltan.

## Directorio de trabajo

El directorio de trabajo del servidor, y no la ubicación del ejecutable del servidor, decide dónde se generan `ServerConfig.toml`, los archivos de registro y la carpeta `Resources`.

## Límites

El backend de BeamMP aplica estos límites a los servidores:

- Nombre: 250 caracteres
- Descripción: 1000 caracteres
- Mapa: 100 caracteres
- Etiquetas: 100 caracteres

El propio servidor aplica estos:

- Versión del Launcher: se rechaza a un jugador cuyo Launcher sea anterior a la 2.7.0, y ve un mensaje que indica la versión necesaria.
- Mensajes de chat: un mensaje de más de 500 bytes, o uno vacío, se descarta.
- Conexiones: como máximo 10 al mismo tiempo desde una misma dirección IP de forma predeterminada, y 128 en total. Consulta `BEAMMP_MAX_CONCURRENT_CONNECTIONS`.
