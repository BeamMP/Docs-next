---
description: "Entretenez un serveur BeamMP en fonctionnement : lisez le fichier journal du serveur, mettez-le à jour sous Windows ou Linux et repérez les nouvelles versions."
---
# Maintenance du serveur

Comment entretenir un serveur BeamMP déjà en fonctionnement : le fichier journal et la mise à jour. Pour les paramètres de `ServerConfig.toml`, consultez [Configuration du serveur](/fr/server-owners/configuration).

## Le fichier journal du serveur

Ce fichier est généré lorsque le serveur fonctionne. Il reflète les messages que vous voyez dans la console quand vous exécutez le serveur. Le fichier s'appelle `Server.log`. Au démarrage du serveur, le journal de l'exécution précédente est renommé en `Server.old.log`, ce qui remplace l'ancien `Server.old.log`. Vous devriez joindre ce fichier chaque fois que vous demandez de l'aide à notre équipe de support ; il n'affiche jamais votre AuthKey, vous pouvez donc généralement l'envoyer sans modification.

Le format est le suivant (le préfixe $ signifie « variable », expliquée ci-dessous) :

```
[$DATE $TIME] $CONTEXT [$LOG_LEVEL] $MESSAGE
```

Où :

- `$DATE` est la date du message au format jour/mois/année, par exemple 21/07/21
- `$TIME` est l'heure du message, par exemple 11:05:23. En mode Debug, elle affiche aussi les millisecondes, par exemple 11:05:23.142
- `$CONTEXT` (visible uniquement en mode Debug et surtout utile aux développeurs) est le contexte du message, qui est soit :
	- `(Player ID) “Player Name”`, où l'ID du joueur est utile pour la modération
	- Un nom court tel que « HeartbeatThread »
- `$LOG_LEVEL` est l'un des niveaux d'importance d'un message :
	- `DEBUG` : visible uniquement en mode Debug, généralement très bavard et important seulement pour les développeurs
	- `EVENT` : visible uniquement en mode Debug, un événement Lua déclenché par le serveur
	- `INFO` : informations générales
	- `LUA` : message d'un plugin Lua
	- `LUA WARN` et `LUA ERROR` : un avertissement ou une erreur du système de plugins Lua, par exemple une erreur dans le code d'un plugin
	- `WARN` : décrit quelque chose qui n'est normalement pas censé se produire
	- `ERROR` : quelque chose s'est très mal passé, ou était très inattendu
- `$MESSAGE` est le message lui-même, généralement quelque chose auquel vous devez prêter attention et que vous devez comprendre. Dans certains cas, il peut être cryptique, mais la règle générale est que, tant que rien ne semble anormal sur le serveur et qu'il n'y a pas d'ERROR, tout va bien.

## Mettre à jour le serveur {#updating-the-server}

### Pourquoi mettre à jour

Chaque fois qu'une mise à jour est publiée, il est conseillé de mettre votre serveur à jour. Cela apporte généralement des corrections de bugs, des améliorations de stabilité et de sécurité, en plus des nouvelles fonctionnalités habituelles.

Pour être informé des mises à jour dès leur sortie, suivez le canal « update » du serveur Discord, surveillez les forums, ou consultez (ou interrogez) la [page des versions GitHub](https://github.com/BeamMP/BeamMP-Server/releases).

### Comment mettre à jour

#### Si vous utilisez un hébergeur partenaire de BeamMP

Si vous utilisez un hébergeur partenaire de BeamMP, les instructions ci-dessous ne fonctionneront probablement pas. Nous vous recommandons d'attendre plus de précisions de la part de votre hébergeur, ou de le contacter pour obtenir de l'aide.

#### Gérer le serveur vous-même

Le serveur se met à jour en remplaçant l'ancien exécutable par le nouveau. Si vous ne savez pas comment faire, des instructions pas à pas pour Windows et Linux figurent ci-dessous.

Si vous l'avez compilé à partir des sources, il suffit de recompiler. Veillez à exécuter `git submodule update --init --recursive` avant de recompiler.

#### Sous Windows

1. Assurez-vous d'avoir installé les [Visual C++ Redistributables](https://aka.ms/vs/17/release/vc_redist.x64.exe) pour pouvoir exécuter le serveur.
2. Rendez-vous sur [BeamMP.com](https://beammp.com/) et cliquez sur le bouton « Download Server ».
3. Une fois le téléchargement terminé, vous devriez voir un fichier nommé `BeamMP-Server.exe`. Nous l'appellerons le « nouvel exécutable ».
4. Rendez-vous dans le dossier où se trouve votre exécutable `BeamMP-Server.exe` actuel (généralement le même dossier que celui de votre `ServerConfig.toml`). Nous l'appellerons l'« ancien exécutable ».
5. Remplacez l'ancien exécutable par le nouveau (par exemple en copiant ou en déplaçant le nouvel exécutable dans le dossier).

#### Sous Linux

1. Rendez-vous sur [BeamMP.com](https://beammp.com/) et cliquez sur le bouton « Download Server » ; vous serez redirigé vers la page des versions du serveur sur GitHub.
2. Téléchargez le fichier correspondant à votre distribution et à votre type de processeur. Son nom ressemble à `BeamMP-Server.debian.12.x86_64`. Ne téléchargez pas les fichiers `debuginfo`. Par simplicité, il sera désormais appelé `BeamMP-Server-xxx`, où `xxx` désigne la version pour la distribution que vous utilisez.
3. Une fois le téléchargement terminé, vous devriez voir un fichier nommé `BeamMP-Server-xxx`, selon la version que vous avez téléchargée. Nous l'appellerons le « nouvel exécutable ».
4. Rendez-vous dans le dossier où se trouve votre exécutable `BeamMP-Server-xxx` actuel (généralement le même dossier que celui de votre `ServerConfig.toml`). Nous l'appellerons l'« ancien exécutable ».
5. Remplacez l'ancien exécutable par le nouveau (par exemple en copiant ou en déplaçant le nouvel exécutable dans le dossier).
6. Ouvrez un terminal dans ce dossier où vous venez de remplacer l'exécutable, et exécutez `sudo chmod +x BeamMP-Server-xxx`. Cela garantit que le serveur peut être exécuté.

### Messages de mise à jour

Le serveur ne se met pas à jour tout seul. Il vérifie au démarrage si une version plus récente existe, et affiche un message si c'est le cas. Il affiche à nouveau ce message à l'intervalle défini par `UpdateReminderTime`, sauf si `ImScaredOfUpdates` vaut `true`, ce qui est la valeur par défaut. Les deux paramètres se trouvent dans [Configuration du serveur](/fr/server-owners/configuration#the-misc-section). Un hébergeur peut remplacer ce message : consultez les paramètres de l'hébergeur dans le [Manuel du serveur](/fr/server-owners/manual#provider-settings).

Pour vérifier la présence d'une nouvelle version depuis un script, interrogez l'API GitHub pour obtenir la dernière version en comparant la version du serveur aux tags. Vous l'obtenez en faisant un GET sur `https://api.github.com/repos/BeamMP/BeamMP-Server/git/refs/tags`.
