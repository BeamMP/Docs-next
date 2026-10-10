---
description: "Créez des exclusions dans le pare-feu et l'antivirus Windows Defender pour que le lanceur et le serveur BeamMP ne soient pas bloqués : règles de pare-feu, puis exclusion antivirus."
---
# Exclusions Defender / pare-feu

Ce guide explique comment créer des exclusions dans le pare-feu et l'antivirus Windows Defender pour le lanceur et le serveur BeamMP.

Avant de modifier le pare-feu, assurez-vous que votre réseau est défini sur **privé** dans les paramètres réseau de Windows, si vous vous trouvez sur un réseau privé.

::: danger Les exclusions représentent un risque
En créant des exclusions, vous reconnaissez les risques liés à l'autorisation de programmes sur votre ordinateur et à l'ouverture de ports de votre réseau domestique sur Internet. Vous renoncez donc à tout recours contre BeamMP pour tous les dommages pouvant en résulter pour vous ou votre foyer.

Nous déclinons toute responsabilité quant au contenu des services ou sites web externes vers lesquels nous renvoyons.
:::

## Autoriser le lanceur dans le pare-feu

1. Ouvrez **Pare-feu Windows Defender avec fonctions avancées de sécurité** (Windows Defender Firewall with Advanced Security).
2. Cliquez sur **Règles de trafic entrant** (Inbound Rules).
3. Cliquez sur **Nouvelle règle…** (New Rule) en haut à droite.
4. Sélectionnez **Programme** et cliquez sur **Suivant**.
5. Sélectionnez **Chemin d'accès de ce programme** (This program path) et saisissez le chemin complet vers `BeamMP-Launcher.exe`. Par défaut, il s'agit de `%appdata%\BeamMP-Launcher\BeamMP-Launcher.exe`, sans guillemets.
6. Sélectionnez **Autoriser la connexion**.
7. Conservez les types de réseau qui sont cochés, puis cliquez sur **Suivant**.
8. Donnez un nom à la règle, par exemple « BeamMP-Launcher », puis cliquez sur **Terminer**.

## Autoriser le serveur dans le pare-feu

Le serveur a besoin d'une règle pour le programme et d'une règle pour son port. Les joueurs se connectent au même numéro de port en TCP et en UDP : le port nécessite donc une règle pour chacun.

1. Créez une règle pour le programme comme dans les étapes ci-dessus, mais avec le chemin complet vers `BeamMP-Server.exe`, qui se trouve à l'endroit où vous avez placé le fichier après l'avoir téléchargé. Nommez-la « BeamMP-Server ».
2. Cliquez à nouveau sur **Nouvelle règle…**.
3. Sélectionnez **Port** et cliquez sur **Suivant**.
4. Sélectionnez **TCP** et **Ports locaux spécifiques** (Specific local ports), puis saisissez le même port que `Port` dans votre `ServerConfig.toml`. La valeur par défaut est `30814`.
5. Sélectionnez **Autoriser la connexion**, conservez les types de réseau qui sont cochés, et donnez un nom à la règle, par exemple « BeamMP-Server TCP ».
6. Répétez les étapes 2 à 5 avec **UDP**, et nommez la règle « BeamMP-Server UDP ».

Une règle de pare-feu s'applique dès que vous l'enregistrez. Redémarrez ensuite le lanceur ou le serveur.

## Ajouter une exclusion antivirus

Cela s'applique au lanceur et au serveur.

1. Ouvrez l'application **Sécurité Windows** (Windows Security).
2. Cliquez sur **Protection contre les virus et menaces** (Virus & threat protection).
3. Sous **Paramètres de protection contre les virus et menaces**, cliquez sur **Gérer les paramètres** (Manage settings).
4. Faites défiler la page jusqu'à **Exclusions**, puis cliquez sur **Ajouter ou supprimer des exclusions** (Add or remove exclusions).
5. Cliquez sur **Ajouter une exclusion** (Add an exclusion), sélectionnez **Fichier** (File), puis sélectionnez `BeamMP-Launcher.exe` ou `BeamMP-Server.exe`. Cela empêche l'analyse ou la suppression du programme lui-même.
6. Cliquez à nouveau sur **Ajouter une exclusion**, sélectionnez **Processus** (Process), puis saisissez le chemin complet vers le même programme. Cela empêche l'analyse des fichiers que le programme ouvre.

Une exclusion s'applique à la protection en temps réel. Une analyse planifiée ou manuelle peut tout de même analyser un fichier exclu.

## Toujours des problèmes ?

Ouvrez un sujet sur le [forum](https://forum.beammp.com), ou posez votre question dans le canal `#support` du [serveur Discord](https://discord.gg/beammp).
