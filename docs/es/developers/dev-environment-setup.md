# Primeros pasos

Para empezar a desarrollar para BeamMP necesitarás, como mínimo:

- BeamNG.drive, instalado en local
- BeamMP, instalado en local; al menos el launcher y, además, también el servidor
- Git, instalado en local, y una cuenta de GitHub.com
- Un editor de código, por ejemplo VSCode o Notepad++

---
# Diferencia entre mod, launcher y servidor

BeamMP se divide en tres partes principales:

- El mod lo carga BeamNG, como cualquier otro mod de vehículos o de interfaz del juego. Su función principal es establecer una conexión local con el launcher y mostrar los elementos de la interfaz multijugador. Está escrito principalmente en Lua, con algo de JavaScript, HTML y CSS para los elementos de la interfaz. Su repositorio es [https://github.com/BeamMP/BeamMP](https://github.com/BeamMP/BeamMP)
- La función principal del launcher es establecer una conexión constante con el mod y, cuando sea necesario, establecer una conexión con el servidor elegido, además de gestionar el inicio de sesión del usuario con el backend de BeamMP. Está escrito en C++, BeamMP lo distribuye precompilado y se puede encontrar en [https://github.com/BeamMP/BeamMP-Launcher](https://github.com/BeamMP/BeamMP-Launcher)
- El servidor establece conexiones entre uno o varios launchers, además de enviar "latidos" (heartbeats) al backend de BeamMP con información como la IP, el puerto, la versión, el número de jugadores, etc. Además, gestiona y ejecuta plugins de Lua del lado del servidor. Está escrito en C++, BeamMP lo distribuye precompilado para varios sistemas operativos y arquitecturas de CPU, y se puede encontrar en [https://github.com/BeamMP/BeamMP-Server](https://github.com/BeamMP/BeamMP-Server)

---
# Configurar un entorno de desarrollo para trabajar en el mod

## Usar una carpeta sin empaquetar (unpacked) en BeamNG

Para trabajar eficientemente con mods en BeamNG, se recomienda usar una carpeta `unpacked` en lugar de empaquetar zips después de cada cambio.

Abre la carpeta de usuario de BeamNG navegando a `%appdata%/Local/BeamNG.drive/0.xx/mods`, donde `xx` es la versión más reciente de BeamNG.
Crea una carpeta llamada `unpacked` dentro de la carpeta `mods`.

Encontrarás más información sobre la carpeta de usuario en [https://documentation.beamng.com/support/userfolder/](https://documentation.beamng.com/support/userfolder/)

## Activar el modo de desarrollo en el launcher de BeamMP

Para evitar que la actualización automática elimine tu clon local de git, es necesario desactivarla con `--no-download`.
Si además no quieres que el launcher inicie BeamNG y quieres ver los mensajes de depuración, se recomienda usar `--dev`.

| Argumento                             | Nota                                       |
|:--------------------------------------|:-------------------------------------------|
| `--help` o `-h`                       | Muestra la siguiente lista de argumentos |
| `--port <port>` o `-p`                | Cambia el puerto de escucha predeterminado a `<port>`. También debe configurarse en el juego |
| `--verbose` o `-v`                    | Modo detallado, muestra mensajes de depuración |
| `--no-download`                       | Omite la descarga y la instalación del mod de Lua de BeamMP |
| `--no-update`                         | Omite la aplicación de actualizaciones del launcher (debes actualizar manualmente) |
| `--no-launch`                         | Omite el inicio del juego (debes iniciar el juego manualmente) |
| `--dev`                               | Modo de desarrollador, equivale a --verbose --no-download --no-launch --no-update |
| `--game <args...>` o `-- <args...>`   | Pasa argumentos al juego |

## Clonar el repositorio de BeamMP en la carpeta unpacked

Aunque puedes copiar manualmente los archivos del mod de BeamMP desde nuestro repositorio de GitHub, se recomienda encarecidamente usar un sistema de control de versiones como git.
Primero crea un fork de [https://github.com/BeamMP/BeamMP](https://github.com/BeamMP/BeamMP)

Lo más eficiente sería clonar el repositorio directamente en la carpeta `unpacked`.

Con `git`, ejecuta `git clone https://github.com/yourName/BeamMP` desde una ventana de PowerShell o CMD iniciada en la carpeta `unpacked`.
Estando en la carpeta de usuario, asegúrate de que no quede ninguna carpeta `multiplayer` en `mods` y de que ahora exista `unpacked/beammp`.

Ahora prueba el modo de desarrollo. Inicia el launcher de BeamMP, inicia BeamNG manualmente y, una vez dentro del juego, asegúrate de que BeamMP sea el único mod activo.
Deberías poder usar BeamMP con normalidad.

Con un editor de código, ahora puedes añadir o cambiar código directamente en la carpeta `unpacked`.
Después puedes probar los cambios recargando Lua en el juego pulsando `Ctrl+L` (y `F5` si hiciste cambios en la interfaz).

Cuando estés satisfecho con tus cambios, puedes hacer commit con git. Consulta [el sitio web de Git-SCM](https://git-scm.com/doc) para ver tutoriales y documentación sobre cómo usar Git. En cuanto tus cambios tengan commit y se hayan subido (a tu fork), puedes crear un pull request.

No dudes en preguntar en el canal #scripting de nuestro [Discord](https://discord.gg/beammp) si tienes algún problema.

---
# Configurar un servidor local

Mientras trabajas en BeamMP, puede resultar útil usar un servidor local. Puedes seguir la [instalación del servidor](/es/server-owners/host-a-server) general omitiendo los dos primeros pasos si solo vas a usar conexiones locales.

Configura el servidor como privado en `serverConfig.toml` y usa cualquier cadena de texto como `AuthKey`.

---
# Directrices de contribución

Para más detalles sobre el formato del código, el formato de los mensajes de commit, las buenas prácticas generales de desarrollo, etc., consulta el archivo `CONTRIBUTING.md` de cada repositorio. Este archivo contiene información más detallada sobre cómo contribuir. El `README.md` de cada repositorio suele incluir también los pasos de compilación (en el caso de proyectos compilados).
