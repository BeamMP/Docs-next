# ¿Cómo crear exclusiones en el Firewall y el antivirus de Windows Defender?

:::: info
Antes de modificar el firewall, asegúrate de que tu red esté configurada como privada en los ajustes de red de Windows (suponiendo que estés en una red privada).

::: danger AVISO LEGAL:
**Las exclusiones del firewall o de Defender suponen un riesgo**.

Al crear exclusiones, entiendes los riesgos de permitir programas en tu PC y de exponer puertos de tu red doméstica a internet y, por tanto, renuncias al derecho de exigir responsabilidades a BeamMP por **cualquier daño** que puedas sufrir tú o las personas de tu hogar.

No asumimos ninguna responsabilidad por el contenido de ningún servicio o sitio web enlazado externamente.
:::
::::

## 1. Exclusión en el Firewall de Defender para BeamMP-Launcher.

1. Abre `Windows Defender Firewall with advanced setting`.
2. En la ventana, haz clic en `Inbound` para abrir la pestaña de reglas de entrada.
3. Haz clic en `Create new rule` en la esquina superior derecha para crear una nueva exclusión.
4. Selecciona `Program` para crear una exclusión específica para un programa.
5. Introduce la ruta completa de `BeamMP-Launcher.exe`. Por defecto sería `%appdata%\BeamMP-Launcher\BeamMP-Launcher.exe` (sin comillas).
6. Asegúrate de permitir la conexión
7. Ponle un nombre a la exclusión (por ejemplo, "BeamMP-Launcher") y guárdala.
9. Reinicia tu PC.

## 1.1 Exclusión en el Firewall de Defender para BeamMP-Server.

1. Abre `Windows Defender Firewall with advanced setting`.
2. En la ventana, haz clic en `Inbound` para abrir la pestaña de reglas de entrada.
3. Haz clic en `Create new rule` en la esquina superior derecha para crear una nueva exclusión.
4. Selecciona `Port` para crear una exclusión de puerto.
5. Introduce el mismo puerto que figura en ServerConfig.toml.
6. Introduce la ruta completa de `BeamMP-Server.exe`. El archivo está en el lugar donde lo colocaste después de descargarlo.
7. Asegúrate de permitir la conexión
8. Ponle un nombre a la exclusión (por ejemplo, "BeamMP-Server") y guárdala.
9. Reinicia tu PC.

## 2. Exclusión en el antivirus de Defender para BeamMP-Launcher/Server.

1. Abre la aplicación `Windows Security`.
2. Haz clic en el primer elemento, `virus and threat protection`.
3. Haz clic en `Manage settings`, debajo de "Virus & threat protection settings".
4. Desplázate hacia abajo hasta la pestaña `Exclusions`.
5. Ahí, haz clic en 'Add an exclusion' y selecciona `process`.
6. Introduce `BeamMP-Launcher.exe` o `BeamMP-Server.exe` en el campo y guárdalo.
7. Reinicia tu PC.

## ¿Sigues teniendo problemas?

Abre un hilo en el [foro](https://forum.beammp.com) o en nuestro [servidor de Discord](https://discord.gg/beammp), en el canal `#support`.
