---
description: "Soluciona problemas de conexión de BeamMP: averigua la IP de tu servidor, comprueba con CheckBeamMP que tu puerto está abierto y mira si hay CGNAT."
---
# Problemas de conexión / red

Usa esta página cuando tú o tus jugadores no podáis conectaros a un servidor de BeamMP.

## Averiguar la dirección IP de tu servidor

### Un servidor en una empresa de alojamiento

La dirección IP aparece en la interfaz de gestión del servidor de la empresa de alojamiento. También puedes encontrar la dirección IP de tus servidores en el sitio web de [Keymaster](https://keymaster.beammp.com/login).

### Un servidor en casa

Abre [whatsmyip.org](https://whatsmyip.org) en un navegador. Muestra la dirección IPv4 pública que ve internet.

`127.0.0.1` es la dirección localhost. Solo puedes usarla tú, y solo si el servidor se ejecuta en el mismo ordenador que el juego.

## Comprobar que tu puerto está abierto

Si sigues teniendo problemas de conexión con un servidor alojado en casa, revisa tu [redirección de puertos](/es/server-owners/port-forwarding) y luego pruébala con CheckBeamMP mientras el servidor está en funcionamiento:

<form action="https://check.beammp.com/api/v2/beammp" method="get" target="_blank">
  <label for="ip">Dirección IP:</label>
  <input type="text" id="ip" name="ip"><br>
  <label for="port">Puerto:</label>
  <input type="text" id="port" name="port"><br>
  <input type="submit" value="CheckBeamMP">
</form>

## Comprobar si hay CGNAT

Algunos proveedores de internet dificultan la redirección de puertos. [Comprueba si hay CGNAT](/es/server-owners/cgnat) para saber si puedes alojar un servidor en casa.

## Otros problemas de conexión

- El Launcher muestra los códigos de error 10060 o 10061: consulta [Códigos de error](/es/troubleshooting/error-codes).
- El Launcher no se conecta al juego: consulta [Cambiar el puerto del Launcher](/es/troubleshooting/launcher-port).
- Puede que un firewall o antivirus esté bloqueando BeamMP: consulta [Exclusiones de Defender / Firewall](/es/troubleshooting/defender-exclusions).
