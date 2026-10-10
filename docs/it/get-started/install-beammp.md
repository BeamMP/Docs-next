---
description: "Installa BeamMP su Windows con l'installer, oppure compila tu stesso il Launcher di BeamMP su Linux, con il gioco nativo o con BeamNG.drive tramite Proton."
---
# Installa BeamMP

Ti serve il Launcher di BeamMP. Su Windows lo installa un installer, su Linux lo compili tu. Non esiste un Launcher per macOS.

::: warning
BeamMP non funziona con copie piratate o non aggiornate di BeamNG.drive.
:::

## Installazione su Windows

1. Vai su [beammp.com](https://beammp.com/) e clicca su **Download Now**.
2. Avvia `BeamMP_Installer.exe` e segui le istruzioni. Lascia selezionata l'opzione **Create a desktop shortcut** se vuoi un'icona sul desktop.
3. Avvia il Launcher di BeamMP dall'icona sul desktop. Se non c'è, cerca "BeamMP-Launcher" nella barra di ricerca di Windows.

L'installer non richiede i diritti di amministratore. Per impostazione predefinita mette il Launcher in `%AppData%\BeamMP-Launcher`. Il Launcher si aggiorna da solo quando si avvia. Se non ci riesce, vedi [Problemi aggiornamento Launcher](/it/troubleshooting/launcher-update).

Passo successivo: [unisciti al tuo primo server](/it/get-started/join-first-server).

## Installazione su Linux {#install-on-linux}

Per Linux non esiste né un installer né un download, quindi devi compilare il Launcher da solo. Ti serve una conoscenza di base di come si compila un'applicazione.

### Prima di iniziare {#before-you-start}

- Installa BeamNG.drive tramite Steam. Il Launcher trova il gioco solo tramite Steam. Cerca in queste cartelle dentro la tua cartella home: `.steam/root/steamapps`, `.steam/steam/steamapps`, `.var/app/com.valvesoftware.Steam/.steam/root/steamapps` (Flatpak) e `snap/steam/common/.local/share/Steam/steamapps` (Snap). Il gioco deve trovarsi in una libreria di Steam elencata in `libraryfolders.vdf`.
- Il Launcher legge e scrive la cartella utente del gioco in `~/.local/share/BeamNG/BeamNG.drive/current/`. L'opzione `--user-path` su Linux non ha alcun effetto.
- Ti serve un compilatore che supporti C++20 e `std::format`, per esempio GCC 13 o più recente.

Se il Launcher non riesce a trovare il gioco, mostra `Unsupported Steam installation.`, `libraryfolders.vdf is missing.` oppure `The game directory was not found.`. Vedi [Codici di errore](/it/troubleshooting/error-codes).

::: warning
Su Linux, entrare in un secondo server dopo aver lasciato il primo può non riuscire. La finestra del Launcher mostra allora `(Proxy) bind failed with error: 98` oppure `Connection still alive terminating`. Chiudi il gioco e il Launcher, poi avviali di nuovo. Nessuna release del Launcher fino alla v2.8.1 risolve il problema.
:::

### Installa gli strumenti di compilazione

Installa i principali strumenti di sviluppo. Sulla maggior parte dei sistemi sono raccolti in un pacchetto:

| Sistema | Comando |
|---|---|
| Debian, Ubuntu | `sudo apt install build-essential` |
| Fedora | `sudo dnf install cmake gcc gcc-c++ make perl perl-IPC-Cmd perl-FindBin perl-File-Compare perl-File-Copy kernel-headers kernel-devel` |
| Arch | `sudo pacman -S base-devel` |
| openSUSE | `zypper in -t pattern devel-basis` |
| SteamOS (Arch) | `sudo pacman -S base-devel linux-api-headers glibc libconfig` |

Ti servono anche `cmake`, `git`, `curl`, `zip`, `unzip`, `tar` e `pkg-config`. Lo script di bootstrap di `vcpkg` ha bisogno di `curl`, `zip`, `unzip` e `tar`, mentre `vcpkg` ha bisogno di `pkg-config` per compilare le librerie. Installa quelli che il tuo sistema non ha.

Su SteamOS, esegui `sudo steamos-readonly disable` prima di installare i pacchetti e riattivalo al termine.

### Ottieni vcpkg

Clona `vcpkg`, esegui il bootstrap e aggiungilo al tuo `PATH`:

1. Clonalo:

   ```bash
   git clone https://github.com/microsoft/vcpkg.git
   ```

2. Esegui il bootstrap:

   ```bash
   ./vcpkg/bootstrap-vcpkg.sh
   ```

3. Aggiungilo al tuo `PATH`:

   ```bash
   export VCPKG_ROOT="$(pwd)/vcpkg"
   export PATH=$VCPKG_ROOT:$PATH
   ```

### Compila il Launcher {#build-the-launcher}

1. Clona il repository [BeamMP-Launcher](https://github.com/BeamMP/BeamMP-Launcher), poi entra nella cartella:

   ```bash
   git clone https://github.com/BeamMP/BeamMP-Launcher.git
   cd BeamMP-Launcher
   ```

   Se non hai mai clonato un repository, consulta la guida di GitHub su come [clonare un repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository).

2. Passa al tag dell'[ultima release](https://github.com/BeamMP/BeamMP-Launcher/releases/latest). Se l'ultima release è `v2.8.1`, esegui:

   ```bash
   git checkout v2.8.1
   ```

3. Nella cartella principale del progetto, configura la compilazione. `vcpkg` scarica e compila le librerie elencate in `vcpkg.json` (`cpp-httplib`, `nlohmann-json`, `zlib`, `openssl` e `curl`), quindi la prima volta questo passaggio richiede un po' di tempo:

   ```bash
   cmake . -B bin -DCMAKE_TOOLCHAIN_FILE=$VCPKG_ROOT/scripts/buildsystems/vcpkg.cmake -DVCPKG_TARGET_TRIPLET=x64-linux
   ```

4. Compila:

   ```bash
   cmake --build bin --parallel
   ```

   Se durante la compilazione la RAM si esaurisce, ometti `--parallel`. In questo modo la compilazione usa un solo thread della CPU e meno RAM.

5. Sposta l'applicazione compilata fuori da `bin`, in una cartella a parte, e avviala da lì:

   ```bash
   mkdir -p ~/beammp-launcher
   cp bin/BeamMP-Launcher ~/beammp-launcher/
   cd ~/beammp-launcher
   ./BeamMP-Launcher
   ```

Il Launcher crea `Launcher.cfg`, la cache delle mod `Resources` e il file `Launcher.log` nella cartella da cui lo avvii. Il Launcher nativo per Linux avvia la versione nativa di BeamNG.drive per Linux dalla cartella del gioco di Steam.

::: details Fedora: vcpkg fallisce durante la compilazione di OpenSSL
Se vcpkg fallisce con errori sugli header del kernel durante OpenSSL, assicurati che le dipendenze siano installate:

```bash
sudo dnf install kernel-headers kernel-devel gcc gcc-c++ make perl
```

Poi svuota la cache di vcpkg ed esegui di nuovo il comando di configurazione:

```bash
rm -rf $VCPKG_ROOT/buildtrees/openssl
```
:::

### Usa BeamNG.drive tramite Proton

Puoi usare il Launcher nativo per Linux con BeamNG.drive eseguito tramite Proton.

1. Avvia il Launcher con `--no-launch`, così non avvia la versione nativa di BeamNG.drive per Linux. Altri argomenti del Launcher sono nella pagina [Configurazione dell’ambiente di sviluppo](/it/developers/dev-environment-setup#turn-on-dev-mode-in-the-launcher).
2. Fai in modo che il gioco Proton usi la cartella utente del gioco Linux, perché il Launcher nativo scrive solo in quella. Un collegamento simbolico (symlink) risolve il problema:
   1. Trova la cartella utente di BeamNG.drive per Linux, di solito `~/.local/share/BeamNG/BeamNG.drive`, e rinominala, ad esempio in `BeamNG.drive_old`.
   2. Trova la cartella utente di BeamNG.drive per Proton, di solito `~/.local/share/Steam/steamapps/compatdata/284160/pfx/drive_c/users/steamuser/AppData/Local/BeamNG/BeamNG.drive`.
   3. Collega le due cartelle:

      ```bash
      ln -s ~/.local/share/Steam/steamapps/compatdata/284160/pfx/drive_c/users/steamuser/AppData/Local/BeamNG/BeamNG.drive ~/.local/share/BeamNG
      ```

3. In Steam, apri le **Proprietà** del gioco e sostituisci le opzioni di avvio con:

   ```bash
   ~/BeamMP/BeamMP-Launcher --no-launch & %command% ; killall BeamMP-Launcher
   ```

   Steam avvierà quindi il Launcher insieme al gioco.

Sostituisci `~/BeamMP/` con la cartella in cui hai messo il Launcher che hai compilato. Il Launcher cerca comunque il gioco in una libreria di Steam, come descritto in [Prima di iniziare](#before-you-start).

::: tip Emoji nei nomi e nella chat
Per mostrare le emoji nei nomi dei server nell'elenco dei server e nella chat di gioco serve un font che le includa. Una possibilità è il [port per Linux del font emoji Segoe UI di Windows](https://github.com/mrbvrz/segoe-ui-linux).
:::

### Aggiorna il Launcher su Linux {#update-the-launcher-on-linux}

Il Launcher per Linux non si aggiorna da solo. Quando esiste una versione più recente, mostra `Auto update is NOT implemented for the Linux version. Please update manually ASAP as updates contain security patches.` Ricompilalo dal tag della release più recente:

1. Entra nella cartella del Launcher e scarica i nuovi tag:

   ```bash
   export VCPKG_ROOT="$(pwd)/vcpkg"
   cd BeamMP-Launcher
   git fetch --tags
   ```

2. Passa al tag dell'[ultima release](https://github.com/BeamMP/BeamMP-Launcher/releases/latest), come in [Compila il Launcher](#build-the-launcher).
3. Compilalo di nuovo e copialo nella cartella del tuo Launcher:

   ```bash
   cmake . -B bin -DCMAKE_TOOLCHAIN_FILE=$VCPKG_ROOT/scripts/buildsystems/vcpkg.cmake -DVCPKG_TARGET_TRIPLET=x64-linux
   cmake --build bin --parallel
   cp bin/BeamMP-Launcher ~/beammp-launcher/
   cd ~/beammp-launcher
   ./BeamMP-Launcher
   ```

Passo successivo: [unisciti al tuo primo server](/it/get-started/join-first-server).
