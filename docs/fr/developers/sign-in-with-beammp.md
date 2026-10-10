---
description: "Permettez à vos utilisateurs de se connecter à votre application avec leur compte BeamMP : créez une application, redirigez vers BeamMP, échangez le code contre un jeton et lisez le profil."
---
# Se connecter avec BeamMP

Cette page s'adresse aux développeurs qui souhaitent permettre à leurs utilisateurs de se connecter à leur propre site ou application avec un compte BeamMP. À la fin, vous disposerez d'une connexion OAuth 2.0 fonctionnelle qui renvoie l'identifiant de compte BeamMP de la personne, son nom d'utilisateur, son avatar et, si elle l'autorise, son adresse e-mail.

BeamMP utilise le flux OAuth 2.0 par **code d'autorisation**. Il s'agit uniquement d'OAuth 2.0, pas d'OpenID Connect : il n'y a ni `id_token`, ni document de découverte, ni JWKS.

## Points de terminaison

| Rôle | Méthode et adresse |
|---|---|
| Autorisation (à ouvrir dans le navigateur de l'utilisateur) | `GET https://accounts.beammp.com/auth/external` |
| Échange du code contre un jeton | `POST https://api.beammp.com/v1/oauth/token` |
| Profil de l'utilisateur | `GET https://api.beammp.com/v1/oauth/userinfo` |
| Révocation d'un jeton | `POST https://api.beammp.com/v1/oauth/revoke` |

## Créer votre application

Vous créez une application dans la **Console développeur** de votre compte BeamMP sur [accounts.beammp.com](https://accounts.beammp.com). Les fonctionnalités pour développeurs s'activent compte par compte et ne sont pas disponibles par défaut. Pour les obtenir, demandez à l'équipe BeamMP sur le [serveur Discord](https://discord.gg/beammp).

Vous renseignez les champs suivants :

| Champ | Remarques |
|---|---|
| Nom de l'application | De 3 à 80 caractères. Affiché aux utilisateurs lorsqu'on leur demande d'approuver votre application. |
| Site web | Facultatif. Une adresse complète en `https://` ou `http://`. Affichée sous forme de lien sur la page d'approbation. |
| URL de la politique de confidentialité | Facultatif, mais fortement recommandé. Une adresse complète en `https://` ou `http://`. Affichée sous forme de lien sur la page d'approbation, afin que les utilisateurs puissent lire ce que vous faites de leurs données avant d'approuver. Si vous ne la renseignez pas, la page d'approbation indique que vous n'en avez pas fourni. |
| Description | Facultatif. Affichée sur la page d'approbation. |
| URI de redirection | Une par ligne. Des adresses `https://`, ou `http://` pour `localhost` et `127.0.0.1` pendant le développement. Les schémas personnalisés ne sont pas acceptés. |

Les adresses du site web et de la politique de confidentialité sont vérifiées lors de l'enregistrement. Seules les adresses `http://` ou `https://` simples sont acceptées : pas d'adresses `javascript:`, `data:` ou `ftp:`, ni d'adresse contenant un nom d'utilisateur et un mot de passe.

Vous obtenez ensuite un **identifiant client** et un **secret client**. Le secret n'est affiché qu'une seule fois, et vous pourrez le renouveler plus tard.

::: warning Gardez le secret sur votre serveur
Ne placez jamais le secret client dans un navigateur ou une application mobile. Si votre application ne peut pas garder un secret, par exemple une application monopage, utilisez plutôt [PKCE](#pkce).
:::

## Rediriger l'utilisateur vers BeamMP

Ouvrez cette adresse dans le navigateur de l'utilisateur :

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

| Paramètre | Obligatoire | Remarques |
|---|---|---|
| `client_id` | Oui | Votre identifiant client. |
| `redirect_uri` | Oui | Doit correspondre exactement à l'un des URI de redirection que vous avez enregistrés. |
| `response_type` | Oui | Doit valoir `code`. Aucune autre valeur n'est prise en charge. |
| `scope` | Non | Séparés par des espaces. Vaut `profile` par défaut. Voir [Portées](#scopes). |
| `state` | Recommandé | Une valeur aléatoire que vous générez. Elle est renvoyée telle quelle. Vérifiez qu'elle correspond, afin d'empêcher les rappels falsifiés. |
| `code_challenge` | Recommandé | Le challenge PKCE. Voir [PKCE](#pkce). |
| `code_challenge_method` | Avec un challenge | Doit valoir `S256`. `plain` n'est pas pris en charge. |

L'utilisateur se connecte à BeamMP, avec un mot de passe et un code d'authentification à deux facteurs si son compte l'exige. Il voit ensuite un écran indiquant le nom de votre application, sa description, son site web et le lien vers sa politique de confidentialité, ainsi que les autorisations demandées. Il approuve ou refuse.

Si la requête elle-même est invalide, par exemple une application inconnue, un `redirect_uri` non enregistré ou une portée non prise en charge, BeamMP affiche l'erreur à l'utilisateur et ne le redirige pas vers votre application.

Les comptes suspendus, désactivés ou en attente de récupération ne peuvent rien autoriser.

## Recevoir le code

Lorsque l'utilisateur approuve, BeamMP le redirige vers votre `redirect_uri` :

```
https://example.com/callback?code=AUTHORIZATION_CODE&state=RANDOM_VALUE
```

S'il refuse, vous recevez à la place `?error=access_denied&state=RANDOM_VALUE`.

Le code est valable 5 minutes et ne peut être utilisé qu'une seule fois. Une tentative d'échange qui échoue consomme le code : demandez-en un nouveau au lieu de réessayer.

## Échanger le code contre un jeton d'accès

Appelez le point de terminaison des jetons depuis votre serveur. Envoyez le corps en `application/x-www-form-urlencoded`. Le JSON est également accepté.

Avec un secret client, en utilisant l'authentification HTTP Basic :

```bash
curl -X POST https://api.beammp.com/v1/oauth/token \
  -u "YOUR_CLIENT_ID:YOUR_CLIENT_SECRET" \
  -d grant_type=authorization_code \
  -d code=AUTHORIZATION_CODE \
  -d redirect_uri=https://example.com/callback \
  -d code_verifier=YOUR_VERIFIER
```

Ou avec les identifiants dans le corps de la requête :

```bash
curl -X POST https://api.beammp.com/v1/oauth/token \
  -d grant_type=authorization_code \
  -d code=AUTHORIZATION_CODE \
  -d redirect_uri=https://example.com/callback \
  -d client_id=YOUR_CLIENT_ID \
  -d client_secret=YOUR_CLIENT_SECRET \
  -d code_verifier=YOUR_VERIFIER
```

`redirect_uri` doit être la même valeur que celle envoyée à l'ouverture de l'adresse d'autorisation. Envoyez `code_verifier` si vous avez envoyé un `code_challenge`.

Une réponse réussie :

```json
{
  "access_token": "bmp_at_...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "profile email"
}
```

Le jeton d'accès est valable 1 heure. Il n'y a pas de jetons d'actualisation : lorsque le jeton expire, renvoyez l'utilisateur vers la page de connexion. S'il a toujours une session BeamMP, c'est rapide.

## Lire le profil de l'utilisateur

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

| Champ | Portée requise | Remarques |
|---|---|---|
| `sub` | Toutes | L'identifiant de compte BeamMP permanent de l'utilisateur, sous forme de chaîne. Utilisez-le pour identifier le compte. |
| `username` | `profile` | Peut changer au fil du temps. Ne l'utilisez pas comme clé. |
| `picture` | `profile` | L'adresse de l'avatar de l'utilisateur, ou `null`. Il peut être affiché sur n'importe quel site web. |
| `email` | `email` | L'adresse e-mail principale de l'utilisateur, ou `null`. |
| `email_verified` | `email` | Indique si cette adresse a été vérifiée. |

BeamMP vérifie le compte à chaque appel. Si l'utilisateur est suspendu ou désactivé après avoir approuvé votre application, le point de terminaison userinfo renvoie `401 invalid_token` jusqu'à ce que son compte soit de nouveau en règle.

## Révoquer un jeton

Lorsqu'un utilisateur déconnecte votre application, révoquez son jeton :

```bash
curl -X POST https://api.beammp.com/v1/oauth/revoke \
  -u "YOUR_CLIENT_ID:YOUR_CLIENT_SECRET" \
  -d token=ACCESS_TOKEN
```

Cet appel renvoie toujours `200 {}`, comme le décrit la RFC 7009, y compris pour les jetons inconnus ou expirés. Vous ne pouvez révoquer que les jetons émis pour votre propre application. L'envoi du secret est facultatif, mais si vous en envoyez un, il doit être correct.

## Portées {#scopes}

| Portée | Ce que vous obtenez |
|---|---|
| `profile` (par défaut) | `sub`, `username`, `picture` |
| `email` | `email`, `email_verified` |

`openid` n'est pas pris en charge. De nombreuses bibliothèques OAuth l'ajoutent par défaut. Désactivez ce comportement, sinon la requête est bloquée avec un message qui nomme l'autorisation non prise en charge.

Ne demandez que ce dont vous avez besoin : les utilisateurs voient chaque autorisation sur l'écran d'approbation.

## Authentification du client

Vous pouvez authentifier la requête de jeton de deux manières :

- **Secret client**, pour une application web dotée d'un serveur. Utilisez HTTP Basic, ou envoyez `client_id` et `client_secret` dans le corps. Utilisez une seule méthode, jamais les deux. Si vous utilisez Basic et envoyez aussi un `client_id` dans le corps, il doit correspondre.
- **PKCE**, pour les applications qui ne peuvent pas garder de secret, ou comme protection supplémentaire. Envoyez `code_challenge` lorsque vous ouvrez l'adresse d'autorisation, et `code_verifier` lorsque vous échangez le code.

Une requête de jeton doit prouver au moins l'un des deux. Si vous avez envoyé un `code_challenge`, le `code_verifier` est toujours vérifié, même si vous envoyez aussi un secret. Un secret erroné est refusé sans consommer le code. Il est recommandé d'utiliser PKCE en plus d'un secret.

## PKCE {#pkce}

Seule la méthode `S256` est prise en charge.

- `code_verifier` : une chaîne aléatoire de 43 à 128 caractères parmi `A-Z a-z 0-9 - . _ ~`.
- `code_challenge` : le hachage SHA-256 du verifier, encodé en base64url sans remplissage. Il fait toujours 43 caractères.

```js
import crypto from "node:crypto";

const verifier = crypto.randomBytes(32).toString("base64url");           // 43 characters
const challenge = crypto.createHash("sha256").update(verifier).digest("base64url");
// send `challenge` when you open the authorization address; keep `verifier` and send it when you exchange the code
```

## Erreurs

Les erreurs des points de terminaison de jeton et de révocation sont au format JSON, avec un code standard :

```json
{ "error": "invalid_grant", "error_description": "Authorization code is invalid, expired, or does not match this request" }
```

| `error` | Statut | Signification |
|---|---|---|
| `invalid_request` | 400 | Un paramètre obligatoire est manquant, ou les deux méthodes d'authentification du client ont été utilisées. |
| `invalid_client` | 401 | Client inconnu, secret erroné, ou ni secret ni PKCE. |
| `invalid_grant` | 400 | Le code est invalide, expiré, déjà utilisé, ou ne correspond pas à l'application ou au `redirect_uri`. Également : échec de la vérification PKCE, ou compte indisponible, par exemple parce qu'il est suspendu. |
| `unsupported_grant_type` | 400 | Seul `authorization_code` est pris en charge. |
| `invalid_token` (userinfo) | 401 | Le jeton d'accès est invalide, expiré ou révoqué, ou son compte n'est pas disponible. |

## Limites et durées de validité

| Élément | Valeur |
|---|---|
| Code d'autorisation | 5 minutes, usage unique |
| Jeton d'accès | 1 heure |
| Points de terminaison de jeton et de révocation | Les requêtes en échec sont limitées à 30 par minute et par adresse IP. Les requêtes réussies ne sont pas comptées. |
| Point de terminaison userinfo | 600 requêtes par minute et par adresse IP |

## URI de redirection

- Un URI de redirection doit correspondre exactement à l'un de ceux enregistrés : schéma, hôte, port, chemin et requête.
- Utilisez des URI de redirection en `https://` en production. `http://` n'est accepté que pour `localhost` et `127.0.0.1`, pour le développement.

## Avant la mise en production

- Renseignez l'URL de votre politique de confidentialité afin que les utilisateurs puissent la lire avant d'approuver.
- Générez un nouveau `state` aléatoire pour chaque connexion et vérifiez-le au retour de l'utilisateur.
- Utilisez PKCE, même avec un secret client.
- Gardez le secret client uniquement sur votre serveur.
- Identifiez les utilisateurs par `sub`, jamais par `username` ou `email`.
- Appelez le point de terminaison des jetons depuis votre serveur, pas depuis le navigateur.
- Ne journalisez pas et ne conservez pas les jetons d'accès plus longtemps que nécessaire.
