---
description: "Lass Nutzer sich mit ihrem BeamMP-Konto in deiner App anmelden: App erstellen, Nutzer zu BeamMP schicken, den Code gegen ein Token tauschen und das Profil abrufen."
---
# Mit BeamMP anmelden

Diese Seite richtet sich an Entwickler, die Nutzern die Anmeldung auf ihrer eigenen Website oder in ihrer eigenen App mit einem BeamMP-Konto ermöglichen wollen. Am Ende hast du eine funktionierende OAuth-2.0-Anmeldung, die die BeamMP-Konto-ID, den Benutzernamen und den Avatar der Person zurückgibt und, wenn sie es erlaubt, auch ihre E-Mail-Adresse.

BeamMP verwendet den OAuth-2.0-Ablauf **Authorization Code**. Es wird nur OAuth 2.0 unterstützt, nicht OpenID Connect: Es gibt kein `id_token`, kein Discovery-Dokument und kein JWKS.

## Endpunkte

| Zweck | Methode und Adresse |
|---|---|
| Autorisierung (im Browser des Nutzers öffnen) | `GET https://accounts.beammp.com/auth/external` |
| Token-Austausch | `POST https://api.beammp.com/v1/oauth/token` |
| Nutzerprofil | `GET https://api.beammp.com/v1/oauth/userinfo` |
| Token widerrufen | `POST https://api.beammp.com/v1/oauth/revoke` |

## Deine App erstellen

