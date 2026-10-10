---
description: "Aloja un servidor de BeamMP en casa: redirige el puerto, permite el servidor en tu firewall, consigue una AuthKey, instálalo y configúralo, añade mods y deja que se unan jugadores."
---
# Alojar un servidor

Esta guía explica cómo alojar un servidor de BeamMP en casa, en tu propio ordenador con Windows o Linux. Si usas una empresa de alojamiento o un VPS con un panel de gestión, sigue en su lugar [Configuración del servidor en un VPS](/es/server-owners/setup-vps). Un servidor en casa es gratis. Un VPS es más fácil y más seguro.

## Antes de empezar

Los servidores son una parte fundamental de BeamMP: los jugadores se conectan entre sí a través del servidor. Puedes crear un servidor privado, al que solo pueden unirse las personas que invites, o un servidor público, que aparece en la lista oficial de servidores.

Lee la [LICENSE](https://raw.githubusercontent.com/BeamMP/BeamMP-Server/master/LICENSE) del servidor antes de usarlo.

El servidor solo admite IPv4. Si no sabes cuál tienes, mira la dirección IP que aparece en [whatsmyip.org](https://www.whatsmyip.org/). Si contiene dos puntos, es IPv6. En ese caso, averigua si también tienes una IPv4, preguntándoselo a tu proveedor de internet o a alguien que sepa de redes. Está previsto añadir compatibilidad con IPv6.

Si tienes problemas, pregunta en el [foro](https://forum.beammp.com) o en el canal `#support` del [servidor de Discord](https://discord.gg/beammp). [Configuración del servidor](/es/server-owners/configuration) tiene más detalles sobre los ajustes del servidor.

## Redirigir el puerto {#forward-the-port}

Los jugadores que estén fuera de tu casa solo podrán unirse a tu servidor alojado en casa si rediriges un puerto en tu router. Omite este paso si usas un VPS o un servidor root, o si todos los que juegan están dentro de tu propia casa (tu red local).

::: danger La redirección de puertos supone un riesgo
Al redirigir puertos, entiendes los riesgos de exponer puertos de tu red doméstica a internet y, por tanto, renuncias al derecho de exigir responsabilidades a BeamMP por cualquier daño que puedas sufrir tú o las personas de tu hogar.

No asumimos ninguna responsabilidad por el contenido de ningún servicio o sitio web enlazado externamente.
:::

Alojar con uno de nuestros servicios asociados evita este riesgo. Para redirigir un puerto tú mismo, sigue la [guía de redirección de puertos](/es/server-owners/port-forwarding).

## Servicios de alojamiento asociados {#partnered-hosting-services}

Estos servicios son de pago:

<!--@include: ./_parts/partners.md-->

## Permitir el servidor en tu firewall {#allow-the-server-through-your-firewall}

Según tu configuración, puede que tengas que permitir que el servidor de BeamMP pase por tu firewall. Es el caso de Windows, donde desactivar el firewall normalmente **no** funciona, y de muchos servidores Linux preinstalados.

Permite el servidor de BeamMP en el firewall para **conexiones entrantes y salientes**, y para **TCP y UDP**. Si tu firewall te pide un puerto, usa el puerto que has redirigido, normalmente el 30814.

Para una guía detallada, consulta [Exclusiones de Defender / Firewall](/es/troubleshooting/defender-exclusions).

<!--@include: ./_parts/authkey.md-->

## Instalar el servidor

El servidor de BeamMP está disponible para Windows y Linux.

### Instalar en Windows

Redirige primero tu puerto. Sin eso, nadie de fuera de tu casa podrá unirse.

1. Instala los [Visual C++ Redistributables](https://aka.ms/vs/17/release/vc_redist.x64.exe). El servidor los necesita para funcionar.
2. Descarga el servidor desde [beammp.com](https://www.beammp.com/). Obtendrás un ejecutable llamado algo como `BeamMP-Server.exe`.
3. Crea una carpeta en algún sitio y pon `BeamMP-Server.exe` en ella. Ahí es donde vivirá tu servidor.
4. Inicia el servidor una vez haciendo doble clic en él. Genera los archivos que necesita. Cuando veas texto, ciérralo. Ahora tienes un archivo `ServerConfig.toml` junto a `BeamMP-Server.exe`.
5. Opcional: para acceder rápido más adelante, crea un acceso directo en el escritorio con **Clic derecho** > **Enviar a** > **Escritorio (crear acceso directo)**.

### Instalar en Linux {#install-on-linux}

#### Usar nuestra compilación (recomendado)

Funciona en todas las distribuciones para las que ofrecemos binarios, que se enumeran en la [página de la última versión](https://github.com/BeamMP/BeamMP-Server/releases/latest). Para otra distribución o arquitectura, consulta [Compilar desde el código fuente](#build-from-source).

1. Instala las dependencias que se enumeran en las [dependencias de ejecución](https://github.com/BeamMP/BeamMP-Server#runtime-dependencies). En Debian y Ubuntu, es el paquete `liblua5.3-0`.
2. Ve a [beammp.com](https://beammp.com/) y haz clic en **Download Server**. Se te llevará a la página de versiones del servidor en GitHub.
3. Descarga el archivo para tu distribución y tu tipo de procesador. Su nombre tiene este aspecto: `BeamMP-Server.debian.12.x86_64`. La versión v3.9.4 incluye compilaciones para Debian 12 y 13 y Ubuntu 22.04 y 24.04, cada una para `x86_64` y `arm64`. No descargues los archivos `debuginfo`. Esta guía llama `BeamMP-Server-xxx` al archivo que has descargado.
4. Crea una carpeta en algún sitio y pon `BeamMP-Server-xxx` en ella. Por ahora puedes ignorar los demás archivos descargados. Ahí es donde vivirá tu servidor.
5. Abre una ventana de terminal en esa carpeta y ejecuta `chmod +x BeamMP-Server-xxx`, para tener permiso de ejecutarlo.
6. Inicia el servidor una vez con `./BeamMP-Server-xxx`. Genera los archivos que necesita. Cuando veas texto, ciérralo. Ahora tienes un archivo `ServerConfig.toml` junto a `BeamMP-Server-xxx`.
7. Opcional, pero muy recomendado: crea un usuario llamado `beammpserver` (o similar) e inicia el servidor solo con ese usuario. No ejecutes el servidor como root, con `sudo` ni con tu usuario personal.

#### Compilar desde el código fuente {#build-from-source}

Es probable que otras distribuciones también funcionen, pero no tienen soporte oficial. Para compilar el servidor tú mismo, descarga el código fuente de [GitHub](https://github.com/BeamMP/BeamMP-Server) y sigue las [instrucciones de compilación](https://github.com/BeamMP/BeamMP-Server#build-instructions). Al final, ejecuta el servidor una vez con `./BeamMP-Server`.

## Configurar el servidor {#configure-the-server}

Cuando ejecutaste el servidor una vez, creó algunos archivos y probablemente mostró algún error. Es lo esperado, porque todavía no está configurado. Ahora tu carpeta tiene estos archivos:

![La carpeta del servidor con ServerConfig.toml, Server.log y BeamMP-Server.exe](../../assets/content/after-running-once.png)

Son `ServerConfig.toml`, `Server.log` y `BeamMP-Server.exe`. Según tus ajustes, puede que no veas las extensiones `.toml`, `.log` y `.exe`.

Abre `ServerConfig.toml` en un editor de texto como el Bloc de notas: **Clic derecho** > **Abrir con…** y elige el editor. Una configuración de ejemplo:

```toml
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

Este archivo usa el formato TOML. [Configuración del servidor](/es/server-owners/configuration) describe cada ajuste.

1. Establece `AuthKey` con la clave que copiaste. Pégala entre las comillas. Con la clave de ejemplo queda así:

   ```toml
   AuthKey = '3173a2e-6az0-4542-a3p0-ddqq5ff95558'
   ```

2. Establece `Name`, el nombre de tu servidor en la lista de servidores. Puedes darle formato con colores y más: consulta [Personalizar el aspecto del nombre de tu servidor](/es/server-owners/configuration#customize-the-look-of-your-server-name).
3. Si has elegido un puerto distinto del 30814, indícalo en `Port`.
4. Tu servidor no aparece en la lista de servidores mientras `Private = true`. Para que aparezca, establece `Private = false`.

### Comprobar que arranca

Vuelve a ejecutar el servidor y busca mensajes `[ERROR]` o `[WARN]`. Ahora el servidor debería seguir abierto. Después añade mods si quieres y consulta cómo unirte.

## Añadir mods

Los mods de vehículos y los de mapas se instalan de forma distinta, pero ambos van en la carpeta `Resources/Client` de tu servidor. Pon el archivo `.zip` del mod en esa carpeta.

::: warning
Los mods pueden ser, o volverse, incompatibles con BeamNG, BeamMP u otros mods. Si tienes problemas, empieza a quitar mods. Si al intentar unirte después de añadir mods te sale un mensaje «done» o «start», probablemente has añadido un mod incompatible o roto. Si tienes mods de cliente instalados, consulta [Seguridad de mods](/es/players/mod-safety) para saber cómo quitarlos de tu juego.
:::

### Mods de vehículos y otros mods

Pon el archivo `.zip` del mod en `Resources/Client`. Todos los que se unan lo descargarán automáticamente.

### Mapas

Los mapas originales funcionan sin instalar nada. Establece `Map` en `ServerConfig.toml` con una de las [rutas de los mapas originales](/es/server-owners/configuration#all-vanilla-maps-names).

Para un mapa con mod:

1. Pon el archivo `.zip` del mapa en `Resources/Client`.
2. Abre el `.zip` sin extraerlo y luego abre su carpeta `levels`. Contiene una carpeta con el nombre del mapa, por ejemplo `myawesomedriftmap2021`. Anota el nombre exactamente como está escrito.
3. En `ServerConfig.toml`, `Map` tiene el aspecto `/levels/MAPNAME/info.json`, donde `MAPNAME` probablemente sea algo como `gridmap_v2`. Sustituye `MAPNAME` por el nombre de la carpeta del paso 2. Debe terminar en `/info.json`. Para este ejemplo:

   ```toml
   Map = '/levels/myawesomedriftmap2021/info.json'
   ```

Cuando alguien se una, el mapa se descargará automáticamente y funcionará.

Si no funciona, instala el mapa en BeamNG.drive en modo un jugador y entra en él. Abre la consola con la tecla `~` (tilde). En un teclado que no sea estadounidense, busca la acción **Consola del sistema** en **Opciones** > **Controles** > **Atajos**, en la sección **Depuración general**. Ejecuta `print(getMissionFilename())`. Te muestra el nombre que debes usar.

### Proteger mods contra la descarga

Puedes alojar contenido protegido o restringido sin redistribuirlo. Es útil para los «mods de pago» o para un creador de mods que quiere dar acceso limitado a su trabajo nuevo.

Para proteger un mod, ejecuta esto en la consola del servidor:

```text
protectmod <filename with .zip> <true/false>
```

Los jugadores que se unan a un servidor con mods protegidos deben conseguir el archivo por su cuenta, por ejemplo del creador o de una plataforma como Patreon, y ponerlo en la carpeta de recursos de su Launcher. El Launcher les avisa cuando falta un archivo, y el juego muestra una notificación con el archivo que falta y cómo solucionarlo.

## Dejar que se unan jugadores

### Unirte a tu propio servidor

Tanto si es privado como público, cómo te unes depende de dónde se ejecute:

- **En el mismo ordenador que el juego:** usa la conexión directa. Haz clic en la pestaña **Direct Connect**, a la izquierda de la lista de servidores, deja los datos por defecto (`127.0.0.1` y tu puerto) y haz clic en **Connect**.
- **En otro ordenador de tu red local:** conexión directa con la dirección IP local de ese ordenador.
- **Fuera de tu casa, como un VPS:** conexión directa con la dirección IP pública de esa máquina.

### Servidor privado

Dale a los demás jugadores la dirección IP pública de tu servidor. Ten cuidado con quién la compartes. Para unirse, tienen que abrir la pestaña **Direct Connect** en BeamMP e introducir tu dirección IP y tu puerto.

### Servidor público

Los demás jugadores lo encuentran en la lista de servidores: escriben su nombre y hacen clic en **Connect**. El nombre es el que está en tu `ServerConfig.toml`. Si no lo encuentran, diles que desactiven los filtros de búsqueda y que pongan el mapa en **Any**.

### «Connection Failed!»

Si te aparece «Connection Failed!» (a ti o a un amigo), busca en la ventana del Launcher códigos como 10060, 10061 o 10030. Significan una de dos cosas: estás detrás de una dirección IPv4 con CGNAT, o algo ha salido mal en [Redirigir el puerto](#forward-the-port) o en [Permitir el servidor en tu firewall](#allow-the-server-through-your-firewall).

Para comprobar si hay CGNAT, busca la dirección IP WAN en la página de tu router y compárala con tu [IP pública](https://www.whatsmyip.org/). Si son iguales, no estás detrás de un CGNAT. Consulta [Comprobar CGNAT](/es/server-owners/cgnat). Todavía no se admite IPv6.

## Comprobar que los jugadores pueden llegar a tu servidor

Mientras el servidor está en ejecución, puedes escribir `nettest` en su consola. El servidor le pregunta al mismo servicio de comprobación si los jugadores pueden llegar a él por su puerto, e imprime la respuesta. O introduce la dirección IPv4 pública de tu servidor y el puerto, y haz clic en **CheckBeamMP**:

<form action="https://check.beammp.com/api/v2/beammp" method="get" target="_blank">
  <label for="ip">Dirección IP:</label>
  <input type="text" id="ip" name="ip"><br>
  <label for="port">Puerto:</label>
  <input type="text" id="port" name="port"><br>
  <input type="submit" value="CheckBeamMP">
</form>

## Usar una VPN

BeamMP no admite VPN como RadminVPN o Hamachi, porque suelen causar problemas. Uno de ellos es que no se reenvía el tráfico UDP. Para solucionarlo, consulta [Redirigir el puerto](#forward-the-port).

::: question Pero antes funcionaba. ¿Por qué ahora no?
Los desarrolladores de estas aplicaciones actualizan su software y hacen cambios sobre los que BeamMP no tiene control. Les corresponde a ellos dar soporte a usos concretos como un servidor de BeamMP.
:::

## ¿Sigues teniendo problemas?

Abre un hilo en el [foro](https://forum.beammp.com) o crea un **Server Support Ticket** en el canal `#support` del [servidor de Discord](https://discord.gg/beammp).
