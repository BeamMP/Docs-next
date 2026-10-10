---
description: "Configura un entorno de desarrollo para el mod de BeamMP: carpeta unpacked, modo de desarrollo del Launcher, repositorio clonado, servidor local y cómo contribuir."
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

1. Abre la carpeta de usuario de BeamNG en `%appdata%/Local/BeamNG.drive/0.xx/mods`, donde `xx` es la versión más reciente de BeamNG.
2. Crea una carpeta llamada `unpacked` dentro de `mods`.

Encontrarás más información sobre la carpeta de usuario en la [documentación de BeamNG](https://documentation.beamng.com/support/userfolder/).

## Activar el modo de desarrollo en el Launcher

La actualización automática eliminaría tu clon local de git, así que desactívala con `--no-download`. Si además no quieres que el Launcher inicie BeamNG y quieres ver los mensajes de depuración, usa `--dev`.

| Argumento | Qué hace |
|---|---|
| `--help` o `-h` | Muestra esta lista de argumentos |
| `--port <port>` o `-p` | Cambia el puerto de escucha predeterminado a `<port>`. También debe configurarse en el juego |
| `--verbose` o `-v` | Modo detallado: muestra mensajes de depuración |
| `--no-download` | Omite la descarga y la instalación del mod de Lua de BeamMP |
| `--no-update` | Omite la aplicación de las actualizaciones del Launcher, así que debes actualizar a mano |
| `--no-launch` | Omite el inicio del juego, así que debes iniciarlo tú |
| `--dev` | Modo de desarrollador: equivale a `--verbose --no-download --no-launch --no-update` |
| `--user-path <path>` | Ruta a la carpeta de usuario de BeamNG.drive |
| `--game <args...>` o `-- <args...>` | Pasa argumentos al juego |

## Clonar el repositorio de BeamMP en la carpeta unpacked

Puedes copiar a mano los archivos del mod desde nuestro repositorio de GitHub, pero es mucho mejor usar un sistema de control de versiones como git.

1. Crea un fork de [BeamMP/BeamMP](https://github.com/BeamMP/BeamMP).
2. Clónalo directamente en la carpeta `unpacked`. En PowerShell o CMD abiertos en esa carpeta, ejecuta:
   ```bash
   git clone https://github.com/yourName/BeamMP
   ```
3. En la carpeta de usuario, asegúrate de que no quede ninguna carpeta `multiplayer` en `mods` y de que ahora exista `unpacked/beammp`.
4. Prueba el modo de desarrollo. Inicia el Launcher y luego inicia BeamNG manualmente. Dentro del juego, asegúrate de que BeamMP sea el único mod activo. Puedes usar BeamMP con normalidad.

Con un editor de código ya puedes cambiar el código directamente en la carpeta `unpacked`. Recarga Lua en el juego con `Ctrl` + `L` y pulsa también `F5` si cambiaste la interfaz.

## Configurar un servidor local

Un servidor local resulta útil cuando trabajas en BeamMP. Sigue [Alojar un servidor](/es/server-owners/host-a-server), omitiendo los dos primeros pasos (la redirección de puertos y la AuthKey) si solo te conectas en local.

En `ServerConfig.toml`, configura el servidor como privado y usa cualquier cadena de texto como `AuthKey`.

## Contribuir con tus cambios

Cuando estés satisfecho con tus cambios, haz commit con git. El [sitio web de Git-SCM](https://git-scm.com/doc) ofrece tutoriales y documentación. Cuando tus cambios tengan commit y se hayan subido a tu fork, puedes crear un pull request.

Para el formato del código, el formato de los mensajes de commit y las buenas prácticas generales de desarrollo, consulta el archivo `CONTRIBUTING.md` de cada repositorio. El `README.md` de cada repositorio suele incluir los pasos de compilación de los proyectos compilados.

Si tienes problemas, pregunta en el canal `#scripting` de nuestro [servidor de Discord](https://discord.gg/beammp).
