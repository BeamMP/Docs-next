---
description: "Crea esclusioni in Windows Defender Firewall e nell'antivirus perché il Launcher e il server di BeamMP non vengano bloccati: prima le regole del firewall, poi un'esclusione antivirus."
---
# Esclusioni Defender / Firewall

Questa guida mostra come creare esclusioni in Windows Defender Firewall e nell'antivirus per il Launcher e il server di BeamMP.

Prima di modificare il firewall, se ti trovi in una rete privata, assicurati che la tua rete sia impostata come **privata** nelle impostazioni di rete di Windows.

::: danger Le esclusioni comportano dei rischi
Creando delle esclusioni, sei consapevole dei rischi legati al consentire l'accesso ai programmi sul tuo computer e all'aprire le porte della tua rete domestica al pubblico. Di conseguenza rinunci al diritto di ritenere BeamMP responsabile di qualsiasi danno che potrebbe derivare a te o al tuo nucleo familiare.

Non ci assumiamo alcuna responsabilità per i contenuti di servizi o siti web esterni collegati.
:::

## Consenti al Launcher di passare attraverso il firewall

1. Apri **Windows Defender Firewall con sicurezza avanzata**.
2. Fai clic su **Regole connessioni in entrata**.
3. Fai clic su **Nuova regola** in alto a destra.
4. Seleziona **Programma** e fai clic su **Avanti**.
5. Seleziona **Questo percorso programma** e inserisci il percorso completo di `BeamMP-Launcher.exe`. Quello predefinito è `%appdata%\BeamMP-Launcher\BeamMP-Launcher.exe`, senza virgolette.
6. Seleziona **Consenti la connessione**.
7. Lascia selezionati i tipi di rete già spuntati e fai clic su **Avanti**.
8. Assegna un nome alla regola, ad esempio "BeamMP-Launcher", e fai clic su **Fine**.

## Consenti al server di passare attraverso il firewall

Il server ha bisogno di una regola per il programma e di una regola per la sua porta. I giocatori si connettono allo stesso numero di porta sia con TCP sia con UDP, quindi la porta ha bisogno di una regola per ciascuno.

1. Crea una regola per il programma come nei passaggi precedenti, ma usa il percorso completo di `BeamMP-Server.exe`, cioè il punto in cui hai posizionato il file dopo averlo scaricato. Chiamala "BeamMP-Server".
2. Fai di nuovo clic su **Nuova regola**.
3. Seleziona **Porta** e fai clic su **Avanti**.
4. Seleziona **TCP** e **Porte locali specifiche** e inserisci la stessa porta di `Port` nel tuo `ServerConfig.toml`. Quella predefinita è `30814`.
5. Seleziona **Consenti la connessione**, lascia selezionati i tipi di rete già spuntati e assegna un nome alla regola, ad esempio "BeamMP-Server TCP".
6. Ripeti i passaggi da 2 a 5 con **UDP** e chiama la regola "BeamMP-Server UDP".

Una regola del firewall si applica non appena la salvi. Riavvia poi il Launcher o il server.

## Aggiungi un'esclusione nell'antivirus

Vale sia per il Launcher sia per il server.

1. Apri l'app **Sicurezza di Windows**.
2. Fai clic su **Protezione da virus e minacce**.
3. Sotto **Impostazioni di Protezione da virus e minacce**, fai clic su **Gestisci impostazioni**.
4. Scorri fino a **Esclusioni** e fai clic su **Aggiungi o rimuovi esclusioni**.
5. Fai clic su **Aggiungi un'esclusione**, seleziona **File** e seleziona `BeamMP-Launcher.exe` o `BeamMP-Server.exe`. Così il programma stesso non viene analizzato né rimosso.
6. Fai di nuovo clic su **Aggiungi un'esclusione**, seleziona **Processo** e inserisci il percorso completo dello stesso programma. Così i file che il programma apre non vengono analizzati.

Un'esclusione vale per la protezione in tempo reale. Un'analisi pianificata o manuale può comunque analizzare un file escluso.

## Hai ancora problemi?

Apri una discussione sul [forum](https://forum.beammp.com), oppure chiedi nel canale `#support` del [server Discord](https://discord.gg/beammp).
