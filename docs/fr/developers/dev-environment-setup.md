---
description: "Configurez un environnement de développement pour le mod BeamMP : dossier mods décompressé, mode développeur et réglages du lanceur, compilation du lanceur, dépôt cloné, serveur local et contribution."
---
# Configuration de l’environnement de développement

Cette page explique comment configurer votre ordinateur pour travailler sur le mod BeamMP et comment exécuter un serveur local. Pour comprendre comment le mod, le lanceur et le serveur s'articulent, consultez [Développeurs](/fr/developers/).

## Ce qu'il vous faut

- BeamNG.drive, installé localement.
- BeamMP, installé localement : au moins le lanceur, et aussi le serveur si vous voulez tester avec un serveur.
- Git, installé localement, et un compte GitHub.
- Un éditeur de code, par exemple VSCode ou Notepad++.

## Utiliser un dossier décompressé pour BeamNG

Pour travailler efficacement sur des mods, utilisez un dossier `unpacked` (décompressé) plutôt que de créer un zip après chaque modification.

1. Ouvrez le dossier `mods` dans le dossier utilisateur de BeamNG. Sous Windows, il se trouve à l'emplacement `%LocalAppData%\BeamNG\BeamNG.drive\current\mods`. Au démarrage, le lanceur affiche le dossier qu'il utilise sur la ligne `Game user path:`.
2. Créez un dossier nommé `unpacked` dans `mods`.

Vous trouverez plus d'informations sur le dossier utilisateur dans la [documentation de BeamNG](https://documentation.beamng.com/support/userfolder/).

## Activer le mode développeur dans le lanceur {#turn-on-dev-mode-in-the-launcher}

Démarrez le lanceur avec `--dev`. Le mode développeur affiche les messages de débogage, ne télécharge pas le mod BeamMP, ne démarre pas BeamNG.drive et ne met pas à jour le lanceur. Si vous ne voulez qu'une partie de ces comportements, utilisez les options individuelles ci-dessous.

Sans `--no-download`, le lanceur télécharge le mod BeamMP publié dans `mods/multiplayer`. Il supprime aussi `mods/unpacked/beammp`, sauf si ce dossier contient un dossier `.git`. Utilisez `--no-download` pour que le mod publié ne s'exécute pas à côté du vôtre.

| Argument | Ce qu'il fait |
|---|---|
| `--help`, `-h` ou `/?` | Affiche cette liste d'arguments, puis se ferme |
| `--port <port>` ou `-p <port>` | Remplace le port d'écoute par défaut, `4444`, par `<port>`. Le lanceur utilise aussi `<port>` + 1. Il doit également être défini dans le jeu. Il remplace `Port` dans `Launcher.cfg` |
| `--verbose` ou `-v` | Mode verbeux : affiche les messages de débogage dans la fenêtre. Ils sont toujours écrits dans `Launcher.log` |
| `--no-download` | Ne télécharge pas et n'installe pas le mod BeamMP |
| `--no-update` | N'applique pas les mises à jour du lanceur : vous devez le mettre à jour manuellement |
| `--no-launch` | Ne lance pas le jeu : vous devez le démarrer vous-même |
| `--dev` | Mode développeur : équivalent à `--verbose --no-download --no-launch --no-update` |
| `--user-path <path>` | Windows uniquement. Chemin du dossier utilisateur de BeamNG.drive, c'est-à-dire le dossier qui contient `current` |
| `--game <args...>` ou `-- <args...>` | Transmet au jeu tous les arguments qui suivent |

### Fichier de réglages du lanceur

Le lanceur lit `Launcher.cfg` dans le dossier à partir duquel il s'exécute. Si le fichier est absent, le lanceur le crée avec les trois premiers réglages. Les options de la ligne de commande remplacent les réglages correspondants.

| Réglage | Valeur par défaut | Ce qu'il fait |
|---|---|---|
| `"Port"` | `4444` | Le port auquel le jeu se connecte. Consultez [Changer le port du lanceur](/fr/troubleshooting/launcher-port) |
| `"Build"` | `"Default"` | La version que le lanceur demande au backend de BeamMP lorsqu'il recherche des mises à jour du lanceur et du mod. Laissez-le sur `Default` |
| `"CachingDirectory"` | `"./Resources"` | Le dossier où le lanceur conserve les mods de serveur téléchargés |
| `"Dev"` | non défini | `true` équivaut à `--dev` |
| `"DeleteDuplicateMods"` | `false` | `true` fait supprimer au lanceur les anciennes versions en cache d'un mod lorsqu'un serveur en envoie une plus récente |

### Cache des mods

