---
description: "Configura un entorno de desarrollo para el mod de BeamMP: carpeta unpacked, modo de desarrollo y ajustes del Launcher, compilar el Launcher, repositorio clonado, servidor local y cómo contribuir."
---
# Configuración del entorno de desarrollo

Esta página explica cómo preparar tu ordenador para trabajar en el mod de BeamMP y cómo ejecutar un servidor local. Para saber cómo encajan el mod, el Launcher y el servidor, consulta [Desarrolladores](/es/developers/).

## Qué necesitas

- BeamNG.drive, instalado en local.
- BeamMP, instalado en local: al menos el Launcher y también el servidor si quieres probar con uno.
- Git, instalado en local, y una cuenta de GitHub.
- Un editor de código, por ejemplo VSCode o Notepad++.

## Usar una carpeta unpacked en BeamNG

Para trabajar con mods de forma eficiente, usa una carpeta `unpacked` en lugar de empaquetar un zip después de cada cambio.

1. Abre la carpeta `mods` dentro de la carpeta de usuario de BeamNG. En Windows es `%LocalAppData%\BeamNG\BeamNG.drive\current\mods`. El Launcher muestra la carpeta que usa en la línea `Game user path:` al iniciarse.
2. Crea una carpeta llamada `unpacked` dentro de `mods`.

