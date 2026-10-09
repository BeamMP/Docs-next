---
description: "Averigua si tu conexión a internet está detrás de un CGNAT, que impide que los jugadores se unan a un servidor de BeamMP alojado en casa aunque redirijas los puertos."
---
# Comprobar CGNAT

¿Tus exclusiones del firewall y tus reglas de redirección de puertos están bien configuradas y, aun así, nadie puede unirse a tu servidor alojado en casa? Puede que estés detrás de un CGNAT.

Si usas un servicio de alojamiento y tienes problemas de conexión, ponte en contacto con ellos. Si quieres un VPS, o no puedes alojar en casa, consulta los [servicios de alojamiento asociados](/es/server-owners/host-a-server#partnered-hosting-services).

## ¿Qué es el CGNAT?

El NAT de nivel de operador (CGNAT, «Carrier-grade NAT») es una configuración que usan algunos proveedores de internet y que dificulta redirigir puertos hacia tu casa. Para una explicación detallada de qué es y por qué es un problema para alojar en casa, consulta [Carrier-grade NAT en Wikipedia](https://en.wikipedia.org/wiki/Carrier-grade_NAT).

## Comprobar si hay CGNAT

### Método 1: trazar la ruta

1. Abre un símbolo del sistema y ejecuta:
   ```text
   tracert -4 beammp.com
   ```
   Muestra una serie de saltos de red. Espera a que termine, lo que puede tardar hasta 30 saltos.
2. El primer salto es tu router, módem o puerta de enlace, y cambia según el dispositivo. Fíjate en las primeras direcciones IP que aparecen después.
3. Si después del primer salto aparecen varias direcciones entre `100.64.x.x` y `100.127.x.x`, o que empiezan por `10.`, lo más probable es que estés detrás de un CGNAT.

Los rangos oficiales para redes locales son `10.0.0.x`, `192.168.x.x` y `172.16.x.x`.

### Método 2: comparar direcciones IP

Busca la dirección IP WAN en la interfaz de tu router y compárala con la que aparece en [whatsmyip.org](https://whatsmyip.org). Si **no** son iguales, estás detrás de un CGNAT.

## Si estás detrás de un CGNAT

Llama a tu proveedor de internet (ISP) para pedir ayuda. Según el proveedor, puede que no ofrezca direcciones IP dinámicas dedicadas. No hace falta una IP estática.

::: warning
Puede que los proveedores solo ofrezcan una dirección IP dedicada como **opción de pago**. Compara el precio con el de nuestros servicios de alojamiento asociados: quizá sean más baratos.
:::

Este es un ejemplo de una red que no está detrás de un CGNAT:

![Un diagrama de red de una conexión que no está detrás de un CGNAT](https://github.com/user-attachments/assets/fee21a50-cbb0-4322-9c26-d9f04f88ae37)
