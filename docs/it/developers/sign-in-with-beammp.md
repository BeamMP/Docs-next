---
description: "Permetti agli utenti di accedere alla tua app con il loro account BeamMP: crea un'app, indirizza gli utenti a BeamMP, scambia il codice con un token e leggi il profilo."
---
# Accedi con BeamMP

Questa pagina è per gli sviluppatori che vogliono permettere agli utenti di accedere al proprio sito web o alla propria app con un account BeamMP. Alla fine avrai un accesso OAuth 2.0 funzionante, che restituisce l'ID account BeamMP della persona, il nome utente, l'avatar e, se lo consente, l'indirizzo email.

BeamMP usa il flusso **authorization code** di OAuth 2.0. Supporta solo OAuth 2.0, non OpenID Connect: non ci sono `id_token`, documento di discovery né JWKS.

## Endpoint

| Scopo | Metodo e indirizzo |
|---|---|
| Autorizzazione (da aprire nel browser dell'utente) | `GET https://accounts.beammp.com/auth/external` |
| Scambio del token | `POST https://api.beammp.com/v1/oauth/token` |
| Profilo utente | `GET https://api.beammp.com/v1/oauth/userinfo` |
| Revoca di un token | `POST https://api.beammp.com/v1/oauth/revoke` |

## Crea la tua app

Crei un'app nella **Developer Console** del tuo account BeamMP su [accounts.beammp.com](https://accounts.beammp.com). Le funzioni per sviluppatori si attivano account per account e non sono attive di default. Per ottenerle, chiedi al team di BeamMP sul [server Discord](https://discord.gg/beammp).

Inserisci:

| Campo | Note |
|---|---|
| Nome dell'app | Da 3 a 80 caratteri. Viene mostrato agli utenti quando devono approvare la tua app. |
| Sito web | Facoltativo. Un indirizzo completo `https://` o `http://`. Viene mostrato come link nella pagina di approvazione. |
| URL dell'informativa sulla privacy | Facoltativo, ma fortemente consigliato. Un indirizzo completo `https://` o `http://`. Viene mostrato come link nella pagina di approvazione, così gli utenti possono leggere cosa fai con i loro dati prima di approvare. Se lo lasci vuoto, la pagina di approvazione indica che non ne hai fornita una. |
| Descrizione | Facoltativa. Viene mostrata nella pagina di approvazione. |
| URI di reindirizzamento | Uno per riga. Indirizzi `https://`, oppure `http://` per `localhost` e `127.0.0.1` durante lo sviluppo. Gli schemi personalizzati non sono accettati. |

Gli indirizzi del sito web e dell'informativa sulla privacy vengono verificati quando li salvi. Sono accettati solo indirizzi `http://` o `https://` semplici: niente indirizzi `javascript:`, `data:` o `ftp:`, e nessun indirizzo che contenga un nome utente e una password.

Otterrai quindi un **client ID** e un **client secret**. Il secret viene mostrato una sola volta e puoi cambiarlo in seguito.

::: warning Tieni il secret sul tuo server
Non inserire mai il client secret in un browser o in un'app mobile. Se la tua app non può custodire un secret, ad esempio una single-page app, usa invece [PKCE](#pkce).
:::

## Indirizza l'utente a BeamMP

Apri questo indirizzo nel browser dell'utente:

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

| Parametro | Obbligatorio | Note |
|---|---|---|
| `client_id` | Sì | Il tuo client ID. |
| `redirect_uri` | Sì | Deve corrispondere esattamente a uno degli URI di reindirizzamento che hai registrato. |
| `response_type` | Sì | Deve essere `code`. Non è supportato nient'altro. |
| `scope` | No | Separati da spazi. Il valore predefinito è `profile`. Vedi [Ambiti](#scopes). |
| `state` | Consigliato | Un valore casuale che generi tu. Viene restituito invariato. Verifica che corrisponda, per prevenire callback falsificate. |
| `code_challenge` | Consigliato | La challenge PKCE. Vedi [PKCE](#pkce). |
| `code_challenge_method` | Con una challenge | Deve essere `S256`. `plain` non è supportato. |

L'utente accede a BeamMP, con password e codice a due fattori se il suo account li richiede. Vede poi una schermata con il nome, la descrizione, il sito web e il link all'informativa sulla privacy della tua app, insieme ai permessi che hai richiesto. Può approvare o rifiutare.

Se la richiesta stessa non è valida, ad esempio per un'app sconosciuta, un `redirect_uri` non registrato o uno scope non supportato, BeamMP mostra l'errore all'utente e non lo reindirizza alla tua app.

Gli account sospesi, disattivati o ancora in attesa di recupero non possono autorizzare nulla.

## Ricevi il codice

Quando l'utente approva, BeamMP lo reindirizza al tuo `redirect_uri`:

```
https://example.com/callback?code=AUTHORIZATION_CODE&state=RANDOM_VALUE
```

Se rifiuta, ricevi invece `?error=access_denied&state=RANDOM_VALUE`.

Il codice è valido per 5 minuti e può essere usato una sola volta. Un tentativo di riscatto non riuscito lo consuma, quindi richiedi un nuovo codice invece di riprovare.

## Scambia il codice con un token di accesso

Chiama l'endpoint del token dal tuo server. Invia il corpo come `application/x-www-form-urlencoded`. È accettato anche JSON.

Con un client secret, usando l'autenticazione HTTP Basic:

```bash
curl -X POST https://api.beammp.com/v1/oauth/token \
  -u "YOUR_CLIENT_ID:YOUR_CLIENT_SECRET" \
  -d grant_type=authorization_code \
  -d code=AUTHORIZATION_CODE \
  -d redirect_uri=https://example.com/callback \
  -d code_verifier=YOUR_VERIFIER
```

Oppure con le credenziali nel corpo:

```bash
curl -X POST https://api.beammp.com/v1/oauth/token \
  -d grant_type=authorization_code \
  -d code=AUTHORIZATION_CODE \
  -d redirect_uri=https://example.com/callback \
  -d client_id=YOUR_CLIENT_ID \
  -d client_secret=YOUR_CLIENT_SECRET \
  -d code_verifier=YOUR_VERIFIER
```

`redirect_uri` deve essere lo stesso valore che hai inviato quando hai aperto l'indirizzo di autorizzazione. Invia `code_verifier` se hai inviato un `code_challenge`.

Una risposta di successo:

```json
{
  "access_token": "bmp_at_...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "profile email"
}
```

Il token di accesso dura 1 ora. Non ci sono refresh token: quando il token scade, fai ripassare l'utente dall'accesso. Se ha ancora una sessione BeamMP, è un'operazione rapida.

## Leggi il profilo dell'utente

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

| Campo | Scope necessario | Note |
|---|---|---|
| `sub` | Qualsiasi | L'ID account BeamMP permanente dell'utente, come stringa. Usalo per identificare l'account. |
| `username` | `profile` | Può cambiare nel tempo. Non usarlo come chiave. |
| `picture` | `profile` | L'indirizzo dell'avatar dell'utente, oppure `null`. Può essere mostrato su qualsiasi sito web. |
| `email` | `email` | L'indirizzo email principale dell'utente, oppure `null`. |
| `email_verified` | `email` | Indica se quell'indirizzo è stato verificato. |

BeamMP controlla l'account a ogni chiamata. Se l'utente viene sospeso o disattivato dopo aver approvato la tua app, userinfo restituisce `401 invalid_token` finché il suo account non torna in regola.

## Revoca un token

Quando un utente scollega la tua app, revoca il suo token:

```bash
curl -X POST https://api.beammp.com/v1/oauth/revoke \
  -u "YOUR_CLIENT_ID:YOUR_CLIENT_SECRET" \
  -d token=ACCESS_TOKEN
```

Restituisce sempre `200 {}`, come descritto dalla RFC 7009, anche per token sconosciuti o scaduti. Puoi revocare solo i token emessi per la tua app. Inviare il secret è facoltativo, ma se lo invii deve essere corretto.

## Ambiti (scope) {#scopes}

| Scope | Cosa ottieni |
|---|---|
| `profile` (predefinito) | `sub`, `username`, `picture` |
| `email` | `email`, `email_verified` |

`openid` non è supportato. Molte librerie OAuth lo aggiungono di default. Disattiva questa opzione, altrimenti la richiesta viene bloccata con un messaggio che indica il permesso non supportato.

Chiedi solo ciò che ti serve: gli utenti vedono ogni permesso nella schermata di approvazione.

## Autenticazione del client

Puoi autenticare la richiesta del token in due modi:

- **Client secret**, per un'app web con un server. Usa HTTP Basic, oppure invia `client_id` e `client_secret` nel corpo. Usa un solo metodo, mai entrambi. Se usi Basic e invii anche un `client_id` nel corpo, deve corrispondere.
- **PKCE**, per le app che non possono custodire un secret, o come protezione aggiuntiva. Invia `code_challenge` quando apri l'indirizzo di autorizzazione e `code_verifier` quando scambi il codice.

Una richiesta di token deve dimostrare almeno uno dei due. Se hai inviato un `code_challenge`, il `code_verifier` viene sempre verificato, anche se invii pure un secret. Un secret errato viene rifiutato senza consumare il codice. Si consiglia di usare PKCE oltre al secret.

## PKCE {#pkce}

È supportato solo il metodo `S256`.

- `code_verifier`: una stringa casuale da 43 a 128 caratteri tra `A-Z a-z 0-9 - . _ ~`.
- `code_challenge`: l'hash SHA-256 del verifier, codificato in base64url senza padding. È sempre di 43 caratteri.

```js
import crypto from "node:crypto";

const verifier = crypto.randomBytes(32).toString("base64url");           // 43 characters
const challenge = crypto.createHash("sha256").update(verifier).digest("base64url");
// send `challenge` when you open the authorization address; keep `verifier` and send it when you exchange the code
```

## Errori

Gli errori del token e della revoca sono JSON con un codice standard:

```json
{ "error": "invalid_grant", "error_description": "Authorization code is invalid, expired, or does not match this request" }
```

| `error` | Stato | Significato |
|---|---|---|
| `invalid_request` | 400 | Manca un parametro obbligatorio, oppure sono stati usati entrambi i metodi di autenticazione del client. |
| `invalid_client` | 401 | Client sconosciuto, secret errato, oppure né secret né PKCE. |
| `invalid_grant` | 400 | Il codice non è valido, è scaduto, è già stato usato oppure non corrisponde all'app o al `redirect_uri`. Anche: la verifica PKCE non è riuscita, oppure l'account non è disponibile, ad esempio perché è sospeso. |
| `unsupported_grant_type` | 400 | È supportato solo `authorization_code`. |
| `invalid_token` (userinfo) | 401 | Il token di accesso non è valido, è scaduto o è stato revocato, oppure il suo account non è disponibile. |

## Limiti e durate

| Elemento | Valore |
|---|---|
| Codice di autorizzazione | 5 minuti, monouso |
| Token di accesso | 1 ora |
| Endpoint del token e della revoca | Le richieste non riuscite sono limitate a 30 al minuto per indirizzo IP. Le richieste riuscite non vengono contate. |
| Endpoint userinfo | 600 richieste al minuto per indirizzo IP |

## URI di reindirizzamento

- Un URI di reindirizzamento deve corrispondere esattamente a uno di quelli registrati: schema, host, porta, percorso e query.
- Usa URI di reindirizzamento `https://` in produzione. `http://` è accettato solo per `localhost` e `127.0.0.1`, durante lo sviluppo.

## Prima di andare in produzione

- Compila l'URL dell'informativa sulla privacy, così gli utenti possono leggerla prima di approvare.
- Genera un nuovo `state` casuale a ogni accesso e verificalo quando l'utente torna.
- Usa PKCE, anche con un client secret.
- Tieni il client secret solo sul tuo server.
- Identifica gli utenti tramite `sub`, mai tramite `username` o `email`.
- Chiama l'endpoint del token dal tuo server, non dal browser.
- Non registrare né conservare i token di accesso più a lungo del necessario.
