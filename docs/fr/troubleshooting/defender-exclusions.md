---
description: "Créez des exclusions dans le pare-feu et l'antivirus Windows Defender pour que le lanceur et le serveur BeamMP ne soient pas bloqués : règles de pare-feu, puis exclusion antivirus."
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
4. Sélectionnez **Programme** pour créer une règle pour un programme.
5. Saisissez le chemin complet vers `BeamMP-Launcher.exe`. Par défaut, il s'agit de `%appdata%\BeamMP-Launcher\BeamMP-Launcher.exe`, sans guillemets.
6. Choisissez d'autoriser la connexion.
7. Donnez un nom à la règle, par exemple « BeamMP-Launcher », et enregistrez-la.
8. Redémarrez votre ordinateur.

## Autoriser le serveur dans le pare-feu

1. Ouvrez **Pare-feu Windows Defender avec fonctions avancées de sécurité** (Windows Defender Firewall with Advanced Security).
2. Cliquez sur **Règles de trafic entrant** (Inbound Rules).
3. Cliquez sur **Nouvelle règle…** (New Rule) en haut à droite.
4. Sélectionnez **Port** pour créer une règle pour un port.
5. Saisissez le même port que dans votre `ServerConfig.toml`.
6. Saisissez le chemin complet vers `BeamMP-Server.exe`. Il se trouve à l'endroit où vous avez placé le fichier après l'avoir téléchargé.
7. Choisissez d'autoriser la connexion.
8. Donnez un nom à la règle, par exemple « BeamMP-Server », et enregistrez-la.
9. Redémarrez votre ordinateur.

## Ajouter une exclusion antivirus

Cela s'applique au lanceur et au serveur.

1. Ouvrez l'application **Sécurité Windows** (Windows Security).
2. Cliquez sur **Protection contre les virus et menaces** (Virus & threat protection).
3. Sous **Paramètres de protection contre les virus et menaces**, cliquez sur **Gérer les paramètres** (Manage settings).
4. Faites défiler la page jusqu'à **Exclusions**.
5. Cliquez sur **Ajouter ou supprimer des exclusions** (Add or remove exclusions), cliquez sur **Ajouter une exclusion** (Add an exclusion) et sélectionnez **Processus** (Process).
6. Saisissez `BeamMP-Launcher.exe` ou `BeamMP-Server.exe` et enregistrez.
7. Redémarrez votre ordinateur.

## Toujours des problèmes ?

Ouvrez un sujet sur le [forum](https://forum.beammp.com), ou posez votre question dans le canal `#support` du [serveur Discord](https://discord.gg/beammp).
