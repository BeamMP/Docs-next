---
description: "Scopri se la tua connessione a Internet è dietro un CGNAT, che impedisce ai giocatori di entrare in un server BeamMP ospitato a casa anche con le porte reindirizzate."
---
# Verifica CGNAT

Le esclusioni del firewall e le regole di port forwarding sono configurate correttamente, ma nessuno riesce a entrare nel tuo server ospitato a casa? Potresti essere dietro un CGNAT.

Se usi un servizio di hosting e hai problemi di connessione, contattalo. Se vuoi un VPS, o non puoi ospitare a casa, consulta i [servizi di hosting partner](/it/server-owners/host-a-server#partnered-hosting-services).

## Che cos'è il CGNAT?

Il Carrier-grade NAT (CGNAT) è una configurazione usata da alcuni provider Internet che rende difficile reindirizzare le porte verso la tua casa. Per una spiegazione dettagliata di cos'è e del perché è un problema per l'hosting a casa, consulta [Carrier-grade NAT su Wikipedia](https://en.wikipedia.org/wiki/Carrier-grade_NAT).

## Verifica la presenza di CGNAT

### Metodo 1: traccia il percorso

1. Apri un prompt dei comandi ed esegui:
   ```text
   tracert -4 beammp.com
   ```
   Viene mostrata una serie di hop di rete. Attendi che finisca: possono volerci fino a 30 hop.
2. Il primo hop è il tuo router, modem o gateway e cambia da un dispositivo all'altro. Guarda i primi indirizzi IP dopo di esso.
3. Se dopo il primo hop compaiono diversi indirizzi compresi tra `100.64.x.x` e `100.127.x.x`, oppure che iniziano con `10.`, molto probabilmente sei dietro un CGNAT.

Gli intervalli ufficiali per le reti locali sono `10.0.0.x`, `192.168.x.x` e `172.16.x.x`.

### Metodo 2: confronta gli indirizzi IP

Trova l'indirizzo IP WAN nell'interfaccia del tuo router e confrontalo con quello mostrato su [whatsmyip.org](https://whatsmyip.org). Se **non** coincidono, sei dietro un CGNAT.

## Se sei dietro un CGNAT

Chiama il tuo provider Internet (ISP) per ricevere assistenza. A seconda dell'ISP, potrebbe non offrire indirizzi IP dinamici dedicati. Non è necessario un IP statico.

::: warning
Gli ISP potrebbero offrire un indirizzo IP dedicato solo come **opzione a pagamento**. Confronta il prezzo con i nostri servizi di hosting partner: potrebbero costare meno.
:::

Questo è un esempio di rete che non è dietro un CGNAT:

![Uno schema di rete di una connessione che non è dietro un CGNAT](https://github.com/user-attachments/assets/fee21a50-cbb0-4322-9c26-d9f04f88ae37)
