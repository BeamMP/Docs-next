---
description: "Deja que los usuarios inicien sesión en tu aplicación con su cuenta de BeamMP: crea una aplicación, redirige al usuario a BeamMP, canjea el código por un token y lee su perfil."
---
# Iniciar sesión con BeamMP

Esta página es para desarrolladores que quieren que los usuarios inicien sesión en su propio sitio web o aplicación con una cuenta de BeamMP. Al terminar tendrás un inicio de sesión con OAuth 2.0 funcionando, que devuelve el ID de cuenta de BeamMP de la persona, su nombre de usuario, su avatar y, si lo permite, su dirección de correo electrónico.

BeamMP usa el flujo de **código de autorización** de OAuth 2.0. Es solo OAuth 2.0, no OpenID Connect: no hay `id_token`, ni documento de descubrimiento, ni JWKS.

## Endpoints

| Finalidad | Método y dirección |
|---|---|
| Autorización (se abre en el navegador del usuario) | `GET https://accounts.beammp.com/auth/external` |
| Intercambio del token | `POST https://api.beammp.com/v1/oauth/token` |
| Perfil del usuario | `GET https://api.beammp.com/v1/oauth/userinfo` |
| Revocar un token | `POST https://api.beammp.com/v1/oauth/revoke` |

## Crea tu aplicación

