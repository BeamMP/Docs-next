---
description: "Instala BeamMP en Windows con el instalador, o compila tú mismo el Launcher de BeamMP en Linux, con o sin Proton."
---
# Instalar BeamMP

Necesitas el Launcher de BeamMP. En Windows lo configura un instalador. En Linux tienes que compilarlo tú.

::: warning
BeamMP no funciona con copias piratas o desactualizadas de BeamNG.drive.
:::

## Instalar en Windows

1. Ve a [beammp.com](https://beammp.com/) y haz clic en **Download Now**.
2. Ejecuta `BeamMP_Installer.exe` y sigue las instrucciones.
3. El icono del Launcher de BeamMP aparece en tu escritorio. Si no aparece, busca "BeamMP" en la barra de búsqueda de Windows.

Siguiente: [únete a tu primer servidor](/es/get-started/join-first-server).

## Instalar en Linux {#install-on-linux}

Todavía no hay un instalador para Linux, así que tienes que compilar el Launcher tú mismo. Necesitas conocimientos básicos sobre cómo compilar una aplicación.

### Instalar las herramientas de compilación

Instala las herramientas básicas de desarrollo. En la mayoría de los sistemas vienen en un paquete:

| Sistema | Comando |
|---|---|
| Debian, Ubuntu | `sudo apt install build-essential` |
| Fedora | `sudo dnf install cmake gcc gcc-c++ make perl perl-IPC-Cmd perl-FindBin perl-File-Compare perl-File-Copy kernel-headers kernel-devel` |
| Arch | `sudo pacman -S base-devel` |
| openSUSE | `zypper in -t pattern devel-basis` |
| SteamOS (Arch) | `sudo pacman -S base-devel linux-api-headers glibc libconfig` |

::: info SteamOS
Ejecuta `sudo steamos-readonly disable` antes de instalar los paquetes y vuelve a activarlo después.
:::

### Obtener vcpkg

Clona `vcpkg`, ejecuta su bootstrap y añádelo a tu `PATH`:

1. Clónalo:
   ```bash
   git clone https://github.com/microsoft/vcpkg.git
   ```
2. Ejecuta el bootstrap:
   ```bash
   ./vcpkg/bootstrap-vcpkg.sh
   ```
3. Añádelo a tu `PATH`:
   ```bash
   export VCPKG_ROOT="$(pwd)/vcpkg"
   export PATH=$VCPKG_ROOT:$PATH
   ```
### Compilar el Launcher {#build-the-launcher}

1. Clona el repositorio [BeamMP-Launcher](https://github.com/BeamMP/BeamMP-Launcher) y entra en él:
   ```bash
   git clone https://github.com/BeamMP/BeamMP-Launcher.git
   cd BeamMP-Launcher
   ```
   Si nunca has clonado un repositorio, consulta la guía de GitHub para [clonar un repositorio](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository).

2. Haz checkout de la etiqueta (tag) de la [última versión](https://github.com/BeamMP/BeamMP-Launcher/releases/latest). Si la última versión es `v2.8.0`, ejecuta:
   ```bash
   git checkout v2.8.0
   ```
3. En el directorio raíz del proyecto, configura la compilación:
   ```bash
   cmake . -B bin -DCMAKE_TOOLCHAIN_FILE=$VCPKG_ROOT/scripts/buildsystems/vcpkg.cmake -DVCPKG_TARGET_TRIPLET=x64-linux
   ```
4. Compílalo:
   ```bash
   cmake --build bin --parallel
   ```
5. Mueve la aplicación terminada fuera de `bin`, a su propia carpeta, y ejecútala desde allí:
   ```bash
   mkdir -p ~/beammp-launcher
   cp bin/BeamMP-Launcher ~/beammp-launcher/
   cd ~/beammp-launcher
   ./BeamMP-Launcher
   ```
El Launcher nativo de Linux se inicia y usa el BeamNG.drive nativo de Linux.

::: tip ¿Te quedas sin RAM?
Omite `--parallel`. Así la compilación usa un solo hilo de CPU y menos RAM.
:::

::: info Compilación de depuración
Sin `-DCMAKE_BUILD_TYPE=Release` compilas una versión de depuración. Es más grande, pero no tiene el error por el que el Launcher solo puede conectarse a un servidor una vez.
:::

::: details Fedora: vcpkg falla al compilar OpenSSL
Si vcpkg falla con errores de las cabeceras del kernel durante OpenSSL, asegúrate de que las dependencias están instaladas:
```bash
sudo dnf install kernel-headers kernel-devel gcc gcc-c++ make perl
```
Después borra la caché de vcpkg y vuelve a ejecutar el comando de configuración:
```bash
rm -rf $VCPKG_ROOT/buildtrees/openssl
```
:::

### Usar BeamNG.drive con Proton

Puedes usar el Launcher nativo de Linux con BeamNG.drive ejecutándose a través de Proton.

1. Inicia el Launcher con `--no-launch` para que no arranque el BeamNG.drive nativo de Linux. Encontrarás más argumentos del Launcher en la página [Configuración del entorno de desarrollo](/es/developers/dev-environment-setup).
2. Haz que el juego de Proton use la carpeta de usuario del juego de Linux, porque el Launcher nativo solo escribe en esa. Un enlace simbólico lo consigue:
   1. Busca la carpeta de usuario de BeamNG.drive en Linux, normalmente `~/.local/share/BeamNG/BeamNG.drive`, y renómbrala, por ejemplo a `BeamNG.drive_old`.
   2. Busca la carpeta de usuario de BeamNG.drive en Proton, normalmente `~/.local/share/Steam/steamapps/compatdata/284160/pfx/drive_c/users/steamuser/AppData/Local/BeamNG/BeamNG.drive`.
   3. Enlaza las dos:
      ```bash
      ln -s ~/.local/share/Steam/steamapps/compatdata/284160/pfx/drive_c/users/steamuser/AppData/Local/BeamNG/BeamNG.drive ~/.local/share/BeamNG
      ```
3. En Steam, abre las **Propiedades** del juego y sustituye las opciones de lanzamiento por:
   ```bash
   ~/BeamMP/BeamMP-Launcher --no-launch & %command% ; killall BeamMP-Launcher
   ```
   Steam iniciará entonces el Launcher junto con el juego.

Cambia `~/BeamMP/` por la carpeta donde hayas puesto el Launcher que compilaste. Debes recompilar el Launcher desde la etiqueta de git correcta cada vez que salga una nueva versión del Launcher.

::: tip Emojis en nombres y en el chat
Para mostrar emojis en los nombres de servidor de la lista de servidores y en el chat del juego, necesitas una fuente que los incluya. Una opción es el [port para Linux de la fuente de emojis Segoe UI de Windows](https://github.com/mrbvrz/segoe-ui-linux).
:::

### Actualizar el Launcher en Linux

1. Entra en la carpeta del Launcher y descarga las nuevas etiquetas:
   ```bash
   export VCPKG_ROOT="$(pwd)/vcpkg"
   cd BeamMP-Launcher
   git fetch --tags
   ```
2. Haz checkout de la etiqueta de la [última versión](https://github.com/BeamMP/BeamMP-Launcher/releases/latest), como en [Compilar el Launcher](#build-the-launcher).
3. Vuelve a compilarlo y cópialo a la carpeta de tu Launcher:
   ```bash
   cmake . -B bin -DCMAKE_TOOLCHAIN_FILE=$VCPKG_ROOT/scripts/buildsystems/vcpkg.cmake -DVCPKG_TARGET_TRIPLET=x64-linux
   cmake --build bin --parallel
   cp bin/BeamMP-Launcher ~/beammp-launcher/
   cd ~/beammp-launcher
   ./BeamMP-Launcher
   ```
Siguiente: [únete a tu primer servidor](/es/get-started/join-first-server).
