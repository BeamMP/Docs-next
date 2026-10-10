---
description: "Installiere BeamMP unter Windows mit dem Installer oder erstelle den BeamMP-Launcher unter Linux selbst, mit dem nativen Spiel oder mit BeamNG.drive über Proton."
---
# BeamMP installieren

Du brauchst den BeamMP-Launcher. Unter Windows richtet ihn ein Installer ein. Unter Linux erstellst du ihn selbst. Für macOS gibt es keinen Launcher.

::: warning
BeamMP funktioniert nicht mit raubkopierten oder veralteten Kopien von BeamNG.drive.
:::

## Unter Windows installieren

1. Öffne [beammp.com](https://beammp.com/) und klicke auf **Download Now**.
2. Starte `BeamMP_Installer.exe` und folge den Anweisungen. Lass **Create a desktop shortcut** ausgewählt, wenn du ein Symbol auf deinem Desktop möchtest.
3. Starte den BeamMP-Launcher über das Desktop-Symbol. Falls es keins gibt, suche in der Windows-Suchleiste nach „BeamMP-Launcher“.

Der Installer braucht keine Administratorrechte. Standardmäßig legt er den Launcher in `%AppData%\BeamMP-Launcher` ab. Der Launcher aktualisiert sich beim Start selbst. Wenn er das nicht kann, siehe [Probleme beim Launcher-Update](/de/troubleshooting/launcher-update).

Weiter geht es mit: [dem ersten Server beitreten](/de/get-started/join-first-server).

## Unter Linux installieren {#install-on-linux}

Für Linux gibt es keinen Installer und keinen Download, daher erstellst du den Launcher selbst. Du brauchst dafür grundlegende Kenntnisse darüber, wie man eine Anwendung erstellt (kompiliert).

### Bevor du anfängst {#before-you-start}

- Installiere BeamNG.drive über Steam. Der Launcher findet das Spiel nur über Steam. Er sucht in diesen Ordnern in deinem Home-Ordner: `.steam/root/steamapps`, `.steam/steam/steamapps`, `.var/app/com.valvesoftware.Steam/.steam/root/steamapps` (Flatpak) und `snap/steam/common/.local/share/Steam/steamapps` (Snap). Das Spiel muss in einer Steam-Bibliothek liegen, die in `libraryfolders.vdf` aufgeführt ist.
- Der Launcher liest und schreibt den Benutzerordner des Spiels unter `~/.local/share/BeamNG/BeamNG.drive/current/`. Die Option `--user-path` hat unter Linux keine Wirkung.
- Du brauchst einen Compiler, der C++20 und `std::format` unterstützt, zum Beispiel GCC 13 oder neuer.

Wenn der Launcher das Spiel nicht findet, zeigt er `Unsupported Steam installation.`, `libraryfolders.vdf is missing.` oder `The game directory was not found.` an. Siehe [Fehlercodes](/de/troubleshooting/error-codes).

::: warning
Unter Linux kann der Beitritt zu einem zweiten Server fehlschlagen, nachdem du den ersten verlassen hast. Das Launcher-Fenster zeigt dann `(Proxy) bind failed with error: 98` oder `Connection still alive terminating` an. Schließe das Spiel und den Launcher und starte sie erneut. Keine Launcher-Version bis einschließlich v2.8.1 behebt das.
:::

### Die Build-Tools installieren

Installiere die grundlegenden Entwicklungstools. Auf den meisten Systemen sind sie in einem Paket enthalten:

| System | Befehl |
|---|---|
| Debian, Ubuntu | `sudo apt install build-essential` |
| Fedora | `sudo dnf install cmake gcc gcc-c++ make perl perl-IPC-Cmd perl-FindBin perl-File-Compare perl-File-Copy kernel-headers kernel-devel` |
| Arch | `sudo pacman -S base-devel` |
| openSUSE | `zypper in -t pattern devel-basis` |
| SteamOS (Arch) | `sudo pacman -S base-devel linux-api-headers glibc libconfig` |

Außerdem brauchst du `cmake`, `git`, `curl`, `zip`, `unzip`, `tar` und `pkg-config`. Das Bootstrap-Skript von `vcpkg` braucht `curl`, `zip`, `unzip` und `tar`, und `vcpkg` braucht `pkg-config`, um die Bibliotheken zu erstellen. Installiere alles davon, was dein System nicht hat.

Führe unter SteamOS vor der Installation der Pakete `sudo steamos-readonly disable` aus und schalte es danach wieder ein.

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

2. Wechsle zum Tag der [neuesten Version](https://github.com/BeamMP/BeamMP-Launcher/releases/latest). Wenn die neueste Version `v2.8.1` ist, führe aus:

   ```bash
   git checkout v2.8.1
   ```

3. Konfiguriere den Build im Stammverzeichnis des Projekts. `vcpkg` lädt die in `vcpkg.json` aufgeführten Bibliotheken (`cpp-httplib`, `nlohmann-json`, `zlib`, `openssl` und `curl`) herunter und erstellt sie, deshalb dauert dieser Schritt beim ersten Mal eine Weile:

   ```bash
   cmake . -B bin -DCMAKE_TOOLCHAIN_FILE=$VCPKG_ROOT/scripts/buildsystems/vcpkg.cmake -DVCPKG_TARGET_TRIPLET=x64-linux
   ```

4. Erstelle ihn:

   ```bash
   cmake --build bin --parallel
   ```

   Wenn dem Build der RAM ausgeht, lass `--parallel` weg. Dann nutzt der Build nur einen CPU-Thread und weniger RAM.

5. Verschiebe die fertige Anwendung aus `bin` in einen eigenen Ordner und führe sie von dort aus:

   ```bash
   mkdir -p ~/beammp-launcher
   cp bin/BeamMP-Launcher ~/beammp-launcher/
   cd ~/beammp-launcher
   ./BeamMP-Launcher
   ```

Der Launcher legt `Launcher.cfg`, den Mod-Cache `Resources` und die Datei `Launcher.log` in dem Ordner an, aus dem du ihn ausführst. Der native Linux-Launcher startet das native Linux-BeamNG.drive aus dem Steam-Spielordner.

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

1. Starte den Launcher mit `--no-launch`, damit er das native Linux-BeamNG.drive nicht startet. Weitere Launcher-Argumente findest du auf der Seite [Entwicklungsumgebung einrichten](/de/developers/dev-environment-setup#turn-on-dev-mode-in-the-launcher).
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

Ändere `~/BeamMP/` in den Ordner, in den du den erstellten Launcher gelegt hast. Der Launcher sucht das Spiel weiterhin in einer Steam-Bibliothek, wie unter [Bevor du anfängst](#before-you-start) beschrieben.

::: tip Emojis in Namen und im Chat
Damit Emojis in Servernamen in der Serverliste und im Ingame-Chat angezeigt werden, brauchst du eine Schriftart, die sie enthält. Eine Möglichkeit ist der [Linux-Port der Windows-Emoji-Schriftart Segoe UI](https://github.com/mrbvrz/segoe-ui-linux).
:::

### Den Launcher unter Linux aktualisieren {#update-the-launcher-on-linux}

Der Linux-Launcher aktualisiert sich nicht selbst. Wenn es eine neuere Version gibt, zeigt er `Auto update is NOT implemented for the Linux version. Please update manually ASAP as updates contain security patches.` an. Erstelle ihn aus dem Tag der neuesten Version neu:

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
