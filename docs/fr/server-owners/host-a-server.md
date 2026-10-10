---
description: "Hébergez un serveur BeamMP chez vous : redirigez le port, ouvrez le pare-feu, obtenez une AuthKey, installez et configurez le serveur, ajoutez des mods et accueillez les joueurs."
---
# Héberger un serveur

Ce guide explique comment héberger un serveur BeamMP chez vous, sur votre propre ordinateur Windows ou Linux. Si vous passez par un hébergeur ou un VPS doté d'un panneau de gestion, suivez plutôt [Configuration du serveur sur un VPS](/fr/server-owners/setup-vps). Un serveur à domicile est gratuit. Un VPS est plus simple et plus sûr.

## Avant de commencer

Les serveurs font partie intégrante de BeamMP : les joueurs sont connectés les uns aux autres par l'intermédiaire du serveur. Vous pouvez créer un serveur privé, que seules les personnes que vous invitez peuvent rejoindre, ou un serveur public, qui apparaît dans la liste officielle des serveurs.

Lisez la [LICENCE](https://raw.githubusercontent.com/BeamMP/BeamMP-Server/master/LICENSE) du serveur avant de l'utiliser.

Le serveur ne prend en charge que l'IPv4. Si vous ne savez pas laquelle vous utilisez, regardez l'adresse IP affichée sur [whatsmyip.org](https://www.whatsmyip.org/). Si elle contient des deux-points, il s'agit d'IPv6. Dans ce cas, vérifiez si vous disposez aussi d'une adresse IPv4, en le demandant à votre fournisseur d'accès (FAI) ou à quelqu'un qui s'y connaît en réseau. La prise en charge de l'IPv6 est prévue.

Si vous rencontrez des problèmes, posez vos questions sur le [forum](https://forum.beammp.com) ou dans le canal `#support` du [serveur Discord](https://discord.gg/beammp). La page [Configuration du serveur](/fr/server-owners/configuration) détaille les paramètres du serveur.

## Rediriger le port {#forward-the-port}

Les joueurs extérieurs à votre domicile ne peuvent rejoindre votre serveur hébergé à la maison que si vous redirigez un port sur votre routeur. Passez cette étape si vous êtes sur un VPS ou un serveur dédié (rootserver), ou si tous les joueurs se trouvent chez vous (sur votre réseau local).

::: danger La redirection de port est un risque
En redirigeant un port, vous reconnaissez les risques liés à l'ouverture de ports de votre réseau domestique au public. Vous renoncez donc à engager la responsabilité de BeamMP pour tout dommage pouvant survenir à vous-même ou à votre foyer.

Nous déclinons toute responsabilité quant au contenu des services ou sites externes vers lesquels pointent des liens.
:::

Choisir l'un de nos services d'hébergement partenaires permet d'éviter ce risque. Pour rediriger vous-même un port, suivez le [guide de redirection de port](/fr/server-owners/port-forwarding).

## Services d'hébergement partenaires {#partnered-hosting-services}

Ces services sont payants :

<!--@include: ./_parts/partners.md-->

## Autoriser le serveur dans votre pare-feu {#allow-the-server-through-your-firewall}

Selon votre configuration, vous devrez peut-être autoriser le serveur BeamMP à traverser votre pare-feu. C'est le cas sous Windows, où désactiver le pare-feu ne fonctionne généralement **pas**, ainsi que sur de nombreux serveurs Linux préinstallés.

Autorisez le serveur BeamMP dans le pare-feu pour les connexions **entrantes et sortantes**, et pour **TCP et UDP**. Si votre pare-feu demande un port à la place, utilisez le port que vous avez redirigé, généralement 30814.

Pour un guide détaillé, consultez [Exclusions Defender / pare-feu](/fr/troubleshooting/defender-exclusions).

<!--@include: ./_parts/authkey.md-->

## Installer le serveur

Le serveur BeamMP est disponible pour Windows et Linux.

### Installation sur Windows

Redirigez d'abord votre port. Sans cela, personne en dehors de chez vous ne peut rejoindre le serveur.

1. Installez les [Visual C++ Redistributables](https://aka.ms/vs/17/release/vc_redist.x64.exe). Le serveur en a besoin pour fonctionner.
2. Téléchargez le serveur depuis [beammp.com](https://www.beammp.com/). Vous obtenez un exécutable nommé à peu près `BeamMP-Server.exe`.
3. Créez un dossier où vous voulez et placez-y `BeamMP-Server.exe`. C'est là que vivra votre serveur.
4. Démarrez le serveur une première fois en double-cliquant dessus. Il génère les fichiers dont il a besoin. Quand du texte s'affiche, fermez-le. Vous avez maintenant un fichier `ServerConfig.toml` à côté de `BeamMP-Server.exe`.
5. Facultatif : pour y accéder rapidement plus tard, créez un raccourci sur le bureau avec **Clic droit** > **Envoyer vers** > **Bureau (créer un raccourci)**.

### Installation sur Linux

#### Utiliser notre version compilée (recommandé)

Cela fonctionne sur toutes les distributions pour lesquelles nous fournissons des binaires, listées sur la [page de la dernière version](https://github.com/BeamMP/BeamMP-Server/releases/latest). Pour une autre distribution ou architecture, consultez [Compiler à partir des sources](#build-from-source).

1. Installez les dépendances listées dans les [dépendances d'exécution](https://github.com/BeamMP/BeamMP-Server#runtime-dependencies). Sous Debian et Ubuntu, il s'agit du paquet `liblua5.3-0`.
2. Rendez-vous sur [beammp.com](https://beammp.com/) et cliquez sur **Download Server**. Vous arrivez sur la page des versions du serveur sur GitHub.
3. Téléchargez le fichier correspondant à votre distribution et à votre type de processeur. Son nom ressemble à `BeamMP-Server.debian.12.x86_64`. La version v3.9.4 propose des builds pour Debian 12 et 13 et pour Ubuntu 22.04 et 24.04, chacune en `x86_64` et en `arm64`. Ne téléchargez pas les fichiers `debuginfo`. Ce guide appelle le fichier téléchargé `BeamMP-Server-xxx`.
4. Créez un dossier où vous voulez et placez-y `BeamMP-Server-xxx`. Vous pouvez ignorer pour l'instant les autres fichiers téléchargés. C'est là que vivra votre serveur.
5. Ouvrez un terminal dans ce dossier et exécutez `chmod +x BeamMP-Server-xxx`, afin d'avoir l'autorisation de l'exécuter.
6. Démarrez le serveur une première fois avec `./BeamMP-Server-xxx`. Il génère les fichiers dont il a besoin. Quand du texte s'affiche, fermez-le. Vous avez maintenant un fichier `ServerConfig.toml` à côté de `BeamMP-Server-xxx`.
7. Facultatif, mais vivement recommandé : créez un utilisateur nommé `beammpserver` (ou similaire) et démarrez le serveur uniquement avec cet utilisateur. N'exécutez pas le serveur en tant que root, avec `sudo`, ni avec votre utilisateur personnel.

#### Compiler à partir des sources {#build-from-source}

D'autres distributions fonctionneront probablement aussi, mais ne sont pas officiellement prises en charge. Pour compiler vous-même le serveur, téléchargez les sources depuis [GitHub](https://github.com/BeamMP/BeamMP-Server) et suivez les [instructions de compilation](https://github.com/BeamMP/BeamMP-Server#build-instructions). À la fin, exécutez le serveur une fois avec `./BeamMP-Server`.

## Configurer le serveur {#configure-the-server}

Lorsque vous avez exécuté le serveur une première fois, il a créé quelques fichiers et a probablement affiché une ou deux erreurs. C'est normal, car il n'est pas encore configuré. Votre dossier contient maintenant ces fichiers :

![Le dossier du serveur avec ServerConfig.toml, Server.log et BeamMP-Server.exe](../../assets/content/after-running-once.png)

Ce sont `ServerConfig.toml`, `Server.log` et `BeamMP-Server.exe`. Selon vos paramètres, les extensions `.toml`, `.log` et `.exe` peuvent ne pas être visibles.

Ouvrez `ServerConfig.toml` dans un éditeur de texte tel que le Bloc-notes : **Clic droit** > **Ouvrir avec…**, puis choisissez l'éditeur. Voici un exemple de configuration :

```toml
[General]
Port = 30814
AuthKey = "auth-key"
AllowGuests = false
LogChat = false
Debug = false
IP = "::"
Private = true
InformationPacket = true
Name = "Test Server"
Tags = "Freeroam,Modded,Racing,Police"
MaxCars = 2
MaxPlayers = 10
Map = "/levels/ks_nord/info.json"
Description = "Total Random Beam MP Server"
ResourceFolder = "Resources"
```

Ce fichier utilise le format TOML. [Configuration du serveur](/fr/server-owners/configuration) décrit chaque paramètre.

1. Définissez `AuthKey` avec la clé que vous avez copiée. Collez-la entre les guillemets. Pour la clé d'exemple, cela donne :

   ```toml
   AuthKey = '3173a2e-6az0-4542-a3p0-ddqq5ff95558'
   ```

2. Définissez `Name`, le nom de votre serveur dans la liste des serveurs. Vous pouvez le mettre en forme avec des couleurs et plus encore : consultez [Personnaliser l'apparence du nom de votre serveur](/fr/server-owners/configuration#customize-the-look-of-your-server-name).
3. Si vous avez choisi un autre port que 30814, indiquez-le dans `Port`.
4. Votre serveur n'apparaît pas dans la liste des serveurs tant que `Private = true`. Pour l'y faire apparaître, définissez `Private = false`.

### Vérifier qu'il démarre

Exécutez de nouveau le serveur et cherchez les messages `[ERROR]` ou `[WARN]`. Le serveur doit maintenant rester ouvert. Ajoutez ensuite des mods si vous le souhaitez, puis voyez comment le rejoindre.

## Ajouter des mods

Les mods de véhicules et les mods de cartes s'installent différemment, mais tous vont dans le dossier `Resources/Client` de votre serveur. Placez le fichier `.zip` du mod dans ce dossier.

::: warning
Les mods peuvent être, ou devenir, incompatibles avec BeamNG, BeamMP ou d'autres mods. Si vous avez des problèmes, commencez à retirer des mods. Si vous obtenez un message « done » ou « start » en essayant de vous connecter après avoir ajouté des mods, vous avez probablement ajouté un mod incompatible ou défectueux. Si vous avez des mods côté client installés, consultez [Sécurité des mods](/fr/players/mod-safety) pour savoir comment les retirer de votre jeu.
:::

### Mods de véhicules et autres mods

Placez le fichier `.zip` du mod dans `Resources/Client`. Toutes les personnes qui se connectent le téléchargent automatiquement.

### Cartes

Les cartes d'origine fonctionnent sans rien installer. Définissez `Map` dans `ServerConfig.toml` avec l'un des [chemins des cartes d'origine](/fr/server-owners/configuration#all-vanilla-maps-names).

Pour une carte moddée :

1. Placez le fichier `.zip` de la carte dans `Resources/Client`.
2. Ouvrez le `.zip` sans l'extraire, puis ouvrez son dossier `levels`. Il contient un dossier portant le nom de la carte, par exemple `myawesomedriftmap2021`. Notez ce nom exactement tel qu'il est écrit.
3. Dans `ServerConfig.toml`, `Map` ressemble à `/levels/MAPNAME/info.json`, où `MAPNAME` est probablement quelque chose comme `gridmap_v2`. Remplacez `MAPNAME` par le nom du dossier de l'étape 2. Le chemin doit se terminer par `/info.json`. Pour cet exemple :

   ```toml
   Map = '/levels/myawesomedriftmap2021/info.json'
   ```

Lorsque quelqu'un se connecte, la carte se télécharge automatiquement et fonctionne.

Si cela ne fonctionne pas, installez la carte dans BeamNG.drive en solo et lancez-la. Ouvrez la console avec la touche `~` (tilde). Sur un clavier non américain, cherchez l'action **Activer/désactiver la console système** sous **Options** > **Contrôles** > **Raccourcis clavier**, dans la section **Débogage général**. Exécutez `print(getMissionFilename())`. Cela affiche le nom à utiliser.

### Protéger des mods contre le téléchargement

Vous pouvez héberger du contenu protégé ou à accès restreint sans le redistribuer. C'est adapté aux « mods payants », ou à un créateur de mods qui souhaite limiter l'accès à ses nouveaux travaux.

Pour protéger un mod, exécutez ceci dans la console du serveur :

```text
protectmod <filename with .zip> <true/false>
```

Les joueurs qui rejoignent un serveur avec des mods protégés doivent se procurer eux-mêmes le fichier, par exemple auprès du créateur ou sur une plateforme comme Patreon, et le placer dans le dossier de ressources de leur lanceur. Le lanceur les prévient lorsqu'un fichier est manquant, et le jeu affiche une notification indiquant le fichier manquant et comment y remédier.

## Faire venir les joueurs

### Rejoindre votre propre serveur

Qu'il soit privé ou public, la façon de le rejoindre dépend de l'endroit où il tourne :

- **Sur le même ordinateur que le jeu :** utilisez la connexion directe. Cliquez sur l'onglet **Direct Connect** à gauche de la liste des serveurs, laissez les informations par défaut (`127.0.0.1` et votre port), puis cliquez sur **Connect**.
- **Sur un autre ordinateur de votre réseau local :** connexion directe avec l'adresse IP locale de cet ordinateur.
- **En dehors de chez vous, par exemple sur un VPS :** connexion directe avec l'adresse IP publique de cette machine.

### Serveur privé

Donnez à d'autres joueurs l'adresse IP publique de votre serveur. Faites attention aux personnes avec qui vous la partagez. Pour le rejoindre, elles ouvrent l'onglet **Direct Connect** dans BeamMP et saisissent votre adresse IP et votre port.

### Serveur public

Les autres joueurs le trouvent dans la liste des serveurs : ils saisissent son nom et cliquent sur **Connect**. Le nom est celui de votre `ServerConfig.toml`. S'ils ne le trouvent pas, dites-leur de désactiver les filtres de recherche et de régler la carte sur **Any**.

### « Connection Failed! »

Si vous ou un ami obtenez « Connection Failed! », cherchez dans la fenêtre du lanceur des codes tels que 10060, 10061 ou 10030. Ils signifient l'une de ces deux choses : vous êtes derrière une adresse IPv4 en CGNAT, ou quelque chose s'est mal passé dans [Rediriger le port](#forward-the-port) ou [Autoriser le serveur dans votre pare-feu](#allow-the-server-through-your-firewall).

Pour vérifier le CGNAT, repérez l'adresse IP WAN sur la page de votre routeur et comparez-la à votre [adresse IP publique](https://www.whatsmyip.org/). Si elles sont identiques, vous n'êtes pas derrière un CGNAT. Consultez [Vérifier le CGNAT](/fr/server-owners/cgnat). L'IPv6 n'est pas encore prise en charge.

## Vérifier que les joueurs peuvent atteindre votre serveur

Tant que le serveur fonctionne, vous pouvez saisir `nettest` dans sa console. Le serveur demande au même service de vérification si les joueurs peuvent l'atteindre sur son port, et affiche la réponse. Vous pouvez aussi saisir l'adresse IPv4 publique et le port de votre serveur, puis cliquer sur **CheckBeamMP** :

<form action="https://check.beammp.com/api/v2/beammp" method="get" target="_blank">
  <label for="ip">Adresse IP :</label>
  <input type="text" id="ip" name="ip"><br>
  <label for="port">Port :</label>
  <input type="text" id="port" name="port"><br>
  <input type="submit" value="CheckBeamMP">
</form>

## Utiliser un VPN

BeamMP ne prend pas en charge les VPN tels que RadminVPN ou Hamachi, car ils causent souvent des problèmes. L'un d'eux est que le trafic UDP n'est pas redirigé. Pour y remédier, consultez [Rediriger le port](#forward-the-port).

::: question Mais ça marchait avant. Pourquoi plus maintenant ?
Les développeurs de ces applications mettent à jour leurs logiciels et apportent des changements sur lesquels BeamMP n'a aucun contrôle. C'est à eux de prendre en charge des usages spécifiques comme un serveur BeamMP.
:::

## Toujours des problèmes ?

Ouvrez un fil de discussion sur le [forum](https://forum.beammp.com), ou envoyez un **Server Support Ticket** dans le canal `#support` du [serveur Discord](https://discord.gg/beammp).
