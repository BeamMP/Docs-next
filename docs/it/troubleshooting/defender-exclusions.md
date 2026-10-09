# Come creare esclusioni in Windows Defender Firewall e nell'antivirus?

:::: info
Prima di modificare il firewall, assicurati che la tua rete sia impostata come privata nelle impostazioni di rete di Windows (supponendo che tu ti trovi in una rete privata).

::: danger LIMITAZIONE DI RESPONSABILITÀ:
**Le esclusioni del firewall / di Defender comportano dei rischi**.

Creando delle esclusioni, sei consapevole dei rischi legati al consentire l'accesso ai programmi sul tuo PC e all'aprire le porte della tua rete domestica al pubblico, e di conseguenza rinunci al diritto di ritenere BeamMP responsabile di **qualsiasi** danno che potrebbe derivare a te o al tuo nucleo familiare.

Non ci assumiamo alcuna responsabilità per i contenuti di servizi o siti web esterni collegati.
:::
::::

## 1. Esclusione nel Defender Firewall per BeamMP-Launcher.

1. Apri `Windows Defender Firewall con sicurezza avanzata`.
2. Nella finestra, fai clic su `Regole connessioni in entrata` per aprire la scheda delle esclusioni in entrata.
3. Fai clic su `Nuova regola` in alto a destra per creare una nuova esclusione.
4. Seleziona `Programma` per creare un'esclusione specifica per un programma.
5. Inserisci il percorso completo di `BeamMP-Launcher.exe`. Quello predefinito è `%appdata%\BeamMP-Launcher\BeamMP-Launcher.exe` (senza virgolette).
6. Assicurati di consentire la connessione
7. Assegna un nome all'esclusione (ad esempio "BeamMP-Launcher") e salvala.
9. Riavvia il PC.

## 1.1 Esclusione nel Defender Firewall per BeamMP-Server.

1. Apri `Windows Defender Firewall con sicurezza avanzata`.
2. Nella finestra, fai clic su `Regole connessioni in entrata` per aprire la scheda delle esclusioni in entrata.
3. Fai clic su `Nuova regola` in alto a destra per creare una nuova esclusione.
4. Seleziona `Porta` per creare un'esclusione specifica per una porta.
5. Inserisci la stessa porta indicata in ServerConfig.toml.
6. Inserisci il percorso completo di `BeamMP-Server.exe`. Il file si trova dove l'hai posizionato dopo averlo scaricato.
7. Assicurati di consentire la connessione
8. Assegna un nome all'esclusione (ad esempio "BeamMP-Server") e salvala.
9. Riavvia il PC.

## 2. Esclusione nell'antivirus Defender per BeamMP-Launcher/Server.

1. Apri l'app `Sicurezza di Windows`.
2. Fai clic sulla prima voce, `Protezione da virus e minacce`.
3. Fai clic su `Gestisci impostazioni` sotto "Impostazioni di Protezione da virus e minacce".
4. Scorri fino alla sezione `Esclusioni`.
5. Lì, fai clic su "Aggiungi un'esclusione" e seleziona `Processo`.
6. Inserisci `BeamMP-Launcher.exe` o `BeamMP-Server.exe` nel campo e salva.
7. Riavvia il PC.

## Hai ancora problemi?

Apri una discussione sul [Forum](https://forum.beammp.com) o sul nostro [server Discord](https://discord.gg/beammp) nel canale `#support`.
