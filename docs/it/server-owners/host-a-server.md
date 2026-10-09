---
description: "Ospita un server BeamMP a casa: reindirizza la porta, consenti il server nel firewall, ottieni una AuthKey, installalo e configuralo, aggiungi mod e fai entrare i giocatori."
---
# Ospitare un server

Questa guida spiega come ospitare un server BeamMP a casa, sul tuo computer Windows o Linux. Se usi una società di hosting o un VPS con un pannello di gestione, segui invece [Configurazione del server su un VPS](/it/server-owners/setup-vps). Un server casalingo è gratuito. Un VPS è più semplice e più sicuro.

## Prima di iniziare

I server sono una parte fondamentale di BeamMP: i giocatori si connettono tra loro attraverso il server. Puoi creare un server privato, al quale possono entrare solo le persone che inviti, oppure un server pubblico, che compare nella lista ufficiale dei server.

Leggi la [LICENSE](https://raw.githubusercontent.com/BeamMP/BeamMP-Server/master/LICENSE) del server prima di usarlo.

Il server supporta solo IPv4. Se non sai quale hai, guarda l'indirizzo IP mostrato su [whatsmyip.org](https://www.whatsmyip.org/). Se contiene dei due punti, è IPv6. In tal caso, scopri se hai anche un indirizzo IPv4, chiedendolo al tuo ISP o a qualcuno che se ne intende di reti. Il supporto per IPv6 è in programma.

Se hai problemi, chiedi sul [forum](https://forum.beammp.com) o nel canale `#support` del [server Discord](https://discord.gg/beammp). [Configurazione del server](/it/server-owners/configuration) approfondisce le impostazioni del server.

## Reindirizzare la porta {#forward-the-port}

I giocatori esterni alla tua casa possono entrare nel tuo server ospitato a casa solo se reindirizzi una porta sul tuo router. Salta questo passaggio se usi un VPS o un rootserver, oppure se tutti quelli che giocano sono dentro casa tua (la tua rete locale).

::: danger Il port forwarding comporta dei rischi
Facendo il port forwarding sei consapevole dei rischi legati all'apertura delle porte della tua rete domestica al pubblico e, di conseguenza, rinunci al diritto di ritenere BeamMP responsabile di qualsiasi danno che potrebbe derivare a te o al tuo nucleo familiare.

Non ci assumiamo alcuna responsabilità per i contenuti di servizi o siti web esterni collegati.
:::

Ospitare con uno dei nostri servizi partner evita questo rischio. Per reindirizzare tu stesso una porta, segui la [guida al port forwarding](/it/server-owners/port-forwarding).

## Servizi di hosting partner {#partnered-hosting-services}

Questi servizi sono a pagamento:

<!--@include: ./_parts/partners.md-->

## Consentire il server nel firewall {#allow-the-server-through-your-firewall}

A seconda della tua configurazione, potresti dover far passare il server BeamMP attraverso il firewall. Succede su Windows, dove disattivare il firewall di solito **non** funziona, e su molti server Linux preinstallati.

Consenti al server BeamMP di passare attraverso il firewall **sia per le connessioni in entrata sia per quelle in uscita** e **sia per TCP sia per UDP**. Se il tuo firewall chiede invece una porta, usa la porta che hai reindirizzato, di solito la 30814.

Per una guida dettagliata, vedi [Esclusioni Defender / Firewall](/it/troubleshooting/defender-exclusions).

<!--@include: ./_parts/authkey.md-->

## Installare il server

Il server BeamMP è disponibile per Windows e Linux.

### Installazione su Windows

Reindirizza prima la tua porta. Senza di essa, nessuno fuori da casa tua potrà entrare.

1. Installa i [Visual C++ Redistributables](https://aka.ms/vs/17/release/vc_redist.x64.exe). Il server ne ha bisogno per funzionare.
2. Scarica il server da [beammp.com](https://www.beammp.com/). Otterrai un eseguibile chiamato più o meno `BeamMP-Server.exe`.
3. Crea una cartella in un punto a tua scelta e mettici dentro `BeamMP-Server.exe`. È qui che vivrà il tuo server.
4. Avvia il server una volta con un doppio clic. Genera i file di cui ha bisogno. Quando vedi del testo, chiudilo. Ora hai un file `ServerConfig.toml` accanto a `BeamMP-Server.exe`.
5. Facoltativo: per un accesso rapido in seguito, crea un collegamento sul desktop con **Clic con il tasto destro** > **Invia a** > **Desktop (crea collegamento)**.

### Installazione su Linux

#### Usa la nostra build (consigliato)

Funziona su tutte le distribuzioni per cui forniamo i binari, elencate nella [pagina dell'ultima release](https://github.com/BeamMP/BeamMP-Server/releases/latest). Per un'altra distribuzione o architettura, vedi [Compilare dal codice sorgente](#build-from-source).

1. Installa le dipendenze elencate nelle [dipendenze di runtime](https://github.com/BeamMP/BeamMP-Server#runtime-dependencies).
2. Vai su [beammp.com](https://beammp.com/) e clicca su **Download Server**. Verrai portato alla pagina delle release del server su GitHub.
3. Scarica la versione per la tua distribuzione. In questa guida la chiamiamo `BeamMP-Server-xxx`, dove `xxx` è la versione per la tua distribuzione.
4. Crea una cartella in un punto a tua scelta e mettici dentro `BeamMP-Server-xxx`. Per ora puoi ignorare gli altri file scaricati. È qui che vivrà il tuo server.
5. Apri un terminale in quella cartella ed esegui `chmod +x BeamMP-Server-xxx`, così hai il permesso di avviarlo.
6. Avvia il server una volta con `./BeamMP-Server-xxx`. Genera i file di cui ha bisogno. Quando vedi del testo, chiudilo. Ora hai un file `ServerConfig.toml` accanto a `BeamMP-Server-xxx`.
7. Facoltativo, ma caldamente consigliato: crea un utente chiamato `beammpserver` (o simile) e avvia il server solo con quell'utente. Non eseguire il server come root, con `sudo` o con il tuo utente personale.

#### Compilare dal codice sorgente {#build-from-source}

Probabilmente funzionano anche altre distribuzioni, ma non sono supportate ufficialmente. Per compilare il server da solo, scarica il codice sorgente da [GitHub](https://github.com/BeamMP/BeamMP-Server) e segui le [istruzioni di compilazione](https://github.com/BeamMP/BeamMP-Server#build-instructions). Alla fine, avvia il server una volta con `./BeamMP-Server`.

## Configurare il server {#configure-the-server}

Quando hai avviato il server una volta, ha creato alcuni file e probabilmente ha stampato un errore o due. È normale, perché non è ancora configurato. La tua cartella ora contiene questi file:

![La cartella del server con ServerConfig.toml, Server.log e BeamMP-Server.exe](../../assets/content/after-running-once.png)

Sono `ServerConfig.toml`, `Server.log` e `BeamMP-Server.exe`. A seconda delle tue impostazioni, potresti non vedere le estensioni `.toml`, `.log` e `.exe`.

Apri `ServerConfig.toml` in un editor di testo come il Blocco note: **Clic con il tasto destro** > **Apri con…**, poi scegli l'editor. Un esempio di configurazione:
```toml
[General]
Port = 30814
AuthKey = "auth-key"
AllowGuests = false
LogChat = false
Debug = false
IP = "::"
Private = true
InformationPacket = true
Name = "Test Server"
Tags = "Freeroam,Modded,Racing,Police"
MaxCars = 2
MaxPlayers = 10
Map = "/levels/ks_nord/info.json"
Description = "Total Random Beam MP Server"
ResourceFolder = "Resources"
```
Questo file usa il formato TOML. [Configurazione del server](/it/server-owners/configuration) descrive ogni impostazione.

1. Imposta `AuthKey` sulla chiave che hai copiato. Incollala tra le virgolette. Per la chiave dell'esempio appare così:
   ```toml
   AuthKey = '3173a2e-6az0-4542-a3p0-ddqq5ff95558'
   ```
2. Imposta `Name`, il nome del tuo server nella lista dei server. Puoi formattarlo con colori e altro: vedi [Personalizza l'aspetto del nome del tuo server](/it/server-owners/configuration#customize-the-look-of-your-server-name).
3. Se hai scelto una porta diversa dalla 30814, impostala in `Port`.
4. Il tuo server non compare nella lista dei server finché `Private = true`. Per farlo comparire, imposta `Private = false`.

### Verifica che si avvii

Avvia di nuovo il server e cerca eventuali messaggi `[ERROR]` o `[WARN]`. Il server ora dovrebbe restare aperto. Poi aggiungi le mod, se le vuoi, e scopri come entrare.

## Aggiungere mod

Le mod di veicoli e quelle di mappe si installano in modo diverso, ma vanno entrambe nella cartella `Resources/Client` del tuo server. Metti il file `.zip` della mod in quella cartella.

::: warning
Le mod possono essere, o diventare, incompatibili con BeamNG, BeamMP o altre mod. Se hai problemi, inizia a rimuovere le mod. Se, dopo aver aggiunto delle mod, ricevi un messaggio "done" o "start" quando provi a entrare, probabilmente hai aggiunto una mod incompatibile o difettosa. Se hai delle mod client installate, vedi [Sicurezza mod](/it/players/mod-safety) per rimuoverle dal tuo gioco.
:::

### Mod di veicoli e altre mod

Metti il file `.zip` della mod in `Resources/Client`. Chiunque entri la scarica automaticamente.

### Mappe

Le mappe vanilla funzionano senza installare nulla. Imposta `Map` in `ServerConfig.toml` su uno dei [percorsi delle mappe vanilla](/it/server-owners/configuration#all-vanilla-maps-names).

Per una mappa moddata:

1. Metti il file `.zip` della mappa in `Resources/Client`.
2. Apri il file `.zip` senza estrarlo, poi apri la sua cartella `levels`. Contiene una cartella con il nome della mappa, per esempio `myawesomedriftmap2021`. Annota il nome esattamente come è scritto.
3. In `ServerConfig.toml`, `Map` ha la forma `/levels/MAPNAME/info.json`, dove `MAPNAME` è probabilmente qualcosa come `gridmap_v2`. Sostituisci `MAPNAME` con il nome della cartella del punto 2. Deve terminare con `/info.json`. Per questo esempio:
   ```toml
   Map = '/levels/myawesomedriftmap2021/info.json'
   ```
Quando qualcuno entra, la mappa viene scaricata automaticamente e funziona.

Se non funziona, installa la mappa in BeamNG.drive in singleplayer ed entraci. Apri la console con il tasto `~` (tilde). Su una tastiera non americana, trova l'azione **Toggle System Console** in **Options** > **Controls** > **Bindings**, nella sezione **General Debug**. Esegui `print(getMissionFilename())`. Mostra il nome da usare.

### Proteggere le mod dal download

Puoi ospitare contenuti protetti o con accesso limitato senza ridistribuirli. È adatto alle "mod a pagamento" o a un creatore di mod che vuole un accesso limitato ai suoi nuovi lavori.

Per proteggere una mod, esegui questo nella console del server:
```text
protectmod <filename with .zip> <true/false>
```
I giocatori che entrano in un server con mod protette devono procurarsi il file da soli, per esempio dal creatore o da una piattaforma come Patreon, e metterlo nella cartella delle risorse del loro Launcher. Il Launcher li avvisa quando manca un file e il gioco mostra una notifica con il file mancante e come risolvere.

## Fare entrare i giocatori

### Entrare nel tuo server

Che sia privato o pubblico, il modo in cui entri dipende da dove è in esecuzione:

- **Sullo stesso computer del gioco:** usa la connessione diretta. Clicca sulla scheda **Direct Connect** a sinistra della lista dei server, lascia i dati predefiniti (`127.0.0.1` e la tua porta) e clicca su **Connect**.
- **Su un altro computer della tua rete locale:** connessione diretta con l'indirizzo IP locale di quel computer.
- **Fuori da casa tua, per esempio su un VPS:** connessione diretta con l'indirizzo IP pubblico di quella macchina.

### Server privato

Dai agli altri giocatori l'indirizzo IP pubblico del tuo server. Fai attenzione a con chi lo condividi. Per entrare, aprono la scheda **Direct Connect** in BeamMP e inseriscono il tuo indirizzo IP e la porta.

### Server pubblico

Gli altri giocatori lo trovano nella lista dei server: digitano il suo nome e cliccano su **Connect**. Il nome è quello nel tuo `ServerConfig.toml`. Se non lo trovano, di' loro di disattivare i filtri di ricerca e di impostare la mappa su **Any**. Anche il sito [Keymaster](https://keymaster.beammp.com/) mostra l'indirizzo IP del tuo server.

### "Connection Failed!"

Se tu o un amico ricevete "Connection Failed!", guarda nella finestra del Launcher i codici come 10060, 10061 o 10030. Significano una di due cose: sei dietro un indirizzo IPv4 CGNAT, oppure qualcosa è andato storto in [Reindirizzare la porta](#forward-the-port) o in [Consentire il server nel firewall](#allow-the-server-through-your-firewall).

Per verificare la presenza di CGNAT, cerca l'indirizzo IP WAN nella pagina del tuo router e confrontalo con il tuo [IP pubblico](https://www.whatsmyip.org/). Se coincidono, non sei dietro un CGNAT. Vedi [Verifica CGNAT](/it/server-owners/cgnat). IPv6 non è ancora supportato.

## Verifica che i giocatori possano raggiungere il tuo server

Inserisci l'indirizzo IPv4 pubblico e la porta del tuo server, poi clicca su **CheckBeamMP**:

<form action="https://check.beammp.com/api/v2/beammp" method="get" target="_blank">
  <label for="ip">Indirizzo IP:</label>
  <input type="text" id="ip" name="ip"><br>
  <label for="port">Porta:</label>
  <input type="text" id="port" name="port"><br>
  <input type="submit" value="CheckBeamMP">
</form>

## Usare una VPN

BeamMP non supporta le VPN come RadminVPN o Hamachi, perché spesso causano problemi. Uno di questi è che il traffico UDP non viene inoltrato. Per risolverlo, vedi [Reindirizzare la porta](#forward-the-port).

::: question Ma prima funzionava. Perché ora no?
Gli sviluppatori di queste applicazioni aggiornano il loro software e fanno modifiche su cui BeamMP non ha alcun controllo. Spetta a loro supportare usi specifici come un server BeamMP.
:::

## Hai ancora problemi?

Apri una discussione sul [forum](https://forum.beammp.com), oppure apri un **Server Support Ticket** nel canale `#support` del [server Discord](https://discord.gg/beammp).
