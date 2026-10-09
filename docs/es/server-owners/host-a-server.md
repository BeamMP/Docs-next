# Instalación del servidor

## **Crear un servidor**
Conceptos básicos para configurar la aplicación del servidor
Esta guía cubre toda la configuración necesaria para alojar un servidor **en casa**.
Para una guía de inicio rápido de tu servidor alojado en un VPS, visita [Cómo crear un servidor](https://docs.beammp.com/server/setup-vps/)

---
### **Resumen**

**Crear un servidor doméstico es gratis; alojarlo en un VPS es más fácil y más seguro**

Los servidores son una parte fundamental de BeamMP: los jugadores se conectan entre sí a través del servidor. Funcionan de forma nativa en Windows y Linux.

Puedes crear servidores privados, a los que solo pueden unirse las personas que invites, o servidores públicos, que aparecerán en nuestra lista oficial de servidores.

¡Poner en marcha un servidor es un proceso de unos pocos pasos! Si tienes algún problema, no dudes en preguntar en nuestro [foro](https://forum.beammp.com) o en nuestro [servidor de Discord](https://discord.gg/beammp), en el canal `#support`. Consulta también la sección de [Mantenimiento del servidor](/es/server-owners/maintenance) para más información.

Asegúrate de leer la [LICENSE](https://raw.githubusercontent.com/BeamMP/BeamMP-Server/master/LICENSE) del servidor antes de usarlo.

Nota: _El servidor solo es compatible con IPv4\. Si no sabes cuál tienes, mira la dirección IP que aparece en [_whatsmyip.org_](https://www.whatsmyip.org/): si contiene_ `_:_` _dos puntos, es **IPv6**. En ese caso, deberías investigar si también dispones de una IPv4\. Puedes llamar a tu proveedor de internet para averiguarlo o preguntar a alguien que viva contigo (si tiene conocimientos técnicos, ¡quizá lo sepa!). Está previsto añadir compatibilidad con IPv6._

## Configurar el servidor

La configuración consta de los siguientes pasos; debes seguirlos todos.

### **1. Redirección de puertos** {#1-port-forwarding}

:::: info
Si usas un VPS (servidor privado virtual) o un servidor dedicado (Rootserver), o si piensas alojar este servidor en local (con jugadores en la misma casa que tú), puedes omitir este paso.
Este paso es necesario si quieres que alguien **ajeno** a tu hogar (fuera de tu red local) se una a tu servidor alojado en casa.

::: danger AVISO LEGAL:
**La redirección de puertos supone un riesgo**.

Al redirigir puertos, entiendes los riesgos de exponer puertos de tu red doméstica a internet y, por tanto, renuncias al derecho de exigir responsabilidades a BeamMP por **cualquier daño** que puedas sufrir tú o las personas de tu hogar.

No asumimos ninguna responsabilidad por el contenido de ningún servicio o sitio web enlazado externamente.
:::

¡Por ello, se recomienda alojar el servidor con uno de nuestros servicios asociados!

*Consulta [esta guía sobre cómo redirigir puertos](port-forwarding.md)*
::::

#### Servicios de alojamiento asociados (de pago): {#partnered-hosting-services-paid}

* [Horizon Hosting](https://hrzn.link/beammp)
* [RackGenius](https://rackgeni.us/beammp-plans)
* [Connect Hosting](https://connecthosting.net/beammp)
* [Assetto Hosting](https://assettohosting.com/en/games/beamng)
* [ZAP-Hosting](https://zap-hosting.com/itsbeammp)
* [HostHavoc](https://hosthavoc.com/)
* [PedalHost](https://pedal.host/)
* [Vyper Hosting](https://vyperhosting.com/r/beammp)
* [BisectHosting](https://www.bisecthosting.com/beammp-server-hosting)
* [Four Seasons Hosting](https://fourseasonshosting.com)
* [Vertuo Hosting](https://vertuohosting.com)
* [Winheberg](https://winheberg.fr/offres/gaming/beammp?lang=en)
* [Wabbanode](https://wabbanode.com/partner/beammp)
* [Iceline Hosting](https://iceline-hosting.com/games/beammp)


#### 1.1 Firewall

Dependiendo de tu configuración, puede que tengas que permitir BeamMP-Server a través de tu firewall. Es el caso de Windows (desactivar el firewall normalmente **no** funciona) y de muchos servidores Linux preinstalados. 

Ahí debes permitir BeamMP-Server a través del firewall, **tanto para conexiones entrantes como salientes** y **tanto para TCP como para UDP**. Si tu firewall te pide un puerto en lugar de un programa, tendrá que ser el mismo puerto que usaste en el paso “1\. Redirección de puertos” (normalmente el 30814).

Para una guía más detallada, consulta [esta página de documentación](https://docs.beammp.com/FAQ/Defender-exclusions/).
Si tienes problemas, no dudes en preguntar en nuestro [foro](https://forum.beammp.com) o en nuestro [servidor de Discord](https://discord.gg/beammp), en el canal `#support`.

### **2. Obtener una clave de autenticación**

La “clave de autenticación” (Authentication Key), a menudo llamada “AuthKey”, es necesaria para que un servidor **público** sea accesible desde la lista de servidores. Aun así, se recomienda añadir la AuthKey también a los servidores privados.
El número de claves es limitado. Una clave solo puede usarse en un servidor a la vez, por lo que no puedes iniciar dos servidores al mismo tiempo con la misma clave.
Puedes obtener más claves apoyando el proyecto. Lee [este artículo](https://docs.beammp.com/FAQ/player-faq/) para más información.

::: warning
NUNCA COMPARTAS ESTA CLAVE NI SE LA ENSEÑES A NADIE. TRÁTALA COMO SI FUERA UNA CONTRASEÑA.
:::

Necesitarás una cuenta de [Discord](https://discord.com) para este paso. Esto es necesario para evitar el spam.

#### 2.1. Acceder a la página de claves

Inicia sesión con Discord en el [Keymaster](https://keymaster.beammp.com).
En la página principal del Keymaster, haz clic en "Keys" a la izquierda de la pantalla:

<figure>

  ![](../../assets/content/keymaster_homepage.png)

</figure>

#### 2.2. Crear una clave

Para crear tu clave, haz clic en el botón verde "+" de la esquina superior derecha. 

<figure>

  ![](../../assets/content/keymaster_new_key.png)

</figure>

#### 2.3. Rellenar la información de la clave

A continuación, rellena el campo Server Name (es solo el nombre de la clave, no el nombre real del servidor en la lista) y haz clic en "Create". Ejemplo:

<figure class="image image_resized" style="width:44.84%;">

  ![](../../assets/content/keymaster_server_name.png)

</figure>

Al final, debería tener un aspecto similar a este:

<figure>

  ![](../../assets/content/keymaster_key_done.png)

</figure>

#### 2.4. Copiar la clave

Ahora copia el texto del campo “Key”, que en este ejemplo es `3173a2e-6az0-4542-a3p0-ddqq5ff95558`, y guárdalo para el siguiente paso. Puedes hacerlo haciendo clic en el icono del portapapeles que hay a la derecha de la clave:

<figure>

  ![](../../assets/content/keymaster_copy_key.png)

</figure>

### **3. Instalación**

BeamMP-Server está disponible para Windows y Linux. Las dos secciones siguientes están dedicadas a Windows y a Linux respectivamente. 

#### 3.a. Instalación en Windows

Para la instalación en Linux, consulta el siguiente paso.

¡Asegúrate de haber redirigido los puertos antes de intentar alojar un servidor en casa! Si no tienes los puertos redirigidos, no podrás alojar un servidor para el público.

1. Asegúrate de haber instalado los [Visual C++ Redistributables](https://aka.ms/vs/17/release/vc_redist.x64.exe) para poder ejecutar el servidor.
2. Descarga el ejecutable del servidor desde [beammp.com](https://www.beammp.com/). Deberías obtener un archivo ejecutable llamado algo como `BeamMP-Server.exe`.
3. Una vez descargado, crea una carpeta en algún lugar y coloca ahí el archivo `BeamMP-Server.exe`. Ahí vivirá tu servidor.
4. Inicia el servidor una vez haciendo doble clic en él. Esto generará todos los archivos necesarios; cuando veas texto, puedes cerrarlo y pasar al siguiente paso. Deberías ver un archivo `ServerConfig.toml` junto a tu `BeamMP-Server.exe`.
5. (opcional) Para tener un acceso rápido en el futuro, puedes crear fácilmente un acceso directo en el escritorio a `BeamMP-Server.exe` mediante **[clic derecho]** > **Enviar a** > **Escritorio (crear acceso directo).**

Ahora continúa con el paso [4. Configuración](#4-configuration).

#### 3.b. Instalación en Linux

##### Usando nuestra compilación (recomendado)

Este paso funciona en todas las distribuciones para las que proporcionamos binarios [aquí](https://github.com/BeamMP/BeamMP-Server/releases/latest). Si usas una distribución o arquitectura diferente, consulta el paso “Compilar desde el código fuente” más abajo.

1. Asegúrate de tener instaladas las dependencias que se indican [aquí](https://github.com/BeamMP/BeamMP-Server#runtime-dependencies).
2. Ve a [beammp.com](https://beammp.com/) y haz clic en el botón “Download Server”; se te redirigirá a la página de versiones de GitHub del servidor.
3. Descarga la versión correcta para tu distribución. Para simplificar, a partir de ahora la llamaremos `BeamMP-Server-xxx`, donde `xxx` indica la versión de la distribución que uses.
4. Una vez descargado, deberías ver un archivo llamado `BeamMP-Server-xxx`, entre otros que puedes ignorar por ahora. Crea una carpeta en algún lugar y coloca ahí el archivo `BeamMP-Server-xxx`. Ahí vivirá tu servidor.
5. Abre una terminal, ve a la carpeta donde pusiste `BeamMP-Server-xxx` y ejecuta `chmod +x BeamMP-Server-xxx`. Esto garantiza que tienes permisos para ejecutarlo.
6. Inicia el servidor una vez ejecutándolo con `./BeamMP-Server-xxx`. Esto generará todos los archivos necesarios; cuando veas texto, puedes cerrarlo y pasar al siguiente paso. Deberías ver un archivo `ServerConfig.toml` junto a tu `BeamMP-Server-xxx`.
7. (opcional) Se recomienda encarecidamente crear un usuario llamado `beammpserver` (o similar), ya que NO recomendamos ejecutar el servidor como root, con sudo ni con tu cuenta de usuario personal. Después deberías tomar medidas para asegurarte de iniciar el servidor únicamente con ese usuario.

Ahora continúa con el paso "4\. Configuración".

##### Compilar desde el código fuente

Es probable que otras distribuciones, además de las que ya tienen un binario [aquí](https://github.com/BeamMP/BeamMP-Server/releases/latest), también funcionen, pero no cuentan con soporte oficial. Si quieres compilarlo tú mismo, puedes hacerlo descargando el código fuente desde nuestro [GitHub](https://github.com/BeamMP/BeamMP-Server); encontrarás un tutorial [aquí](https://github.com/BeamMP/BeamMP-Server#build-instructions).

Al terminar, asegúrate de ejecutar tu servidor una vez con `./BeamMP-Server` y después continúa con el siguiente paso.

### **4. Configuración** {#4-configuration}

Ahora que has ejecutado el servidor una vez, debería haber creado algunos archivos y probablemente haber mostrado un par de errores. Esto es porque todavía no hemos terminado. Tu carpeta debería contener estos archivos:

<figure>

  ![](../../assets/content/after-running-once.png)

</figure>

Se llaman “ServerConfig.toml”, “Server.log” y “BeamMP-Server.exe”. (Dependiendo de tus ajustes, puede que no veas las extensiones [.toml] [.log] [.exe]).

Abre `ServerConfig.toml` con un editor de texto como el `Bloc de notas`. Puedes hacerlo con [clic derecho] → “Abrir con…” y seleccionando un editor de texto.

Este es un ejemplo de configuración:
```TOML
[General]
Port = 30814
AuthKey = "auth-key"
AllowGuests = false
LogChat = false
Debug = false
IP = "::"
Private = true
InformationPacket = true
Name = "Test Server"
Tags = "Freeroam,Modded,Racing,Police"
MaxCars = 2
MaxPlayers = 10
Map = "/levels/ks_nord/info.json"
Description = "Total Random Beam MP Server"
ResourceFolder = "Resources"
```
::: info
Este es tu archivo de configuración. Usa un formato llamado TOML. Consulta la sección de [Mantenimiento del servidor](/es/server-owners/maintenance) para más información sobre este archivo y sus variables.
Tu servidor **NO** aparecerá en la lista de servidores mientras `Private = true`. _Si_ quieres que aparezca en la lista, cámbialo a **`Private = false`**.
:::

Por ahora, solo nos interesa el campo `AuthKey`. Entre las comillas `''`, pega la AuthKey que copiaste en el primer paso.

Para nuestra clave de ejemplo, debería quedar así:
```TOML
AuthKey = '3173a2e-6az0-4542-a3p0-ddqq5ff95558'
```
Ponle también un nombre a tu servidor en el campo `Name`. Puedes darle formato con colores y más; consulta [esta sección sobre la personalización del nombre](/es/server-owners/maintenance#customize-the-look-of-your-server-name) en la página de mantenimiento del servidor.

Si elegiste un **puerto** distinto del **30814**, asegúrate de cambiarlo aquí, en `Port`.

#### **4.1. Validación**

Ahora ejecuta de nuevo tu servidor y comprueba si muestra más mensajes `[ERROR]` o `[WARN]`. El servidor debería permanecer abierto ahora. En los siguientes pasos (6.) puedes ver cómo unirte al servidor.

---

### 5. Cómo añadir mods a tu servidor

Los mods de vehículos y los de mapas se instalan de forma distinta, pero en ambos casos debes colocarlos en la carpeta (`Resources/Client`) de tu servidor. Simplemente mueve a esa carpeta cualquier mod que quieras añadir.

::: warning
Los mods pueden ser o volverse incompatibles con BeamNG, con BeamMP o incluso con otros mods. Si tienes problemas, empieza a quitar mods.
Si recibes un mensaje de "done" o "start" al intentar unirte a tu servidor después de añadir mods, es probable que hayas añadido un mod incompatible o dañado.
También pueden producirse incompatibilidades entre 2 o más mods. Si tienes mods de cliente instalados, consulta [esta guía](/es/players/mod-safety) sobre cómo eliminar mods de tu juego.
:::

#### 5.1 Mods generales

Si solo querías añadir vehículos modificados, simplemente coloca el archivo zip del mod en la carpeta `Resources/Client`. Cualquiera que se una a tu servidor los descargará automáticamente.

#### 5.2 Mapas

Todos los mapas predeterminados (los que no son mods) funcionan directamente y no hace falta instalarlos. Solo tienes que cambiar el ajuste `Map` del archivo `ServerConfig.toml` por cualquiera de [estos](/es/server-owners/maintenance#all-vanilla-maps-names). Para cualquier otro mapa con mods, haz lo siguiente:

1.  Coloca el archivo `.zip` de tu mapa en la carpeta (`Resources/Client`) de tu servidor.
2.  A continuación, echa un vistazo dentro del zip del mapa (sin extraerlo) y abre la carpeta `levels`. Dentro de esta carpeta debería haber simplemente otra carpeta con el nombre del mapa, por ejemplo “myawesomedriftmap2021”. Asegúrate de copiar o recordar este nombre _exactamente como está escrito en el nombre de esa carpeta._
3.  Abre tu `ServerConfig.toml`. En el ajuste `Map` deberías ver `/levels/MAPNAME/info.json`, donde `MAPNAME` probablemente sea algo como `gridmap_v2`. Ahora tienes que sustituir este `MAPNAME` por el nombre de la carpeta del paso anterior; en ese ejemplo era `myawesomedriftmap2021`. Al final debería verse así (para este ejemplo) y _**debería**_ terminar con `/info.json`.
```TOML
Map = '/levels/myawesomedriftmap2021/info.json'
```
Ahora, cuando alguien se una a tu servidor, debería descargar el mapa automáticamente y funcionar como se espera. 

**Si esto NO funciona**, instala el mapa en tu BeamNG.drive en modo de un jugador, inícialo y entra en el mapa. Después, abre la consola pulsando la tecla `~` (_tilde_) (si tienes un teclado que no es de EE. UU., busca la acción **Toggle System Console** en el menú **Options > Controls > Bindings**, dentro de la sección **General Debug**) y ejecuta `print(getMissionFilename())`. Esto te mostrará el nombre que debes usar. 

¡Eso es todo! ¡Tu mapa con mods ya debería estar disponible para unirse!

#### 5.4 Proteger mods contra la descarga (mods de pago/privados)

¡Ahora puedes proteger mods! Esto te permite alojar un servidor con contenido protegido o restringido sin redistribuir realmente ese contenido. 
Es ideal si tienes lo que suele llamarse "mods de pago" o si eres creador de mods y quieres limitar el acceso a tu trabajo más reciente.
Simplemente ejecuta `protectmod <filename with .zip> <true/false>` en la consola del servidor para proteger un mod. Los usuarios que se unan a un servidor con mods protegidos tendrán que obtener el archivo por su cuenta de otra fuente, como directamente del creador o a través de plataformas como Patreon. Una vez obtenido, deben colocarlo en la carpeta de recursos de su launcher. 
El launcher informará de ello al usuario si falta el archivo; además, el usuario verá una notificación en el juego que muestra el archivo que falta y cómo solucionarlo.

### **6. Cómo unirse a tu servidor**

Cómo pueden unirse tú y otros jugadores a tu servidor.

#### 6.a. Unirte a tu propio servidor (tanto privado como público)

Si tu servidor está alojado en el mismo PC en el que se ejecuta el juego, debes unirte mediante conexión directa: para ello, haz clic en la **pestaña Direct Connect** a la izquierda de la lista de servidores. Deja la información que aparece por defecto (debería ser 127.0.0.1 y el puerto correspondiente) y pulsa conectar.

Si tu servidor está alojado en otro PC de tu red local, debes averiguar la IP local de esa máquina y conectarte directamente usando esa IP local.

Si tu servidor está alojado fuera de tu casa (por ejemplo, en un VPS), debes averiguar la IP pública de esa máquina y conectarte directamente de esa forma.

#### 6.b. Otras personas uniéndose a tu servidor privado

Debes darles a los demás usuarios la dirección IP pública de tu servidor. Sin embargo, ¡ten cuidado al compartir tu dirección IP pública con desconocidos! Para unirse a tu servidor privado, los jugadores deben ir a la **pestaña Direct Connect** de BeamMP y escribir tu IP y puerto.

#### 6.c. Otras personas uniéndose a tu servidor público

Para unirse a tu servidor público, simplemente pueden ir a la lista de servidores, escribir el nombre del servidor y hacer clic en conectar. Si no estás seguro de cuál es el nombre de tu servidor, es el que pusiste en `ServerConfig.toml`.
Asegúrate de que los filtros de búsqueda estén desactivados y de que el mapa esté en "Any" si no lo encuentras.
También puedes consultar el sitio web del [Keymaster](https://keymaster.beammp.com/) para ver la dirección IP del servidor.

Si tú o tus amigos reciben el error "Connection Failed!", comprueba la ventana del launcher para ver códigos como 10060, 10061 o 10030.
Esto significa que tienes una IPv4 con CGNAT o que has hecho algo mal durante el paso **1 Redirección de puertos** o **1.1. Firewall**.
Para comprobar si tienes una IPv4 con CGNAT, busca la dirección IP WAN en la interfaz de tu router. Compárala con tu [IP pública](https://www.whatsmyip.org/). Si coinciden, no estás detrás de un CGNAT.
La compatibilidad con IPv6 **NO** está implementada todavía.

### **7. Cómo comprobar la conectividad de tu BeamMP-Server**

Introduce a continuación la IPv4 pública y el puerto del servidor y haz clic en "CheckBeamMP".
<form action="https://check.beammp.com/api/v2/beammp" method="get" target="_blank">
  <label for="ip">Dirección IP:</label>
  <input type="text" id="ip" name="ip"><br>
  <label for="port">Puerto:</label>
  <input type="text" id="port" name="port"><br>
  <input type="submit" value="CheckBeamMP">
</form>

:::: warning Quiero usar una VPN como RadminVPN, Hamachi o similar.
BeamMP no es compatible con estas VPN, ya que a menudo causan problemas. Uno de ellos es que no se reenvía el tráfico UDP. Para resolverlo, consulta la sección 1.

::: question Pero ¿por qué ha funcionado en el pasado?
Esto se debe a que los desarrolladores de estas aplicaciones actualizan su software e implementan cambios sobre los que BeamMP no tiene ningún control.
Les corresponde a los desarrolladores de estas aplicaciones ofrecer soporte para casos de uso específicos como un BeamMP-Server.
:::
::::

## ¿Sigues teniendo problemas?

Abre un hilo en el [foro](https://forum.beammp.com) o crea un **Server Support Ticket** en nuestro [servidor de Discord](https://discord.gg/beammp), en el canal `#support`.