Lorsque vous rejoignez un serveur, le lanceur télécharge chaque mod listé par le serveur dans le dossier `CachingDirectory`. Un mod est enregistré sous le nom `<name>-<8 premiers caractères de son hash SHA-256>.zip`. Le lanceur réutilise un fichier en cache lorsque son hash correspond, et enregistre la dernière utilisation de chaque fichier dans `mods.json`, dans le même dossier. Il copie ensuite le mod dans `mods/multiplayer` du dossier utilisateur du jeu, avec un nom de fichier en minuscules sous Linux.

À chaque démarrage, le lanceur supprime tout ce qui se trouve dans `mods/multiplayer`, sauf `beammp.zip`. N'y conservez pas vos propres fichiers.

## Compiler le lanceur

Vous n'avez besoin de compiler le lanceur que si vous travaillez sur le lanceur lui-même. Le `README.md` du lanceur ne contient aucune étape de compilation.

Sous Windows, il vous faut Visual Studio avec la charge de travail de bureau C++ (MSVC), CMake et [vcpkg](https://github.com/microsoft/vcpkg). Les bibliothèques de `vcpkg.json` sont `cpp-httplib`, `nlohmann-json`, `zlib`, `openssl` et `curl`. Le lanceur utilise le runtime C++ statique, utilisez donc le triplet `x64-windows-static`. Dans le répertoire racine du projet, exécutez les commandes suivantes. Remplacez `C:/vcpkg` par l'emplacement où vous avez installé `vcpkg` :

```bash
cmake . -B bin -DCMAKE_BUILD_TYPE=Release -DCMAKE_TOOLCHAIN_FILE=C:/vcpkg/scripts/buildsystems/vcpkg.cmake -DVCPKG_TARGET_TRIPLET=x64-windows-static
cmake --build bin --parallel --config Release
```

Le programme est `bin/Release/BeamMP-Launcher.exe`. Sous Windows, le lanceur se remplace par la version officielle signée lorsqu'une version plus récente existe, démarrez donc votre propre build avec `--no-update`.

Pour Linux, suivez [Compiler le lanceur](/fr/get-started/install-beammp#build-the-launcher). Le lanceur ne se compile pas sous macOS.

## Cloner le dépôt BeamMP dans le dossier unpacked

Vous pouvez copier manuellement les fichiers du mod depuis notre dépôt GitHub, mais un système de gestion de versions comme git est bien préférable.

1. Créez un fork de [BeamMP/BeamMP](https://github.com/BeamMP/BeamMP).
2. Clonez-le directement dans le dossier `unpacked`. Dans PowerShell ou CMD ouvert dans ce dossier, exécutez :

   ```bash
   git clone https://github.com/yourName/BeamMP
   ```

3. Dans le dossier utilisateur, supprimez `mods/multiplayer/beammp.zip` s'il existe. Un démarrage normal du lanceur le télécharge, et `--no-download` ne le supprime pas. Vérifiez que `mods/unpacked/beammp` existe.
4. Essayez le mode développeur. Démarrez le lanceur avec `--dev`, puis démarrez BeamNG manuellement. Une fois en jeu, assurez-vous que BeamMP est le seul mod actif. Vous pouvez utiliser BeamMP comme d'habitude.

Avec un éditeur de code, vous pouvez désormais modifier le code directement dans le dossier `unpacked`. Rechargez le Lua en jeu avec `Ctrl` + `L`, et appuyez aussi sur `F5` si vous avez modifié l'interface.

## Configurer un serveur local

Un serveur local est utile lorsque vous travaillez sur BeamMP. Suivez [Héberger un serveur](/fr/server-owners/host-a-server) en ignorant les deux premières étapes (la redirection de port et l'AuthKey) si vous vous connectez uniquement en local.

Dans `ServerConfig.toml`, définissez le serveur comme privé et utilisez n'importe quelle chaîne comme `AuthKey`.

## Contribuer avec vos modifications

Lorsque vous êtes satisfait de vos modifications, validez-les (commit) avec git. Le [site Git-SCM](https://git-scm.com/doc) propose des tutoriels et de la documentation. Une fois vos modifications validées et poussées (push) vers votre fork, vous pouvez créer une pull request.

Le dépôt du mod BeamMP contient un fichier `CONTRIBUTING.md` avec le format du code, le format des messages de commit et les pratiques de développement en général. Le dépôt du lanceur contient un fichier `.clang-format` pour son style de code, et son modèle de pull request vous demande de confirmer que vous avez écrit et compris vous-même tout le code. Le fichier `README.md` d'un dépôt peut contenir les étapes de compilation des projets compilés.

Si vous rencontrez des problèmes, posez votre question dans le canal `#scripting` de notre [serveur Discord](https://discord.gg/beammp).
