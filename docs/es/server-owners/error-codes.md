# Códigos de error

Esta página contiene todos los códigos de error que puede mostrar el servidor.

---

| Código | Descripción                                | Posible solución                                                                                                      |
|--------|--------------------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| 10022  | Hay un problema al enlazar con el puerto   | Comprueba si el puerto del servidor ya está en uso por otro servicio; si es así, usa otro.                            |
| 10048  | Dirección ya en uso                        | Otro servidor de BeamMP u otro programa se está ejecutando en ese puerto; usa otro.                                   |
| 10051  | Red inaccesible                            | Redirección de puertos incorrecta o problemas similares; comprueba que todo esté bien configurado.                    |
| 10052  | Red restablecida                           | Ocurre si la red pierde la conexión mientras se está estableciendo una conexión. Vuelve a intentar la conexión.       |
| 10053  | Conexión anulada                           | Causada por un tiempo de espera agotado o un error de red; vuelve a intentar la conexión.                             |
| 10054  | Conexión restablecida por el par           | Un cliente se ha desconectado de tu servidor.                                                                         |
| 10060  | Tiempo de espera de la conexión agotado    | Hay un problema con tu redirección de puertos; consulta los [pasos de la guía](/es/server-owners/host-a-server#1-port-forwarding). |
| 10061  | Conexión rechazada                         | Hay un problema con tu redirección de puertos; consulta los [pasos de la guía](/es/server-owners/host-a-server#1-port-forwarding). |
| 10064  | Host caído                                 | Es un error poco probable, pero significa que el host está caído, ya sea porque está apagado o porque se cerraron los puertos. |
| 10065  | Host inaccesible                           | No hay internet o la redirección de puertos es incorrecta; consulta los [pasos de la guía](/es/server-owners/host-a-server#1-port-forwarding). |

::: note
Para cualquier otro código que no figure en esta lista, puedes consultar <https://learn.microsoft.com/en-us/windows/win32/winsock/windows-sockets-error-codes-2> si tienes algunos conocimientos de redes y sockets.
:::
