---
description: "Respuestas a las dudas habituales sobre los servidores de BeamMP: cómo montar uno, Linux, requisitos del sistema, jugadores que no pueden unirse y cómo informar de errores o de una AuthKey comprometida."
---
# Preguntas frecuentes del servidor

Preguntas habituales y problemas conocidos sobre cómo ejecutar un servidor de BeamMP.

## Configuración

### ¿Cómo puedo configurar mi propio servidor?

Todo lo que necesitas está en [Alojar un servidor](/es/server-owners/host-a-server), o en [Configuración del servidor en un VPS](/es/server-owners/setup-vps) si usas una empresa de alojamiento.

### ¿Se puede ejecutar un servidor en Linux?

Sí. Ofrecemos binarios para muchas distribuciones de Linux en la [página de la última versión](https://github.com/BeamMP/BeamMP-Server/releases/latest). Si no hay ninguno para tu distribución, puedes compilarlo a partir del código fuente en [GitHub](https://github.com/BeamMP/BeamMP-Server). Las [instrucciones de compilación](https://github.com/BeamMP/BeamMP-Server#build-instructions) explican cómo.

### ¿Cuáles son los requisitos mínimos del sistema?

| | Requisito |
|---|---|
| RAM | 50 MiB o más utilizables, sin contar el sistema operativo |
| CPU | Más de 1 GHz, preferiblemente multinúcleo |
| SO | Windows o Linux (en teoría, cualquier sistema POSIX) |
| GPU | Ninguna |
| Disco | 10 MiB más los mods y plugins |
| Ancho de banda | 5-10 Mb/s de subida |

## Los jugadores no pueden unirse

### Los jugadores ajenos a mi red no pueden unirse a mi servidor autoalojado

Si otros jugadores reciben el código de error 10060, 10061 o 10038 en su Launcher, comprueba lo siguiente. La guía completa es [Redirección de puertos](/es/server-owners/port-forwarding).

- Redirige el puerto 30814, o el que hayas configurado en `ServerConfig.toml`, tanto para TCP como para UDP.
- Permite BeamMP a través del Firewall de Windows, tanto para conexiones entrantes como salientes. Desactivar el firewall normalmente **no** funciona.
- Asegúrate de que no estás usando una VPN. Puede causar problemas.
- Asegúrate de que el servidor está en ejecución, sin errores ni advertencias.

Mientras el servidor está en ejecución, puedes comprobar si el puerto está redirigido con CheckBeamMP:

<form action="https://check.beammp.com/api/v2/beammp" method="get" target="_blank">
  <label for="ip">Dirección IP:</label>
  <input type="text" id="ip" name="ip"><br>
  <label for="port">Puerto:</label>
  <input type="text" id="port" name="port"><br>
  <input type="submit" value="CheckBeamMP">
</form>

Algunos proveedores de internet no ofrecen una dirección IPv4 dedicada (CGNAT), así que puede que la redirección de puertos no funcione aunque tu router la ofrezca. Consulta [Comprobar CGNAT](/es/server-owners/cgnat). No es posible redirigir puertos con una conexión móvil (4G o 5G).

### Veo mi servidor en la lista, pero yo no puedo unirme

Si el servidor se ejecuta en el mismo ordenador que el juego, únete con **Direct Connect**, usando la dirección IP `127.0.0.1` y el puerto de tu servidor.

Para unirte a tu propio servidor autoalojado a través de la lista de servidores, tu router tiene que ser compatible con NAT loopback. No muchos routers domésticos lo son.

## Otras preguntas

<!--@include: ../_parts/faq-code-and-bugs.md-->

### ¿Cuántas AuthKeys puedo tener y cómo consigo más?

De forma predeterminada, una cuenta puede tener 2 AuthKeys. Los niveles de Patreon y el impulso («boost») del servidor de Discord de BeamMP añaden más. **Keymaster**, en [BeamMP Accounts](https://accounts.beammp.com), muestra cuántas claves has usado y de dónde viene cada clave adicional. Los pasos están en [Conseguir una AuthKey](/es/server-owners/host-a-server#get-an-authkey).

### Mi AuthKey se ha visto comprometida, ¿qué debo hacer?

Rota la clave en **Keymaster**. La clave antigua deja de funcionar al instante. Pon la clave nueva en tu `ServerConfig.toml` y reinicia el servidor. Los pasos están en [Conseguir una AuthKey](/es/server-owners/host-a-server#get-an-authkey).

Si no puedes rotar la clave tú mismo, por ejemplo porque no puedes iniciar sesión en BeamMP Accounts, crea un ticket de **Account Support** en [Discord](https://discord.gg/beammp).
