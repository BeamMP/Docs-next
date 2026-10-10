---
description: "Installez BeamMP sous Windows avec l'installateur, ou compilez vous-même le lanceur BeamMP sous Linux, avec le jeu natif ou BeamNG.drive via Proton."
---
# Installer BeamMP

Il vous faut le lanceur BeamMP. Sous Windows, un installateur s'en charge. Sous Linux, vous le compilez vous-même. Il n'existe pas de lanceur pour macOS.

::: warning
BeamMP ne fonctionne pas avec les copies piratées ou obsolètes de BeamNG.drive.
:::

## Installation sur Windows

1. Rendez-vous sur [beammp.com](https://beammp.com/) et cliquez sur **Download Now**.
2. Exécutez `BeamMP_Installer.exe` et suivez les instructions. Laissez **Create a desktop shortcut** sélectionné si vous voulez une icône sur votre bureau.
3. Démarrez le lanceur BeamMP depuis l'icône du bureau. S'il n'y en a pas, cherchez « BeamMP-Launcher » dans la barre de recherche de Windows.

L'installateur ne nécessite pas de droits d'administrateur. Par défaut, il place le lanceur dans `%AppData%\BeamMP-Launcher`. Le lanceur se met à jour tout seul au démarrage. S'il n'y parvient pas, consultez [Problèmes de mise à jour du lanceur](/fr/troubleshooting/launcher-update).

Étape suivante : [rejoindre votre premier serveur](/fr/get-started/join-first-server).

## Installation sur Linux {#install-on-linux}

Il n'existe ni installateur ni téléchargement pour Linux : vous devez donc compiler le lanceur vous-même. Il vous faut une connaissance de base de la compilation d'une application.

### Avant de commencer {#before-you-start}

- Installez BeamNG.drive via Steam. Le lanceur ne trouve le jeu que par Steam. Il cherche dans ces dossiers, situés dans votre dossier personnel : `.steam/root/steamapps`, `.steam/steam/steamapps`, `.var/app/com.valvesoftware.Steam/.steam/root/steamapps` (Flatpak) et `snap/steam/common/.local/share/Steam/steamapps` (Snap). Le jeu doit se trouver dans une bibliothèque Steam listée dans `libraryfolders.vdf`.
- Le lanceur lit et écrit dans le dossier utilisateur du jeu, `~/.local/share/BeamNG/BeamNG.drive/current/`. L'option `--user-path` n'a aucun effet sous Linux.
- Il vous faut un compilateur qui prend en charge C++20 et `std::format`, par exemple GCC 13 ou une version plus récente.

Si le lanceur ne trouve pas le jeu, il affiche `Unsupported Steam installation.`, `libraryfolders.vdf is missing.` ou `The game directory was not found.`. Consultez [Codes d'erreur](/fr/troubleshooting/error-codes).

::: warning
Sous Linux, rejoindre un deuxième serveur après avoir quitté le premier peut échouer. La fenêtre du lanceur affiche alors `(Proxy) bind failed with error: 98` ou `Connection still alive terminating`. Fermez le jeu et le lanceur, puis relancez-les. Aucune version du lanceur jusqu'à la v2.8.1 ne corrige ce problème.
:::

### Installer les outils de compilation

Installez les outils de développement de base. Sur la plupart des systèmes, ils se trouvent dans un paquet :

| Système | Commande |
|---|---|
| Debian, Ubuntu | `sudo apt install build-essential` |
| Fedora | `sudo dnf install cmake gcc gcc-c++ make perl perl-IPC-Cmd perl-FindBin perl-File-Compare perl-File-Copy kernel-headers kernel-devel` |
| Arch | `sudo pacman -S base-devel` |
| openSUSE | `zypper in -t pattern devel-basis` |
| SteamOS (Arch) | `sudo pacman -S base-devel linux-api-headers glibc libconfig` |

Il vous faut aussi `cmake`, `git`, `curl`, `zip`, `unzip`, `tar` et `pkg-config`. Le script d'initialisation (bootstrap) de `vcpkg` a besoin de `curl`, `zip`, `unzip` et `tar`, et `vcpkg` a besoin de `pkg-config` pour compiler les bibliothèques. Installez ceux que votre système n'a pas.

Sous SteamOS, exécutez `sudo steamos-readonly disable` avant d'installer les paquets, puis réactivez-le ensuite.

### Obtenir vcpkg

Clonez `vcpkg`, initialisez-le (bootstrap) et ajoutez-le à votre `PATH` :

1. Clonez-le :

   ```bash
   git clone https://github.com/microsoft/vcpkg.git
   ```

2. Initialisez-le :

   ```bash
   ./vcpkg/bootstrap-vcpkg.sh
   ```

3. Ajoutez-le à votre `PATH` :

   ```bash
   export VCPKG_ROOT="$(pwd)/vcpkg"
   export PATH=$VCPKG_ROOT:$PATH
   ```

### Compiler le lanceur {#build-the-launcher}

1. Clonez le dépôt [BeamMP-Launcher](https://github.com/BeamMP/BeamMP-Launcher), puis placez-vous dedans :

   ```bash
   git clone https://github.com/BeamMP/BeamMP-Launcher.git
   cd BeamMP-Launcher
   ```

   Si vous n'avez encore jamais cloné de dépôt, consultez le guide de GitHub pour [cloner un dépôt](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository).

2. Récupérez le tag de la [dernière version](https://github.com/BeamMP/BeamMP-Launcher/releases/latest) (commande `checkout`). Si la dernière version est `v2.8.1`, exécutez :

   ```bash
   git checkout v2.8.1
   ```

3. Dans le répertoire racine du projet, configurez la compilation. `vcpkg` télécharge et compile les bibliothèques listées dans `vcpkg.json` (`cpp-httplib`, `nlohmann-json`, `zlib`, `openssl` et `curl`) : cette étape prend donc du temps la première fois :

   ```bash
   cmake . -B bin -DCMAKE_TOOLCHAIN_FILE=$VCPKG_ROOT/scripts/buildsystems/vcpkg.cmake -DVCPKG_TARGET_TRIPLET=x64-linux
   ```

4. Lancez la compilation :

   ```bash
   cmake --build bin --parallel
   ```

   Si la compilation manque de RAM, omettez `--parallel`. La compilation n'utilise alors qu'un seul thread du processeur et moins de RAM.

5. Déplacez l'application terminée hors du dossier `bin`, dans son propre dossier, et exécutez-la à partir de là :

   ```bash
   mkdir -p ~/beammp-launcher
   cp bin/BeamMP-Launcher ~/beammp-launcher/
   cd ~/beammp-launcher
   ./BeamMP-Launcher
   ```

Le lanceur crée `Launcher.cfg`, le cache de mods `Resources` et le fichier `Launcher.log` dans le dossier depuis lequel vous l'exécutez. Le lanceur natif Linux démarre la version native Linux de BeamNG.drive depuis le dossier du jeu Steam.

::: details Fedora : vcpkg échoue pendant la compilation d'OpenSSL
Si vcpkg échoue avec des erreurs d'en-têtes du noyau pendant la compilation d'OpenSSL, assurez-vous que les dépendances sont installées :

```bash
sudo dnf install kernel-headers kernel-devel gcc gcc-c++ make perl
```

Puis videz le cache de vcpkg et relancez la commande de configuration :

```bash
rm -rf $VCPKG_ROOT/buildtrees/openssl
```
:::

### Utiliser BeamNG.drive avec Proton

Vous pouvez utiliser le lanceur natif Linux avec BeamNG.drive exécuté via Proton.

1. Démarrez le lanceur avec `--no-launch`, afin qu'il ne démarre pas la version native Linux de BeamNG.drive. D'autres arguments du lanceur sont décrits dans la page [Configuration de l’environnement de développement](/fr/developers/dev-environment-setup#turn-on-dev-mode-in-the-launcher).
2. Faites en sorte que le jeu sous Proton utilise le dossier utilisateur (user folder) du jeu Linux, car le lanceur natif n'écrit que dans celui-ci. Un lien symbolique (symlink) permet de le faire :
   1. Repérez le dossier utilisateur de BeamNG.drive pour Linux, généralement `~/.local/share/BeamNG/BeamNG.drive`, et renommez-le, par exemple en `BeamNG.drive_old`.
   2. Repérez le dossier utilisateur de BeamNG.drive sous Proton, généralement `~/.local/share/Steam/steamapps/compatdata/284160/pfx/drive_c/users/steamuser/AppData/Local/BeamNG/BeamNG.drive`.
   3. Reliez les deux :

      ```bash
      ln -s ~/.local/share/Steam/steamapps/compatdata/284160/pfx/drive_c/users/steamuser/AppData/Local/BeamNG/BeamNG.drive ~/.local/share/BeamNG
      ```

3. Dans Steam, ouvrez les **Propriétés** du jeu et remplacez les options de lancement par :

   ```bash
   ~/BeamMP/BeamMP-Launcher --no-launch & %command% ; killall BeamMP-Launcher
   ```

   Steam démarre alors le lanceur en même temps que le jeu.

Remplacez `~/BeamMP/` par le dossier dans lequel vous avez placé le lanceur que vous avez compilé. Le lanceur cherche toujours le jeu dans une bibliothèque Steam, comme décrit dans [Avant de commencer](#before-you-start).

::: tip Emojis dans les noms et le chat
Pour afficher les emojis dans les noms de serveurs de la liste des serveurs, ainsi que dans le chat en jeu, il vous faut une police qui les contient. Une possibilité est le [portage Linux de la police d'emojis Segoe UI de Windows](https://github.com/mrbvrz/segoe-ui-linux).
:::

### Mettre à jour le lanceur sous Linux {#update-the-launcher-on-linux}

Le lanceur Linux ne se met pas à jour tout seul. Lorsqu'une version plus récente existe, il affiche `Auto update is NOT implemented for the Linux version. Please update manually ASAP as updates contain security patches.` Recompilez-le à partir du tag de la dernière version :

1. Placez-vous dans le dossier du lanceur et récupérez les nouveaux tags :

   ```bash
   export VCPKG_ROOT="$(pwd)/vcpkg"
   cd BeamMP-Launcher
   git fetch --tags
   ```

2. Récupérez le tag de la [dernière version](https://github.com/BeamMP/BeamMP-Launcher/releases/latest), comme dans [Compiler le lanceur](#build-the-launcher).
3. Compilez-le de nouveau et copiez-le dans votre dossier du lanceur :

   ```bash
   cmake . -B bin -DCMAKE_TOOLCHAIN_FILE=$VCPKG_ROOT/scripts/buildsystems/vcpkg.cmake -DVCPKG_TARGET_TRIPLET=x64-linux
   cmake --build bin --parallel
   cp bin/BeamMP-Launcher ~/beammp-launcher/
   cd ~/beammp-launcher
   ./BeamMP-Launcher
   ```

Étape suivante : [rejoindre votre premier serveur](/fr/get-started/join-first-server).
