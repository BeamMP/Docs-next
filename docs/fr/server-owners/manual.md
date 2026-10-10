---
description: "Référence du serveur BeamMP : le dossier Resources, les variables d'environnement, les arguments de ligne de commande, les commandes de la console et les limites du backend."
---
# Manuel du serveur

Cette page est la référence du comportement du serveur BeamMP. Pour en installer un, consultez [Héberger un serveur](/fr/server-owners/host-a-server). Pour les paramètres de `ServerConfig.toml`, consultez [Configuration du serveur](/fr/server-owners/configuration).

## Ce qui influence le serveur

Le serveur est influencé par l'état de ces paramètres externes :

- Le dossier `Resources`
- L'environnement (les variables d'environnement du processus)
- Les arguments de ligne de commande
- Le fichier `ServerConfig.toml`
- Le répertoire de travail

## Dossier Resources

Le serveur crée le dossier `Resources` au démarrage, avec les sous-dossiers `Client` et `Server`.

- `Server` contient des dossiers, chacun avec au moins un fichier `.lua`. Chaque dossier est un « plugin ». Le serveur charge les plugins par ordre alphabétique, sans tenir compte de la casse, et ignore tout ce qui n'est pas un dossier dans `Server`. Les fichiers `.lua` à la racine d'un plugin sont rechargés à chaud lorsqu'ils changent. Pour écrire des plugins, consultez la [Référence de script serveur](/fr/developers/beammp-scripting/server/latest).
- `Client` contient des fichiers `.zip`, que les joueurs téléchargent lorsqu'ils se connectent. Le serveur les lit au démarrage, et ignore avec un avertissement tout fichier qui n'est pas un `.zip`. Pour prendre en compte des mods ajoutés, modifiés ou supprimés pendant que le serveur fonctionne, utilisez la [commande de console](#console-commands) `reloadmods`.

Le serveur conserve aussi un fichier nommé `mods.json` dans `Client`. Il y stocke le hash SHA-256 de chaque mod et indique si le mod est protégé, afin que le serveur ne calcule pas à nouveau le hash d'un mod inchangé. Le serveur réécrit ce fichier au besoin. Ne le modifiez pas.

## Variables d'environnement

### Paramètres généraux {#general-settings}

Depuis la version v3.2.0 du serveur, celui-ci accepte des variables d'environnement qui **remplacent** les paramètres de `ServerConfig.toml`. Chaque paramètre en a une. Les noms des paramètres sont en PascalCase. La variable correspond au nom en MAJUSCULES, avec un tiret bas au début de chaque nouveau mot, et le préfixe `BEAMMP_`. Par exemple, `MaxPlayers` devient `MAX_PLAYERS`, et avec le préfixe `BEAMMP_MAX_PLAYERS`. Ces variables existent (« Depuis » indique la première version du serveur qui lit chacune d'elles) :

| Variable | Paramètre | Depuis |
|---|---|---|
| `BEAMMP_DEBUG` | `Debug` | v3.2.0 |
| `BEAMMP_PRIVATE` | `Private` | v3.2.0 |
| `BEAMMP_PORT` | `Port` | v3.2.0 |
| `BEAMMP_MAX_CARS` | `MaxCars` | v3.2.0 |
| `BEAMMP_MAX_PLAYERS` | `MaxPlayers` | v3.2.0 |
| `BEAMMP_MAP` | `Map` | v3.2.0 |
| `BEAMMP_NAME` | `Name` | v3.2.0 |
| `BEAMMP_DESCRIPTION` | `Description` | v3.2.0 |
| `BEAMMP_TAGS` | `Tags` | v3.2.0 |
| `BEAMMP_RESOURCE_FOLDER` | `ResourceFolder` | v3.2.0 |
| `BEAMMP_AUTH_KEY` | `AuthKey` | v3.2.0 |
| `BEAMMP_LOG_CHAT` | `LogChat` | v3.2.0 |
| `BEAMMP_ALLOW_GUESTS` | `AllowGuests` | v3.5.0 |
| `BEAMMP_INFORMATION_PACKET` | `InformationPacket` | v3.7.0 |
| `BEAMMP_IM_SCARED_OF_UPDATES` | `ImScaredOfUpdates` (la section `[Misc]`) | v3.8.2 |
| `BEAMMP_UPDATE_REMINDER_TIME` | `UpdateReminderTime` (la section `[Misc]`) | v3.8.2 |
| `BEAMMP_IP` | `IP` | v3.8.3 |

Pour les paramètres qui sont des chaînes de caractères ou des nombres, la valeur est une chaîne, par exemple `BEAMMP_NAME="Cool Server"`, `BEAMMP_NAME=Server1` ou `BEAMMP_PORT=12345`.

