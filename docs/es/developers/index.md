---
description: "Empieza a desarrollar para BeamMP: cómo encajan el mod, el Launcher y el servidor, cómo configurar un entorno de desarrollo y dónde están las referencias de scripting."
---
# Desarrolladores

BeamMP se divide en tres partes y puedes escribir código para cada una. Esta sección explica cómo encajan entre sí y por dónde empezar.

## Las tres partes

- **El mod** lo carga BeamNG.drive como cualquier otro mod de vehículos o de interfaz. Establece una conexión local con el Launcher y muestra la interfaz multijugador. Está escrito sobre todo en Lua, con algo de JavaScript, HTML y CSS para la interfaz. Su repositorio es [BeamMP/BeamMP](https://github.com/BeamMP/BeamMP).
- **El Launcher** mantiene una conexión constante con el mod, se conecta al servidor que elijas y gestiona el inicio de sesión con el backend de BeamMP. Está escrito en C++, BeamMP lo distribuye precompilado y se encuentra en [BeamMP/BeamMP-Launcher](https://github.com/BeamMP/BeamMP-Launcher).
- **El servidor** conecta uno o varios Launchers y envía «latidos» (heartbeats) al backend de BeamMP con su dirección IP, puerto, versión, número de jugadores y más. También ejecuta plugins de Lua del lado del servidor. Está escrito en C++, BeamMP lo distribuye precompilado para varios sistemas operativos y arquitecturas de CPU, y se encuentra en [BeamMP/BeamMP-Server](https://github.com/BeamMP/BeamMP-Server).

## Por dónde empezar

- **Trabajar en el propio BeamMP:** [Configuración del entorno de desarrollo](/es/developers/dev-environment-setup).
- **Escribir un plugin de servidor o un mod:** [Creación de Mods y Recursos](/es/developers/mod-and-resource-creation).
- **Consultar una función o un evento:** las [referencias de scripting](/es/developers/beammp-scripting/): [Mod (En el Juego)](/es/developers/beammp-scripting/mod-in-game) y [Servidor](/es/developers/beammp-scripting/server/latest).
- **Trabajar con el propio BeamNG.drive:** [Documentación del juego](/es/game-documentation/).

Si te atascas, pregunta en el canal `#scripting` del [servidor de Discord](https://discord.gg/beammp).
