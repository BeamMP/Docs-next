---
description: "Installez BeamMP sur Windows avec l'installateur, ou compilez vous-même le lanceur BeamMP sur Linux, avec ou sans Proton."
---
# Installer BeamMP

Il vous faut le lanceur BeamMP. Sous Windows, un installateur s'en charge. Sous Linux, vous le compilez vous-même.

::: warning
BeamMP ne fonctionne pas avec les copies piratées ou obsolètes de BeamNG.drive.
:::

## Installation sur Windows

1. Rendez-vous sur [beammp.com](https://beammp.com/) et cliquez sur **Download Now**.
2. Exécutez `BeamMP_Installer.exe` et suivez les instructions.
3. L'icône du lanceur BeamMP apparaît sur votre bureau. Si ce n'est pas le cas, cherchez « BeamMP » dans la barre de recherche de Windows.

Étape suivante : [rejoindre votre premier serveur](/fr/get-started/join-first-server).

## Installation sur Linux {#install-on-linux}

Il n'existe pas encore d'installateur pour Linux : vous devez donc compiler le lanceur vous-même. Il vous faut une connaissance de base de la compilation d'une application.

### Installer les outils de compilation

Installez les outils de développement de base. Sur la plupart des systèmes, ils se trouvent dans un paquet :

| Système | Commande |
|---|---|
| Debian, Ubuntu | `sudo apt install build-essential` |
| Fedora | `sudo dnf install cmake gcc gcc-c++ make perl perl-IPC-Cmd perl-FindBin perl-File-Compare perl-File-Copy kernel-headers kernel-devel` |
| Arch | `sudo pacman -S base-devel` |
| openSUSE | `zypper in -t pattern devel-basis` |
| SteamOS (Arch) | `sudo pacman -S base-devel linux-api-headers glibc libconfig` |

::: info SteamOS
Exécutez `sudo steamos-readonly disable` avant d'installer les paquets, puis réactivez-le ensuite.
:::

### Obtenir vcpkg

Clonez `vcpkg`, initialisez-le (bootstrap) et ajoutez-le à votre `PATH` :

1. Clonez-le :
   ```bash
   git clone https://github.com/microsoft/vcpkg.git
   ```
2. Initialisez-le :
   ```bash
   ./vcpkg/bootstrap-vcpkg.sh
   ```
3. Ajoutez-le à votre `PATH` :
   ```bash
   export VCPKG_ROOT="$(pwd)/vcpkg"
   export PATH=$VCPKG_ROOT:$PATH
   ```
### Compiler le lanceur {#build-the-launcher}

1. Clonez le dépôt [BeamMP-Launcher](https://github.com/BeamMP/BeamMP-Launcher), puis placez-vous dedans :
   ```bash
   git clone https://github.com/BeamMP/BeamMP-Launcher.git
   cd BeamMP-Launcher
   ```
   Si vous n'avez encore jamais cloné de dépôt, consultez le guide de GitHub pour [cloner un dépôt](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository).

2. Récupérez le tag de la [dernière version](https://github.com/BeamMP/BeamMP-Launcher/releases/latest) (commande `checkout`). Si la dernière version est `v2.8.0`, exécutez :
   ```bash
   git checkout v2.8.0
   ```
3. Dans le répertoire racine du projet, configurez la compilation :
   ```bash
   cmake . -B bin -DCMAKE_TOOLCHAIN_FILE=$VCPKG_ROOT/scripts/buildsystems/vcpkg.cmake -DVCPKG_TARGET_TRIPLET=x64-linux
   ```
4. Lancez la compilation :
   ```bash
   cmake --build bin --parallel
   ```
5. Déplacez l'application terminée hors du dossier `bin`, dans son propre dossier, et exécutez-la à partir de là :
   ```bash
   mkdir -p ~/beammp-launcher
   cp bin/BeamMP-Launcher ~/beammp-launcher/
   cd ~/beammp-launcher
   ./BeamMP-Launcher
   ```
Le lanceur natif Linux démarre et utilise la version native Linux de BeamNG.drive.

::: tip Vous manquez de RAM ?
Omettez `--parallel`. La compilation n'utilise alors qu'un seul thread du processeur et moins de RAM.
:::

::: info Version de débogage
Sans `-DCMAKE_BUILD_TYPE=Release`, vous compilez une version de débogage (debug). Elle est plus volumineuse, mais elle ne présente pas le bug qui empêche le lanceur de se connecter à un serveur plus d'une fois.
:::

::: details Fedora : vcpkg échoue pendant la compilation d'OpenSSL
Si vcpkg échoue avec des erreurs d'en-têtes du noyau pendant la compilation d'OpenSSL, assurez-vous que les dépendances sont installées :
```bash
sudo dnf install kernel-headers kernel-devel gcc gcc-c++ make perl
```
Puis videz le cache de vcpkg et relancez la commande de configuration :
```bash
rm -rf $VCPKG_ROOT/buildtrees/openssl
```
:::

### Utiliser BeamNG.drive avec Proton

Vous pouvez utiliser le lanceur natif Linux avec BeamNG.drive exécuté via Proton.

1. Démarrez le lanceur avec `--no-launch`, afin qu'il ne démarre pas la version native Linux de BeamNG.drive. D'autres arguments du lanceur sont décrits dans la page [Configuration de l'environnement de développement](/fr/developers/dev-environment-setup).
2. Faites en sorte que le jeu sous Proton utilise le dossier utilisateur (user folder) du jeu Linux, car le lanceur natif n'écrit que dans celui-ci. Un lien symbolique (symlink) permet de le faire :
   1. Repérez le dossier utilisateur de BeamNG.drive pour Linux, généralement `~/.local/share/BeamNG/BeamNG.drive`, et renommez-le, par exemple en `BeamNG.drive_old`.
   2. Repérez le dossier utilisateur de BeamNG.drive sous Proton, généralement `~/.local/share/Steam/steamapps/compatdata/284160/pfx/drive_c/users/steamuser/AppData/Local/BeamNG/BeamNG.drive`.
   3. Reliez les deux :
      ```bash
      ln -s ~/.local/share/Steam/steamapps/compatdata/284160/pfx/drive_c/users/steamuser/AppData/Local/BeamNG/BeamNG.drive ~/.local/share/BeamNG
      ```
3. Dans Steam, ouvrez les **Propriétés** du jeu et remplacez les options de lancement par :
   ```bash
   ~/BeamMP/BeamMP-Launcher --no-launch & %command% ; killall BeamMP-Launcher
   ```
   Steam démarre alors le lanceur en même temps que le jeu.

Remplacez `~/BeamMP/` par le dossier dans lequel vous avez placé le lanceur que vous avez compilé. Vous devez recompiler le lanceur à partir du bon tag git à chaque nouvelle version du lanceur.

::: tip Emojis dans les noms et le chat
Pour afficher les emojis dans les noms de serveurs de la liste des serveurs, ainsi que dans le chat en jeu, il vous faut une police qui les contient. Une possibilité est le [portage Linux de la police d'emojis Segoe UI de Windows](https://github.com/mrbvrz/segoe-ui-linux).
:::

### Mettre à jour le lanceur sous Linux

1. Placez-vous dans le dossier du lanceur et récupérez les nouveaux tags :
   ```bash
   export VCPKG_ROOT="$(pwd)/vcpkg"
   cd BeamMP-Launcher
   git fetch --tags
   ```
2. Récupérez le tag de la [dernière version](https://github.com/BeamMP/BeamMP-Launcher/releases/latest), comme dans [Compiler le lanceur](#build-the-launcher).
3. Compilez-le de nouveau et copiez-le dans votre dossier du lanceur :
   ```bash
   cmake . -B bin -DCMAKE_TOOLCHAIN_FILE=$VCPKG_ROOT/scripts/buildsystems/vcpkg.cmake -DVCPKG_TARGET_TRIPLET=x64-linux
   cmake --build bin --parallel
   cp bin/BeamMP-Launcher ~/beammp-launcher/
   cd ~/beammp-launcher
   ./BeamMP-Launcher
   ```
Étape suivante : [rejoindre votre premier serveur](/fr/get-started/join-first-server).
