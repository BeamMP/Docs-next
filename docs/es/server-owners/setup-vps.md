---
description: "Configura un servidor de BeamMP en un VPS o en el panel de gestión de una empresa de alojamiento: consigue una AuthKey, rellena los campos del panel, añade mods y deja que se unan jugadores."
---
# Configuración del servidor en un VPS

Esta guía es para un servidor en un VPS, o en una empresa de alojamiento, que tenga un panel de gestión. Para alojar en casa, sigue [Alojar un servidor](/es/server-owners/host-a-server).

Alojar en un VPS no requiere ningún cambio de firewall ni de redirección de puertos en tu router.

## Antes de empezar

Los servidores son una parte fundamental de BeamMP: los jugadores se conectan entre sí a través del servidor. Puedes crear un servidor privado, al que solo pueden unirse las personas que invites, o un servidor público, que aparece en la lista oficial de servidores.

Lee la [LICENSE](https://raw.githubusercontent.com/BeamMP/BeamMP-Server/master/LICENSE) del servidor antes de usarlo.

Si tienes problemas, pregunta en el [foro](https://forum.beammp.com) o en el canal `#support` del [servidor de Discord](https://discord.gg/beammp). [Configuración del servidor](/es/server-owners/configuration) tiene más detalles sobre los ajustes del servidor.

Si todavía no has elegido un VPS, echa un vistazo a nuestros servicios de alojamiento asociados. Son de pago.

::: details Servicios de alojamiento asociados
<!--@include: ./_parts/partners.md-->
:::

## Configurar el VPS

Asegúrate de que la página de gestión de tu servidor es accesible. Cuando hayas comprobado que el servidor está listo para funcionar, continúa.

<!--@include: ./_parts/authkey.md-->

## Rellenar los campos del panel

El panel de alojamiento tiene algunos campos que rellenar. Los campos marcados con `*` son obligatorios.

1. Pega tu AuthKey en el campo **Authkey**.
2. Ponle un nombre y una descripción a tu servidor. Puedes darles formato con colores y más: consulta [Personalizar el aspecto del nombre de tu servidor](/es/server-owners/configuration#customize-the-look-of-your-server-name).

::: warning
No puedes editar `ServerConfig.toml` directamente en el gestor de archivos. Es intencionado, para que la empresa de alojamiento pueda aplicar límites como el número de jugadores.
:::

### Comprobar que arranca

Ejecuta tu servidor y busca mensajes `[ERROR]` o `[WARN]`. El servidor debería seguir en marcha ahora. Después añade mods si quieres y consulta cómo unirte.

## Añadir mods

Puedes añadir mods con el gestor de archivos del panel. Los mods de vehículos y los de mapas se instalan de forma distinta, pero ambos van en la carpeta `Resources/Client` de tu servidor. Pon el archivo `.zip` del mod en esa carpeta.

::: warning
Los mods pueden ser, o volverse, incompatibles con BeamNG, BeamMP u otros mods. Si tienes problemas, empieza a quitar mods. Si al intentar unirte después de añadir mods te sale un mensaje «done» o «start», probablemente has añadido un mod incompatible o roto. Si tienes mods de cliente instalados, consulta [Seguridad de mods](/es/players/mod-safety) para saber cómo quitarlos de tu juego.
:::

### Mods de vehículos y otros mods

Pon el archivo `.zip` del mod en `Resources/Client`. Todos los que se unan lo descargarán automáticamente.

### Mapas

Los mapas originales funcionan sin instalar nada. Establece el campo **Map** del panel de gestión con una de las [rutas de los mapas originales](/es/server-owners/configuration#all-vanilla-maps-names).

Para un mapa con mod:

1. Pon el archivo `.zip` del mapa en `Resources/Client`.
2. Abre el `.zip` sin extraerlo y luego abre su carpeta `levels`. Contiene una carpeta con el nombre del mapa, por ejemplo `myawesomedriftmap2021`. Anota el nombre exactamente como está escrito.
3. En el panel de gestión, el campo **Map** tiene el aspecto `/levels/MAPNAME/info.json`, donde `MAPNAME` probablemente sea algo como `gridmap_v2`. Sustituye `MAPNAME` por el nombre de la carpeta del paso 2. Debe terminar en `/info.json`. Para este ejemplo: `/levels/myawesomedriftmap2021/info.json`.

Cuando alguien se una, el mapa se descargará automáticamente y funcionará.

Si no funciona, instala el mapa en BeamNG.drive en modo un jugador y entra en él. Abre la consola con la tecla `~` (tilde). En un teclado que no sea estadounidense, busca la acción **Toggle System Console** en **Options** > **Controls** > **Bindings**, en la sección **General Debug**. Ejecuta `print(getMissionFilename())`. Te muestra el nombre que debes usar.

## Dejar que se unan jugadores

Los jugadores pueden conectarse directamente a la dirección IP pública y al puerto del servidor, que se encuentran en el panel de gestión. También puedes encontrar la dirección IP en el sitio web del [Keymaster](https://keymaster.beammp.com/).

En un servidor público, los jugadores pueden abrir en su lugar la lista de servidores, escribir el nombre del servidor y hacer clic en **Conectarse**. El nombre es el que hayas establecido. Si no lo encuentran, diles que desactiven los filtros de búsqueda y que pongan el mapa en **Any**.

Si te aparece «Connection Failed!» (a ti o a un amigo), busca en la ventana del Launcher códigos como 10060, 10061 o 10030. Significan que no se puede acceder al servidor, o que la dirección IP y el puerto escritos en el cliente son incorrectos. Todavía no se admite IPv6.

## ¿Sigues teniendo problemas?

Abre un hilo en el [foro](https://forum.beammp.com) o crea un **Server Support Ticket** en el canal `#support` del [servidor de Discord](https://discord.gg/beammp).
