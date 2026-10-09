# Reindirizzamento delle porte

::: danger LIMITAZIONE DI RESPONSABILITÀ:
**Il port forwarding comporta dei rischi**.

Facendo il port forwarding sei consapevole dei rischi legati all'apertura delle porte della tua rete domestica al pubblico, e di conseguenza rinunci al diritto di ritenere BeamMP responsabile di **qualsiasi** danno che potrebbe derivare a te o al tuo nucleo familiare.

Non ci assumiamo alcuna responsabilità per i contenuti di servizi o siti web esterni collegati.

<u>**Se non capisci questa guida, valuta l'uso di uno dei nostri partner.**</u>
:::

::: warning
Assicurati che il tuo router non sia un dispositivo esclusivamente 4G/5G. Se è un dispositivo ibrido, assicurati di selezionare l'adattatore collegato via cavo più avanti, nella sezione 3 di questa guida!
:::

## Come configurare il port forwarding.

Creare una regola di port forwarding richiede alcuni termini di rete piuttosto specifici. Preparati ad annotare alcuni appunti durante il procedimento.

Questa guida è composta da 4 passaggi principali.

## Una guida rapida. (Una guida più dettagliata si trova più in basso)

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

## La guida dettagliata

### 1. Assegnare un indirizzo IP statico

### Metodo 1: impostare un indirizzo IP statico tramite le prenotazioni DHCP

Un altro modo per impostare un indirizzo IP statico nella tua rete locale è usare la funzione di prenotazione DHCP del router. Non tutti i router dispongono di questa funzione, quindi potrebbe non essere un'opzione per te. Cerca su Internet il modello del tuo router per trovare un manuale. 

