# ¿Cómo puedo encontrar la IP de mi servidor?

## Para servidores alojados en un VPS
Si alojas un servidor con uno de nuestros servicios de alojamiento asociados, la IP aparecerá en la interfaz de gestión del servidor correspondiente.
También puedes encontrar la IP de tus servidores en el sitio web del [Keymaster](https://keymaster.beammp.com/login).

## Para servidores alojados en casa
Si el servidor está alojado en casa, abre [whatsmyip.org](https://whatsmyip.org) en un navegador.
Mostrará la dirección IPv4 pública con la que se te contacta desde internet.

Ten en cuenta que 127.0.0.1 es la dirección localhost y solo puedes usarla tú, si el servidor está alojado en el mismo ordenador.
Si sigues teniendo problemas de conexión con tu servidor alojado en casa, revisa la [redirección de puertos](https://docs.beammp.com/server/port-forwarding/) y usa también CheckBeamMP

<form action="https://check.beammp.com/api/v2/beammp" method="get" target="_blank">
  <label for="ip">Dirección IP:</label>
  <input type="text" id="ip" name="ip"><br>
  <label for="port">Puerto:</label>
  <input type="text" id="port" name="port"><br>
  <input type="submit" value="CheckBeamMP">
</form>

## ¿Cómo comprobar si hay CGNAT?
Echa un vistazo a [esta página](https://docs.beammp.com/FAQ/How-to-check-for-CGNAT/) para determinar si puedes alojar un servidor en casa o no.


Etiquetas: IP, Servidor, Conexión fallida, 10060/10061
