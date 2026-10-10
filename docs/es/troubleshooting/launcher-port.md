---
description: "Cambia a mano el puerto del Launcher de BeamMP cuando no se conecta al juego: configura el puerto en las opciones de BeamNG y en Launcher.cfg."
---
# Cambiar el puerto del Launcher

¿El Launcher no se conecta al juego? Esta guía explica cómo cambiar a mano el puerto del Launcher. El puerto debe ser el mismo en el juego y en el Launcher.

1. Inicia BeamNG.drive.
2. En el menú principal, ve a **Opciones** y luego a **Multijugador**.
3. Activa **Show advanced options**.
4. Desplázate hasta el final.
5. En **Launcher port**, cambia el número por otro, por ejemplo `4567`.
6. Cierra BeamNG.drive.
7. Haz clic derecho en el acceso directo del Launcher de BeamMP y elige **Abrir ubicación del archivo**.
8. Abre `Launcher.cfg` en un editor de texto.
9. Cambia el número de `"Port": 4444,` por el puerto que configuraste en el juego, en este ejemplo `4567`.
10. Guarda el archivo y cierra el editor.
11. Inicia el Launcher.

Si sigue sin conectarse, prueba con otro puerto. Cualquier número entre aproximadamente 2000 y 65535 es un puerto válido.

## ¿Sigues teniendo problemas?

Crea un ticket de soporte en nuestro [servidor de Discord](https://discord.gg/BeamMP).
