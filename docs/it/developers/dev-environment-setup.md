---
description: "Configura un ambiente di sviluppo per la mod di BeamMP: una cartella mods non compressa, la modalità sviluppatore del Launcher, un repository clonato, un server locale e come contribuire."
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

1. Apri la cartella utente di BeamNG in `%appdata%/Local/BeamNG.drive/0.xx/mods`, dove `xx` è l'ultima versione di BeamNG.
2. Crea una cartella chiamata `unpacked` all'interno di `mods`.

Altre informazioni sulla cartella utente si trovano nella [documentazione di BeamNG](https://documentation.beamng.com/support/userfolder/).

## Attiva la modalità sviluppatore nel Launcher

L'aggiornamento automatico cancellerebbe il tuo clone git locale, quindi disattivalo con `--no-download`. Se non vuoi nemmeno che il Launcher avvii BeamNG e vuoi vedere le stampe di debug, usa `--dev`.

| Argomento | Cosa fa |
|---|---|
| `--help` o `-h` | Stampa questo elenco di argomenti |
| `--port <port>` o `-p` | Cambia la porta di ascolto predefinita in `<port>`. Deve essere impostata anche nel gioco |
| `--verbose` o `-v` | Modalità dettagliata: stampa i messaggi di debug |
| `--no-download` | Salta il download e l'installazione della mod Lua di BeamMP |
| `--no-update` | Salta l'applicazione degli aggiornamenti del Launcher, quindi devi aggiornarlo a mano |
| `--no-launch` | Salta l'avvio del gioco, quindi devi avviarlo tu |
| `--dev` | Modalità sviluppatore: equivale a `--verbose --no-download --no-launch --no-update` |
| `--user-path <path>` | Percorso della cartella utente di BeamNG.drive |
| `--game <args...>` o `-- <args...>` | Passa degli argomenti al gioco |

## Clona il repository di BeamMP nella cartella unpacked

Puoi copiare a mano i file della mod dal nostro repository GitHub, ma un sistema di controllo del codice sorgente come git è molto meglio.

1. Crea una fork di [BeamMP/BeamMP](https://github.com/BeamMP/BeamMP).
2. Clonala direttamente nella cartella `unpacked`. In PowerShell o CMD aperto in quella cartella, esegui:
   ```bash
   git clone https://github.com/yourName/BeamMP
   ```
3. Nella cartella utente, assicurati che in `mods` non sia rimasta alcuna cartella `multiplayer` e che ora ci sia `unpacked/beammp`.
4. Prova la modalità sviluppatore. Avvia il Launcher, poi avvia BeamNG manualmente. Nel gioco, assicurati che BeamMP sia l'unica mod attiva. Puoi usare BeamMP come al solito.

Con un editor di codice ora puoi modificare il codice direttamente nella cartella `unpacked`. Ricarica Lua nel gioco con `Ctrl` + `L` e premi anche `F5` se hai modificato l'interfaccia.

## Configura un server locale

Un server locale è utile quando lavori su BeamMP. Segui [Ospitare un server](/it/server-owners/host-a-server), saltando i primi due passaggi (il reindirizzamento delle porte e l'AuthKey) se ti connetti solo in locale.

In `ServerConfig.toml`, imposta il server come privato e usa una stringa qualsiasi come `AuthKey`.

## Contribuisci con le tue modifiche

Quando sei soddisfatto delle tue modifiche, fai commit con git. Il [sito Git-SCM](https://git-scm.com/doc) offre tutorial e documentazione. Dopo aver fatto commit e push delle modifiche sulla tua fork, puoi creare una pull request.

Per il formato del codice, il formato dei messaggi di commit e le pratiche di sviluppo in generale, consulta il file `CONTRIBUTING.md` in ogni repository. Il `README.md` di ogni repository di solito contiene i passaggi per compilare i progetti compilati.

Se incontri dei problemi, chiedi nel canale `#scripting` del nostro [server Discord](https://discord.gg/beammp).
