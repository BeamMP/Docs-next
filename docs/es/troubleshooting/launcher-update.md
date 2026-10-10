---
description: "Actualiza a mano el Launcher de BeamMP cuando no puede actualizarse solo o muestra una pantalla en blanco: descarga el último en Windows o vuelve a compilarlo en Linux."
---
# Problemas de actualización del Launcher

¿El Launcher no puede actualizarse o muestra una pantalla en blanco? Esta guía explica cómo actualizarlo a mano.

En Windows, antes de seguirla ya deberías haber instalado BeamMP con el instalador de [nuestro sitio web](https://beammp.com).

## Cómo se actualiza el Launcher

En Windows, el Launcher comprueba en `backend.beammp.com` si hay una versión más reciente cada vez que se inicia. Si la hay, la descarga, comprueba su firma y conserva el archivo antiguo como `BeamMP-Launcher.back` en la misma carpeta. Después se reinicia. El Launcher se salta la comprobación cuando lo inicias con `--no-update` o `--dev`.

Si la actualización falla, el Launcher muestra uno de estos mensajes:

- `Failed to download the launcher update! Please try manually updating it`
- `The authenticity of the updated launcher could not be verified, it was corrupted or tampered with.`

Comprueba tu conexión a internet y tu firewall o antivirus, como se explica en [Exclusiones de Defender / Firewall](/es/troubleshooting/defender-exclusions). Después actualiza el Launcher a mano.

En Linux, el Launcher nunca se actualiza solo. Sigue [Actualizar el Launcher en Linux](/es/get-started/install-beammp#update-the-launcher-on-linux) en lugar de los pasos de abajo.

## Instalar un nuevo Launcher

1. Descarga el último Launcher directamente desde [GitHub](https://github.com/BeamMP/BeamMP-Launcher/releases/latest/download/BeamMP-Launcher.exe).
2. Cierra el Launcher.
3. Ve a la carpeta que contiene `BeamMP-Launcher.exe`. Por defecto es `C:\Users\<username>\AppData\Roaming\BeamMP-Launcher`. Sustituye `<username>` por tu nombre de usuario de Windows. Si instalaste BeamMP en otro lugar, por ejemplo `D:\BeamMP-Launcher`, usa esa carpeta.
4. Sustituye el Launcher existente en la carpeta BeamMP-Launcher por el nuevo.
5. Inicia el Launcher como de costumbre y comprueba que funciona.

## ¿Sigues teniendo problemas?

Crea un ticket de soporte en nuestro [servidor de Discord](https://discord.gg/BeamMP).
