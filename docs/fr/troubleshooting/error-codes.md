---
description: "La signification des codes d'erreur et des messages affichés dans la fenêtre du lanceur BeamMP, comme 10060, 10048 ou Failed to find the game, et comment les corriger."
---
# Codes d'erreur

Cette page liste les codes d'erreur et les messages que le lanceur peut afficher, et ce qu'il faut faire dans chaque cas. Les messages proviennent du lanceur v2.8.1. Pour les erreurs dans la fenêtre d'un serveur, consultez les [codes d'erreur serveur](/fr/server-owners/error-codes).

Le lanceur écrit aussi tout ce qu'il affiche dans `Launcher.log`, dans le dossier qui contient le lanceur. Le fichier est vide à chaque démarrage du lanceur : il ne contient donc que la dernière exécution. Si le lanceur se ferme aussitôt, lisez ce fichier.

## Codes réseau

Le nombre qui suit `error:` ou `Error code:` est un code de socket Windows. Sous Linux, c'est le numéro d'erreur du système à la place.

| Windows (Linux) | Description | Solution possible |
|---|---|---|
| 10048 (98) | `bind failed with error` : autre chose utilise déjà le port du lanceur ou le suivant. Les ports par défaut sont `4444` et `4445` | N'exécutez qu'un seul lanceur à la fois, et redémarrez votre PC. Si un autre programme utilise ces ports, [changez le port du lanceur](/fr/troubleshooting/launcher-port). Sous Linux, cela arrive aussi lorsque vous rejoignez un second serveur : fermez le jeu et le lanceur, puis relancez-les |
| 10060, 10061 (110, 111) | `Client: connect failed! Error code` : aucun serveur n'a répondu sur cette adresse IP et ce port | Si vous êtes le propriétaire du serveur, vérifiez la redirection de port et les règles du pare-feu dans [Héberger un serveur](/fr/server-owners/host-a-server). Sinon, choisissez un autre serveur, ou contactez son propriétaire |
| 10054 (104) | La connexion a été réinitialisée par l'autre côté | Le serveur auquel vous étiez connecté est hors ligne ou a redémarré. Réessayez plus tard |
| 10038 | `(Game) send failed with error` : le lanceur a essayé d'envoyer des données au jeu alors que le jeu s'était déconnecté. Le lanceur v2.8.0 affiche ce message | Mettez à jour le lanceur vers la dernière version |
| `DNS lookup failed! on` suivi d'un nom | Le lanceur n'a pas trouvé l'adresse correspondant au nom de serveur que vous avez saisi | Vérifiez le nom. Utilisez plutôt l'adresse IP du serveur |

## Démarrage du jeu