Du erstellst eine App in der **Developer Console** deines BeamMP-Kontos auf [accounts.beammp.com](https://accounts.beammp.com). Entwicklerfunktionen werden pro Konto freigeschaltet und sind standardmäßig nicht aktiv. Um sie zu erhalten, frag das BeamMP-Team auf dem [Discord-Server](https://discord.gg/beammp).

Du gibst Folgendes an:

| Feld | Hinweise |
|---|---|
| App-Name | 3 bis 80 Zeichen. Wird Nutzern angezeigt, wenn sie gefragt werden, ob sie deine App zulassen. |
| Website | Optional. Eine vollständige `https://`- oder `http://`-Adresse. Wird auf der Zustimmungsseite als Link angezeigt. |
| URL der Datenschutzerklärung | Optional, aber dringend empfohlen. Eine vollständige `https://`- oder `http://`-Adresse. Wird auf der Zustimmungsseite als Link angezeigt, damit Nutzer vor ihrer Zustimmung nachlesen können, was du mit ihren Daten machst. Wenn du sie weglässt, steht auf der Zustimmungsseite, dass du keine angegeben hast. |
| Beschreibung | Optional. Wird auf der Zustimmungsseite angezeigt. |
| Redirect-URIs | Eine pro Zeile. `https://`-Adressen oder, während der Entwicklung, `http://` für `localhost` und `127.0.0.1`. Eigene Schemata werden nicht akzeptiert. |

Die Adressen für Website und Datenschutzerklärung werden beim Speichern geprüft. Akzeptiert werden nur einfache `http://`- oder `https://`-Adressen: keine `javascript:`-, `data:`- oder `ftp:`-Adressen und keine Adressen, die einen Benutzernamen und ein Passwort enthalten.

Danach erhältst du eine **Client-ID** und ein **Client-Secret**. Das Secret wird nur einmal angezeigt, du kannst es aber später erneuern.

::: warning Behalte das Secret auf deinem Server
Lege das Client-Secret niemals in einem Browser oder in einer mobilen App ab. Wenn deine App kein Secret geheim halten kann, zum Beispiel eine Single-Page-App, verwende stattdessen [PKCE](#pkce).
:::

## Den Nutzer zu BeamMP schicken

Öffne diese Adresse im Browser des Nutzers:

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

| Parameter | Erforderlich | Hinweise |
|---|---|---|
| `client_id` | Ja | Deine Client-ID. |
| `redirect_uri` | Ja | Muss genau mit einer der von dir registrierten Redirect-URIs übereinstimmen. |
| `response_type` | Ja | Muss `code` sein. Etwas anderes wird nicht unterstützt. |
| `scope` | Nein | Durch Leerzeichen getrennt. Standardwert ist `profile`. Siehe [Scopes](#scopes). |
| `state` | Empfohlen | Ein zufälliger Wert, den du selbst erzeugst. Er wird unverändert zurückgegeben. Prüfe, ob er übereinstimmt, um gefälschte Callbacks zu verhindern. |
| `code_challenge` | Empfohlen | Die PKCE-Challenge. Siehe [PKCE](#pkce). |
| `code_challenge_method` | Mit einer Challenge | Muss `S256` sein. `plain` wird nicht unterstützt. |

Der Nutzer meldet sich bei BeamMP an, wenn sein Konto es verlangt mit Passwort und Zwei-Faktor-Code. Danach sieht er einen Bildschirm mit dem Namen, der Beschreibung, der Website und dem Link zur Datenschutzerklärung deiner App sowie den Berechtigungen, die du angefragt hast. Er stimmt zu oder lehnt ab.

Ist die Anfrage selbst ungültig, etwa wegen einer unbekannten App, einer nicht registrierten `redirect_uri` oder eines nicht unterstützten Scopes, zeigt BeamMP dem Nutzer den Fehler an und leitet nicht zu deiner App weiter.

Konten, die gesperrt oder deaktiviert sind oder sich noch in der Wiederherstellung befinden, können nichts autorisieren.

## Den Code empfangen

Wenn der Nutzer zustimmt, leitet BeamMP ihn an deine `redirect_uri` weiter:

```
https://example.com/callback?code=AUTHORIZATION_CODE&state=RANDOM_VALUE
```

Wenn er ablehnt, erhältst du stattdessen `?error=access_denied&state=RANDOM_VALUE`.

Der Code ist 5 Minuten gültig und kann einmal verwendet werden. Auch ein fehlgeschlagener Einlöseversuch verbraucht ihn, fordere daher einen neuen Code an, statt es erneut zu versuchen.

## Den Code gegen ein Zugriffstoken tauschen

Rufe den Token-Endpunkt von deinem Server aus auf. Sende den Body als `application/x-www-form-urlencoded`. JSON wird ebenfalls akzeptiert.

Mit einem Client-Secret per HTTP Basic:

```bash
curl -X POST https://api.beammp.com/v1/oauth/token \
  -u "YOUR_CLIENT_ID:YOUR_CLIENT_SECRET" \
  -d grant_type=authorization_code \
  -d code=AUTHORIZATION_CODE \
  -d redirect_uri=https://example.com/callback \
  -d code_verifier=YOUR_VERIFIER
```

Oder mit den Zugangsdaten im Body:

```bash
curl -X POST https://api.beammp.com/v1/oauth/token \
  -d grant_type=authorization_code \
  -d code=AUTHORIZATION_CODE \
  -d redirect_uri=https://example.com/callback \
  -d client_id=YOUR_CLIENT_ID \
  -d client_secret=YOUR_CLIENT_SECRET \
  -d code_verifier=YOUR_VERIFIER
```

`redirect_uri` muss derselbe Wert sein, den du beim Öffnen der Autorisierungsadresse gesendet hast. Sende `code_verifier`, wenn du eine `code_challenge` gesendet hast.

Eine erfolgreiche Antwort:

```json
{
  "access_token": "bmp_at_...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "profile email"
}
```

Das Zugriffstoken ist 1 Stunde gültig. Refresh-Tokens gibt es nicht: Wenn das Token abläuft, schicke den Nutzer erneut durch die Anmeldung. Hat er noch eine BeamMP-Sitzung, geht das schnell.

## Das Profil des Nutzers abrufen

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

| Feld | Erforderlicher Scope | Hinweise |
|---|---|---|
| `sub` | Beliebig | Die dauerhafte BeamMP-Konto-ID des Nutzers als String. Verwende sie, um das Konto zu identifizieren. |
| `username` | `profile` | Kann sich mit der Zeit ändern. Verwende ihn nicht als Schlüssel. |
| `picture` | `profile` | Die Adresse des Avatars des Nutzers oder `null`. Er kann auf jeder Website angezeigt werden. |
| `email` | `email` | Die primäre E-Mail-Adresse des Nutzers oder `null`. |
| `email_verified` | `email` | Ob diese Adresse bestätigt wurde. |

BeamMP prüft das Konto bei jedem Aufruf. Wird der Nutzer gesperrt oder deaktiviert, nachdem er deiner App zugestimmt hat, gibt userinfo `401 invalid_token` zurück, bis sein Konto wieder in Ordnung ist.

## Ein Token widerrufen

Wenn ein Nutzer deine App trennt, widerrufe sein Token:

```bash
curl -X POST https://api.beammp.com/v1/oauth/revoke \
  -u "YOUR_CLIENT_ID:YOUR_CLIENT_SECRET" \
  -d token=ACCESS_TOKEN
```

Das gibt immer `200 {}` zurück, wie in RFC 7009 beschrieben, auch bei unbekannten oder abgelaufenen Tokens. Du kannst nur Tokens widerrufen, die für deine eigene App ausgestellt wurden. Das Senden des Secrets ist optional, aber wenn du eines sendest, muss es korrekt sein.

## Scopes {#scopes}

| Scope | Gibt dir |
|---|---|
| `profile` (Standard) | `sub`, `username`, `picture` |
| `email` | `email`, `email_verified` |

`openid` wird nicht unterstützt. Viele OAuth-Bibliotheken fügen es standardmäßig hinzu. Schalte das ab, sonst wird die Anfrage mit einer Meldung abgebrochen, die die nicht unterstützte Berechtigung nennt.

Frage nur an, was du brauchst: Nutzer sehen jede Berechtigung auf dem Zustimmungsbildschirm.

## Client-Authentifizierung

Du kannst die Token-Anfrage auf zwei Arten authentifizieren:

- **Client-Secret**, für eine Web-App mit Server. Verwende HTTP Basic oder sende `client_id` und `client_secret` im Body. Nutze eine Methode, niemals beide. Wenn du Basic verwendest und zusätzlich eine `client_id` im Body sendest, muss sie übereinstimmen.
- **PKCE**, für Apps, die kein Secret geheim halten können, oder als zusätzlicher Schutz. Sende `code_challenge`, wenn du die Autorisierungsadresse öffnest, und `code_verifier`, wenn du den Code tauschst.

Eine Token-Anfrage muss mindestens eines von beiden nachweisen. Wenn du eine `code_challenge` gesendet hast, wird der `code_verifier` immer geprüft, auch wenn du zusätzlich ein Secret sendest. Ein falsches Secret wird abgelehnt, ohne den Code zu verbrauchen. Es wird empfohlen, zusätzlich zum Secret auch PKCE zu verwenden.

## PKCE {#pkce}

Es wird nur die Methode `S256` unterstützt.

- `code_verifier`: eine zufällige Zeichenfolge aus 43 bis 128 Zeichen aus `A-Z a-z 0-9 - . _ ~`.
- `code_challenge`: der SHA-256-Hash des Verifiers, base64url-kodiert ohne Padding. Er ist immer 43 Zeichen lang.

```js
import crypto from "node:crypto";

const verifier = crypto.randomBytes(32).toString("base64url");           // 43 characters
const challenge = crypto.createHash("sha256").update(verifier).digest("base64url");
// send `challenge` when you open the authorization address; keep `verifier` and send it when you exchange the code
```

## Fehler

Fehler beim Token- und Revoke-Endpunkt sind JSON mit einem Standardcode:

```json
{ "error": "invalid_grant", "error_description": "Authorization code is invalid, expired, or does not match this request" }
```

| `error` | Status | Bedeutung |
|---|---|---|
| `invalid_request` | 400 | Ein erforderlicher Parameter fehlt, oder es wurden beide Methoden der Client-Authentifizierung verwendet. |
| `invalid_client` | 401 | Unbekannter Client, falsches Secret oder weder ein Secret noch PKCE. |
| `invalid_grant` | 400 | Der Code ist ungültig, abgelaufen, bereits verwendet oder passt nicht zur App oder zur `redirect_uri`. Außerdem: Die PKCE-Prüfung ist fehlgeschlagen, oder das Konto ist nicht verfügbar, zum Beispiel weil es gesperrt ist. |
| `unsupported_grant_type` | 400 | Es wird nur `authorization_code` unterstützt. |
| `invalid_token` (userinfo) | 401 | Das Zugriffstoken ist ungültig, abgelaufen oder widerrufen, oder sein Konto ist nicht verfügbar. |

## Limits und Gültigkeitsdauern

| Element | Wert |
|---|---|
| Autorisierungscode | 5 Minuten, einmal verwendbar |
| Zugriffstoken | 1 Stunde |
| Token- und Revoke-Endpunkte | Fehlgeschlagene Anfragen sind auf 30 pro Minute und IP-Adresse begrenzt. Erfolgreiche Anfragen werden nicht gezählt. |
| Userinfo-Endpunkt | 600 Anfragen pro Minute und IP-Adresse |

## Redirect-URIs

- Eine Redirect-URI muss genau mit einer registrierten übereinstimmen: Schema, Host, Port, Pfad und Query.
- Verwende in der Produktion `https://`-Redirect-URIs. `http://` wird nur für `localhost` und `127.0.0.1` akzeptiert, für die Entwicklung.

## Bevor du live gehst

- Trage die URL deiner Datenschutzerklärung ein, damit Nutzer sie vor ihrer Zustimmung lesen können.
- Erzeuge für jede Anmeldung einen neuen zufälligen `state` und prüfe ihn, wenn der Nutzer zurückkommt.
- Verwende PKCE, auch mit einem Client-Secret.
- Behalte das Client-Secret ausschließlich auf deinem Server.
- Identifiziere Nutzer anhand von `sub`, niemals anhand von `username` oder `email`.
- Rufe den Token-Endpunkt von deinem Server aus auf, nicht vom Browser.
- Protokolliere oder speichere Zugriffstokens nicht länger als nötig.