Pour les paramètres de type vrai ou faux (activé ou désactivé), la valeur `true` ou `1` signifie activé. Toute autre valeur signifie désactivé.

Une variable vide ou non définie est ignorée. Le serveur réécrit dans `ServerConfig.toml`, au démarrage, les valeurs qu'il utilise finalement, y compris celles-ci, sauf si `BEAMMP_PROVIDER_DISABLE_CONFIG` est définie.

### Paramètres des hébergeurs {#provider-settings}

Ces variables permettent aux hébergeurs, et à toute personne qui gère de nombreux serveurs, de remplacer des paramètres propres à l'hébergeur.

#### `BEAMMP_PROVIDER_PORT_ENV` (de v3.3.0 à v3.4.1, et depuis v3.7.2)

Lorsqu'elle est définie avec une chaîne non vide, elle désigne une autre variable dans laquelle lire le port, à la place de `BEAMMP_PORT`. Les serveurs de v3.5.0 à v3.7.1 ne la lisent pas. Par exemple, Pterodactyl peut exposer le port sous le nom `SERVER_PORT`. Vous pourriez définir `BEAMMP_PORT=${SERVER_PORT}`, mais il est plus simple de définir `BEAMMP_PROVIDER_PORT_ENV="SERVER_PORT"` : le serveur lit alors son port dans la variable `SERVER_PORT`.

#### `BEAMMP_PROVIDER_IP_ENV` (depuis v3.8.4)

Lorsqu'elle est définie avec une chaîne non vide, elle désigne une autre variable dans laquelle lire l'adresse IP, à la place de `BEAMMP_IP`. Elle fonctionne comme `BEAMMP_PROVIDER_PORT_ENV`.

#### `BEAMMP_PROVIDER_DISABLE_CONFIG` (depuis v3.3.0)

Si elle est définie à `1` ou `true`, `ServerConfig.toml` n'est **pas généré**, et n'est **pas lu** s'il existe. Vous devez définir `BEAMMP_AUTH_KEY` pour que le serveur fonctionne.

#### `BEAMMP_PROVIDER_UPDATE_MESSAGE` (depuis v3.2.2)

Lorsqu'elle est définie avec une chaîne non vide, elle remplace l'intégralité du message de mise à jour, qui commence par défaut par « NEW VERSION IS OUT! Please update to the new… ».

Votre message **doit** contenir `{}` quelque part. Le serveur le remplace par le numéro de la nouvelle version. Par exemple :

```sh
BEAMMP_PROVIDER_UPDATE_MESSAGE="NEW VERSION of the BeamMP-Server has been released: {}! Please follow the update guide here: https://example.com/update-guide"
```

Cela donne un message de mise à jour comme celui-ci :

```text
NEW VERSION of the BeamMP-Server has been released: v5.0.2! Please follow the update guide here: https://example.com/update-guide
```

Indiquez clairement aux utilisateurs qu'ils doivent mettre à jour, et expliquez comment.

#### `BEAMMP_PROVIDER_DISABLE_MP_SET` (depuis v3.9.2)

Si elle est définie à `1` ou `true`, les plugins Lua ne peuvent pas modifier les paramètres du serveur avec `MP.Set`. Un plugin qui essaie reçoit une erreur indiquant que l'appel a été bloqué par votre hébergeur.

#### `BEAMMP_MAX_CONCURRENT_CONNECTIONS` (depuis v3.9.4)

Définit le nombre maximal de connexions que le serveur accepte en même temps depuis une même adresse IP. C'est un nombre entier de 1 à 128, et la valeur par défaut est 10. Une valeur hors limites, ou qui n'est pas un nombre, est ignorée avec un avertissement. Le serveur accepte aussi au plus 128 connexions en même temps au total, ce que vous ne pouvez pas modifier. La commande `status` affiche les deux limites.

## Arguments de ligne de commande

Exécutez le serveur avec `--help` pour les voir : `./BeamMP-Server --help`. Les arguments sont :

| Argument | Ce qu'il fait |
|---|---|
| `--help` | Affiche l'aide et quitte |
| `--version` | Affiche la version du serveur et quitte |
| `--port=1234` | Définit le port TCP et UDP sur lequel le serveur écoute. Il remplace l'environnement et `ServerConfig.toml` |
| `--config=/path/to/ServerConfig.toml` | Le chemin absolu ou relatif du fichier de configuration du serveur, nom du fichier compris. Mettez des guillemets autour d'un chemin contenant des espaces |
| `--working-directory=/path/to/folder` | Définit le répertoire de travail du serveur. Tous les chemins, y compris celui de `--config`, sont relatifs à celui-ci |