Las aplicaciones se crean en la **Developer Console** de tu cuenta de BeamMP en [accounts.beammp.com](https://accounts.beammp.com). Las funciones de desarrollador se activan cuenta por cuenta y no vienen activadas por defecto. Para conseguirlas, pídeselo al equipo de BeamMP en el [servidor de Discord](https://discord.gg/beammp).

Tendrás que rellenar estos campos:

| Campo | Notas |
|---|---|
| Nombre de la aplicación | De 3 a 80 caracteres. Se muestra a los usuarios cuando se les pide que aprueben tu aplicación. |
| Sitio web | Opcional. Una dirección completa con `https://` o `http://`. Se muestra como enlace en la página de aprobación. |
| URL de la política de privacidad | Opcional, pero muy recomendable. Una dirección completa con `https://` o `http://`. Se muestra como enlace en la página de aprobación, para que los usuarios puedan leer qué haces con sus datos antes de aprobar. Si la omites, la página de aprobación indica que no has proporcionado ninguna. |
| Descripción | Opcional. Se muestra en la página de aprobación. |
| URI de redirección | Una por línea. Direcciones `https://`, o `http://` para `localhost` y `127.0.0.1` mientras desarrollas. No se aceptan esquemas personalizados. |

Las direcciones del sitio web y de la política de privacidad se comprueban al guardarlas. Solo se aceptan direcciones `http://` o `https://` normales: nada de direcciones `javascript:`, `data:` o `ftp:`, ni direcciones que incluyan un nombre de usuario y una contraseña.

Después recibirás un **client ID** y un **client secret**. El secreto se muestra una sola vez, y más adelante puedes rotarlo.

::: warning Mantén el secreto en tu servidor
No pongas nunca el client secret en un navegador ni en una aplicación móvil. Si tu aplicación no puede guardar un secreto, por ejemplo una aplicación de una sola página, usa [PKCE](#pkce) en su lugar.
:::

## Redirige al usuario a BeamMP

Abre esta dirección en el navegador del usuario:

```
https://accounts.beammp.com/auth/external
  ?client_id=YOUR_CLIENT_ID
  &redirect_uri=https%3A%2F%2Fexample.com%2Fcallback
  &response_type=code
  &scope=profile%20email
  &state=RANDOM_VALUE
  &code_challenge=CHALLENGE
  &code_challenge_method=S256
```

| Parámetro | Obligatorio | Notas |
|---|---|---|
| `client_id` | Sí | Tu client ID. |
| `redirect_uri` | Sí | Debe coincidir exactamente con una de las URI de redirección que registraste. |
| `response_type` | Sí | Debe ser `code`. No se admite ningún otro valor. |
| `scope` | No | Separados por espacios. Por defecto es `profile`. Consulta [Ámbitos](#scopes). |
| `state` | Recomendado | Un valor aleatorio que generas tú. Se devuelve sin cambios. Comprueba que coincide, para evitar callbacks falsificados. |
| `code_challenge` | Recomendado | El desafío PKCE. Consulta [PKCE](#pkce). |
| `code_challenge_method` | Con un desafío | Debe ser `S256`. `plain` no se admite. |

El usuario inicia sesión en BeamMP, con contraseña y código de dos factores si su cuenta los exige. Después ve una pantalla con el nombre, la descripción, el sitio web y el enlace a la política de privacidad de tu aplicación, junto con los permisos que has pedido. Puede aprobarlos o rechazarlos.

Si la propia solicitud no es válida, por ejemplo por una aplicación desconocida, una `redirect_uri` que no está registrada o un ámbito no admitido, BeamMP muestra el error al usuario y no lo redirige a tu aplicación.

Las cuentas suspendidas, desactivadas o que aún esperan su recuperación no pueden autorizar nada.

## Recibe el código

Cuando el usuario aprueba, BeamMP lo redirige a tu `redirect_uri`:

```
https://example.com/callback?code=AUTHORIZATION_CODE&state=RANDOM_VALUE
```

Si lo rechaza, recibirás `?error=access_denied&state=RANDOM_VALUE` en su lugar.

El código es válido durante 5 minutos y solo se puede usar una vez. Un intento fallido de canjearlo lo consume, así que solicita un código nuevo en lugar de reintentarlo.

## Intercambia el código por un token de acceso

Llama al endpoint del token desde tu servidor. Envía el cuerpo como `application/x-www-form-urlencoded`. También se acepta JSON.

Con un client secret, usando autenticación HTTP Basic:

```bash
curl -X POST https://api.beammp.com/v1/oauth/token \
  -u "YOUR_CLIENT_ID:YOUR_CLIENT_SECRET" \
  -d grant_type=authorization_code \
  -d code=AUTHORIZATION_CODE \
  -d redirect_uri=https://example.com/callback \
  -d code_verifier=YOUR_VERIFIER
```

O con las credenciales en el cuerpo:

```bash
curl -X POST https://api.beammp.com/v1/oauth/token \
  -d grant_type=authorization_code \
  -d code=AUTHORIZATION_CODE \
  -d redirect_uri=https://example.com/callback \
  -d client_id=YOUR_CLIENT_ID \
  -d client_secret=YOUR_CLIENT_SECRET \
  -d code_verifier=YOUR_VERIFIER
```

`redirect_uri` debe ser el mismo valor que enviaste al abrir la dirección de autorización. Envía `code_verifier` si enviaste un `code_challenge`.

Una respuesta correcta:

```json
{
  "access_token": "bmp_at_...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "profile email"
}
```

El token de acceso dura 1 hora. No hay tokens de actualización: cuando el token caduca, vuelve a llevar al usuario por el inicio de sesión. Si todavía tiene una sesión de BeamMP, es un proceso rápido.

## Lee el perfil del usuario

```bash
curl https://api.beammp.com/v1/oauth/userinfo \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

```json
{
  "sub": "12345",
  "username": "Racer",
  "picture": "https://api.beammp.com/v1/avatars/abc123",
  "email": "racer@example.com",
  "email_verified": true
}
```

| Campo | Ámbito necesario | Notas |
|---|---|---|
| `sub` | Cualquiera | El ID de cuenta de BeamMP permanente del usuario, como cadena de texto. Úsalo para identificar la cuenta. |
| `username` | `profile` | Puede cambiar con el tiempo. No lo uses como clave. |
| `picture` | `profile` | La dirección del avatar del usuario, o `null`. Se puede mostrar en cualquier sitio web. |
| `email` | `email` | La dirección de correo electrónico principal del usuario, o `null`. |
| `email_verified` | `email` | Indica si esa dirección ha sido verificada. |

BeamMP comprueba la cuenta en cada llamada. Si el usuario es suspendido o desactivado después de aprobar tu aplicación, userinfo devuelve `401 invalid_token` hasta que su cuenta vuelva a estar en regla.

## Revoca un token

Cuando un usuario desconecta tu aplicación, revoca su token:

```bash
curl -X POST https://api.beammp.com/v1/oauth/revoke \
  -u "YOUR_CLIENT_ID:YOUR_CLIENT_SECRET" \
  -d token=ACCESS_TOKEN
```

Siempre devuelve `200 {}`, como describe la RFC 7009, incluso para tokens desconocidos o caducados. Solo puedes revocar tokens emitidos a tu propia aplicación. Enviar el secreto es opcional, pero si lo envías debe ser correcto.

## Ámbitos {#scopes}

| Ámbito | Te da |
|---|---|
| `profile` (por defecto) | `sub`, `username`, `picture` |
| `email` | `email`, `email_verified` |

`openid` no se admite. Muchas bibliotecas de OAuth lo añaden por defecto. Desactiva esa opción, o la solicitud se detendrá con un mensaje que nombra el permiso no admitido.

Pide solo lo que necesites: los usuarios ven cada permiso en la pantalla de aprobación.

## Autenticación del cliente

Puedes autenticar la solicitud del token de dos maneras:

- **Client secret**, para una aplicación web con servidor. Usa HTTP Basic, o envía `client_id` y `client_secret` en el cuerpo. Usa un solo método, nunca los dos. Si usas Basic y además envías un `client_id` en el cuerpo, debe coincidir.
- **PKCE**, para aplicaciones que no pueden guardar un secreto, o como protección adicional. Envía `code_challenge` al abrir la dirección de autorización y `code_verifier` al canjear el código.

Una solicitud de token debe acreditar al menos uno de los dos. Si enviaste un `code_challenge`, el `code_verifier` se comprueba siempre, incluso si también envías un secreto. Un secreto incorrecto se rechaza sin consumir el código. Se recomienda usar PKCE además del secreto.

## PKCE {#pkce}

Solo se admite el método `S256`.

- `code_verifier`: una cadena aleatoria de 43 a 128 caracteres de `A-Z a-z 0-9 - . _ ~`.
- `code_challenge`: el hash SHA-256 del verifier, codificado en base64url sin relleno. Siempre tiene 43 caracteres.

```js
import crypto from "node:crypto";

const verifier = crypto.randomBytes(32).toString("base64url");           // 43 characters
const challenge = crypto.createHash("sha256").update(verifier).digest("base64url");
// send `challenge` when you open the authorization address; keep `verifier` and send it when you exchange the code
```

## Errores

Los errores del token y de la revocación son JSON con un código estándar:

```json
{ "error": "invalid_grant", "error_description": "Authorization code is invalid, expired, or does not match this request" }
```

| `error` | Estado | Significado |
|---|---|---|
| `invalid_request` | 400 | Falta un parámetro obligatorio, o se usaron los dos métodos de autenticación del cliente. |
| `invalid_client` | 401 | Cliente desconocido, secreto incorrecto, o ni secreto ni PKCE. |
| `invalid_grant` | 400 | El código no es válido, ha caducado, ya se usó o no coincide con la aplicación o con `redirect_uri`. También: falló la verificación PKCE, o la cuenta no está disponible, por ejemplo porque está suspendida. |
| `unsupported_grant_type` | 400 | Solo se admite `authorization_code`. |
| `invalid_token` (userinfo) | 401 | El token de acceso no es válido, ha caducado o ha sido revocado, o su cuenta no está disponible. |

## Límites y duraciones

| Elemento | Valor |
|---|---|
| Código de autorización | 5 minutos, de un solo uso |
| Token de acceso | 1 hora |
| Endpoints del token y de la revocación | Las solicitudes fallidas están limitadas a 30 por minuto por dirección IP. Las solicitudes correctas no cuentan. |
| Endpoint userinfo | 600 solicitudes por minuto por dirección IP |

## URI de redirección

- Una URI de redirección debe coincidir exactamente con una registrada: esquema, host, puerto, ruta y query.
- Usa URI de redirección `https://` en producción. `http://` solo se acepta para `localhost` y `127.0.0.1`, durante el desarrollo.

## Antes de publicar

- Rellena la URL de tu política de privacidad para que los usuarios puedan leerla antes de aprobar.
- Genera un `state` aleatorio nuevo en cada inicio de sesión y verifícalo cuando el usuario vuelva.
- Usa PKCE, incluso con un client secret.
- Guarda el client secret únicamente en tu servidor.
- Identifica a los usuarios por `sub`, nunca por `username` ni por `email`.
- Llama al endpoint del token desde tu servidor, no desde el navegador.
- No registres ni guardes los tokens de acceso más tiempo del necesario.
