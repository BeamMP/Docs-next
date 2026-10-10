---
description: "Todos los ajustes de ServerConfig.toml de un servidor de BeamMP, las rutas de los mapas originales, cómo dar color y formato al nombre del servidor y la lista de etiquetas."
---
# Configuración del servidor

Los ajustes de un servidor de BeamMP, cómo ponerle nombre y etiquetas, y las rutas de los mapas originales. Para instalar un servidor, consulta [Alojar un servidor](/es/server-owners/host-a-server). Para leer el registro o actualizar el servidor, consulta [Mantenimiento del servidor](/es/server-owners/maintenance).

## El archivo ServerConfig

La configuración del servidor, que es un archivo llamado `ServerConfig.toml`, usa el [formato TOML](https://toml.io/en/).

::: info Archivo de configuración antiguo
El archivo de configuración antiguo del servidor se llamaba `Server.cfg`. Ya no se usa, y el servidor avisa si todavía existe. Los dos formatos **no** son compatibles.
:::

La configuración tiene dos secciones, `[General]` y `[Misc]`. Los valores por defecto son los de la versión 3.9.4 del servidor.

### La sección `[General]`

| Clave | Por defecto | Valor | Qué hace |
|---|---|---|---|
| Port | `30814` | 1024-65535 | El puerto de red en el que se podrá acceder al servidor. El servidor lo usa tanto para TCP como para UDP. (Debe ser único y no estar usado por otro servicio del mismo host). |
| AuthKey | vacío | Formato de AuthKey `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`, donde todas las x son caracteres alfanuméricos (números y letras) | Sirve para identificar ante el backend un servidor configurado como público. El servidor avisa al arrancar si la clave no tiene 36 caracteres. |
| AllowGuests | `true` | true/false | Si se permite que los invitados se unan al servidor. Si está desactivado (`false`), se rechaza al invitado que intente unirse. |
| LogChat | `true` | true/false | Si está activado (true), los mensajes del chat se guardan en la consola y en el archivo `Server.log`. |
| Debug | `false` | true/false | Si está activado (true), muestra más mensajes en el registro y da más información. Actívalo si tienes problemas. Activarlo aumenta drásticamente el tamaño del archivo de registro. |
| IP | `"::"` | Una dirección IP local de una de las interfaces de red del host | El servidor se enlaza a esta dirección IP. **No** es tu IP pública. Úsala si tu equipo tiene varias interfaces de red. No necesitas cambiarla para que el servidor funcione. El valor por defecto `"::"` acepta conexiones en todas las interfaces. |
| Private | `true` | true/false | Si está activado (true), tu servidor no se mostrará en la lista de servidores. Cualquiera que tenga la IP y el puerto correctos puede conectarse igualmente. |
| InformationPacket | `true` | true/false | Si está activado (true), el servidor permitirá que los clientes sin autenticar obtengan la misma información que aparece en la lista de servidores, pero directamente a través del servidor. |
| Name | `"BeamMP Server"` | Cualquier "texto" | Se muestra como el nombre / título de tu servidor en la lista de servidores. Puedes usar caracteres especiales para darle colores y estilos. |
| Tags | `"Freeroam"` | Consulta la lista de etiquetas permitidas más abajo. | Etiquetas para la búsqueda, p. ej. Police, Racing, etc. |
| MaxCars | `1` | Cualquier número ≥ 1 | El número máximo de coches por jugador. Los coches adicionales que un jugador intente generar se eliminarán al instante. El monociclo (a pie) no cuenta. |
| MaxPlayers | `8` | Cualquier número ≥ 1 | El número máximo de jugadores por servidor. No afecta a la cantidad de vehículos. Cuando el servidor está lleno, al jugador que intenta unirse se le rechaza con «Server full!», a menos que un plugin le deje entrar (consulta `onPlayerAuth` en la [referencia de scripting](/es/developers/beammp-scripting/server/latest#onplayerauth)). |
| Map | `"/levels/gridmap_v2/info.json"` | Una ubicación de mapa válida, como `/levels/gridmap_v2/info.json` | El mapa que alojará tu servidor. Tiene que estar instalado de serie (más abajo hay una lista) o como mod del servidor. |
| Description | `"BeamMP Default Description"` | Cualquier "texto" | Se muestra como la descripción del servidor en la lista de servidores (si el servidor es público). Puedes usar caracteres especiales para darle colores y estilos. |
| ResourceFolder | `"Resources"` | Una ubicación de carpeta válida, como "D:\Server\BeamMP\Resources" | Útil para guardar el servidor y la carpeta de recursos por separado. |

### La sección `[Misc]` {#the-misc-section}

| Clave | Por defecto | Valor | Qué hace |
|---|---|---|---|
| ImScaredOfUpdates | `true` | true/false | Si está activado (`true`), oculta el mensaje periódico que te avisa de que hay una nueva versión del servidor. El servidor no se actualiza solo: consulta [Mantenimiento del servidor](/es/server-owners/maintenance#updating-the-server). |
| UpdateReminderTime | `"30s"` | Un número con `s`, `min`, `h` o `d` añadido, por ejemplo `30s` | Con qué frecuencia se imprime el recordatorio de actualización en la ventana de terminal. `30d` es cada 30 días, `0.5min` cada medio minuto. |

::: warning El servidor reescribe este archivo
Cada vez que arranca, el servidor vuelve a escribir `ServerConfig.toml` solo con los valores actuales de los ajustes de `[General]` y `[Misc]`. Los comentarios que hayas añadido y las secciones que hayan añadido los plugins, como `[MyMod]`, se eliminan. Los valores establecidos con [variables de entorno](/es/server-owners/manual#general-settings) también se escriben en el archivo, salvo que `BEAMMP_PROVIDER_DISABLE_CONFIG` esté definida.
:::

**Debes** establecer tú mismo la AuthKey. Por defecto está vacía. Escribe la AuthKey que obtuviste al [instalar el servidor](/es/server-owners/host-a-server). No la compartas con nadie y difumínala por completo en las capturas de pantalla.

### Nombres de todos los mapas originales {#all-vanilla-maps-names}

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

Las etiquetas permiten que la gente busque un tipo concreto de servidor. Tu serverConfig.toml se generará con la etiqueta freeroam: `Tags = "Freeroam"`.

Puedes añadir varias etiquetas separadas por comas, `Tags = "Events,Offroad,lang:english"`; no distinguen entre mayúsculas y minúsculas.

Puedes elegir entre la siguiente lista:

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

== Clima y hora del día

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


Si falta alguna etiqueta en esta lista, puedes enviar una solicitud para que la añadan [aquí](https://forum.beammp.com/t/introducing-server-tags/1320081)
