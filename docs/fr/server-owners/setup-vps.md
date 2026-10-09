---
description: "Configurez un serveur BeamMP sur un VPS ou dans le panneau de gestion d'un hébergeur : obtenez une AuthKey, remplissez les champs du panneau, ajoutez des mods et faites venir les joueurs."
---
# Configuration du serveur sur un VPS

Ce guide s'adresse à un serveur hébergé sur un VPS, ou chez un hébergeur, qui dispose d'un panneau de gestion. Pour héberger chez vous à la place, suivez [Héberger un serveur](/fr/server-owners/host-a-server).

Un hébergement sur VPS ne nécessite aucune modification du pare-feu ni aucune redirection de port sur votre routeur.

## Avant de commencer

Les serveurs font partie intégrante de BeamMP : les joueurs sont connectés les uns aux autres par l'intermédiaire du serveur. Vous pouvez créer un serveur privé, que seules les personnes que vous invitez peuvent rejoindre, ou un serveur public, qui apparaît dans la liste officielle des serveurs.

Lisez la [LICENCE](https://raw.githubusercontent.com/BeamMP/BeamMP-Server/master/LICENSE) du serveur avant de l'utiliser.

Si vous rencontrez des problèmes, posez vos questions sur le [forum](https://forum.beammp.com) ou dans le canal `#support` du [serveur Discord](https://discord.gg/beammp). La page [Configuration du serveur](/fr/server-owners/configuration) détaille les paramètres du serveur.

Si vous n'avez pas encore choisi de VPS, consultez nos services d'hébergement partenaires. Ils sont payants.

::: details Services d'hébergement partenaires
<!--@include: ./_parts/partners.md-->
:::

## Préparer le VPS

Assurez-vous que la page de gestion de votre serveur est accessible. Une fois que vous avez vérifié que le serveur est prêt à fonctionner, continuez.

<!--@include: ./_parts/authkey.md-->

## Remplir les champs du panneau

Le panneau de l'hébergeur comporte des champs à remplir. Les champs marqués d'un `*` sont obligatoires.

1. Collez votre AuthKey dans le champ **Authkey**.
2. Donnez un nom et une description à votre serveur. Vous pouvez les mettre en forme avec des couleurs et plus encore : consultez [Personnaliser l'apparence du nom de votre serveur](/fr/server-owners/configuration#customize-the-look-of-your-server-name).

::: warning
Vous ne pouvez pas modifier `ServerConfig.toml` directement dans le gestionnaire de fichiers. C'est voulu : cela permet à l'hébergeur d'imposer des limites, comme le nombre de joueurs.
:::

### Vérifier qu'il démarre

Lancez votre serveur et cherchez les messages `[ERROR]` ou `[WARN]`. Le serveur doit maintenant rester en marche. Ajoutez ensuite des mods si vous le souhaitez, puis voyez comment le rejoindre.

## Ajouter des mods

Vous pouvez ajouter des mods avec le gestionnaire de fichiers du panneau. Les mods de véhicules et les mods de cartes s'installent différemment, mais tous vont dans le dossier `Resources/Client` de votre serveur. Placez le fichier `.zip` du mod dans ce dossier.

::: warning
Les mods peuvent être, ou devenir, incompatibles avec BeamNG, BeamMP ou d'autres mods. Si vous avez des problèmes, commencez à retirer des mods. Si vous obtenez un message « done » ou « start » en essayant de vous connecter après avoir ajouté des mods, vous avez probablement ajouté un mod incompatible ou défectueux. Si vous avez des mods côté client installés, consultez [Sécurité des mods](/fr/players/mod-safety) pour savoir comment les retirer de votre jeu.
:::

### Mods de véhicules et autres mods

Placez le fichier `.zip` du mod dans `Resources/Client`. Toutes les personnes qui se connectent le téléchargent automatiquement.

### Cartes

Les cartes d'origine fonctionnent sans rien installer. Définissez le champ **Map** du panneau de gestion avec l'un des [chemins des cartes d'origine](/fr/server-owners/configuration#all-vanilla-maps-names).

Pour une carte moddée :

1. Placez le fichier `.zip` de la carte dans `Resources/Client`.
2. Ouvrez le `.zip` sans l'extraire, puis ouvrez son dossier `levels`. Il contient un dossier portant le nom de la carte, par exemple `myawesomedriftmap2021`. Notez ce nom exactement tel qu'il est écrit.
3. Dans le panneau de gestion, le champ **Map** ressemble à `/levels/MAPNAME/info.json`, où `MAPNAME` est probablement quelque chose comme `gridmap_v2`. Remplacez `MAPNAME` par le nom du dossier de l'étape 2. Le chemin doit se terminer par `/info.json`. Pour cet exemple : `/levels/myawesomedriftmap2021/info.json`.

Lorsque quelqu'un se connecte, la carte se télécharge automatiquement et fonctionne.

Si cela ne fonctionne pas, installez la carte dans BeamNG.drive en solo et lancez-la. Ouvrez la console avec la touche `~` (tilde). Sur un clavier non américain, cherchez l'action **Toggle System Console** sous **Options** > **Controls** > **Bindings**, dans la section **General Debug**. Exécutez `print(getMissionFilename())`. Cela affiche le nom à utiliser.

## Faire venir les joueurs

Les joueurs peuvent se connecter directement à l'adresse IP publique et au port du serveur, que vous trouverez tous deux dans le panneau de gestion. Vous pouvez aussi trouver l'adresse IP sur le site [Keymaster](https://keymaster.beammp.com/).

Pour un serveur public, les joueurs peuvent à la place ouvrir la liste des serveurs, saisir le nom du serveur et cliquer sur **Connect**. Le nom est celui que vous avez défini. S'ils ne le trouvent pas, dites-leur de désactiver les filtres de recherche et de régler la carte sur **Any**.

Si vous ou un ami obtenez « Connection Failed! », cherchez dans la fenêtre du lanceur des codes tels que 10060, 10061 ou 10030. Ils signifient que le serveur est injoignable, ou que l'adresse IP et le port saisis sur le client sont incorrects. L'IPv6 n'est pas encore prise en charge.

## Toujours des problèmes ?

Ouvrez un fil de discussion sur le [forum](https://forum.beammp.com), ou envoyez un **Server Support Ticket** dans le canal `#support` du [serveur Discord](https://discord.gg/beammp).
