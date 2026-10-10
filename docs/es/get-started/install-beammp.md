---
description: "Instala BeamMP en Windows con el instalador, o compila tú mismo el Launcher de BeamMP en Linux, con el juego nativo o con BeamNG.drive a través de Proton."
---
# Instalar BeamMP

Necesitas el Launcher de BeamMP. En Windows lo configura un instalador. En Linux tienes que compilarlo tú. No hay Launcher para macOS.

::: warning
BeamMP no funciona con copias piratas o desactualizadas de BeamNG.drive.
:::

## Instalar en Windows

1. Ve a [beammp.com](https://beammp.com/) y haz clic en **Download Now**.
2. Ejecuta `BeamMP_Installer.exe` y sigue las instrucciones. Deja marcada la opción **Create a desktop shortcut** si quieres un icono en tu escritorio.
3. Inicia el Launcher de BeamMP desde el icono del escritorio. Si no hay ninguno, busca "BeamMP-Launcher" en la barra de búsqueda de Windows.

El instalador no necesita derechos de administrador. Por defecto instala el Launcher en `%AppData%\BeamMP-Launcher`. El Launcher se actualiza solo al iniciarse. Si no puede, consulta [Problemas de actualización del Launcher](/es/troubleshooting/launcher-update).

Siguiente: [únete a tu primer servidor](/es/get-started/join-first-server).

## Instalar en Linux {#install-on-linux}

No hay instalador ni descarga para Linux, así que tienes que compilar el Launcher tú mismo. Necesitas conocimientos básicos sobre cómo compilar una aplicación.

### Antes de empezar {#before-you-start}

- Instala BeamNG.drive a través de Steam. El Launcher solo encuentra el juego a través de Steam. Busca en estas carpetas dentro de tu carpeta personal: `.steam/root/steamapps`, `.steam/steam/steamapps`, `.var/app/com.valvesoftware.Steam/.steam/root/steamapps` (Flatpak) y `snap/steam/common/.local/share/Steam/steamapps` (Snap). El juego debe estar en una biblioteca de Steam que figure en `libraryfolders.vdf`.
- El Launcher lee y escribe en la carpeta de usuario del juego, `~/.local/share/BeamNG/BeamNG.drive/current/`. La opción `--user-path` no tiene efecto en Linux.
- Necesitas un compilador compatible con C++20 y `std::format`, por ejemplo GCC 13 o posterior.

Si el Launcher no encuentra el juego, muestra `Unsupported Steam installation.`, `libraryfolders.vdf is missing.` o `The game directory was not found.`. Consulta [Códigos de error](/es/troubleshooting/error-codes).

::: warning
En Linux, unirte a un segundo servidor después de salir del primero puede fallar. La ventana del Launcher muestra entonces `(Proxy) bind failed with error: 98` o `Connection still alive terminating`. Cierra el juego y el Launcher y vuelve a iniciarlos. Ninguna versión del Launcher hasta la v2.8.1 lo soluciona.
:::

### Instalar las herramientas de compilación

Instala las herramientas básicas de desarrollo. En la mayoría de los sistemas vienen en un paquete:

| Sistema | Comando |
|---|---|
| Debian, Ubuntu | `sudo apt install build-essential` |
| Fedora | `sudo dnf install cmake gcc gcc-c++ make perl perl-IPC-Cmd perl-FindBin perl-File-Compare perl-File-Copy kernel-headers kernel-devel` |
| Arch | `sudo pacman -S base-devel` |
| openSUSE | `zypper in -t pattern devel-basis` |
| SteamOS (Arch) | `sudo pacman -S base-devel linux-api-headers glibc libconfig` |

También necesitas `cmake`, `git`, `curl`, `zip`, `unzip`, `tar` y `pkg-config`. El script de bootstrap de `vcpkg` necesita `curl`, `zip`, `unzip` y `tar`, y `vcpkg` necesita `pkg-config` para compilar las bibliotecas. Instala los que tu sistema no tenga.

En SteamOS, ejecuta `sudo steamos-readonly disable` antes de instalar los paquetes y vuelve a activarlo después.

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

2. Haz checkout de la etiqueta (tag) de la [última versión](https://github.com/BeamMP/BeamMP-Launcher/releases/latest). Si la última versión es `v2.8.1`, ejecuta:

   ```bash
   git checkout v2.8.1
   ```

3. En el directorio raíz del proyecto, configura la compilación. `vcpkg` descarga y compila las bibliotecas que figuran en `vcpkg.json` (`cpp-httplib`, `nlohmann-json`, `zlib`, `openssl` y `curl`), así que este paso tarda un rato la primera vez:

   ```bash
   cmake . -B bin -DCMAKE_TOOLCHAIN_FILE=$VCPKG_ROOT/scripts/buildsystems/vcpkg.cmake -DVCPKG_TARGET_TRIPLET=x64-linux
   ```

4. Compílalo:

   ```bash
   cmake --build bin --parallel
   ```

   Si la compilación se queda sin RAM, omite `--parallel`. Así la compilación usa un solo hilo de CPU y menos RAM.

5. Mueve la aplicación terminada fuera de `bin`, a su propia carpeta, y ejecútala desde allí:

   ```bash
   mkdir -p ~/beammp-launcher
   cp bin/BeamMP-Launcher ~/beammp-launcher/
   cd ~/beammp-launcher
   ./BeamMP-Launcher
   ```

El Launcher crea `Launcher.cfg`, la caché de mods `Resources` y el archivo `Launcher.log` en la carpeta desde la que lo ejecutas. El Launcher nativo de Linux inicia el BeamNG.drive nativo de Linux desde la carpeta del juego de Steam.

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

1. Inicia el Launcher con `--no-launch` para que no arranque el BeamNG.drive nativo de Linux. Encontrarás más argumentos del Launcher en la página [Configuración del entorno de desarrollo](/es/developers/dev-environment-setup#turn-on-dev-mode-in-the-launcher).
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

Cambia `~/BeamMP/` por la carpeta donde hayas puesto el Launcher que compilaste. El Launcher sigue buscando el juego en una biblioteca de Steam, como se describe en [Antes de empezar](#before-you-start).

::: tip Emojis en nombres y en el chat
Para mostrar emojis en los nombres de servidor de la lista de servidores y en el chat del juego, necesitas una fuente que los incluya. Una opción es el [port para Linux de la fuente de emojis Segoe UI de Windows](https://github.com/mrbvrz/segoe-ui-linux).
:::

### Actualizar el Launcher en Linux {#update-the-launcher-on-linux}

El Launcher de Linux no se actualiza solo. Cuando existe una versión más reciente, muestra `Auto update is NOT implemented for the Linux version. Please update manually ASAP as updates contain security patches.` Vuelve a compilarlo desde la etiqueta de la versión más reciente:

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
