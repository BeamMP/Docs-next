---
description: "Redirige el puerto de BeamMP en el router de tu casa, paso a paso: fija una IP estática, inicia sesión en el router, crea la regla y compruébala con CheckBeamMP."
---
# Redirección de puertos

::: danger AVISO LEGAL:
**La redirección de puertos supone un riesgo**.

Al redirigir puertos, entiendes los riesgos de exponer puertos de tu red doméstica a internet y, por tanto, renuncias al derecho de exigir responsabilidades a BeamMP por **cualquier daño** que puedas sufrir tú o las personas de tu hogar.

No asumimos ninguna responsabilidad por el contenido de ningún servicio o sitio web enlazado externamente.

<u>**Si no entiendes esta guía, te recomendamos usar uno de nuestros socios.**</u>
:::

::: warning
Asegúrate de que tu router no sea un dispositivo exclusivamente 4G/5G. Si es un dispositivo híbrido, ¡asegúrate de seleccionar más adelante, en la sección 3 de esta guía, el adaptador conectado por cable!
:::

## Qué vas a hacer

Crear una regla de redirección de puertos implica algunos términos de red detallados. Prepárate para anotar algunas cosas a medida que avanzas en el proceso.

Esta guía tiene 4 pasos principales.

## Guía rápida

1. **Asigna una dirección IP estática a tu ordenador o dispositivos**

   Esto es necesario para evitar que la IP de tu dispositivo cambie y deje de funcionar la regla de redirección de puertos.

   [Consulta la información sobre tu router](https://portforward.com/router.htm#1)

2. **Inicia sesión en tu router**

   Normalmente puedes hacerlo averiguando la IP de la «puerta de enlace predeterminada» (Default Gateway), que aparece al ejecutar `ipconfig` en un símbolo del sistema, y escribiéndola en la barra de direcciones de un navegador web.

3. **Redirige los puertos a tu ordenador**

   Busca la sección de redirección de puertos en la interfaz web de tu router. La mayoría de los routers la ubican en Red, Avanzado o LAN.

4. **Comprueba que tu puerto está correctamente redirigido**

   Usa una herramienta como CheckBeamMP para comprobar si la regla funciona.

   <form action="https://check.beammp.com/api/v2/beammp" method="get" target="_blank">
    <label for="ip">Dirección IP:</label>
    <input type="text" id="ip" name="ip"><br>
    <label for="port">Puerto:</label>
    <input type="text" id="port" name="port"><br>
    <input type="submit" value="CheckBeamMP">
   </form>

## Guía detallada

### Asignar una dirección IP estática

#### Método 1: usar una reserva DHCP

Otra forma de establecer una dirección IP estática en tu red local es usar la función de reserva DHCP de tu router. No todos los routers tienen esta función, así que puede que no sea una opción para ti. Busca en internet el modelo de tu router para encontrar un manual. 

Si lo has conseguido, pasa directamente a [Iniciar sesión en tu router](#log-in-to-your-router)

#### Método 2: asignar una IP estática en Windows

##### Averiguar tu dirección IP actual, la puerta de enlace y los servidores DNS

Antes de poder configurar una dirección IP estática, necesitamos conocer tu configuración de red actual. 
Te conviene anotarla, así que ten a mano una ventana del Bloc de notas. 
Para este paso usaremos el símbolo del sistema.

Abre un símbolo del sistema. Las 3 formas principales son:

- Pulsa la tecla Windows, empieza a escribir «cmd» y pulsa Intro cuando veas resaltado «Símbolo del sistema».


<figure class="image image_resized" style="width:62%;">

![El menú Inicio de Windows con Símbolo del sistema resaltado](../../assets/content/win11-open-cmd.png)

</figure>

Una vez en el símbolo del sistema, ejecuta el siguiente comando:
```
ipconfig /all
```
Verás muchos datos.
Si tienes adaptadores de red virtuales o varios adaptadores, verás aún más datos. 
Es habitual ver muchos adaptadores virtuales si tienes instalado Hyper-V o Docker.

<figure class="image image_resized" style="width:62%;">

![El símbolo del sistema mostrando la salida de ipconfig, con la dirección IPv4, la máscara de subred, la puerta de enlace predeterminada y los servidores DNS resaltados](../../assets/content/win11-command-prompt-ipconfig-highlighted.png)

</figure>

Se recomienda usar una conexión de red por cable en el equipo que ejecutará este servidor, aunque también funcionará con una conexión inalámbrica.
Tendrás que buscar en esta lista un adaptador que tenga una conexión a internet activa. Recorre la lista y busca uno que tenga asignada una puerta de enlace predeterminada. 
Muchos de los adaptadores virtuales no tendrán puerta de enlace predeterminada. 

A continuación tienes ejemplos de direcciones IPv4 locales; al menos uno de los adaptadores debería tener una de ellas.
Tendrás que anotar la información de tu adaptador.

- 192.168.x.x
- 10.x.x.x.
- 172.16.x.x - 172.31.x.x

Máscara de subred (lo más probable es 255.255.255.0)
</br>
Puerta de enlace predeterminada (lo más probable es 192.168.0.1 o 192.168.1.1)

::: info Ten en cuenta
Actualmente BeamMP no es compatible con IPv6 para alojar un servidor. 
:::

##### Cambiar la configuración del adaptador

Ahora tenemos que cambiar la configuración de tu adaptador de red para que tu PC conserve la configuración IP que tiene actualmente. Para acceder a la configuración de tu red, el método más rápido es:

- Pulsa una vez la tecla Windows
- Escribe «conexiones de red» hasta que veas «Ver conexiones de red».
- Pulsa la tecla Intro


<figure class="image image_resized" style="width:62%;">

![El menú Inicio de Windows mostrando Ver conexiones de red](../../assets/content/win11-start-menu-view-network-connections.png)

</figure>

Deberías ver una lista de las conexiones de red de tu ordenador. 
Si tienes Hyper-V o Docker instalados, puede haber muchas. 
Busca los adaptadores cuyo nombre no sea «Hyper-V».

<figure class="image image_resized" style="width:62%;">

![La ventana Conexiones de red con el adaptador Ethernet](../../assets/content/win11-network-connections.png)

</figure>


Haz clic con el botón derecho en tu adaptador y elige Propiedades. Si `Internet Protocol Version 4` no está marcado, este no es el adaptador correcto. Elige otro.

<figure class="image image_resized" style="width:62%;">

![La ventana de propiedades de Ethernet con la entrada de IPv4 resaltada](../../assets/content/win11-ethernet-properties-highlighted.png)

</figure>

Haz doble clic en `Internet Protocol Version 4`. Cambia `Obtain an IP address automatically` por `Use the following IP address`.

Rellena la dirección IP, la máscara de subred, la puerta de enlace predeterminada y el servidor DNS preferido con la información del símbolo del sistema (ipconfig /all).

Como alternativa, en lugar de usar tus servidores DNS, puedes usar los de CloudFlare o Google:

- DNS de CloudFlare: 1.1.1.1, 1.0.0.1
- DNS de Google: 8.8.8.8, 8.8.4.4


<figure class="image image_resized" style="width:62%;">

![La ventana de propiedades de IPv4 con la dirección IP, la máscara de subred, la puerta de enlace predeterminada y los servidores DNS rellenados](../../assets/content/win11-network-settings-static-ip.png)

</figure>

Haz clic en Aceptar y de nuevo en Aceptar, y tu adaptador pasará de DHCP a estático. Navega por la web para comprobar que sigues teniendo conexión a internet. Si no es así, vuelve a poner la configuración en «Obtener una dirección IP automáticamente» e inténtalo con el siguiente método.

### Iniciar sesión en tu router {#log-in-to-your-router}

Ahora que tu dispositivo tiene una dirección IP estática, ¡ya puedes redirigir el puerto para BeamMP!

Para empezar, tenemos que iniciar sesión en tu router. Antes anotaste, entre otros ajustes, tu puerta de enlace predeterminada. Esa es la dirección IP de tu router.

La mayoría de los routers usan una página web alojada localmente para su administración. Para ver el menú y los ajustes de tu router:

- Abre un navegador web. Firefox, Chrome o Edge deberían funcionar bien.
- En la barra de direcciones, escribe la dirección IP de tu puerta de enlace predeterminada, como 192.168.0.1 o 192.168.1.1, y pulsa Intro

Ahora deberías ver la pantalla de inicio de sesión de tu router. No todos los routers piden iniciar sesión, pero la mayoría sí. Necesitas conocer el nombre de usuario y la contraseña de tu router. Si nunca has iniciado sesión, lo más probable es que tengan los valores de fábrica o, en algunos casos, que estén escritos en una etiqueta del router.

Aquí se enumeran algunos de los nombres de usuario y contraseñas de fábrica más comunes:

| Usuario     | Contraseña |
| ----------- | ---------- |
| admin       | admin      |
| admin       | password   |
| {vacío}     | admin      |
| {vacío}     | password   |

Prueba varias combinaciones de admin, password y dejando los campos vacíos. *Donde dice vacío, prueba a dejar el valor en blanco.* 

### Crear las reglas de redirección

#### Encontrar la sección de redirección

Busca la sección de redirección de puertos en la interfaz web de tu router. Navega por tu router haciendo clic en las pestañas o enlaces de la parte superior o izquierda de cada página. La mayoría de los routers ubican la sección de redirección de puertos en Red, Avanzado o LAN. Busca las siguientes palabras clave para ayudarte a encontrarla:

- Port Forwarding
- Forwarding
- Port Range Forwarding
- Virtual Servers
- Apps & Gaming
- Advanced Setup/Settings
- NAT

#### Introducir los datos

Cuando encuentres la sección de redirección de puertos de tu router, ya puedes introducir la información necesaria.
Tu router tendrá un lugar donde introducir los puertos que se van a redirigir y la dirección IP de destino a la que apuntarán esos puertos redirigidos. Si tu router muestra puertos internos y externos, haz que sean iguales. 

BeamMP necesita tanto el puerto UDP como el TCP 30814 (a menos que lo hayas cambiado en tu [ServerConfig.toml](/es/server-owners/host-a-server#configure-the-server)). 

::: info Nota
Aunque el **puerto** por defecto es el **30814**, puedes elegir cualquier otro número mayor que 1024 y menor que 65535, pero tienes que anotar el que elijas si no es el 30814\. Tienes que redirigir tanto **TCP** como **UDP**.
</br>
Se recomienda usar el puerto por defecto, ya que es muy poco probable que lo use otro servicio de tu PC.
</br>
Sin embargo, si alojas varios servidores en una misma máquina, cada servidor necesita un puerto distinto. Por ejemplo, servidor 1: 30814, servidor 2: 30815.
:::

En algunos routers puede que tengas que crear 2 reglas, una para UDP y otra para TCP, mientras que otros permiten hacer ambas con una sola regla.

La mayoría de los routers tienen un botón de «guardar», y algunos necesitan un reinicio para que los cambios surtan efecto.

### Probar el puerto

Hay varias formas de probar la conexión.

Nuestra forma recomendada es usar nuestra herramienta **CheckBeamMP**, ya que comprueba los problemas y protocolos específicos de BeamMP.

<form action="https://check.beammp.com/api/v2/beammp" method="get" target="_blank">
  <label for="ip">Dirección IP:</label>
  <input type="text" id="ip" name="ip"><br>
  <label for="port">Puerto:</label>
  <input type="text" id="port" name="port"><br>
  <input type="submit" value="CheckBeamMP">
</form>

Para ello hace falta tu dirección IPv4 pública, que, una vez más, se puede obtener de varias formas. La principal es usar un sitio web llamado [whatsmyip.org](https://whatsmyip.org/). Es un sitio web sencillo que muestra tu dirección IP pública. Debes buscar una dirección IP con el formato: xxx.xxx.xxx.xxx

Visita el siguiente enlace y sustituye «IP» por tu dirección IPv4 real y «Port» por el puerto de tu servidor. Asegúrate de no dejar espacios.
https://check.beammp.com/api/v2/beammp/ip/port

::: success status: ok
¡Si obtienes la salida de arriba, ya puedes unirte a tu servidor!
Hay 2 formas de unirse: directamente, con los datos que introdujiste en CheckBeamMP, o, si tu servidor está configurado como «public», a través de la lista de servidores.
Como estás alojando un servidor en local, usa 127.0.0.1 (localhost) si el servidor se ejecuta en el mismo PC en el que juegas, o la IPv4 LAN de la máquina local que ejecuta el servidor.
:::

::: failure status: error
Si la conexión falla por completo, es posible que tu ISP esté usando CGNAT (Carrier Grade Network Address Translation). Para más detalles, consulta [Comprobar CGNAT](/es/server-owners/cgnat),
  o abre un ticket de Server Support en nuestro [servidor de Discord](https://discord.gg/beammp), en el canal `#support`, y un miembro de nuestro equipo atenderá tu ticket.
  Si solo ves que TCP funciona y UDP falla, vuelve a revisar el firewall y las reglas de redirección de puertos.
:::
