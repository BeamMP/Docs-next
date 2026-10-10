---
description: "Configurez un environnement de développement pour le mod BeamMP : un dossier mods décompressé, le mode développeur du lanceur, un dépôt cloné, un serveur local et comment contribuer."
---
# Configuration de l’environnement de développement

Cette page explique comment configurer votre ordinateur pour travailler sur le mod BeamMP et comment exécuter un serveur local. Pour comprendre comment le mod, le lanceur et le serveur s'articulent, consultez [Développeurs](/fr/developers/).

## Ce qu'il vous faut

- BeamNG.drive, installé localement.
- BeamMP, installé localement : au moins le lanceur, et aussi le serveur si vous voulez tester avec un serveur.
- Git, installé localement, et un compte GitHub.
- Un éditeur de code, par exemple VSCode ou Notepad++.

## Utiliser un dossier décompressé pour BeamNG

Pour travailler efficacement sur des mods, utilisez un dossier `unpacked` (décompressé) plutôt que de créer un zip après chaque modification.

1. Ouvrez le dossier utilisateur de BeamNG à l'emplacement `%appdata%/Local/BeamNG.drive/0.xx/mods`, où `xx` correspond à la version la plus récente de BeamNG.
2. Créez un dossier nommé `unpacked` dans `mods`.

Vous trouverez plus d'informations sur le dossier utilisateur dans la [documentation de BeamNG](https://documentation.beamng.com/support/userfolder/).

## Activer le mode développeur dans le lanceur

La mise à jour automatique supprimerait votre clone git local : désactivez-la avec `--no-download`. Si vous ne souhaitez pas non plus que le lanceur démarre BeamNG, et que vous voulez voir les messages de débogage, utilisez `--dev`.

| Argument | Ce qu'il fait |
|---|---|
| `--help` ou `-h` | Affiche cette liste d'arguments |
| `--port <port>` ou `-p` | Remplace le port d'écoute par défaut par `<port>`. Il doit également être défini dans le jeu |
| `--verbose` ou `-v` | Mode verbeux : affiche les messages de débogage |
| `--no-download` | Ne télécharge pas et n'installe pas le mod Lua BeamMP |
| `--no-update` | N'applique pas les mises à jour du lanceur : vous devez le mettre à jour manuellement |
| `--no-launch` | Ne lance pas le jeu : vous devez le démarrer vous-même |
| `--dev` | Mode développeur : équivalent à `--verbose --no-download --no-launch --no-update` |
| `--user-path <path>` | Chemin du dossier utilisateur de BeamNG.drive |
| `--game <args...>` ou `-- <args...>` | Transmet des arguments au jeu |

## Cloner le dépôt BeamMP dans le dossier unpacked

Vous pouvez copier manuellement les fichiers du mod depuis notre dépôt GitHub, mais un système de gestion de versions comme git est bien préférable.

1. Créez un fork de [BeamMP/BeamMP](https://github.com/BeamMP/BeamMP).
2. Clonez-le directement dans le dossier `unpacked`. Dans PowerShell ou CMD ouvert dans ce dossier, exécutez :
   ```bash
   git clone https://github.com/yourName/BeamMP
   ```
3. Dans le dossier utilisateur, assurez-vous qu'il ne reste aucun dossier `multiplayer` dans `mods` et qu'il y a désormais `unpacked/beammp`.
4. Essayez le mode développeur. Démarrez le lanceur, puis démarrez BeamNG manuellement. Une fois en jeu, assurez-vous que BeamMP est le seul mod actif. Vous pouvez utiliser BeamMP comme d'habitude.

Avec un éditeur de code, vous pouvez désormais modifier le code directement dans le dossier `unpacked`. Rechargez le Lua en jeu avec `Ctrl` + `L`, et appuyez aussi sur `F5` si vous avez modifié l'interface.

## Configurer un serveur local

Un serveur local est utile lorsque vous travaillez sur BeamMP. Suivez [Héberger un serveur](/fr/server-owners/host-a-server) en ignorant les deux premières étapes (la redirection de port et l'AuthKey) si vous vous connectez uniquement en local.

Dans `ServerConfig.toml`, définissez le serveur comme privé et utilisez n'importe quelle chaîne comme `AuthKey`.

## Contribuer avec vos modifications

Lorsque vous êtes satisfait de vos modifications, validez-les (commit) avec git. Le [site Git-SCM](https://git-scm.com/doc) propose des tutoriels et de la documentation. Une fois vos modifications validées et poussées (push) vers votre fork, vous pouvez créer une pull request.

Pour le format du code, le format des messages de commit et les pratiques de développement en général, consultez le fichier `CONTRIBUTING.md` de chaque dépôt. Le fichier `README.md` de chaque dépôt contient généralement les étapes de compilation des projets compilés.

Si vous rencontrez des problèmes, posez votre question dans le canal `#scripting` de notre [serveur Discord](https://discord.gg/beammp).