| Message | Description | Solution possible |
|---|---|---|
| `Failed to find the game please launch it. Report this if the issue persists code 3` | Windows. `%LocalAppData%\BeamNG\BeamNG.Drive.ini` existe, mais le lanceur ne parvient pas à le lire | Démarrez BeamNG.drive une fois pour qu'il réécrive le fichier |
| `... code 4` | Windows. `installPath` dans `BeamNG.Drive.ini` pointe vers un dossier qui n'existe pas | Démarrez BeamNG.drive une fois depuis son dossier actuel, ou corrigez `installPath` dans le fichier |
| `... code 5` | Windows. `BeamNG.Drive.ini` ne contient pas de `installPath` | Démarrez BeamNG.drive une fois |
| `... code 6` | Windows. Il n'y a pas de `BeamNG.Drive.ini`, et la clé de registre `HKEY_CURRENT_USER\Software\BeamNG\BeamNG.drive` n'a pas de valeur `rootpath` | Démarrez BeamNG.drive une fois |
| `... code 7` | Windows. Il n'y a pas de `BeamNG.Drive.ini`, et la clé de registre `HKEY_CURRENT_USER\Software\BeamNG\BeamNG.drive` n'existe pas | Démarrez BeamNG.drive une fois |
| `Unsupported Steam installation.` | Linux. Aucun des dossiers Steam que le lanceur connaît ne contient de dossier `steamapps` | Consultez [Avant de commencer](/fr/get-started/install-beammp#before-you-start) pour connaître ces dossiers. Liez le vôtre à l'un d'eux |
| `libraryfolders.vdf is missing.` | Linux. Le dossier Steam ne contient pas de fichier `libraryfolders.vdf` | Démarrez Steam une fois, puis réessayez |
| `The game directory was not found.` | Linux. BeamNG.drive ne se trouve dans aucune des bibliothèques Steam listées par `libraryfolders.vdf` | Installez BeamNG.drive via Steam |
| `Failed to Launch the game! launcher closing soon` | Le lanceur n'a pas pu démarrer `BeamNG.drive.exe` (Windows) ou `BinLinux/BeamNG.drive.x64` (Linux) dans le dossier du jeu. Sous Windows, le code d'erreur Windows et son texte suivent | Vérifiez l'intégrité des fichiers du jeu dans Steam, et démarrez le jeu une fois avant de lancer le lanceur |
| `Game Closed! launcher closing soon` | Le jeu s'est arrêté. Le lanceur se ferme 5 secondes plus tard | Normal lorsque vous fermez le jeu. Si le jeu s'est fermé tout seul, relancez le lanceur |
| `We were unable to clean the multiplayer mods folder! Is the game still running or do you have something open in that folder?` | Au démarrage, le lanceur vide le dossier `mods/multiplayer` du dossier utilisateur du jeu, et n'y est pas parvenu | Fermez le jeu et tout programme qui utilise ce dossier, puis relancez le lanceur |

## Les fichiers propres au lanceur

| Message | Description | Solution possible |
|---|---|---|
| `logger file init failed!` | Le lanceur ne peut pas créer `Launcher.log` dans son dossier | Déplacez le lanceur dans un dossier où vous pouvez écrire |
| `Config failed to parse make sure it's valid JSON!` | `Launcher.cfg` n'est pas un JSON valide. Le lanceur se ferme | Corrigez le fichier, ou supprimez-le. Le lanceur en crée un nouveau avec les paramètres par défaut |
| `Failed to open Launcher.cfg!`, `Failed to write config on disk!` | Le lanceur ne peut pas lire ou créer `Launcher.cfg` dans le dossier depuis lequel il s'exécute | Exécutez-le depuis un dossier où vous pouvez écrire |
| `Failed to create caching directory` | Le lanceur ne peut pas créer le dossier de cache des mods, qui est `Resources` sauf si vous définissez `CachingDirectory` dans `Launcher.cfg` | Définissez `CachingDirectory` sur un dossier où vous pouvez écrire |
| `Exception in main()` | Une erreur fatale. Le lanceur se ferme au bout de 5 secondes | Lisez le texte qui suit, et posez la question sur le [forum](https://forum.beammp.com) ou le [serveur Discord](https://discord.gg/beammp) |

## Mises à jour et serveurs BeamMP

| Message | Description | Solution possible |
|---|---|---|
| `Failed to download the launcher update! Please try manually updating it` | Windows. Le lanceur n'a pas pu télécharger sa mise à jour | Consultez [Problèmes de mise à jour du lanceur](/fr/troubleshooting/launcher-update) |
| `The authenticity of the updated launcher could not be verified, it was corrupted or tampered with.` | Windows. La mise à jour téléchargée n'a pas de signature valide, le lanceur l'a donc supprimée | Téléchargez le lanceur depuis la [page des versions GitHub](https://github.com/BeamMP/BeamMP-Launcher/releases/latest), comme dans [Problèmes de mise à jour du lanceur](/fr/troubleshooting/launcher-update) |
| `Auto update is NOT implemented for the Linux version.` | Linux. Un lanceur plus récent existe | Recompilez le lanceur : consultez [Mettre à jour le lanceur sous Linux](/fr/get-started/install-beammp#update-the-launcher-on-linux) |
| `GET to ... failed` ou `POST to ... failed`, puis `Curl error` | Le lanceur n'a pas pu joindre un serveur BeamMP. Le texte qui suit donne la raison, par exemple un délai dépassé ou une erreur de certificat | Vérifiez votre connexion Internet et les règles de votre pare-feu. Si le problème ne vient pas de chez vous, consultez le [canal des mises à jour BeamMP](<https://discord.com/channels/601558901657305098/697596153943949352>) sur notre Discord |
| `Invalid hash from backend, skipping update check.` | Le backend de BeamMP n'a pas donné de réponse valide. Le lanceur ignore la vérification et continue | Vérifiez votre connexion Internet et les règles de votre pare-feu |
| `Failed to communicate with the auth system!` | Le serveur de connexion n'a pas répondu | Vérifiez votre connexion Internet et les règles de votre pare-feu, puis réessayez |
| `Invalid answer from authentication servers, please try again later!` | Le serveur de connexion a donné une réponse que le lanceur ne peut pas lire | Réessayez plus tard |

## Mods

| Message | Description | Solution possible |
|---|---|---|
| `Mod '...' is protected and therefore must be placed in the Resources/Caching folder manually here:` suivi d'un chemin | Le serveur utilise un mod protégé, que le lanceur ne télécharge pas | Récupérez le fichier auprès de son créateur et placez-le dans le dossier indiqué par le message, en conservant son nom de fichier |
| `Server cannot find` suivi d'un nom de fichier | Le serveur n'a pas le fichier de mod qu'il a listé | Prévenez le propriétaire du serveur |
| `Failed to write or download the entire file ... (hash mismatch)` | Le fichier du mod ne s'est pas téléchargé correctement | Rejoignez à nouveau le serveur. Le lanceur revérifie le fichier et le télécharge à nouveau |
| `Failed copy to the mods folder!` | Le lanceur n'a pas pu copier un mod dans le dossier `mods/multiplayer` du jeu | Fermez le jeu et tout programme qui utilise ce dossier, puis rejoignez à nouveau le serveur |
