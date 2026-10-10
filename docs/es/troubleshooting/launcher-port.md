---
description: "Cambia a mano el puerto del Launcher de BeamMP cuando no se conecta al juego: configura el puerto en las opciones de BeamNG y en Launcher.cfg."
---
# Cambiar el puerto del Launcher

¿El Launcher no se conecta al juego? Esta guía explica cómo cambiar a mano el puerto del Launcher. El puerto debe ser el mismo en el juego y en el Launcher.

El puerto por defecto es el `4444`. El Launcher usa este puerto y el siguiente, el `4445`, en tu propio ordenador. Ambos usan TCP y ambos deben estar libres. Si otro programa usa uno de ellos, el Launcher muestra `bind failed with error`, como se indica en [Códigos de error](/es/troubleshooting/error-codes).

1. Inicia BeamNG.drive.
2. En el menú principal, ve a **Opciones** y luego a la pestaña **BeamMP**.
3. Abre el grupo **Avanzado**.
4. En **Launcher port**, cambia el número por otro, por ejemplo `4567`.
5. Cierra BeamNG.drive.
6. Haz clic derecho en el acceso directo del Launcher de BeamMP y elige **Abrir ubicación del archivo**.
7. Abre `Launcher.cfg` en un editor de texto.
8. Cambia el número de `"Port": 4444,` por el puerto que configuraste en el juego, en este ejemplo `4567`.
9. Guarda el archivo y cierra el editor. Mantén el archivo como un JSON válido: si el Launcher no puede leerlo, muestra `Config failed to parse make sure it's valid JSON!` y se cierra.
10. Inicia el Launcher.

Si sigue sin conectarse, prueba con otro puerto. Usa un número entre 1024 y 65534, porque el Launcher también usa el número siguiente.

::: tip
Puedes establecer el puerto sin editar `Launcher.cfg`. Inicia el Launcher con `--port 4567`. La opción de línea de comandos sustituye el valor de `Launcher.cfg`. Las demás opciones están en [Configuración del entorno de desarrollo](/es/developers/dev-environment-setup#turn-on-dev-mode-in-the-launcher).
:::

## ¿Sigues teniendo problemas?

Crea un ticket de soporte en nuestro [servidor de Discord](https://discord.gg/BeamMP).
