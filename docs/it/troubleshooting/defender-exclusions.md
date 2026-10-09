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
4. Seleziona **Programma** per creare una regola per un programma.
5. Inserisci il percorso completo di `BeamMP-Launcher.exe`. Quello predefinito è `%appdata%\BeamMP-Launcher\BeamMP-Launcher.exe`, senza virgolette.
6. Scegli di consentire la connessione.
7. Assegna un nome alla regola, ad esempio "BeamMP-Launcher", e salvala.
8. Riavvia il computer.

## Consenti al server di passare attraverso il firewall

1. Apri **Windows Defender Firewall con sicurezza avanzata**.
2. Fai clic su **Regole connessioni in entrata**.
3. Fai clic su **Nuova regola** in alto a destra.
4. Seleziona **Porta** per creare una regola per una porta.
5. Inserisci la stessa porta indicata nel tuo `ServerConfig.toml`.
6. Inserisci il percorso completo di `BeamMP-Server.exe`. Il file si trova dove l'hai posizionato dopo averlo scaricato.
7. Scegli di consentire la connessione.
8. Assegna un nome alla regola, ad esempio "BeamMP-Server", e salvala.
9. Riavvia il computer.

## Aggiungi un'esclusione nell'antivirus

Vale sia per il Launcher sia per il server.

1. Apri l'app **Sicurezza di Windows**.
2. Fai clic su **Protezione da virus e minacce**.
3. Sotto **Impostazioni di Protezione da virus e minacce**, fai clic su **Gestisci impostazioni**.
4. Scorri fino a **Esclusioni**.
5. Fai clic su **Aggiungi o rimuovi esclusioni**, poi su **Aggiungi un'esclusione** e seleziona **Processo**.
6. Inserisci `BeamMP-Launcher.exe` o `BeamMP-Server.exe` e salva.
7. Riavvia il computer.

## Hai ancora problemi?

Apri una discussione sul [forum](https://forum.beammp.com), oppure chiedi nel canale `#support` del [server Discord](https://discord.gg/beammp).
