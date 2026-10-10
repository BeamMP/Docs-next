---
description: "Aggiorna a mano il Launcher di BeamMP quando non riesce ad aggiornarsi da solo o mostra una schermata vuota: scarica l'ultimo Launcher su Windows o ricompilalo su Linux."
---
# Problemi di aggiornamento del Launcher

Il Launcher non riesce ad aggiornarsi o mostra una schermata vuota? Questa guida spiega come aggiornarlo a mano.

Su Windows, prima di seguirla dovresti aver già installato BeamMP con l'installer disponibile sul [nostro sito web](https://beammp.com).

## Come si aggiorna il Launcher

Su Windows, il Launcher controlla `backend.beammp.com` per una versione più recente a ogni avvio. Se ce n'è una, la scarica, ne verifica la firma e conserva il vecchio file come `BeamMP-Launcher.back` nella stessa cartella. Poi si riavvia. Il Launcher salta il controllo quando lo avvii con `--no-update` o `--dev`.

Se l'aggiornamento non riesce, il Launcher mostra uno di questi messaggi:

- `Failed to download the launcher update! Please try manually updating it`
- `The authenticity of the updated launcher could not be verified, it was corrupted or tampered with.`

Controlla la tua connessione a Internet e il tuo firewall o antivirus, come in [Esclusioni Defender / Firewall](/it/troubleshooting/defender-exclusions). Poi aggiorna il Launcher a mano.

Su Linux, il Launcher non si aggiorna mai da solo. Segui [Aggiorna il Launcher su Linux](/it/get-started/install-beammp#update-the-launcher-on-linux) invece dei passaggi qui sotto.

## Installa un nuovo Launcher

1. Scarica l'ultimo Launcher direttamente da [GitHub](https://github.com/BeamMP/BeamMP-Launcher/releases/latest/download/BeamMP-Launcher.exe).
2. Chiudi il Launcher.
3. Vai alla cartella che contiene `BeamMP-Launcher.exe`. Per impostazione predefinita è `C:\Users\<username>\AppData\Roaming\BeamMP-Launcher`. Sostituisci `<username>` con il nome utente del tuo account Windows. Se hai installato BeamMP altrove, ad esempio in `D:\BeamMP-Launcher`, usa quella cartella.
4. Sostituisci il Launcher esistente nella cartella BeamMP-Launcher con quello nuovo.
5. Avvia il Launcher come al solito e verifica che funzioni.

## Hai ancora problemi?

Crea un ticket di supporto sul nostro [server Discord](https://discord.gg/BeamMP).
