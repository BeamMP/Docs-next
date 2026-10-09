# Preguntas frecuentes y problemas conocidos
Lista de preguntas habituales y errores conocidos.

---
## **Servidor**

---
### **¿Cómo puedo configurar mi propio servidor?**

Toda la información para configurar tu propio servidor se encuentra [aquí](https://docs.beammp.com/server/create-a-server/).

---
### **¿Se puede crear un servidor con Linux?**

Ofrecemos binarios para muchas distribuciones de Linux [aquí](https://github.com/BeamMP/BeamMP-Server/releases/latest). 
Si no hay binarios para tu sistema operativo o distribución, puedes compilarlo tú mismo descargando el código fuente desde nuestro [GitHub](https://github.com/BeamMP/BeamMP-Server); encontrarás un tutorial [aquí](https://github.com/BeamMP/BeamMP-Server#build-instructions).

---
### **¿Cuáles son los requisitos mínimos del sistema para ejecutar un servidor de BeamMP?**

- RAM: más de 50 MiB utilizables (sin contar lo que consume el sistema operativo)
- CPU: >1 GHz, preferiblemente multinúcleo
- SO: Windows, Linux (en teoría cualquier sistema POSIX)
- GPU: ninguna
- Disco: 10 MiB + mods/plugins
- Ancho de banda: 5-10 Mb/s de subida

---
## **Los jugadores ajenos a mi red no pueden unirse a mi servidor autoalojado**

Lee la guía de redirección de puertos, disponible [aquí](https://docs.beammp.com/server/port-forwarding/). A continuación tienes un breve resumen de los pasos más importantes.
Si otros jugadores que intentan conectarse a tu servidor reciben el código de error 10060, 10061 o 10038 en su launcher de BeamMP, deberías revisar lo siguiente:

- Redirige el puerto 30814 (o el que hayas configurado en tu ServerConfig.toml), tanto para el protocolo TCP como para UDP.
- Permite BeamMP a través del Firewall de Windows, tanto para conexiones entrantes como salientes. Desactivar el firewall normalmente NO funciona.
- Asegúrate de que no estás usando una VPN (puede causar problemas).
- Asegúrate de que el servidor está realmente en ejecución, sin errores ni advertencias.

Puedes comprobar si has redirigido los puertos correctamente con CheckBeamMP mientras el servidor está en ejecución.

<form action="https://check.beammp.com/api/v2/beammp" method="get" target="_blank">
  <label for="ip">Dirección IP:</label>
  <input type="text" id="ip" name="ip"><br>
  <label for="port">Puerto:</label>
  <input type="text" id="port" name="port"><br>
  <input type="submit" value="CheckBeamMP">
</form>

Notas:

- Algunos proveedores de internet no ofrecen direcciones IPv4 dedicadas a tu conexión (CGNAT), por lo que puede que no sea posible redirigir puertos, aunque la opción esté disponible en el router.
- No es posible redirigir puertos si usas una conexión a internet móvil (4G/5G).

---
### **Veo mi servidor autoalojado en la lista de servidores, pero yo no puedo unirme**

Si el servidor se ejecuta en el mismo equipo que el juego, tú tienes que unirte mediante Conexión directa, con la IP 127.0.0.1 y el puerto de tu servidor.
Para poder unirte a tu propio servidor autoalojado desde la lista de servidores, tu router tiene que ser compatible con NAT loopback, una función que no muchos routers domésticos admiten.

---
## **Varios**

---
### **¿Dónde puedo encontrar el código?**

Todo el código fuente está disponible en nuestro [GitHub](https://github.com/BeamMP).
Antes de hacer nada, ten en cuenta que el código está sujeto a nuestros [Términos de uso](https://forum.beammp.com/t/terms-of-use-v1-0/43) y a las siguientes licencias:

|   Código   | Licencia                                                                   |
|------------|:--------------------------------------------------------------------------:|
| Servidor   | [LICENSE](https://github.com/BeamMP/BeamMP-Server/blob/master/LICENSE)     |
| Launcher   | [LICENSE](https://github.com/BeamMP/BeamMP-Launcher/blob/master/README.md) |
| Lua del cliente | [LICENSE](https://github.com/BeamMP/BeamMP/blob/development/LICENSE.md) |

---
### **He encontrado un error o una vulnerabilidad, ¿qué debo hacer?**

Si el problema está relacionado con el código y sabes usar GitHub, crea un nuevo "Issue" en el repositorio correspondiente de nuestro [GitHub](https://github.com/BeamMP). Usamos un flujo de trabajo basado en issues, así que, aunque ya tengas una solución para el error, te recomendamos abrir un nuevo "Issue" y después enviar un "Pull Request" que lo resuelva. Encontrarás más información sobre cómo contribuir [aquí](https://github.com/BeamMP/BeamMP/blob/development/CONTRIBUTING.md).

Si no tienes una cuenta de GitHub o no sabes usarlo, puedes ponerte en contacto con nosotros de las siguientes maneras:

- Si no se trata de algo sensible, puedes crear una publicación en nuestro [foro de BeamMP](https://forum.beammp.com) o informar de ello en nuestro [Discord oficial](https://discord.gg/beammp).
- Si la información es sensible, puedes informar directamente a un miembro del Staff en nuestro [Discord](https://discord.gg/beammp).

---

### **Mi AuthKey se ha visto comprometida, ¿qué debo hacer?**

Si crees que una de tus AuthKeys se ha visto comprometida, crea un ticket de **Account Support** a través de nuestro [Discord](https://discord.gg/beammp).
