---
description: "Reindirizza la porta di BeamMP sul router di casa, passo dopo passo: imposta un IP statico, accedi al router, crea la regola e provala con CheckBeamMP."
---
# Reindirizzamento delle porte

::: danger LIMITAZIONE DI RESPONSABILITÀ:
**Il port forwarding comporta dei rischi**.

Facendo il port forwarding sei consapevole dei rischi legati all'apertura delle porte della tua rete domestica al pubblico e, di conseguenza, rinunci al diritto di ritenere BeamMP responsabile di **qualsiasi** danno che potrebbe derivare a te o al tuo nucleo familiare.

Non ci assumiamo alcuna responsabilità per i contenuti di servizi o siti web esterni collegati.

<u>**Se non capisci questa guida, valuta l'uso di uno dei nostri partner.**</u>
:::

::: warning
Assicurati che il tuo router non sia un dispositivo esclusivamente 4G/5G. Se è un dispositivo ibrido, assicurati di selezionare più avanti l'adattatore collegato via cavo, nella sezione 3 di questa guida!
:::

## Cosa farai

Creare una regola di port forwarding richiede alcuni termini di rete piuttosto specifici. Preparati ad annotare qualche appunto durante il procedimento.

Questa guida ha 4 passaggi principali.

## Guida rapida