Par exemple, `BeamMP-Server --config=../MyWestCoastServerConfig.toml` exécute le serveur avec le fichier de configuration situé un dossier au-dessus.

## Commandes de la console {#console-commands}

Saisissez-les dans la console du serveur. Appuyez sur `Tab` pour compléter une commande.

| Commande | Ce qu'elle fait |
|---|---|
| `help` | Affiche les commandes |
| `exit` | Arrête le serveur |
| `kick <name> [reason]` | Expulse un joueur, avec une raison facultative. Le nom correspond au début du nom d'un joueur, sans tenir compte de la casse. Sans raison, le joueur voit « Kicked by server console » |
| `list` | Liste tous les joueurs, avec leur identifiant et leur nombre de voitures |
| `say <message>` | Envoie le message à tous les joueurs dans le chat |
| `lua [state id]` | Passe à la console Lua, éventuellement dans l'état portant cet identifiant. Consultez [Débogage](/fr/developers/beammp-scripting/server/latest#debugging) |
| `settings [command]` | Définit ou lit les paramètres du serveur. Exécutez `settings help` pour en savoir plus. Consultez [Commande settings](#settings-command) |
| `status` | Affiche l'état du serveur : joueurs, voitures, durée de fonctionnement, états Lua, minuteurs et gestionnaires d'événements, limites de connexion, et état de chaque partie du serveur |
| `clear` | Efface la fenêtre de la console |
| `version` | Affiche la plateforme, la version du serveur, ainsi que les versions de Lua et d'OpenSSL |
| `protectmod <name> <value>` | Définit si un mod est protégé. Le nom est le nom de fichier du mod, `.zip` compris. La valeur est `true` ou `false` |
| `reloadmods` | Recharge tous les mods depuis le dossier `Resources/Client` |
| `nettest` | Demande au service de vérification des serveurs BeamMP si les joueurs peuvent joindre votre serveur sur son port, et affiche la réponse. `help` ne la liste pas. Depuis v3.8.5 |

Un plugin peut ajouter ses propres commandes avec l'événement `onConsoleInput`. Consultez [Commandes personnalisées](/fr/developers/beammp-scripting/server/latest#custom-commands).

### Commande settings {#settings-command}

`settings` comporte quatre sous-commandes :

- `settings list` liste les paramètres et leurs valeurs.
- `settings get <category> <setting>` affiche une valeur, par exemple `settings get General MaxPlayers`.
- `settings set <category> <setting> <value>` modifie une valeur, par exemple `settings set General MaxPlayers 12`. Mettez des guillemets autour d'une valeur contenant des espaces.
- `settings help` affiche ces sous-commandes.

Une modification dure jusqu'à l'arrêt du serveur. Elle n'est pas écrite dans `ServerConfig.toml`. Vous pouvez modifier `Description`, `Tags`, `MaxPlayers`, `Name`, `Map`, `MaxCars`, `Debug`, `AllowGuests` et `InformationPacket` dans `General`, ainsi que `ImScaredOfUpdates` et `UpdateReminderTime` dans `Misc`. `Private`, `IP`, `Port`, `LogChat` et `ResourceFolder` peuvent être lus mais pas modifiés. `AuthKey` ne peut être ni lu ni modifié.

## ServerConfig.toml

Le serveur génère ce fichier au premier démarrage. Les commentaires à l'intérieur du fichier expliquent brièvement chaque paramètre, et le serveur réécrit le fichier à chaque démarrage. Consultez [Configuration du serveur](/fr/server-owners/configuration).

Si `AuthKey` est vide, le serveur affiche une erreur et se ferme au bout de 10 secondes. Cela se produit aussi si le fichier contient une erreur, par exemple un guillemet manquant.

## Répertoire de travail

C'est le répertoire de travail du serveur, et non l'emplacement de son exécutable, qui détermine où sont générés `ServerConfig.toml`, les fichiers journaux et le dossier `Resources`.

## Limites

Le backend de BeamMP impose ces limites aux serveurs :

- Nom : 250 caractères
- Description : 1000 caractères
- Carte : 100 caractères
- Tags : 100 caractères

Le serveur lui-même impose celles-ci :

- Version du lanceur : un joueur dont le lanceur est antérieur à la version 2.7.0 est refusé, et voit un message qui indique la version requise.
- Messages du chat : un message de plus de 500 octets, ou un message vide, est ignoré.
- Connexions : au plus 10 en même temps depuis une même adresse IP par défaut, et 128 au total. Consultez `BEAMMP_MAX_CONCURRENT_CONNECTIONS`.
