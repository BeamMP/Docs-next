# Mantenimiento del servidor

Guías, consejos y trucos sobre cómo configurar y cuidar un servidor de BeamMP.

## Cómo instalar

Para ver las instrucciones de instalación, consulta la [instalación del servidor](/es/server-owners/host-a-server).

## El archivo ServerConfig

La configuración del servidor, que es un archivo llamado `ServerConfig.toml`, usa el [formato TOML](https://toml.io/en/).

*NOTA*: El archivo de configuración *antiguo* del servidor se llamaba `Server.cfg`, pero ya no se usa, y el servidor mostrará una advertencia si todavía existe. Ten en cuenta también que los dos formatos de configuración **no** son compatibles entre sí.

La configuración tiene una sección por defecto, llamada `[General]`, que contiene los siguientes valores:

| Clave             | Tipo de valor                                                                                                        | Descripción                                                                                                                                                                                 |
|-------------------|----------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Port              | 1024-65535                                                                                                           | El puerto de red en el que el servidor estará accesible. (Debe ser único y no estar usado por otro servicio en el mismo host). |
| AuthKey           | Formato de AuthKey `xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`, donde todas las x son caracteres alfanuméricos (números y letras) | Se usa para identificar un servidor público ante el backend. |
| AllowGuests       | true/false                                                                                                           | Determina si se permite o no que los invitados se unan al servidor. |
| LogChat           | true/false                                                                                                           | Cuando está activado (true), los mensajes de chat se registran en el archivo server.log. |
| Debug             | true/false                                                                                                           | Cuando está activado (true), mostrará más mensajes en el registro y proporcionará más información. Actívalo si tienes problemas. Activarlo aumentará drásticamente el tamaño del archivo de registro. |
| IP                | Una dirección de clase local de una de las tarjetas de red conectadas al host. (Por defecto: "0.0.0.0" o "::")       | El servidor intentará enlazarse a la IP indicada. No modifiques el campo IP a menos que sepas lo que haces. No es necesario cambiar este valor para que el servidor funcione. |
| Private           | true/false                                                                                                           | Cuando está activado (true), tu servidor no se mostrará en la lista de servidores. Cualquiera que tenga la IP y el puerto correctos podrá conectarse igualmente. |
| InformationPacket | true/false                                                                                                           | Cuando está activado (true), el servidor permitirá que clientes no autenticados obtengan la misma información que aparece en la lista de servidores, pero directamente a través del servidor. |
| Name              | Cualquier "texto"                                                                                                    | Se muestra como nombre/título de tu servidor en la lista de servidores. Puedes usar caracteres especiales para darle formato con colores y estilos. |
| Tags              | Consulta la lista de etiquetas permitidas más abajo.                                                                 | Etiquetas para la búsqueda, p. ej. Police, Racing, etc... |
| MaxCars           | Cualquier número ≥ 1                                                                                                 | El número máximo de coches por jugador. Cualquier coche adicional que un jugador intente generar se eliminará al instante. |
| MaxPlayers        | Cualquier número ≥ 1                                                                                                 | La cantidad máxima de jugadores por servidor. No afecta al número de vehículos. |
| Map               | Una ubicación de mapa válida, como `/levels/gridmap_v2/info.json`                                                    | El mapa que alojará tu servidor. Debe estar instalado, ya sea por defecto (más abajo hay una lista) o como mod del servidor. |
| Description       | Cualquier "texto"                                                                                                    | Se muestra como descripción del servidor en la lista de servidores (si el servidor es público). Puedes usar caracteres especiales para darle formato con colores y estilos. |
| ResourceFolder    | Una ubicación de carpeta válida, como "D:\Server\BeamMP\Resources"                                                   | Útil para almacenar el servidor y la carpeta de recursos por separado. |
| ImScaredOfUpdates | true/false                                                                                                           | Establece si el servidor se actualiza automáticamente o no cuando se publica una nueva versión. |
| UpdateReminderTime| Cualquier número seguido de s, min, h, d. (30s)                                                                      | Establece el intervalo del mensaje de recordatorio de actualización que se imprime en la terminal.


Los plugins del servidor pueden y deben usar otras secciones (API de Lua próximamente), así: `[MyMod]`.

La AuthKey **TIENES** que establecerla tú. Estará vacía por defecto y hay que rellenarla con tu AuthKey del paso de instalación anterior. No compartas esta clave con nadie y, en las capturas de pantalla, ocúltala por completo.

### Nombres de todos los mapas vanilla {#all-vanilla-maps-names}

Estos son todos los mapas originales:

- /levels/gridmap_v2/info.json
- /levels/johnson_valley/info.json
- /levels/automation_test_track/info.json
- /levels/east_coast_usa/info.json
- /levels/hirochi_raceway/info.json
- /levels/italy/info.json
- /levels/jungle_rock_island/info.json
- /levels/industrial/info.json
- /levels/small_island/info.json
- /levels/smallgrid/info.json
- /levels/utah/info.json
- /levels/west_coast_usa/info.json
- /levels/driver_training/info.json
- /levels/derby/info.json

### Personalizar el aspecto del nombre de tu servidor {#customize-the-look-of-your-server-name}

Usa estos símbolos especiales antes de tu texto y se aplicará un efecto a ese texto en la lista de servidores:

| Valor | Descripción                 |
|:-----:|-----------------------------|
| `^r`  | Restablecer                 |
| `^p`  | Salto de línea (solo en descripciones) |
| `^n`  | Subrayado                   |
| `^l`  | Negrita                     |
| `^m`  | Tachado                     |
| `^o`  | Cursiva                     |
| `^0`  | Negro                       |
| `^1`  | Azul                        |
| `^2`  | Verde                       |
| `^3`  | Azul claro                  |
| `^4`  | Rojo                        |
| `^5`  | Rosa                        |
| `^6`  | Naranja                     |
| `^7`  | Gris                        |
| `^8`  | Gris oscuro                 |
| `^9`  | Morado claro                |
| `^a`  | Verde claro                 |
| `^b`  | Azul claro                  |
| `^c`  | Naranja oscuro              |
| `^d`  | Rosa claro                  |
| `^e`  | Amarillo                    |
| `^f`  | Blanco                      |

### Personalizar las etiquetas de tu servidor

Las etiquetas permiten que la gente busque un tipo concreto de servidor. Tu serverConfig.toml se generará con la etiqueta de conducción libre `Tags = "Freeroam"`.

Puedes añadir varias etiquetas separadas por comas `Tags = "Events,Offroad,lang:english"`; no distinguen entre mayúsculas y minúsculas.

Puedes elegir de la siguiente lista:

::: tabs

== Edad/Contenido

- `Mature/18+`

== Tipos de juego

- `Freeroam`
- `Roleplay`
- `Economy`
- `Traffic`
- `Challenge`
- `Drift`

== Categorías de carreras

- `Racing`
- `Racing:NASCAR`
- `Racing:Track`
- `Racing:Drag`
- `Racing:Rally`
- `Touge`

== Todoterreno

- `Offroad`
- `Crawling`
- `Rally`
- `Dakar`

== Eventos de destrucción

- `Derby`
- `Arena`

== Condiciones meteorológicas y horarias

- `Snow/Ice`
- `Rain`
- `Night`
- `Weather`

== Modos de juego

- `Gamemode`
- `Gamemode:Racing`
- `Gamemode:Rally`
- `Gamemode:Drag`
- `Gamemode:Derby`
- `Gamemode:Infection`
- `Gamemode:Cops-Robbers`
- `Gamemode:Delivery`
- `Gamemode:Sumo`

== Comunidad y eventos

- `Scenarios`
- `Events`
- `Leaderboard`

== Mods

- `Modded`
- `Mod:BeamPaint`
- `Mod:BeamJoy`
- `Mod:CEI`

== Idiomas

- `Lang:English`
- `Lang:Russian`
- `Lang:French`
- `Lang:Spanish`
- `Lang:Portuguese`
- `Lang:German`
- `Lang:Polish`
- `Lang:Arabic`

== Otros

- `Vanilla`
- `Moderated`

:::


Si falta alguna etiqueta en esta lista, puedes enviar una solicitud para que se añada [aquí](https://forum.beammp.com/t/introducing-server-tags/1320081)

## El archivo Server.log

Este archivo se genera cuando se ejecuta el servidor. Es un reflejo de los mensajes que ves en la consola al ejecutar el servidor. Debes adjuntar este archivo cada vez que necesites ayuda de nuestro equipo de soporte; nunca mostrará tu AuthKey, por lo que normalmente puedes enviarlo sin modificaciones.

El formato es el siguiente (el prefijo $ significa “variable”, se explican a continuación):
```
[$DATE $TIME] $CONTEXT [$LOG_LEVEL] $MESSAGE
```
Donde:

- `$DATE` es la fecha del mensaje, por ejemplo 21/07/2021
- `$TIME` es la hora del mensaje, por ejemplo 11:05:23
- `$CONTEXT` (solo visible en modo Debug y relevante sobre todo para desarrolladores) es el contexto del mensaje, que puede ser:
	- `(Player ID) “Player Name”`, donde el ID del jugador es útil para la moderación
	- Un nombre corto como “HeartbeatThread”
- `$LOG_LEVEL` es uno de los niveles de importancia de un mensaje:
	- `DEBUG`: solo visible en modo Debug, normalmente muy abundante y solo importante para los desarrolladores
	- `INFO`: información general
	- `LUA`: mensaje de un plugin de Lua
	- `WARN`: describe algo que, por lo general, no debería ocurrir
	- `ERROR`: algo ha ido muy mal o ha sido muy inesperado
	- `FATAL`: ha ocurrido algo que provoca el apagado del servidor
- `$MESSAGE` es el propio mensaje, normalmente algo a lo que debes prestar atención y que debes entender. En algunos casos puede ser críptico, pero la regla general es que, mientras no haya nada visiblemente mal en el servidor y no haya ERRORs, todo va bien.

## Actualizar el servidor

### Por qué actualizar

Cada vez que se publica una actualización, te recomendamos actualizar tu servidor. Normalmente incluye correcciones de errores, mejoras de estabilidad y de seguridad, además de las nuevas funciones, etc. que se introducen.

Para recibir noticias sobre las actualizaciones cuando salgan, sigue el canal “update” del servidor de Discord, busca en el foro o consulta/pregunta en la [página de versiones de GitHub](https://github.com/BeamMP/BeamMP-Server/releases).

### Cómo actualizar

#### Si usas un proveedor de alojamiento asociado de BeamMP

Si usas un proveedor de alojamiento asociado de BeamMP, es probable que las instrucciones siguientes no funcionen. Te recomendamos esperar a recibir más detalles de tu proveedor de alojamiento o contactar con él para pedir ayuda.

#### Gestionar el servidor tú mismo

El servidor se actualiza sustituyendo el ejecutable antiguo por el nuevo. Si no estás seguro de cómo hacerlo, más abajo tienes instrucciones paso a paso para Windows y Linux.

Si lo compilaste desde el código fuente, solo tienes que volver a compilarlo. Asegúrate de ejecutar `git submodule update --init --recursive` antes de volver a compilar.

#### En Windows

1. Asegúrate de haber instalado los [Visual C++ Redistributables](https://aka.ms/vs/17/release/vc_redist.x64.exe) para poder ejecutar el servidor.
2. Ve a [BeamMP.com](https://beammp.com/) y haz clic en el botón “Download Server”.
3. Una vez descargado, deberías ver un archivo llamado `BeamMP-Server.exe`. Lo llamaremos el “ejecutable nuevo”.
4. Ve a la carpeta donde está tu ejecutable `BeamMP-Server.exe` actual (normalmente, la misma carpeta donde está tu `ServerConfig.toml`). Lo llamaremos el “ejecutable antiguo”.
5. Sustituye el ejecutable antiguo por el nuevo (por ejemplo, copiando o moviendo el ejecutable nuevo a la carpeta).

#### En Linux

1. Ve a [BeamMP.com](https://beammp.com/) y haz clic en el botón “Download Server”; se te redirigirá a la página de versiones de GitHub del servidor.
2. Descarga la versión correcta para tu distribución. Para simplificar, a partir de ahora la llamaremos `BeamMP-Server-xxx`, donde `xxx` indica la versión de la distribución que uses.
3. Una vez descargado, deberías ver un archivo llamado `BeamMP-Server-xxx`, según la versión que hayas descargado. Lo llamaremos el “ejecutable nuevo”.
4. Ve a la carpeta donde está tu ejecutable `BeamMP-Server-xxx` actual (normalmente, la misma carpeta donde está tu `ServerConfig.toml`). Lo llamaremos el “ejecutable antiguo”.
5. Sustituye el ejecutable antiguo por el nuevo (por ejemplo, copiando o moviendo el ejecutable nuevo a la carpeta).
6. Abre una terminal en la carpeta donde acabas de sustituir el ejecutable y ejecuta `sudo chmod +x BeamMP-Server-xxx`. Esto garantiza que el servidor pueda ejecutarse.

### Actualizaciones automáticas

El servidor (todavía) no admite actualizaciones automáticas ni notificaciones de actualización.

Sin embargo, puedes consultar la última versión a través de la API de GitHub comparando la versión del servidor con las etiquetas (tags). Puedes obtenerla haciendo una petición GET a `https://api.github.com/repos/BeamMP/BeamMP-Server/git/refs/tags`.
