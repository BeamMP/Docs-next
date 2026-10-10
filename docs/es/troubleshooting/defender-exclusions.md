---
description: "Crea exclusiones en el Firewall y el antivirus de Windows Defender para que no se bloqueen el Launcher ni el servidor de BeamMP: reglas de firewall y antivirus."
---
# Exclusiones de Defender / Firewall

Esta guía explica cómo crear exclusiones en el Firewall y el antivirus de Windows Defender para el Launcher y el servidor de BeamMP.

Antes de modificar el firewall, asegúrate de que tu red esté configurada como **privada** en los ajustes de red de Windows, si estás en una red privada.

::: danger Las exclusiones suponen un riesgo
Al crear exclusiones, entiendes los riesgos de permitir programas en tu ordenador y de abrir puertos de tu red doméstica al público. Por tanto, renuncias al derecho de exigir responsabilidades a BeamMP por cualquier daño que puedan sufrir tú o las personas de tu hogar.

No asumimos ninguna responsabilidad por el contenido de ningún servicio o sitio web enlazado externamente.
:::

## Permitir el Launcher en el firewall

1. Abre **Firewall de Windows Defender con seguridad avanzada**.
2. Haz clic en **Reglas de entrada**.
3. Haz clic en **Nueva regla** en la esquina superior derecha.
4. Selecciona **Programa** y haz clic en **Siguiente**.
5. Selecciona **Esta ruta de acceso del programa** e introduce la ruta completa de `BeamMP-Launcher.exe`. Por defecto es `%appdata%\BeamMP-Launcher\BeamMP-Launcher.exe`, sin comillas.
6. Selecciona **Permitir la conexión**.
7. Deja marcados los tipos de red que ya lo están y haz clic en **Siguiente**.
8. Ponle un nombre a la regla, por ejemplo "BeamMP-Launcher", y haz clic en **Finalizar**.

## Permitir el servidor en el firewall

El servidor necesita una regla para el programa y otra para su puerto. Los jugadores se conectan al mismo número de puerto por TCP y por UDP, así que el puerto necesita una regla para cada uno.

1. Crea una regla para el programa como en los pasos anteriores, pero usa la ruta completa de `BeamMP-Server.exe`, que es el lugar donde colocaste el archivo después de descargarlo. Ponle el nombre "BeamMP-Server".
2. Haz clic en **Nueva regla** otra vez.
3. Selecciona **Puerto** y haz clic en **Siguiente**.
4. Selecciona **TCP** y **Puertos locales específicos**, e introduce el mismo puerto que `Port` en tu `ServerConfig.toml`. Por defecto es `30814`.
5. Selecciona **Permitir la conexión**, deja marcados los tipos de red que ya lo están y ponle un nombre a la regla, por ejemplo "BeamMP-Server TCP".
6. Repite los pasos del 2 al 5 con **UDP** y ponle a la regla el nombre "BeamMP-Server UDP".

Una regla de firewall se aplica en cuanto la guardas. Reinicia después el Launcher o el servidor.

## Añadir una exclusión del antivirus

Esto se aplica al Launcher y al servidor.

1. Abre la aplicación **Seguridad de Windows**.
2. Haz clic en **Protección antivirus y contra amenazas**.
3. En **Configuración de Protección antivirus y contra amenazas**, haz clic en **Administrar la configuración**.
4. Desplázate hacia abajo hasta **Exclusiones** y haz clic en **Agregar o quitar exclusiones**.
5. Haz clic en **Agregar una exclusión**, selecciona **Archivo** y selecciona `BeamMP-Launcher.exe` o `BeamMP-Server.exe`. Así se evita que el propio programa se analice o se elimine.
6. Haz clic de nuevo en **Agregar una exclusión**, selecciona **Proceso** e introduce la ruta completa del mismo programa. Así se evita que se analicen los archivos que abre el programa.

Una exclusión se aplica a la protección en tiempo real. Un análisis programado o manual todavía puede analizar un archivo excluido.

## ¿Sigues teniendo problemas?

Abre un hilo en el [foro](https://forum.beammp.com) o pregunta en el canal `#support` del [servidor de Discord](https://discord.gg/beammp).
