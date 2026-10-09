---
description: "Inizia a sviluppare per BeamMP: come si combinano la mod, il Launcher e il server, come configurare un ambiente di sviluppo e dove trovare i riferimenti per lo scripting."
---
# Sviluppatori

BeamMP è diviso in tre parti e puoi scrivere codice per ciascuna. Questa sezione spiega come si combinano e da dove iniziare.

## Le tre parti

- **La mod** viene caricata da BeamNG.drive come qualsiasi altra mod di veicoli o di interfaccia. Stabilisce una connessione locale con il Launcher e mostra l'interfaccia multigiocatore. È scritta soprattutto in Lua, con un po' di JavaScript, HTML e CSS per l'interfaccia. Il suo repository è [BeamMP/BeamMP](https://github.com/BeamMP/BeamMP).
- **Il Launcher** mantiene una connessione costante con la mod, si connette al server che scegli e gestisce l'accesso con il backend di BeamMP. È scritto in C++, viene precompilato da BeamMP e si trova su [BeamMP/BeamMP-Launcher](https://github.com/BeamMP/BeamMP-Launcher).
- **Il server** collega uno o più Launcher e invia degli heartbeat al backend di BeamMP con il suo indirizzo IP, la porta, la versione, il numero di giocatori e altro. Esegue anche plugin Lua lato server. È scritto in C++, viene precompilato da BeamMP per diversi sistemi operativi e architetture CPU e si trova su [BeamMP/BeamMP-Server](https://github.com/BeamMP/BeamMP-Server).

## Da dove iniziare

- **Lavorare su BeamMP stesso:** [Configurazione dell’ambiente di sviluppo](/it/developers/dev-environment-setup).
- **Scrivere un plugin per il server o una mod:** [Creazione di Mod e Risorse](/it/developers/mod-and-resource-creation).
- **Cercare una funzione o un evento:** i [riferimenti allo scripting](/it/developers/beammp-scripting/): [Mod (In gioco)](/it/developers/beammp-scripting/mod-in-game) e [Server](/it/developers/beammp-scripting/server/latest).
- **Lavorare con BeamNG.drive stesso:** [Documentazione di gioco](/it/game-documentation/).

Se hai difficoltà, chiedi nel canale `#scripting` del [server Discord](https://discord.gg/beammp).
