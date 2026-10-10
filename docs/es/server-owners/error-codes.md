---
description: "Qué significan los códigos de error de red detrás de los problemas del servidor de BeamMP, como 10048 y 10060, y qué hacer en cada caso."
---
# Códigos de error del servidor

Esta página enumera los códigos de error de red con los que puedes encontrarte al ejecutar un servidor y qué hacer en cada caso. El propio servidor imprime el texto del error, por ejemplo después de `bind() failed:`, no el número. Los números son los códigos de error de Windows Sockets que muestran el Launcher y Windows.


| Código | Descripción                                | Posible solución                                                                                                      |
|--------|--------------------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| 10022  | Hay un problema al enlazar con el puerto   | Comprueba si otro servicio ya está usando el puerto del servidor; si es así, usa otro.                                |
| 10048  | Dirección en uso                           | Otro servidor de BeamMP u otro programa se está ejecutando en ese puerto; usa otro.                                   |
| 10051  | Red inaccesible                            | Mala redirección de puertos o problemas similares; comprueba que todo esté bien configurado.                          |
| 10052  | Red restablecida                           | Ocurre si la red pierde la conexión mientras se está estableciendo una conexión. Vuelve a intentar la conexión.       |
| 10053  | Conexión cancelada                         | Causado por un tiempo de espera agotado o un error de red; vuelve a intentar la conexión.                             |
| 10054  | Conexión restablecida por el par           | Un cliente se ha desconectado de tu servidor.                                                                         |
| 10060  | Tiempo de espera de la conexión agotado    | Hay un problema con tu redirección de puertos; consulta los [pasos de redirección de puertos](/es/server-owners/host-a-server#forward-the-port). |
| 10061  | Conexión rechazada                         | Hay un problema con tu redirección de puertos; consulta los [pasos de redirección de puertos](/es/server-owners/host-a-server#forward-the-port). |
| 10064  | Host caído                                 | Es un error poco probable, pero significa que el host está caído porque se ha apagado o se han cerrado los puertos.   |
| 10065  | Host inaccesible                           | No hay internet o la redirección de puertos está mal; consulta los [pasos de redirección de puertos](/es/server-owners/host-a-server#forward-the-port). |

Para un código que no aparezca en esta lista, consulta los [códigos de error de Windows Sockets](https://learn.microsoft.com/en-us/windows/win32/winsock/windows-sockets-error-codes-2), si tienes algunos conocimientos sobre cómo funcionan las redes y los sockets.