Encontrarás más información sobre la carpeta de usuario en la [documentación de BeamNG](https://documentation.beamng.com/support/userfolder/).

## Activar el modo de desarrollo en el Launcher {#turn-on-dev-mode-in-the-launcher}

Inicia el Launcher con `--dev`. El modo de desarrollo muestra mensajes de depuración, no descarga el mod de BeamMP, no inicia BeamNG.drive y no actualiza el Launcher. Si solo quieres parte de esto, usa las opciones individuales de más abajo.

Sin `--no-download`, el Launcher descarga la versión publicada del mod de BeamMP en `mods/multiplayer`. Además, elimina `mods/unpacked/beammp` a menos que esa carpeta contenga una carpeta `.git`. Usa `--no-download` para que la versión publicada del mod no se ejecute junto con la tuya.

| Argumento | Qué hace |
|---|---|
| `--help`, `-h` o `/?` | Muestra esta lista de argumentos y se cierra |
| `--port <port>` o `-p <port>` | Cambia el puerto de escucha, `4444` de forma predeterminada, a `<port>`. El Launcher también usa `<port>` + 1. También debe configurarse en el juego. Sustituye a `Port` en `Launcher.cfg` |
| `--verbose` o `-v` | Modo detallado: muestra mensajes de depuración en la ventana. Siempre se escriben en `Launcher.log` |
| `--no-download` | Omite la descarga y la instalación del mod de BeamMP |
| `--no-update` | Omite la aplicación de las actualizaciones del Launcher, así que debes actualizar a mano |
| `--no-launch` | Omite el inicio del juego, así que debes iniciarlo tú |
| `--dev` | Modo de desarrollador: equivale a `--verbose --no-download --no-launch --no-update` |
| `--user-path <path>` | Solo en Windows. Ruta a la carpeta de usuario de BeamNG.drive, la carpeta que contiene `current` |
| `--game <args...>` o `-- <args...>` | Pasa al juego todos los argumentos que van después |

### Archivo de configuración del Launcher

El Launcher lee `Launcher.cfg` de la carpeta desde la que se ejecuta. Si el archivo no existe, el Launcher lo crea con los tres primeros ajustes. Las opciones de la línea de comandos sustituyen a los ajustes correspondientes.

| Ajuste | Valor predeterminado | Qué hace |
|---|---|---|
| `"Port"` | `4444` | El puerto al que se conecta el juego. Consulta [Cambiar el puerto del Launcher](/es/troubleshooting/launcher-port) |
| `"Build"` | `"Default"` | La compilación que el Launcher solicita al backend de BeamMP cuando busca actualizaciones del Launcher y del mod. Déjalo en `Default` |
| `"CachingDirectory"` | `"./Resources"` | La carpeta donde el Launcher guarda los mods de servidor descargados |
| `"Dev"` | sin definir | `true` equivale a `--dev` |
| `"DeleteDuplicateMods"` | `false` | `true` hace que el Launcher elimine las versiones anteriores de un mod guardadas en la caché cuando un servidor envía una más reciente |

### Caché de mods

Cuando te unes a un servidor, el Launcher descarga cada mod que el servidor indica en la carpeta `CachingDirectory`. Un mod se guarda como `<name>-<first 8 characters of its SHA-256 hash>.zip`. El Launcher reutiliza un archivo de la caché cuando su hash coincide, y registra el último uso de cada archivo en `mods.json`, en la misma carpeta. Después copia el mod en `mods/multiplayer`, dentro de la carpeta de usuario del juego, con el nombre de archivo en minúsculas en Linux.

Cada vez que se inicia, el Launcher elimina todo lo que hay en `mods/multiplayer` salvo `beammp.zip`. No guardes allí tus propios archivos.

## Compilar el Launcher

Solo necesitas compilar el Launcher si trabajas en el propio Launcher. El `README.md` del Launcher no incluye pasos de compilación.

En Windows necesitas Visual Studio con la carga de trabajo de escritorio de C++ (MSVC), CMake y [vcpkg](https://github.com/microsoft/vcpkg). Las bibliotecas de `vcpkg.json` son `cpp-httplib`, `nlohmann-json`, `zlib`, `openssl` y `curl`. El Launcher usa el runtime estático de C++, así que usa el triplete `x64-windows-static`. En el directorio raíz del proyecto, ejecuta lo siguiente. Cambia `C:/vcpkg` por el lugar donde instalaste `vcpkg`:

```bash
cmake . -B bin -DCMAKE_BUILD_TYPE=Release -DCMAKE_TOOLCHAIN_FILE=C:/vcpkg/scripts/buildsystems/vcpkg.cmake -DVCPKG_TARGET_TRIPLET=x64-windows-static
cmake --build bin --parallel --config Release
```

El programa es `bin/Release/BeamMP-Launcher.exe`. En Windows, el Launcher se sustituye a sí mismo por la versión oficial firmada cuando existe una más reciente, así que inicia tu propia compilación con `--no-update`.

Para Linux, sigue [Compilar el Launcher](/es/get-started/install-beammp#build-the-launcher). El Launcher no se puede compilar en macOS.

## Clonar el repositorio de BeamMP en la carpeta unpacked

Puedes copiar a mano los archivos del mod desde nuestro repositorio de GitHub, pero es mucho mejor usar un sistema de control de versiones como git.

1. Crea un fork de [BeamMP/BeamMP](https://github.com/BeamMP/BeamMP).
2. Clónalo directamente en la carpeta `unpacked`. En PowerShell o CMD abiertos en esa carpeta, ejecuta:

   ```bash
   git clone https://github.com/yourName/BeamMP
   ```

3. En la carpeta de usuario, elimina `mods/multiplayer/beammp.zip` si existe. Un inicio normal del Launcher lo descarga, y `--no-download` no lo elimina. Comprueba que exista `mods/unpacked/beammp`.
4. Prueba el modo de desarrollo. Inicia el Launcher con `--dev` y luego inicia BeamNG manualmente. Dentro del juego, asegúrate de que BeamMP sea el único mod activo. Puedes usar BeamMP con normalidad.

Con un editor de código ya puedes cambiar el código directamente en la carpeta `unpacked`. Recarga Lua en el juego con `Ctrl` + `L` y pulsa también `F5` si cambiaste la interfaz.

## Configurar un servidor local

Un servidor local resulta útil cuando trabajas en BeamMP. Sigue [Alojar un servidor](/es/server-owners/host-a-server), omitiendo los dos primeros pasos (la redirección de puertos y la AuthKey) si solo te conectas en local.

En `ServerConfig.toml`, configura el servidor como privado y usa cualquier cadena de texto como `AuthKey`.

## Contribuir con tus cambios

Cuando estés satisfecho con tus cambios, haz commit con git. El [sitio web de Git-SCM](https://git-scm.com/doc) ofrece tutoriales y documentación. Cuando tus cambios tengan commit y se hayan subido a tu fork, puedes crear un pull request.

El repositorio del mod de BeamMP tiene un archivo `CONTRIBUTING.md` con el formato del código, el formato de los mensajes de commit y las buenas prácticas generales de desarrollo. El repositorio del Launcher tiene un archivo `.clang-format` con su estilo de código, y su plantilla de pull request te pide confirmar que has escrito y entiendes todo el código por tu cuenta. El `README.md` de un repositorio puede incluir los pasos de compilación de los proyectos compilados.

Si tienes problemas, pregunta en el canal `#scripting` de nuestro [servidor de Discord](https://discord.gg/beammp).
