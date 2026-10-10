---
description: "Let people sign in to your app with their BeamMP account: create an app, send users to BeamMP, exchange the code for a token and read the user's profile."
---
# Sign in with BeamMP

This page is for developers who want people to sign in to their own website or app with a BeamMP account. You will end with a working OAuth 2.0 sign-in that returns the person's BeamMP account ID, username, avatar and, if they allow it, email address.

BeamMP uses the OAuth 2.0 **authorization code** flow. It is OAuth 2.0 only, not OpenID Connect: there is no `id_token`, no discovery document and no JWKS.

## Endpoints

| Purpose | Method and address |
|---|---|
| Authorization (open in the user's browser) | `GET https://accounts.beammp.com/auth/external` |
| Token exchange | `POST https://api.beammp.com/v1/oauth/token` |
| User profile | `GET https://api.beammp.com/v1/oauth/userinfo` |
| Revoke a token | `POST https://api.beammp.com/v1/oauth/revoke` |

## Create your app

You create an app in the **Developer Console** of your BeamMP account at [accounts.beammp.com](https://accounts.beammp.com). Developer features are switched on per account and are not on by default. To get them, ask the BeamMP team on the [Discord server](https://discord.gg/beammp).

You enter:

| Field | Notes |
|---|---|
| App name | 3 to 80 characters. Shown to people when they are asked to approve your app. |
| Website | Optional. A full `https://` or `http://` address. Shown as a link on the approval page. |
| Privacy policy URL | Optional, but strongly recommended. A full `https://` or `http://` address. Shown as a link on the approval page, so people can read what you do with their data before they approve. If you leave it out, the approval page says you have not provided one. |
| Description | Optional. Shown on the approval page. |
| Redirect URIs | One per line. `https://` addresses, or `http://` for `localhost` and `127.0.0.1` while you develop. Custom schemes are not accepted. |

Website and privacy policy addresses are checked when you save them. Only plain `http://` or `https://` addresses are accepted: no `javascript:`, `data:` or `ftp:` addresses, and no address with a username and password in it.

You then get a **client ID** and a **client secret**. The secret is shown once, and you can rotate it later.

::: warning Keep the secret on your server
Never put the client secret in a browser or mobile app. If your app cannot keep a secret, for example a single-page app, use [PKCE](#pkce) instead.
:::

## Send the user to BeamMP

Open this address in the user's browser:

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

| Parameter | Required | Notes |
|---|---|---|
| `client_id` | Yes | Your client ID. |
| `redirect_uri` | Yes | Must exactly match one of the redirect URIs you registered. |
| `response_type` | Yes | Must be `code`. Nothing else is supported. |
| `scope` | No | Space-separated. Defaults to `profile`. See [Scopes](#scopes). |
| `state` | Recommended | A random value you generate. It is returned unchanged. Check that it matches, to prevent forged callbacks. |
| `code_challenge` | Recommended | The PKCE challenge. See [PKCE](#pkce). |
| `code_challenge_method` | With a challenge | Must be `S256`. `plain` is not supported. |

The user signs in to BeamMP, with a password and two-factor code if their account requires them. They then see a screen with your app's name, description, website and privacy policy link, and the permissions you asked for. They approve or deny.

If the request itself is invalid, such as an unknown app, a `redirect_uri` that is not registered or an unsupported scope, BeamMP shows the error to the user and does not redirect to your app.

Accounts that are suspended, deactivated or still awaiting recovery cannot authorize anything.

## Receive the code

When the user approves, BeamMP redirects them to your `redirect_uri`:

```
https://example.com/callback?code=AUTHORIZATION_CODE&state=RANDOM_VALUE
```

If they deny, you get `?error=access_denied&state=RANDOM_VALUE` instead.

The code is valid for 5 minutes and can be used once. A failed attempt to redeem it uses it up, so request a new code instead of retrying.

## Exchange the code for an access token

Call the token endpoint from your server. Send the body as `application/x-www-form-urlencoded`. JSON is also accepted.

With a client secret, using HTTP Basic authentication:

```bash
curl -X POST https://api.beammp.com/v1/oauth/token \
  -u "YOUR_CLIENT_ID:YOUR_CLIENT_SECRET" \
  -d grant_type=authorization_code \
  -d code=AUTHORIZATION_CODE \
  -d redirect_uri=https://example.com/callback \
  -d code_verifier=YOUR_VERIFIER
```

Or with the credentials in the body:

```bash
curl -X POST https://api.beammp.com/v1/oauth/token \
  -d grant_type=authorization_code \
  -d code=AUTHORIZATION_CODE \
  -d redirect_uri=https://example.com/callback \
  -d client_id=YOUR_CLIENT_ID \
  -d client_secret=YOUR_CLIENT_SECRET \
  -d code_verifier=YOUR_VERIFIER
```

`redirect_uri` must be the same value you sent when you opened the authorization address. Send `code_verifier` if you sent a `code_challenge`.

A successful response:

```json
{
  "access_token": "bmp_at_...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "profile email"
}
```

The access token lasts 1 hour. There are no refresh tokens: when the token expires, send the user through the sign-in again. If they still have a BeamMP session, this is quick.

## Read the user's profile

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

| Field | Scope needed | Notes |
|---|---|---|
| `sub` | Any | The user's permanent BeamMP account ID, as a string. Use it to identify the account. |
| `username` | `profile` | Can change over time. Do not use it as a key. |
| `picture` | `profile` | The address of the user's avatar, or `null`. It can be shown on any website. |
| `email` | `email` | The user's primary email address, or `null`. |
| `email_verified` | `email` | Whether that address has been verified. |

BeamMP checks the account on every call. If the user is suspended or deactivated after approving your app, userinfo returns `401 invalid_token` until their account is back in good standing.

## Revoke a token

When a user disconnects your app, revoke their token:

```bash
curl -X POST https://api.beammp.com/v1/oauth/revoke \
  -u "YOUR_CLIENT_ID:YOUR_CLIENT_SECRET" \
  -d token=ACCESS_TOKEN
```

This always returns `200 {}`, as RFC 7009 describes, including for tokens that are unknown or expired. You can only revoke tokens issued to your own app. Sending the secret is optional, but if you send one it must be correct.

## Scopes

| Scope | Gives you |
|---|---|
| `profile` (default) | `sub`, `username`, `picture` |
| `email` | `email`, `email_verified` |

`openid` is not supported. Many OAuth libraries add it by default. Turn that off, or the request is stopped with a message naming the unsupported permission.

Ask only for what you need: users see each permission on the approval screen.

## Client authentication

You can authenticate the token request in either of two ways:

- **Client secret**, for a web app with a server. Use HTTP Basic, or send `client_id` and `client_secret` in the body. Use one method, never both. If you use Basic and also send a `client_id` in the body, it must match.
- **PKCE**, for apps that cannot keep a secret, or as extra protection. Send `code_challenge` when you open the authorization address, and `code_verifier` when you exchange the code.

A token request must prove at least one of the two. If you sent a `code_challenge`, the `code_verifier` is always checked, even when you also send a secret. A wrong secret is refused without using up the code. Using PKCE as well as a secret is recommended.

## PKCE

Only the `S256` method is supported.

- `code_verifier`: a random string of 43 to 128 characters from `A-Z a-z 0-9 - . _ ~`.
- `code_challenge`: the SHA-256 hash of the verifier, base64url-encoded without padding. It is always 43 characters.

```js
import crypto from "node:crypto";

const verifier = crypto.randomBytes(32).toString("base64url");           // 43 characters
const challenge = crypto.createHash("sha256").update(verifier).digest("base64url");
// send `challenge` when you open the authorization address; keep `verifier` and send it when you exchange the code
```

## Errors

Token and revoke errors are JSON with a standard code:

```json
{ "error": "invalid_grant", "error_description": "Authorization code is invalid, expired, or does not match this request" }
```

| `error` | Status | Meaning |
|---|---|---|
| `invalid_request` | 400 | A required parameter is missing, or both client authentication methods were used. |
| `invalid_client` | 401 | Unknown client, wrong secret, or neither a secret nor PKCE. |
| `invalid_grant` | 400 | The code is invalid, expired, already used, or does not match the app or `redirect_uri`. Also: PKCE verification failed, or the account is not available, for example because it is suspended. |
| `unsupported_grant_type` | 400 | Only `authorization_code` is supported. |
| `invalid_token` (userinfo) | 401 | The access token is invalid, expired or revoked, or its account is not available. |

## Limits and lifetimes

| Item | Value |
|---|---|
| Authorization code | 5 minutes, single use |
| Access token | 1 hour |
| Token and revoke endpoints | Failed requests are limited to 30 per minute per IP address. Successful requests are not counted. |
| Userinfo endpoint | 600 requests per minute per IP address |

## Redirect URIs

- A redirect URI must match a registered one exactly: scheme, host, port, path and query.
- Use `https://` redirect URIs in production. `http://` is accepted only for `localhost` and `127.0.0.1`, for development.

## Before you go live

- Fill in your privacy policy URL so people can read it before approving.
- Generate a fresh random `state` for every sign-in and verify it when the user returns.
- Use PKCE, even with a client secret.
- Keep the client secret on your server only.
- Identify users by `sub`, never by `username` or `email`.
- Call the token endpoint from your server, not from the browser.
- Do not log or store access tokens longer than you need to.
