---
description: "Gestisci un server BeamMP già in funzione: leggi il file di log, aggiorna il server su Windows o Linux e controlla le nuove release."
---
# Manutenzione del server

Come gestire un server BeamMP già in funzione: il file di log e gli aggiornamenti. Per le impostazioni di `ServerConfig.toml`, vedi [Configurazione del server](/it/server-owners/configuration).

## Il file di log del server

Questo file viene generato mentre il server è in esecuzione. È uno specchio dei messaggi che vedi nella console quando avvii il server. Dovresti allegarlo ogni volta che chiedi aiuto al nostro staff di supporto e non mostra mai la tua AuthKey, quindi di solito puoi inviarlo senza modifiche.

Il formato è il seguente (il prefisso $ indica una “variabile”, spiegata più sotto):
```
[$DATE $TIME] $CONTEXT [$LOG_LEVEL] $MESSAGE
```
Dove:

- `$DATE` è la data del messaggio, per esempio 21/07/2021
- `$TIME` è l'ora del messaggio, per esempio 11:05:23
- `$CONTEXT` (visibile solo in modalità Debug e per lo più utile agli sviluppatori) è il contesto del messaggio, che può essere:
	- `(Player ID) “Player Name”`, dove l'ID del giocatore è utile per la moderazione
	- Un nome breve come “HeartbeatThread”
- `$LOG_LEVEL` è uno dei livelli di importanza di un messaggio:
	- `DEBUG`: visibile solo in modalità Debug, di solito molto prolisso e importante solo per gli sviluppatori
	- `INFO`: informazioni generali
	- `LUA`: messaggio di un plugin Lua
	- `WARN`: descrive qualcosa che di solito non dovrebbe succedere
	- `ERROR`: qualcosa è andato molto storto o era del tutto inatteso
	- `FATAL`: è successo qualcosa che causa lo spegnimento del server
- `$MESSAGE` è il messaggio vero e proprio, di solito qualcosa a cui dovresti prestare attenzione e che dovresti capire. In alcuni casi può essere criptico, ma la regola generale è che, finché nel server non c'è nulla di visibilmente sbagliato e non ci sono ERROR, va tutto bene.

## Aggiornare il server {#updating-the-server}

### Perché aggiornare

Ogni volta che esce un aggiornamento, ti consigliamo di aggiornare il tuo server. Di solito comprende correzioni di bug, miglioramenti di stabilità e di sicurezza, oltre alle nuove funzionalità introdotte.

Per ricevere notizie sugli aggiornamenti non appena escono, segui il canale “update” del server Discord, tieni d'occhio il forum oppure consulta (o chiedi sulla) [pagina delle release su GitHub](https://github.com/BeamMP/BeamMP-Server/releases).

### Come aggiornare

#### Se usi un provider di hosting partner di BeamMP

Se usi un provider di hosting partner di BeamMP, le istruzioni qui sotto probabilmente non funzioneranno. Ti consigliamo di attendere maggiori dettagli dal tuo provider di hosting o di contattarlo per assistenza.

#### Se gestisci il server da solo

Il server si aggiorna sostituendo il vecchio eseguibile con quello nuovo. Se non sai come fare, qui sotto trovi istruzioni passo passo per Windows e Linux.

Se hai compilato dal codice sorgente, ti basta ricompilare. Prima di ricompilare, esegui `git submodule update --init --recursive`.

#### Su Windows

1. Assicurati di aver installato i [Visual C++ Redistributables](https://aka.ms/vs/17/release/vc_redist.x64.exe), necessari per eseguire il server.
2. Vai su [BeamMP.com](https://beammp.com/) e clicca sul pulsante “Download Server”.
3. Una volta scaricato, dovresti vedere un file chiamato `BeamMP-Server.exe`. Lo chiameremo il “nuovo eseguibile”.
4. Vai nella cartella in cui si trova il tuo attuale eseguibile `BeamMP-Server.exe` (di solito la stessa cartella in cui si trova `ServerConfig.toml`). Lo chiameremo il “vecchio eseguibile”.
5. Sostituisci il vecchio eseguibile con quello nuovo (per esempio copiando o spostando il nuovo eseguibile nella cartella).

#### Su Linux

1. Vai su [BeamMP.com](https://beammp.com/) e clicca sul pulsante “Download Server”: verrai reindirizzato alla pagina delle release del server su GitHub.
2. Scarica la versione corretta per la tua distribuzione. Per semplicità, da qui in poi si chiamerà `BeamMP-Server-xxx`, dove `xxx` indica la versione per la distribuzione che stai usando.
3. Una volta scaricato, dovresti vedere un file chiamato `BeamMP-Server-xxx`, a seconda della versione che hai scaricato. Lo chiameremo il “nuovo eseguibile”.
4. Vai nella cartella in cui si trova il tuo attuale eseguibile `BeamMP-Server-xxx` (di solito la stessa cartella in cui si trova `ServerConfig.toml`). Lo chiameremo il “vecchio eseguibile”.
5. Sostituisci il vecchio eseguibile con quello nuovo (per esempio copiando o spostando il nuovo eseguibile nella cartella).
6. Apri un terminale nella cartella in cui hai appena sostituito l'eseguibile ed esegui `sudo chmod +x BeamMP-Server-xxx`. Così ti assicuri che il server possa essere avviato.

### Aggiornamenti automatici

Il server non supporta (ancora) gli aggiornamenti automatici né le notifiche di aggiornamento.

Puoi comunque chiedere all'API di GitHub l'ultima release, confrontando la versione del server con i tag. Puoi ottenerli con una richiesta GET a `https://api.github.com/repos/BeamMP/BeamMP-Server/git/refs/tags`.
