# Premiers pas

Pour commencer à développer pour BeamMP, vous aurez besoin au minimum de :

- BeamNG.drive, installé localement
- BeamMP, installé localement ; au moins le lanceur, et éventuellement aussi le serveur
- Git, installé localement, et un compte GitHub.com
- Un éditeur de code, par exemple VSCode ou notepad++

---
# Différences entre le mod, le lanceur et le serveur

BeamMP se divise en trois parties principales :

- Le mod est chargé par BeamNG, comme n'importe quel mod de véhicule ou d'interface pour le jeu. Sa fonction principale est d'établir une connexion locale avec le lanceur et d'afficher les éléments de l'interface multijoueur. Il est principalement écrit en Lua, avec un peu de JavaScript, HTML et CSS pour les éléments d'interface. Son dépôt est [https://github.com/BeamMP/BeamMP](https://github.com/BeamMP/BeamMP)
- La fonction principale du lanceur est d'établir une connexion permanente avec le mod puis, le moment venu, une connexion avec le serveur choisi, et de gérer la connexion de l'utilisateur au backend de BeamMP. Il est écrit en C++, précompilé par BeamMP et disponible sur [https://github.com/BeamMP/BeamMP-Launcher](https://github.com/BeamMP/BeamMP-Launcher)
- Le serveur établit les connexions entre un ou plusieurs lanceurs et envoie des « heartbeats » au backend de BeamMP, en lui fournissant des informations telles que l'IP, le port, la version, le nombre de joueurs, etc. Il gère et exécute également les plugins Lua côté serveur. Il est écrit en C++, précompilé par BeamMP pour plusieurs systèmes d'exploitation et architectures de processeur, et disponible sur [https://github.com/BeamMP/BeamMP-Server](https://github.com/BeamMP/BeamMP-Server)

---
# Mise en place d'un environnement de développement pour travailler sur le mod

## Utiliser un dossier décompressé pour BeamNG

Pour travailler efficacement sur des mods dans BeamNG, il est conseillé d'utiliser un dossier `unpacked` (décompressé) plutôt que de recréer des zips après chaque modification.

Ouvrez le dossier utilisateur de BeamNG en accédant à `%appdata%/Local/BeamNG.drive/0.xx/mods`, où `xx` correspond à la version la plus récente de BeamNG.
Créez un dossier nommé `unpacked` dans le dossier `mods`.

Vous trouverez plus d'informations sur le dossier utilisateur sur [https://documentation.beamng.com/support/userfolder/](https://documentation.beamng.com/support/userfolder/)

## Activer le mode développeur dans le lanceur BeamMP

Pour éviter que la mise à jour automatique ne supprime votre clone git local, il faut la désactiver avec `--no-download`.
Si vous ne souhaitez pas non plus que le lanceur démarre BeamNG, et que vous voulez voir les messages de débogage, il est conseillé d'utiliser `--dev`.

| Argument                              | Remarque                                   |
|:--------------------------------------|:-------------------------------------------|
| `--help` ou `-h`                      | Affiche la liste d'arguments suivante |
| `--port <port>` ou `-p`               | Remplace le port d'écoute par défaut par `<port>`. Il doit également être configuré en jeu |
| `--verbose` ou `-v`                   | Mode verbeux, affiche les messages de débogage |
| `--no-download`                       | Ne télécharge pas et n'installe pas le mod Lua BeamMP |
| `--no-update`                         | N'applique pas les mises à jour du lanceur (vous devez le mettre à jour manuellement) |
| `--no-launch`                         | Ne lance pas le jeu (vous devez le lancer manuellement) |
| `--dev`                               | Mode développeur, équivalent à --verbose --no-download --no-launch --no-update |
| `--game <args...>` ou `-- <args...>`  | Transmet des arguments au jeu |

## Cloner le dépôt BeamMP dans le dossier unpacked

Bien que vous puissiez copier manuellement les fichiers du mod BeamMP depuis notre dépôt GitHub, il est vivement recommandé d'utiliser un système de gestion de versions comme git.
Commencez par créer un fork de [https://github.com/BeamMP/BeamMP](https://github.com/BeamMP/BeamMP)

Le plus efficace est de cloner le dépôt directement dans le dossier `unpacked`.

Avec `git`, exécutez `git clone https://github.com/yourName/BeamMP` depuis une fenêtre PowerShell ou CMD ouverte dans le dossier `unpacked`.
Dans le dossier utilisateur, assurez-vous qu'il ne reste aucun dossier `multiplayer` dans `mods` et qu'il y a désormais `unpacked/beammp`.

Essayez maintenant le mode développeur. Démarrez le lanceur BeamMP, démarrez BeamNG manuellement et, une fois en jeu, assurez-vous que BeamMP est le seul mod actif.
Vous devriez pouvoir utiliser BeamMP comme d'habitude.

À l'aide d'un éditeur de code, vous pouvez désormais ajouter ou modifier du code directement dans le dossier `unpacked`.
Vous pouvez ensuite tester vos modifications en rechargeant le Lua en jeu avec `Ctrl+L` (et `F5` si vous avez modifié l'interface).

Une fois satisfait de vos modifications, vous pouvez les valider (commit) avec git. Consultez [le site Git-SCM](https://git-scm.com/doc) pour des tutoriels et de la documentation sur l'utilisation de Git. Dès que vos modifications sont validées et poussées (vers votre fork), vous pouvez créer une pull request.

N'hésitez pas à poser vos questions dans le canal #scripting de notre [Discord](https://discord.gg/beammp) si vous rencontrez des difficultés.

---
# Mise en place d'un serveur local

Lorsque vous travaillez sur BeamMP, il peut être utile d'utiliser un serveur local. Vous pouvez suivre l'[installation générale du serveur](/fr/server-owners/host-a-server) en omettant les deux premières étapes pour des connexions purement locales.

Définissez le serveur comme privé dans le fichier `serverConfig.toml` et utilisez n'importe quelle chaîne de caractères comme `AuthKey`.

---
# Directives de contribution

Pour plus de détails sur le format du code, le format des messages de commit, les bonnes pratiques générales de développement, etc., consultez le fichier `CONTRIBUTING.md` présent dans chaque dépôt. Ce fichier contient des informations plus détaillées sur la manière de contribuer. Le fichier `README.md` de chaque dépôt contient généralement aussi les étapes de compilation (pour les projets compilés).