1. **Assegna un indirizzo IP statico al tuo computer o ai tuoi dispositivi**

   Serve a evitare che l'IP del tuo dispositivo cambi e invalidi la regola di port forwarding.

   [Scopri di più sul tuo router](https://portforward.com/router.htm#1)

2. **Accedi al tuo router**

   Di solito si può fare trovando l'IP del "Gateway predefinito", che si ottiene eseguendo `ipconfig` in un prompt dei comandi, e inserendolo nella barra degli indirizzi di un browser web.

3. **Reindirizza le porte verso il tuo computer**

   Trova la sezione del port forwarding nell'interfaccia web del tuo router. La maggior parte dei router la inserisce sotto Rete, Avanzate o LAN.

4. **Verifica che la porta sia reindirizzata correttamente**

   Usa uno strumento come CheckBeamMP per verificare se la regola funziona.

   <form action="https://check.beammp.com/api/v2/beammp" method="get" target="_blank">
    <label for="ip">Indirizzo IP:</label>
    <input type="text" id="ip" name="ip"><br>
    <label for="port">Porta:</label>
    <input type="text" id="port" name="port"><br>
    <input type="submit" value="CheckBeamMP">
   </form>

## Guida dettagliata

### Assegnare un indirizzo IP statico

#### Metodo 1: usa una prenotazione DHCP

Un altro modo per impostare un indirizzo IP statico nella tua rete locale è usare la funzione di prenotazione DHCP del router. Non tutti i router dispongono di questa funzione, quindi potrebbe non essere un'opzione per te. Cerca su Internet il modello del tuo router per trovare un manuale. 

Se ci sei riuscito, passa a [Accedere al router](#log-in-to-your-router)

#### Metodo 2: imposta un IP statico in Windows

##### Trova il tuo indirizzo IP attuale, il gateway e i server DNS

Prima di poter impostare un indirizzo IP statico, dobbiamo conoscere le tue impostazioni di rete attuali. 
Ti conviene annotarle, quindi tieni pronta una finestra del Blocco note. 
Per questo passaggio useremo il prompt dei comandi.

Apri un prompt dei comandi. I 3 modi principali sono:

- Premi il tasto Windows, poi inizia a digitare "cmd" e premi Invio quando vedi evidenziato "Prompt dei comandi".


<figure class="image image_resized" style="width:62%;">

![Il menu Start di Windows con Prompt dei comandi evidenziato](../../assets/content/win11-open-cmd.png)

</figure>

Una volta nel prompt dei comandi, esegui il seguente comando:
```
ipconfig /all
```
Vedrai molti dati.
Se hai adattatori di rete virtuali o più adattatori, ne vedrai ancora di più. 
È normale vedere molti adattatori virtuali se hai installato Hyper-V o Docker.

<figure class="image image_resized" style="width:62%;">

![Il prompt dei comandi con l'output di ipconfig, con evidenziati indirizzo IPv4, subnet mask, gateway predefinito e server DNS](../../assets/content/win11-command-prompt-ipconfig-highlighted.png)

</figure>

Si consiglia di usare una connessione di rete cablata per il computer su cui girerà il server, ma funziona anche con una connessione wireless.
In questo elenco devi cercare un adattatore con una connessione a Internet attiva. Scorri l'elenco e trova uno che abbia un Gateway predefinito assegnato. 
Molti adattatori virtuali non hanno un Gateway predefinito. 

Qui sotto ci sono esempi di indirizzi IPv4 locali: almeno uno degli adattatori dovrebbe averne uno.
Dovrai annotare le informazioni del tuo adattatore.

- 192.168.x.x
- 10.x.x.x.
- 172.16.x.x - 172.31.x.x

Subnet mask (molto probabilmente 255.255.255.0)
</br>
Gateway predefinito (molto probabilmente 192.168.0.1 o 192.168.1.1)

::: info Nota bene
Al momento BeamMP non supporta IPv6 per ospitare un server. 
:::

##### Modifica le impostazioni dell'adattatore

Ora dobbiamo modificare le impostazioni del tuo adattatore di rete, in modo che il PC mantenga la configurazione IP che ha adesso. Il modo più rapido per arrivare alle impostazioni di rete è:

- Premi una volta il tasto Windows
- Digita "connessioni di rete" finché non vedi "Visualizza connessioni di rete".
- Premi il tasto Invio


<figure class="image image_resized" style="width:62%;">

![Il menu Start di Windows con Visualizza connessioni di rete](../../assets/content/win11-start-menu-view-network-connections.png)

</figure>

Dovresti vedere un elenco delle connessioni di rete del tuo computer. 
Se hai installato Hyper-V o Docker, possono essere molte. 
Cerca gli adattatori che non si chiamano "Hyper-V".

<figure class="image image_resized" style="width:62%;">

![La finestra Connessioni di rete con l'adattatore Ethernet](../../assets/content/win11-network-connections.png)

</figure>


Clicca con il tasto destro sul tuo adattatore e scegli Proprietà. Se `Internet Protocol Version 4` non è selezionato, questo è l'adattatore sbagliato. Scegline un altro.

<figure class="image image_resized" style="width:62%;">

![La finestra delle proprietà di Ethernet con la voce IPv4 evidenziata](../../assets/content/win11-ethernet-properties-highlighted.png)

</figure>

Fai doppio clic su `Internet Protocol Version 4`. Cambia `Obtain an IP address automatically` in `Use the following IP address`.

Compila Indirizzo IP, Subnet mask, Gateway predefinito e Server DNS preferito con le informazioni del prompt dei comandi (ipconfig /all).

In alternativa, al posto dei tuoi server DNS, puoi usare quelli di CloudFlare o di Google:

- DNS di CloudFlare: 1.1.1.1, 1.0.0.1
- DNS di Google: 8.8.8.8, 8.8.4.4


<figure class="image image_resized" style="width:62%;">

![La finestra delle proprietà IPv4 con indirizzo IP, subnet mask, gateway predefinito e server DNS compilati](../../assets/content/win11-network-settings-static-ip.png)

</figure>

Clicca su OK, poi di nuovo su OK, e il tuo adattatore è passato da DHCP a statico. Naviga sul web per assicurarti di avere ancora la connessione a Internet. Se non ce l'hai, riporta le impostazioni su Ottieni automaticamente un indirizzo IP e prova il metodo successivo.

### Accedere al router {#log-in-to-your-router}

Ora che il tuo dispositivo ha un indirizzo IP statico, sei pronto a reindirizzare la porta per BeamMP!

Per iniziare, dobbiamo accedere al tuo router. Prima hai annotato, tra le impostazioni, il Gateway predefinito. È l'indirizzo IP del tuo router.

La maggior parte dei router usa una pagina web ospitata in locale per la gestione. Per vedere il menu e le impostazioni del tuo router:

- Apri un browser web. Firefox, Chrome o Edge vanno bene.
- Nella barra degli indirizzi, digita l'indirizzo IP del tuo Gateway predefinito, come 192.168.0.1 o 192.168.1.1, e premi Invio

Ora dovresti vedere la schermata di accesso del router. Non tutti i router richiedono un accesso, ma la maggior parte sì. Devi conoscere nome utente e password del tuo router. Se non hai mai effettuato l'accesso, è molto probabile che nome utente e password siano quelli di fabbrica o, in alcuni casi, siano scritti su un'etichetta sul router.

Qui sono elencati alcuni dei nomi utente e password di fabbrica più comuni:

| Nome utente | Password  |
| ----------- | --------- |
| admin       | admin     |
| admin       | password  |
| {vuoto}     | admin     |
| {vuoto}     | password  |

Prova varie combinazioni di admin, password e lasciando i campi vuoti. *Dove c'è scritto vuoto, prova a lasciare il valore vuoto.* 

### Creare le regole di reindirizzamento

#### Trova la sezione del reindirizzamento

Trova la sezione del port forwarding nell'interfaccia web del tuo router. Muoviti nel router cliccando sulle schede o sui link in alto o a sinistra di ogni pagina. La maggior parte dei router inserisce la sezione del port forwarding sotto Rete, Avanzate o LAN. Cerca queste parole chiave per trovarla:

- Port Forwarding
- Forwarding
- Port Range Forwarding
- Virtual Servers
- Apps & Gaming
- Advanced Setup/Settings
- NAT

#### Inserisci i dettagli

Quando trovi la sezione del port forwarding del tuo router, sei pronto a inserire le informazioni necessarie.
Il router avrà un punto in cui inserire le porte da reindirizzare e l'indirizzo IP di destinazione a cui indirizzarle. Se il router elenca sia porte interne sia porte esterne, impostale uguali. 

BeamMP richiede sia la porta UDP sia la porta TCP 30814 (a meno che tu non l'abbia cambiata nel tuo [ServerConfig.toml](/it/server-owners/host-a-server#configure-the-server)). 

::: info Nota
Anche se la **porta** predefinita è la **30814**, puoi scegliere qualsiasi altro numero maggiore di 1024 ma minore di 65535, però devi annotare quello che hai scelto se non è 30814\. Devi reindirizzare sia **TCP** sia **UDP**.
</br>
Si consiglia di usare la porta predefinita, perché è molto improbabile che venga usata da un altro servizio sul tuo PC.
</br>
Tuttavia, se ospiti più server su una stessa macchina, ogni server ha bisogno di una porta diversa. Per esempio, server 1: 30814, server 2: 30815.
:::

Su alcuni router potresti dover creare 2 regole, una per UDP e una per TCP, mentre altri permettono di fare entrambe le cose con una sola regola!

La maggior parte dei router ha un pulsante di salvataggio e alcuni router richiedono un riavvio perché le modifiche abbiano effetto.

### Verificare la porta

Ci sono diversi modi per verificare la connessione.

Il modo che consigliamo è usare il nostro strumento **CheckBeamMP**, perché verifica i problemi e i protocolli specifici di BeamMP.

<form action="https://check.beammp.com/api/v2/beammp" method="get" target="_blank">
  <label for="ip">Indirizzo IP:</label>
  <input type="text" id="ip" name="ip"><br>
  <label for="port">Porta:</label>
  <input type="text" id="port" name="port"><br>
  <input type="submit" value="CheckBeamMP">
</form>

Per farlo, devi ottenere il tuo indirizzo IPv4 pubblico, e anche questo si può fare in diversi modi. Il principale è usare un sito chiamato [whatsmyip.org](https://whatsmyip.org/), un semplice sito che mostra il tuo indirizzo IP pubblico. Devi cercare un indirizzo IP nel formato: xxx.xxx.xxx.xxx

Visita il seguente link, sostituendo "IP" con il tuo vero indirizzo IPv4 e "Port" con la porta del tuo server. Assicurati di non lasciare spazi.
https://check.beammp.com/api/v2/beammp/ip/port

::: success status: ok
Se ottieni l'output qui sopra, ora puoi entrare nel tuo server!
Ci sono 2 modi per entrare: direttamente con i dati che hai inserito in CheckBeamMP oppure, se il tuo server è impostato come "public", tramite la lista dei server.
Dato che stai ospitando un server in locale, usa 127.0.0.1 (localhost) se il server gira sullo stesso PC su cui giochi, oppure l'IPv4 LAN della macchina locale su cui gira il server.
:::

::: failure status: error
Se la connessione fallisce del tutto, il tuo ISP potrebbe usare un CGNAT (Carrier Grade Network Address Translation). Per maggiori dettagli, vedi [Verifica CGNAT](/it/server-owners/cgnat),
  oppure apri un ticket Server Support sul nostro [server Discord](https://discord.gg/beammp) nel canale `#support` e uno dei nostri membri dello staff si occuperà del tuo ticket!
  Se vedi funzionare solo TCP e UDP fallisce, ricontrolla le regole del firewall e del port forwarding.
:::
