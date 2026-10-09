# Come posso trovare l'IP del mio server?

## Per i server ospitati su VPS
Se ospiti un server con uno dei nostri servizi di hosting partner, l'IP è riportato nella rispettiva interfaccia di gestione del server.
Puoi trovare l'IP dei tuoi server anche sul sito [Keymaster](https://keymaster.beammp.com/login).

## Per i server ospitati a casa
Per i server ospitati a casa, apri [whatsmyip.org](https://whatsmyip.org) in un browser.
Verrà mostrato l'indirizzo IPv4 pubblico con cui sei raggiungibile da Internet.

Nota che 127.0.0.1 è l'indirizzo localhost e può essere usato solo da te, se il server è ospitato sullo stesso computer.
Se hai ancora problemi di connessione con il tuo server ospitato a casa, controlla anche il [port forwarding](https://docs.beammp.com/server/port-forwarding/) e usa CheckBeamMP

<form action="https://check.beammp.com/api/v2/beammp" method="get" target="_blank">
  <label for="ip">Indirizzo IP:</label>
  <input type="text" id="ip" name="ip"><br>
  <label for="port">Porta:</label>
  <input type="text" id="port" name="port"><br>
  <input type="submit" value="CheckBeamMP">
</form>

## Come verificare la presenza di CGNAT?
Dai un'occhiata a [questa pagina](https://docs.beammp.com/FAQ/How-to-check-for-CGNAT/) per stabilire se puoi ospitare un server a casa oppure no.


Tag: IP, Server, Connessione non riuscita, 10060/10061
