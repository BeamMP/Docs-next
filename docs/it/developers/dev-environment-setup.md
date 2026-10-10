---
description: "Configura un ambiente di sviluppo per la mod di BeamMP: cartella mods non compressa, modalità sviluppatore e impostazioni del Launcher, compilazione, repository clonato, server locale e contributi."
---
# Configurazione dell’ambiente di sviluppo

Questa pagina mostra come configurare il tuo computer per lavorare sulla mod di BeamMP e come eseguire un server locale. Per capire come si combinano la mod, il Launcher e il server, consulta [Sviluppatori](/it/developers/).

## Cosa ti serve

- BeamNG.drive, installato in locale.
- BeamMP, installato in locale: almeno il Launcher, e anche il server se vuoi fare dei test con uno.
- Git, installato in locale, e un account GitHub.
- Un editor di codice, ad esempio VSCode o Notepad++.

## Usa una cartella unpacked per BeamNG

Per lavorare in modo efficiente sulle mod, usa una cartella `unpacked` invece di creare uno zip dopo ogni modifica.

1. Apri la cartella `mods` nella cartella utente di BeamNG. Su Windows è `%LocalAppData%\BeamNG\BeamNG.drive\current\mods`. Il Launcher mostra la cartella che usa nella riga `Game user path:` quando si avvia.
2. Crea una cartella chiamata `unpacked` all'interno di `mods`.

