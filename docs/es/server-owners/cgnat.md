¿Cómo comprobar si hay CGNAT?
## Problema

¿Todas las exclusiones del firewall y las reglas de redirección de puertos están bien configuradas y, aun así, nadie puede unirse a tu servidor alojado en casa?

Si tienes problemas de conexión y usas un servicio de alojamiento, contacta con ellos para pedir ayuda. Si quieres usar un VPS o no puedes alojar un servidor en casa, echa un vistazo a nuestra
[lista de servicios de alojamiento asociados](/es/server-owners/host-a-server#partnered-hosting-services-paid) (documentación de configuración del servidor).

# ¿Qué es exactamente el CGNAT?

Para una explicación detallada de qué es el CGNAT y por qué supone un problema al intentar alojar un servidor en casa, consulta [esta página](https://en.wikipedia.org/wiki/Carrier-grade_NAT).

# ¿Cómo comprobar si hay CGNAT?

## Método 1:
Abre una ventana de símbolo del sistema y ejecuta ``tracert -4 beammp.com``. Esto mostrará una serie de saltos de red. Espera a que termine la operación (puede llegar a tardar hasta 30 saltos). Fíjate en las primeras direcciones IP después de la IP de tu router/módem/puerta de enlace.
Si después del primer salto aparecen varias direcciones IP dentro del rango ``100.64.x.x``-``100.127.x.x`` o ``10.xx.xx.xx``, lo más probable es que estés detrás de un CGNAT.

::: note
El primer salto será tu router/módem/puerta de enlace y varía según el dispositivo.
Los rangos oficiales de las redes locales son los siguientes: ``10.0.0.xxx`` - ``192.168.xxx.xxx`` - ```172.16.xxx.xxx``
:::

## Método 2:
Averigua la IP WAN de tu router consultándola en su interfaz. Compárala con la IP que aparece en, por ejemplo, https://whatsmyip.org . Si NO son la misma, estás detrás de un CGNAT.

## Método 3/Solución:
Llama a tu proveedor de servicios de internet para pedir ayuda.
Dependiendo de tu proveedor, puede que no ofrezca direcciones IP *dinámicas* dedicadas. Ten en cuenta que no es necesario que la IP sea estática.

::: warning
Es posible que los proveedores de servicios de internet solo ofrezcan direcciones IP dedicadas como una **opción de pago**.
¡Consulta los precios de nuestros servicios de alojamiento asociados, ya que podrían ser más baratos que esa tarifa!
:::

Ejemplo de una red sin CGNAT:

![imagen](https://github.com/user-attachments/assets/fee21a50-cbb0-4322-9c26-d9f04f88ae37)

Etiquetas: Servidor, 10060 10061, CGNAT, Conexión fallida, Redirección de puertos, Firewall