Se ci sei riuscito, passa direttamente al [passaggio 2](port-forwarding.md#2-log-in-to-your-router)

### Metodo 2: assegnare un IP statico in Windows

#### 1.1. Trova il tuo indirizzo IP attuale, il gateway e i server DNS:

Prima di poter impostare un indirizzo IP statico, dobbiamo conoscere le tue impostazioni di rete attuali. 
Ti conviene annotarle, quindi tieni pronta una finestra del Blocco note. 
Per questo passaggio useremo il prompt dei comandi.

Apri un prompt dei comandi. I 3 modi principali sono:

- Premi il tasto Windows, poi inizia a digitare "cmd" e premi Invio quando vedi evidenziato "Prompt dei comandi".


<figure class="image image_resized" style="width:62%;">

![](../../assets/content/win11-open-cmd.png)

</figure>

Una volta nel prompt dei comandi, esegui il seguente comando:
```
ipconfig /all
```
Vedrai molti dati.
Se hai adattatori di rete virtuali o più adattatori, ne vedrai ancora di più. 
È normale vedere molti adattatori virtuali se hai installato Hyper-V o Docker.

<figure class="image image_resized" style="width:62%;">

![](../../assets/content/win11-command-prompt-ipconfig-highlighted.png)

</figure>

Si consiglia di usare una connessione di rete cablata per il computer che eseguirà il server, anche se funziona anche con una connessione wireless.
In questo elenco dovrai cercare un adattatore con una connessione a Internet attiva. Scorri l'elenco e trova quello a cui è assegnato un gateway predefinito. 
Molti degli adattatori virtuali non hanno un gateway predefinito. 

Di seguito trovi alcuni esempi di indirizzi IPv4 locali, di cui almeno uno dei tuoi adattatori dovrebbe averne uno.
Dovrai annotare le informazioni del tuo adattatore.

- 192.168.x.x
- 10.x.x.x.
- 172.16.x.x - 172.31.x.x

Subnet mask (molto probabilmente 255.255.255.0)
</br>
Gateway predefinito (molto probabilmente 192.168.0.1 o 192.168.1.1)

::: info Da tenere presente
Al momento BeamMP non supporta IPv6 per ospitare un server. 
:::

#### 1.2. Modifica le impostazioni dell'adattatore

Ora dobbiamo cambiare le impostazioni del tuo adattatore di rete in modo che il PC mantenga la configurazione IP che ha attualmente. Il modo più veloce per raggiungere le impostazioni di rete è:

- Premi una volta il tasto Windows
- Digita "connessioni di rete" finché non vedi "Visualizza connessioni di rete".
- Premi il tasto Invio


<figure class="image image_resized" style="width:62%;">

![](../../assets/content/win11-start-menu-view-network-connections.png)

</figure>

Dovresti vedere un elenco delle connessioni di rete del tuo computer. 
Se hai Hyper-V o Docker installati, potrebbero essere molte. 
Cerca gli adattatori il cui nome non contiene "Hyper-V".

<figure class="image image_resized" style="width:62%;">

![](../../assets/content/win11-network-connections.png)

</figure>


Fai clic con il tasto destro sul tuo adattatore e scegli Proprietà. Se `Protocollo Internet versione 4` non è selezionato, questo è l'adattatore sbagliato. Scegline un altro.

<figure class="image image_resized" style="width:62%;">

![](../../assets/content/win11-ethernet-properties-highlighted.png)

</figure>

Fai doppio clic su `Protocollo Internet versione 4`. Cambia `Ottieni automaticamente un indirizzo IP` in `Utilizza il seguente indirizzo IP`.

Compila i campi Indirizzo IP, Subnet mask, Gateway predefinito e Server DNS preferito con le informazioni ottenute dal prompt dei comandi (ipconfig /all).

In alternativa, invece di usare i tuoi server DNS, puoi usare quelli di CloudFlare o di Google:

- DNS di CloudFlare: 1.1.1.1, 1.0.0.1
- DNS di Google: 8.8.8.8, 8.8.4.4


<figure class="image image_resized" style="width:62%;">

![](../../assets/content/win11-network-settings-static-ip.png)

</figure>

Fai clic su OK, poi di nuovo su OK, e il tuo adattatore passerà da DHCP a statico. Naviga sul web per verificare di avere ancora la connessione a Internet. In caso contrario, ripristina le impostazioni su Ottieni automaticamente un indirizzo IP e prova il metodo successivo.

### 2. Accedi al tuo router {#2-log-in-to-your-router}

Ora che il tuo dispositivo ha un indirizzo IP statico, sei pronto a reindirizzare la porta per BeamMP!

Per iniziare, dobbiamo accedere al tuo router. Prima hai annotato, tra le altre, l'impostazione del Gateway predefinito. Quello è l'indirizzo IP del tuo router.

La maggior parte dei router usa una pagina web ospitata localmente per la gestione. Per visualizzare il menu e le impostazioni del tuo router:

- Apri un browser web. Firefox, Chrome o Edge vanno benissimo.
- Nella barra degli indirizzi, digita l'indirizzo IP del tuo Gateway predefinito, ad esempio 192.168.0.1 o 192.168.1.1, e premi Invio

Ora dovresti vedere la schermata di accesso del tuo router. Non tutti i router richiedono un accesso, ma la maggior parte sì. Devi conoscere il nome utente e la password del tuo router. Se non hai mai effettuato l'accesso, nome utente e password sono molto probabilmente impostati ai valori di fabbrica o, in alcuni casi, sono scritti su un'etichetta sul router.

Ecco alcune delle combinazioni di nome utente e password di fabbrica più comuni:

| Nome utente | Password  |
| ----------- | --------- |
| admin       | admin     |
| admin       | password  |
| {vuoto}     | admin     |
| {vuoto}     | password  |

Prova varie combinazioni di admin, password e lasciando i campi vuoti. *Dove c'è scritto vuoto, prova a lasciare il valore vuoto.* 

### 3. Crea le regole di reindirizzamento!

#### 3.1. Trova la sezione del reindirizzamento

Trova la sezione del port forwarding nell'interfaccia web del tuo router. Naviga nel router cliccando sulle schede o sui link in alto o a sinistra di ogni pagina. La maggior parte dei router inserisce la sezione del port forwarding sotto Rete, Avanzate o LAN. Cerca le seguenti parole chiave per trovarla più facilmente:

- Port Forwarding
- Forwarding
- Port Range Forwarding
- Virtual Servers
- Apps & Gaming
- Advanced Setup/Settings
- NAT

#### 3.2. Inserisci i dettagli

Una volta trovata la sezione del port forwarding del tuo router, sei pronto a inserire le informazioni necessarie.
Il router avrà un campo in cui inserire le porte da reindirizzare e l'indirizzo IP di destinazione a cui indirizzarle. Se il tuo router elenca sia porte interne sia porte esterne, impostale uguali. 

BeamMP richiede sia la porta UDP sia la porta TCP 30814 (a meno che tu non l'abbia cambiata nel tuo [ServerConfig.toml](/it/server-owners/host-a-server#4-configuration)). 

::: info Nota
Anche se la **porta** predefinita è la **30814**, puoi scegliere qualsiasi altro numero maggiore di 1024 e minore di 65535, ma devi annotare quello che hai scelto se non è 30814\. Devi reindirizzare sia **TCP** sia **UDP**.
</br>
Si consiglia di mantenere la porta predefinita, perché è molto improbabile che venga usata da un altro servizio sul tuo PC.
</br>
Tuttavia, se ospiti più server sulla stessa macchina, ogni server ha bisogno di una porta diversa. Ad esempio, server 1: 30814, server 2: 30815.
:::

Su alcuni router potresti dover creare 2 regole, una per UDP e una per TCP, mentre altri permettono comodamente di fare entrambe le cose con una sola regola!

La maggior parte dei router ha un pulsante "Salva", e alcuni richiedono un riavvio perché le modifiche abbiano effetto.

### 4. È ora di provare!

Ci sono diversi modi per verificare la connessione.

Il modo che consigliamo è usare il nostro strumento **CheckBeamMP**, perché verifica i problemi e i protocolli specifici di BeamMP.

<form action="https://check.beammp.com/api/v2/beammp" method="get" target="_blank">
  <label for="ip">Indirizzo IP:</label>
  <input type="text" id="ip" name="ip"><br>
  <label for="port">Porta:</label>
  <input type="text" id="port" name="port"><br>
  <input type="submit" value="CheckBeamMP">
</form>

Per farlo devi ottenere il tuo indirizzo IPv4 pubblico, cosa che si può fare in diversi modi. Il modo principale è usare il sito [whatsmyip.org](https://whatsmyip.org/), un semplice sito web che mostra il tuo indirizzo IP pubblico. Dovresti cercare un indirizzo IP nel formato xxx.xxx.xxx.xxx

Visita il seguente link, sostituendo "IP" con il tuo vero indirizzo IPv4 e "Port" con la porta del tuo server. Assicurati di non lasciare spazi.
https://check.beammp.com/api/v2/beammp/ip/port

::: success stato: ok
Se ottieni l'output qui sopra, ora puoi entrare nel tuo server!
Ci sono 2 modi per entrare: direttamente con i dettagli che hai inserito in Probably UP oppure, se il tuo server è impostato come "pubblico", tramite la lista dei server.
Poiché stai ospitando un server in locale, usa 127.0.0.1 (localhost) se il server è in esecuzione sullo stesso PC con cui giochi, oppure l'IPv4 LAN della macchina locale su cui è in esecuzione il server.
:::

::: failure stato: errore
Se la connessione fallisce del tutto, il tuo ISP potrebbe usare il CGNAT (Carrier Grade Network Address Translation). Per maggiori dettagli, consulta [Come verificare la presenza di CGNAT?](/it/server-owners/cgnat),
  oppure apri un ticket di supporto server sul nostro [server Discord](https://discord.gg/beammp) nel canale `#support` e uno del nostro staff si occuperà del tuo ticket!
  Se vedi che funziona solo TCP e UDP no, ricontrolla le regole del firewall e del port forwarding.
:::
