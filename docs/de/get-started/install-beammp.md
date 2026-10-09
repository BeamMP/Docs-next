---
description: "Installiere BeamMP unter Windows mit dem Installer oder erstelle den BeamMP-Launcher unter Linux selbst, mit oder ohne Proton."
---
# BeamMP installieren

Du brauchst den BeamMP-Launcher. Unter Windows richtet ihn ein Installer ein. Unter Linux erstellst du ihn selbst.

::: warning
BeamMP funktioniert nicht mit raubkopierten oder veralteten Kopien von BeamNG.drive.
:::

## Unter Windows installieren

1. Öffne [beammp.com](https://beammp.com/) und klicke auf **Download Now**.
2. Starte `BeamMP_Installer.exe` und folge den Anweisungen.
3. Das Symbol des BeamMP-Launchers erscheint auf deinem Desktop. Falls nicht, suche in der Windows-Suchleiste nach „BeamMP“.

Weiter geht es mit: [dem ersten Server beitreten](/de/get-started/join-first-server).

## Unter Linux installieren {#install-on-linux}

Für Linux gibt es noch keinen Installer, daher erstellst du den Launcher selbst. Du brauchst dafür grundlegende Kenntnisse darüber, wie man eine Anwendung erstellt (kompiliert).

### Die Build-Tools installieren

Installiere die grundlegenden Entwicklungstools. Auf den meisten Systemen sind sie in einem Paket enthalten:

| System | Befehl |
|---|---|
| Debian, Ubuntu | `sudo apt install build-essential` |
| Fedora | `sudo dnf install cmake gcc gcc-c++ make perl perl-IPC-Cmd perl-FindBin perl-File-Compare perl-File-Copy kernel-headers kernel-devel` |
| Arch | `sudo pacman -S base-devel` |
| openSUSE | `zypper in -t pattern devel-basis` |
| SteamOS (Arch) | `sudo pacman -S base-devel linux-api-headers glibc libconfig` |

::: info SteamOS
Führe vor der Installation der Pakete `sudo steamos-readonly disable` aus und schalte es danach wieder ein.
:::

### vcpkg besorgen

Klone `vcpkg`, initialisiere es und füge es deiner `PATH`-Umgebungsvariable hinzu:

1. Klone es:
   ```bash
   git clone https://github.com/microsoft/vcpkg.git
   ```
2. Initialisiere es:
   ```bash
   ./vcpkg/bootstrap-vcpkg.sh
   ```
3. Füge es deiner `PATH`-Umgebungsvariable hinzu:
   ```bash
   export VCPKG_ROOT="$(pwd)/vcpkg"
   export PATH=$VCPKG_ROOT:$PATH
   ```
### Den Launcher erstellen {#build-the-launcher}

1. Klone das Repository [BeamMP-Launcher](https://github.com/BeamMP/BeamMP-Launcher) und wechsle dann hinein:
   ```bash
   git clone https://github.com/BeamMP/BeamMP-Launcher.git
   cd BeamMP-Launcher
   ```
   Falls du noch nie ein Repository geklont hast, findest du in der GitHub-Anleitung zum [Klonen eines Repositorys](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) Hilfe.

2. Wechsle zum Tag der [neuesten Version](https://github.com/BeamMP/BeamMP-Launcher/releases/latest). Wenn die neueste Version `v2.8.0` ist, führe aus:
   ```bash
   git checkout v2.8.0
   ```
3. Konfiguriere den Build im Stammverzeichnis des Projekts:
   ```bash
   cmake . -B bin -DCMAKE_TOOLCHAIN_FILE=$VCPKG_ROOT/scripts/buildsystems/vcpkg.cmake -DVCPKG_TARGET_TRIPLET=x64-linux
   ```
4. Erstelle ihn:
   ```bash
   cmake --build bin --parallel
   ```
5. Verschiebe die fertige Anwendung aus `bin` in einen eigenen Ordner und führe sie von dort aus:
   ```bash
   mkdir -p ~/beammp-launcher
   cp bin/BeamMP-Launcher ~/beammp-launcher/
   cd ~/beammp-launcher
   ./BeamMP-Launcher
   ```
Der native Linux-Launcher wird gestartet und verwendet das native Linux-BeamNG.drive.

::: tip Der RAM geht dir aus?
Lass `--parallel` weg. Dann nutzt der Build nur einen CPU-Thread und weniger RAM.
:::

::: info Debug-Build
Ohne `-DCMAKE_BUILD_TYPE=Release` erstellst du eine Debug-Version. Sie ist größer, hat aber nicht den Fehler, dass sich der Launcher nur einmal mit einem Server verbinden kann.
:::

::: details Fedora: vcpkg schlägt beim Erstellen von OpenSSL fehl
Wenn vcpkg bei OpenSSL mit Kernel-Header-Fehlern fehlschlägt, stelle sicher, dass die Abhängigkeiten installiert sind:
```bash
sudo dnf install kernel-headers kernel-devel gcc gcc-c++ make perl
```
Leere dann den vcpkg-Cache und führe den Konfigurationsbefehl erneut aus:
```bash
rm -rf $VCPKG_ROOT/buildtrees/openssl
```
:::

### BeamNG.drive über Proton nutzen

Du kannst den nativen Linux-Launcher zusammen mit BeamNG.drive nutzen, das über Proton läuft.

1. Starte den Launcher mit `--no-launch`, damit er das native Linux-BeamNG.drive nicht startet. Weitere Launcher-Argumente findest du auf der Seite [Entwicklungsumgebung einrichten](/de/developers/dev-environment-setup).
2. Sorge dafür, dass das Proton-Spiel den Benutzerordner des Linux-Spiels verwendet, da der native Launcher nur dorthin schreibt. Das geht mit einem symbolischen Link:
   1. Suche den Benutzerordner von Linux-BeamNG.drive, normalerweise `~/.local/share/BeamNG/BeamNG.drive`, und benenne ihn um, zum Beispiel in `BeamNG.drive_old`.
   2. Suche den Benutzerordner von Proton-BeamNG.drive, normalerweise `~/.local/share/Steam/steamapps/compatdata/284160/pfx/drive_c/users/steamuser/AppData/Local/BeamNG/BeamNG.drive`.
   3. Verknüpfe beide:
      ```bash
      ln -s ~/.local/share/Steam/steamapps/compatdata/284160/pfx/drive_c/users/steamuser/AppData/Local/BeamNG/BeamNG.drive ~/.local/share/BeamNG
      ```
3. Öffne in Steam die **Eigenschaften** des Spiels und ersetze die Startoptionen durch:
   ```bash
   ~/BeamMP/BeamMP-Launcher --no-launch & %command% ; killall BeamMP-Launcher
   ```
   Steam startet den Launcher dann zusammen mit dem Spiel.

Ändere `~/BeamMP/` in den Ordner, in den du den erstellten Launcher gelegt hast. Du musst den Launcher jedes Mal, wenn eine neue Launcher-Version erscheint, mit dem richtigen Git-Tag neu erstellen.

::: tip Emojis in Namen und im Chat
Damit Emojis in Servernamen in der Serverliste und im Ingame-Chat angezeigt werden, brauchst du eine Schriftart, die sie enthält. Eine Möglichkeit ist der [Linux-Port der Windows-Emoji-Schriftart Segoe UI](https://github.com/mrbvrz/segoe-ui-linux).
:::

### Den Launcher unter Linux aktualisieren

1. Wechsle in den Launcher-Ordner und hole die neuen Tags:
   ```bash
   export VCPKG_ROOT="$(pwd)/vcpkg"
   cd BeamMP-Launcher
   git fetch --tags
   ```
2. Wechsle zum Tag der [neuesten Version](https://github.com/BeamMP/BeamMP-Launcher/releases/latest), wie unter [Den Launcher erstellen](#build-the-launcher).
3. Erstelle ihn erneut und kopiere ihn in deinen Launcher-Ordner:
   ```bash
   cmake . -B bin -DCMAKE_TOOLCHAIN_FILE=$VCPKG_ROOT/scripts/buildsystems/vcpkg.cmake -DVCPKG_TARGET_TRIPLET=x64-linux
   cmake --build bin --parallel
   cp bin/BeamMP-Launcher ~/beammp-launcher/
   cd ~/beammp-launcher
   ./BeamMP-Launcher
   ```
Weiter geht es mit: [dem ersten Server beitreten](/de/get-started/join-first-server).