Altre informazioni sulla cartella utente si trovano nella [documentazione di BeamNG](https://documentation.beamng.com/support/userfolder/).

## Attiva la modalità sviluppatore nel Launcher {#turn-on-dev-mode-in-the-launcher}

Avvia il Launcher con `--dev`. La modalità sviluppatore stampa i messaggi di debug, non scarica la mod di BeamMP, non avvia BeamNG.drive e non aggiorna il Launcher. Se ti serve solo una parte di tutto questo, usa le singole opzioni qui sotto.

Senza `--no-download`, il Launcher scarica la mod di BeamMP rilasciata in `mods/multiplayer`. Inoltre elimina `mods/unpacked/beammp`, a meno che quella cartella non contenga una cartella `.git`. Usa `--no-download` in modo che la mod rilasciata non venga eseguita insieme alla tua.

| Argomento | Cosa fa |
|---|---|
| `--help`, `-h` o `/?` | Stampa questo elenco di argomenti e si chiude |
| `--port <port>` o `-p <port>` | Cambia la porta di ascolto, `4444` per impostazione predefinita, in `<port>`. Il Launcher usa anche `<port>` + 1. Deve essere impostata anche nel gioco. Sostituisce `Port` in `Launcher.cfg` |
| `--verbose` o `-v` | Modalità dettagliata: stampa i messaggi di debug nella finestra. Vengono sempre scritti in `Launcher.log` |
| `--no-download` | Salta il download e l'installazione della mod di BeamMP |
| `--no-update` | Salta l'applicazione degli aggiornamenti del Launcher, quindi devi aggiornarlo a mano |
| `--no-launch` | Salta l'avvio del gioco, quindi devi avviarlo tu |
| `--dev` | Modalità sviluppatore: equivale a `--verbose --no-download --no-launch --no-update` |
| `--user-path <path>` | Solo Windows. Percorso della cartella utente di BeamNG.drive, cioè la cartella che contiene `current` |
| `--game <args...>` o `-- <args...>` | Passa al gioco tutti gli argomenti che seguono |

### File delle impostazioni del Launcher

Il Launcher legge `Launcher.cfg` dalla cartella da cui viene eseguito. Se il file manca, il Launcher lo crea con le prime tre impostazioni. Le opzioni da riga di comando sostituiscono le impostazioni corrispondenti.

| Impostazione | Predefinito | Cosa fa |
|---|---|---|
| `"Port"` | `4444` | La porta a cui si connette il gioco. Consulta [Cambiare la porta del Launcher](/it/troubleshooting/launcher-port) |
| `"Build"` | `"Default"` | La build che il Launcher richiede al backend di BeamMP quando cerca aggiornamenti del Launcher e della mod. Lasciala su `Default` |
| `"CachingDirectory"` | `"./Resources"` | La cartella in cui il Launcher conserva le mod del server scaricate |
| `"Dev"` | non impostato | `true` equivale a `--dev` |
| `"DeleteDuplicateMods"` | `false` | `true` fa sì che il Launcher elimini le versioni precedenti di una mod presenti nella cache quando un server ne invia una più recente |

### Cache delle mod

Quando entri in un server, il Launcher scarica ogni mod indicata dal server nella cartella `CachingDirectory`. Una mod viene salvata come `<name>-<first 8 characters of its SHA-256 hash>.zip`. Il Launcher riutilizza un file della cache quando il suo hash corrisponde e registra l'ultimo utilizzo di ogni file in `mods.json`, nella stessa cartella. Poi copia la mod in `mods/multiplayer` nella cartella utente del gioco, con il nome del file in minuscolo su Linux.

A ogni avvio, il Launcher elimina tutto ciò che si trova in `mods/multiplayer`, tranne `beammp.zip`. Non conservare lì i tuoi file.

## Compila il Launcher

Devi compilare il Launcher solo se lavori sul Launcher stesso. Il `README.md` del Launcher non contiene i passaggi per la compilazione.

Su Windows ti servono Visual Studio con il carico di lavoro desktop C++ (MSVC), CMake e [vcpkg](https://github.com/microsoft/vcpkg). Le librerie in `vcpkg.json` sono `cpp-httplib`, `nlohmann-json`, `zlib`, `openssl` e `curl`. Il Launcher usa il runtime C++ statico, quindi usa il triplet `x64-windows-static`. Nella cartella principale del progetto, esegui i comandi seguenti. Cambia `C:/vcpkg` con la cartella in cui hai installato `vcpkg`:

```bash
cmake . -B bin -DCMAKE_BUILD_TYPE=Release -DCMAKE_TOOLCHAIN_FILE=C:/vcpkg/scripts/buildsystems/vcpkg.cmake -DVCPKG_TARGET_TRIPLET=x64-windows-static
cmake --build bin --parallel --config Release
```

Il programma è `bin/Release/BeamMP-Launcher.exe`. Su Windows, il Launcher sostituisce sé stesso con la release ufficiale firmata quando ne esiste una più recente, quindi avvia la tua build con `--no-update`.

Per Linux, segui [Compila il Launcher](/it/get-started/install-beammp#build-the-launcher). Il Launcher non si compila su macOS.

## Clona il repository di BeamMP nella cartella unpacked

Puoi copiare a mano i file della mod dal nostro repository GitHub, ma un sistema di controllo del codice sorgente come git è molto meglio.

1. Crea una fork di [BeamMP/BeamMP](https://github.com/BeamMP/BeamMP).
2. Clonala direttamente nella cartella `unpacked`. In PowerShell o CMD aperto in quella cartella, esegui:

   ```bash
   git clone https://github.com/yourName/BeamMP
   ```

3. Nella cartella utente, elimina `mods/multiplayer/beammp.zip` se esiste. Un normale avvio del Launcher lo scarica, e `--no-download` non lo rimuove. Assicurati che `mods/unpacked/beammp` esista.
4. Prova la modalità sviluppatore. Avvia il Launcher con `--dev`, poi avvia BeamNG manualmente. Nel gioco, assicurati che BeamMP sia l'unica mod attiva. Puoi usare BeamMP come al solito.

Con un editor di codice ora puoi modificare il codice direttamente nella cartella `unpacked`. Ricarica Lua nel gioco con `Ctrl` + `L` e premi anche `F5` se hai modificato l'interfaccia.

## Configura un server locale

Un server locale è utile quando lavori su BeamMP. Segui [Ospitare un server](/it/server-owners/host-a-server), saltando i primi due passaggi (il reindirizzamento delle porte e l'AuthKey) se ti connetti solo in locale.

In `ServerConfig.toml`, imposta il server come privato e usa una stringa qualsiasi come `AuthKey`.

## Contribuisci con le tue modifiche

Quando sei soddisfatto delle tue modifiche, fai commit con git. Il [sito Git-SCM](https://git-scm.com/doc) offre tutorial e documentazione. Dopo aver fatto commit e push delle modifiche sulla tua fork, puoi creare una pull request.

Il repository della mod di BeamMP contiene un file `CONTRIBUTING.md` con il formato del codice, il formato dei messaggi di commit e le pratiche di sviluppo in generale. Il repository del Launcher ha un file `.clang-format` per lo stile del codice, e il suo modello di pull request ti chiede di confermare di aver scritto e di aver compreso tu stesso tutto il codice. Il `README.md` di un repository può contenere i passaggi per compilare i progetti compilati.

Se incontri dei problemi, chiedi nel canale `#scripting` del nostro [server Discord](https://discord.gg/beammp).
