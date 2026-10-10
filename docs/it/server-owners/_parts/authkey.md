## Ottenere una AuthKey {#get-an-authkey}

La AuthKey, chiamata anche "chiave di autenticazione", è ciò che fa comparire un server **pubblico** nella lista dei server. È consigliata anche per i server privati.

- Hai a disposizione un numero limitato di chiavi. Una chiave funziona su un solo server alla volta, quindi non puoi usare la stessa chiave per due server.
- Puoi ottenere altre chiavi sostenendo il progetto. Vedi [Come ottengo l'early access?](/it/players/faq) nelle FAQ del giocatore.
- Ti serve un account BeamMP. Non ti serve un account Discord per creare una chiave.

::: warning
Non condividere mai la tua AuthKey e non mostrarla a nessuno. Trattala come una password.
:::

1. Apri [BeamMP Accounts](https://accounts.beammp.com) e accedi. Se non hai ancora un account, segui [Il tuo account BeamMP](/it/players/account).
2. Clicca su **Keymaster** nel menu in alto nella pagina.
3. Clicca su **Create New Server Key**, poi su **Create Key**. La nuova chiave viene aggiunta all'elenco **Your Server Keys**.
4. In **Your Server Keys**, clicca su **Show Keys**. Ogni chiave viene abbreviata ai primi 8 e agli ultimi 4 caratteri, insieme alla data in cui l'hai creata.
5. Clicca sull'icona di copia accanto alla chiave. Keymaster copia la chiave completa. Tienila a portata di mano per il passo successivo.

Una chiave ha questo aspetto: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`. Keymaster non ha un campo per dare un nome alla chiave né un pulsante per eliminarla. Una chiave che non usi conta comunque nel tuo limite.

### Il limite di chiavi {#your-key-limit}

**Your Server Keys** mostra quante chiavi hai usato, per esempio `1 / 2 keys used`, e da dove arrivano eventuali chiavi extra. Per impostazione predefinita:

- Ogni account può avere 2 chiavi.
- Un livello Patreon aggiunge una chiave per ogni dollaro statunitense (US$) intero del prezzo del livello. Prima collega il tuo account Patreon in BeamMP Accounts. Vedi [Il tuo account BeamMP](/it/players/account#linked-accounts).
- Fare il boost del server Discord di BeamMP aggiunge 5 chiavi in totale, non 5 per ogni boost. Prima collega il tuo account Discord in BeamMP Accounts. Può passare fino a un giorno prima che un boost venga mostrato.

Quando raggiungi il limite, **Create New Server Key** mostra il messaggio **Key Limit Reached** invece di creare una chiave.

### Sostituire una chiave che altri hanno visto {#replace-a-key-that-others-have-seen}

Se qualcun altro potrebbe conoscere la tua chiave, falla ruotare.

1. In **Your Server Keys**, clicca sull'icona di rotazione accanto alla chiave.
2. Clicca su **Rotate Key**. La vecchia chiave smette di funzionare subito e il server che la usa sparisce dalla lista dei server.
3. Copia la nuova chiave e inseriscila nell'impostazione `AuthKey` del tuo `ServerConfig.toml`.
4. Riavvia il server.

Una chiave bannata dallo staff non può essere ruotata.

### Spostare le vecchie chiavi su BeamMP Accounts {#move-your-old-keys-to-beammp-accounts}

Le chiavi ottenute prima dell'esistenza di BeamMP Accounts sono legate al tuo account Discord.

1. In **Keymaster**, cerca il riquadro **Legacy Keys**. Compare solo finché c'è qualcosa da fare.
2. Se Discord non è collegato, clicca su **Link Discord** e accedi con l'account Discord che possedeva le chiavi.
3. Clicca sul pulsante **Migrate**, che indica il numero di chiavi, e conferma con **Migrate Keys**. Ogni chiave mantiene il proprio valore, quindi i tuoi server restano online e non devi cambiare nulla su di essi.

Le chiavi migrate contano nel tuo limite. Se ti fanno superare il limite, le mantieni tutte, ma non puoi creare nuove chiavi finché non scendi di nuovo sotto il limite.

Keymaster elenca anche i server online con le tue chiavi sotto **Your Online Servers**, con il numero di giocatori e la versione.
