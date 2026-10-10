---
description: "Soluciona problemas de conexión de BeamMP: averigua la IP de tu servidor, comprueba con CheckBeamMP que tu puerto está abierto y mira si hay CGNAT."
---
# Problemas de conexión / red

Usa esta página cuando tú o tus jugadores no podáis conectaros a un servidor de BeamMP.

## Averiguar la dirección IP de tu servidor

### Un servidor en una empresa de alojamiento

La dirección IP aparece en la interfaz de gestión del servidor de la empresa de alojamiento.

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

## Puertos y direcciones que usa el Launcher

Si usas un firewall estricto o un proxy, permite estas conexiones para el Launcher:

| Puerto | Protocolo | Conecta | Se usa para |
|---|---|---|---|
| `4444` | TCP | El juego con el Launcher, en tu ordenador | La lista de servidores, el inicio de sesión y las solicitudes para unirse. Se establece con `Port` en `Launcher.cfg` |
| `4445` (`Port` + 1) | TCP | El juego con el Launcher, en tu ordenador | Datos del juego mientras estás en un servidor |
| Un puerto libre elegido al iniciarse | TCP (HTTP) | El juego con el Launcher, en `127.0.0.1` | Solicitudes a `backend.beammp.com` y `forum.beammp.com` para los menús del juego |
| El puerto del servidor (`30814`, salvo que el propietario lo haya cambiado) | TCP y UDP | El Launcher con el servidor | Unirse, descargar mods y jugar |
| `443` | HTTPS | El Launcher con `backend.beammp.com`, `auth.beammp.com` y `forum.beammp.com` | Actualizaciones, la lista de servidores y el inicio de sesión |

No tienes que redirigir los puertos `4444` y `4445`. Son solo para el juego y el Launcher en el mismo ordenador. El puerto del servidor debe ser accesible tanto por TCP como por UDP.

## Otros problemas de conexión

- El Launcher muestra los códigos de error 10060 o 10061, o en Linux `Error code: 110` o `111`: consulta [Códigos de error](/es/troubleshooting/error-codes).
- El Launcher no se conecta al juego: consulta [Cambiar el puerto del Launcher](/es/troubleshooting/launcher-port).
- Puede que un firewall o antivirus esté bloqueando BeamMP: consulta [Exclusiones de Defender / Firewall](/es/troubleshooting/defender-exclusions).
