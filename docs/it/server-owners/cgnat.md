Come verificare la presenza di CGNAT?
## Problema

Tutte le esclusioni del firewall e le regole di port forwarding sono configurate correttamente, ma nessuno riesce a entrare nel tuo server ospitato a casa?

Se hai problemi di connessione e usi un servizio di hosting, contattalo per ricevere assistenza. Se vuoi usare un VPS o non puoi ospitare un server a casa, dai un'occhiata alla nostra
[lista dei servizi di hosting partner](/it/server-owners/host-a-server#partnered-hosting-services-paid) (documentazione sulla configurazione del server).

# Che cos'è il CGNAT?

Per una spiegazione dettagliata di cosa sia il CGNAT e del perché sia un problema quando si cerca di ospitare un server a casa, dai un'occhiata a [questa pagina](https://en.wikipedia.org/wiki/Carrier-grade_NAT).

# Come verificare la presenza di CGNAT?

## Metodo 1:
Apri un prompt dei comandi ed esegui ``tracert -4 beammp.com``. Verrà mostrata una serie di hop di rete. Attendi che l'operazione termini (può richiedere fino a 30 hop). Controlla i primi indirizzi IP dopo quello del tuo router/modem/gateway.
Se dopo il primo hop compaiono più indirizzi IP compresi nell'intervallo da ``100.64.x.x`` a ``100.127.x.x`` oppure ``10.xx.xx.xx``, molto probabilmente ti trovi dietro un CGNAT.

::: note
Il primo hop è il tuo router/modem/gateway e varia da un dispositivo all'altro.
Gli intervalli ufficiali per le reti locali sono i seguenti: ``10.0.0.xxx`` - ``192.168.xxx.xxx`` - ```172.16.xxx.xxx``
:::

## Metodo 2:
Trova l'IP WAN del tuo router consultando la sua interfaccia. Confrontalo con l'IP mostrato, ad esempio, su https://whatsmyip.org . Se NON coincidono, ti trovi dietro un CGNAT.

## Metodo 3/Soluzione:
Chiama il tuo provider di servizi Internet (ISP) per ricevere assistenza.
A seconda del tuo ISP, potrebbe non offrire indirizzi IP *dinamici* dedicati. Tieni presente che non è necessario un IP statico.

::: warning
Gli ISP potrebbero offrire gli indirizzi IP dedicati solo come **opzione a pagamento**.
Controlla i prezzi dei nostri servizi di hosting partner, perché potrebbero costare meno di questa tariffa!
:::

Esempio di rete senza CGNAT:

![image](https://github.com/user-attachments/assets/fee21a50-cbb0-4322-9c26-d9f04f88ae37)

Tag: Server, 10060 10061, CGNAT, Connessione non riuscita, Port forwarding, Firewall
