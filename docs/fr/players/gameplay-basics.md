---
description: "Ce que vous voyez et faites dans BeamMP : liste des serveurs, barre de session, liste des joueurs, pseudos, chat, véhicules des autres, file d'événements."
---
# Bases du gameplay

Cette page explique ce qui change dans BeamNG.drive lorsque vous jouez sur un serveur BeamMP. Les paramètres associés à chaque élément sont décrits dans [Paramètres multijoueurs](/fr/players/multiplayer-settings).

## La liste des serveurs {#the-server-list}

Une fois connecté, le menu BeamMP s'ouvre sur la liste des serveurs. Les boutons à gauche choisissent ce que la liste affiche :

- **Public Servers** : tous les serveurs. Les serveurs officiels apparaissent en premier.
- **Official Servers**, **Featured Servers** et **Partner Servers** : uniquement les serveurs ayant ce statut.
- **Favorites** : les serveurs que vous avez ajoutés avec **Ajouter aux favoris**.
- **Recent** : les 50 derniers serveurs auxquels vous vous êtes connecté, du plus récent au plus ancien. **Effacer l'historique récent** vide la liste.
- **Direct Connect** : se connecter à un serveur à partir de son adresse.

Pour trouver un serveur :

- Saisissez du texte dans la zone de recherche pour filtrer sur le nom des serveurs.
- Cliquez sur un en-tête de colonne (**Location**, **Title**, **Map** ou **Players**) pour trier. Cliquez-y de nouveau pour inverser l'ordre.
- Utilisez **Search Filters** pour affiner la liste selon le nombre de joueurs (**Vide seulement**, **Non vide**, **Pas complet**, ou un minimum et un maximum avec **Advanced Player Count**), la **Taille totale des mods**, les tags, les versions de serveur, les localisations de serveur et les cartes. Lorsque **Correspond à tous les filtres** est activé, un serveur doit avoir tous les tags que vous sélectionnez. **Réinitialiser les filtres** les efface.
- Cliquez sur **Refresh** pour recharger la liste.

Cliquez sur un serveur pour voir ses détails : le propriétaire, la carte, la description, les tags, les joueurs présents et ses mods avec leur **Taille totale des mods :**. **Connect** vous connecte au serveur. **Ajouter aux favoris** et **Supprimer des favoris** modifient vos favoris.

Dans **Direct Connect**, saisissez l'**Adresse IP du serveur** et le **Port du serveur**, ou cliquez sur **Paste from Clipboard** pour coller une adresse de la forme `ip:port`. Si vous les laissez vides, BeamMP utilise `127.0.0.1` et le port `30814`. **Connect** vous connecte au serveur et **Ajouter aux favoris** l'ajoute à vos favoris.

Pendant la connexion, **Connexion au serveur…** indique la progression, y compris chaque mod qui se télécharge. Cliquez sur **Cancel** pour arrêter. Si le serveur utilise des mods, vous voyez d'abord l'avertissement de sécurité sur les mods, décrit dans [Sécurité des mods](/fr/players/mod-safety#the-mod-security-warning).

## La barre de session {#the-session-bar}

Dans une session, l'application HUD **BeamMP Session** en haut de l'écran affiche le nom du serveur, le nombre de **Players**, votre **Ping** en ms et un bouton **Leave**. **Leave** vous déconnecte et vous ramène au menu principal. Le bouton **Events queued** apparaît lorsque des modifications attendent d'être chargées, comme décrit dans [La file d'événements](#the-event-queue).

Le menu pause a aussi un onglet **BeamMP**. **Player List** affiche tous les joueurs avec leur ping, ainsi que des boutons pour copier un nom et ouvrir le profil du joueur. **Server Details** affiche les informations du serveur. L'adresse du serveur est masquée jusqu'à ce que vous cliquiez sur **Reveal**.

Si le serveur vous retire, un message indique la raison, avec **Retour au menu** et **Continuer hors ligne**.

## La liste des joueurs {#the-player-list}

L'application HUD **BeamMP Player List** affiche le nom et le ping de chaque joueur. Elle est masquée jusqu'à ce que vous cliquiez sur son bouton fléché (**<** ou **>**), et le même bouton la masque de nouveau. **↔** et **↕** déplacent la liste horizontalement et verticalement dans son cadre. Si **Afficher les identifiants des joueurs** est activé, elle a aussi une colonne avec l'ID de chaque joueur. Un joueur qui a des modifications en attente est mis en évidence lorsque **Mettre en évidence les joueurs en file d'attente** est activé.

Une étiquette de rôle suit le nom lorsque le joueur a un rôle, par exemple `[EA]`. Les étiquettes de rôle sont décrites dans la section [Pseudos](#nametags).

Cliquer sur un nom exécute l'action que vous avez choisie dans **Action du clic gauche sur la liste des joueurs**. Par défaut, c'est **Événements en file d'attente**. Un clic droit sur un nom ouvre un menu avec ces actions :

- **Copier le nom**
- **Supprimer tous les véhicules** : supprime les véhicules du joueur dans votre jeu.
- **Événements en file d'attente**
- **Changer de caméra vers** : vous regardez le joueur en mode spectateur.
- **Ouvrir le profil** : ouvre le profil du joueur sur le forum.
- **Véhicules supprimés de la file d'attente** : fait revenir les véhicules de ce joueur que vous avez supprimés.

Des mods peuvent ajouter leurs propres boutons à ce menu.

## Pseudos {#nametags}

Chaque joueur a un pseudo au-dessus de son véhicule. Il comporte l'étiquette de rôle et, en option, la distance et les noms des joueurs qui regardent le véhicule en mode spectateur. Vous pouvez masquer les pseudos, les faire s'estomper avec la distance et afficher la distance. L'action de touche **Player Nametags** les masque et les affiche tous.

Le rôle du compte BeamMP d'un joueur détermine l'étiquette :

| Étiquette | Étiquette courte |
|---|---|
| `[Early Access]` | `[EA]` |
| `[Contributor]` | `[CO]` |
| `[Content Creator]` | `[CC]` |
| `[Events Team]` | `[Events]` |
| `[Support]` | `[Staff]` |
| `[BeamMP Staff]` | `[Staff]` |
| `[Moderator]` | `[Mod]` |
| `[Admin]` | `[Adm]` |
| `[BeamMP Dev]` | `[Dev]` |
| `[BeamNG Developer]`, `[BeamNG Staff]`, `[BeamNG Affiliate]` | `[BNG]` |

Les joueurs sans rôle n'ont pas d'étiquette. Un serveur peut aussi attribuer sa propre étiquette à un joueur ou à un véhicule.

## Chat {#chat}

Par défaut, le chat se trouve dans l'application HUD **BeamMP Chat**. Saisissez votre texte dans la zone de saisie et envoyez-le avec **Send**. Un message peut contenir jusqu'à 500 caractères. Appuyez sur `↑` dans la zone de saisie pour rappeler votre dernier message. Les messages s'estompent après quelques secondes et réapparaissent lorsque vous passez la souris sur le chat. **↔** et **↕** déplacent le chat.

Lorsque **Nouveau menu de chat** est activé, le chat s'affiche dans une fenêtre séparée que vous pouvez faire glisser hors du jeu. Consultez [La fenêtre de chat](/fr/players/multiplayer-settings#the-chat-window) pour ses paramètres.

## Véhicules des autres joueurs {#other-players-vehicles}

- Les véhicules des autres joueurs apparaissent dans votre jeu, et leurs modifications de pièces vous sont synchronisées. Vos propres modifications de pièces sont envoyées automatiquement aux autres joueurs, environ 15 secondes après votre dernière modification, lorsque **Activer la synchronisation automatique des pièces** est activé.
- Le passage d'un véhicule à l'autre peut ignorer les véhicules des autres joueurs. Pour cela, activez **Désactiver le passage aux véhicules des autres joueurs**. Les monocycles des autres joueurs sont toujours ignorés.
- Si vous passez de votre monocycle au véhicule d'un autre joueur, la caméra passe en vue passager.
- Un véhicule qui n'est pas encore apparu chez vous s'affiche sous la forme d'une sphère colorée, appelée blob. Consultez [Blobs](/fr/players/multiplayer-settings#blobs).
- Si un joueur fait apparaître un véhicule qui utilise un mod que vous n'avez pas, BeamMP l'ignore et affiche un message. Le véhicule reste un blob.
- Lorsque **Afficher les noms des joueurs sur les plaques d'immatriculation** est activé, la plaque d'immatriculation affiche le nom du joueur à qui appartient le véhicule.
- Pour protéger votre création, activez **Activer la protection contre le clonage de configuration**. Les autres joueurs ne peuvent alors ni cloner ni enregistrer votre véhicule. Ils voient **Erreur de clonage de véhicule** ou **Erreur de sauvegarde du véhicule**.

## La file d'événements {#the-event-queue}

Lorsqu'un autre joueur fait apparaître ou modifie un véhicule, votre jeu peut mettre la modification en file d'attente au lieu de la charger immédiatement, afin qu'un chargement n'interrompe pas votre conduite. Un message vous indique qu'une modification est en file d'attente, et le bouton **Events queued** apparaît dans la barre de session. Il affiche le nombre d'apparitions en attente, puis le nombre de modifications en attente, par exemple `2|1`.

Les modifications en attente se chargent lorsque vous :

- cliquez sur **Events queued**.
- appuyez sur la touche que vous avez associée à **Queue Events**.
- cliquez sur le nom d'un joueur, ou sélectionnez **Événements en file d'attente** dans son menu. Cela ne charge que les modifications de ce joueur.

Elles se chargent aussi automatiquement lorsque vous roulez lentement depuis assez longtemps, et immédiatement si vous n'avez pas de véhicule. Consultez [les paramètres de la file d'événements](/fr/players/multiplayer-settings#event-queue).

## Véhicules instables {#unstable-vehicles}

Les instabilités de la physique ne mettent pas le jeu en pause pendant une session. BeamMP réinitialise à la place la physique d'un véhicule instable. Cela s'applique à tout véhicule de la session, le vôtre comme celui d'un autre joueur.

Si le même véhicule devient instable de façon répétée, BeamMP le désactive un instant et affiche un avertissement, puis le réactive. Un véhicule qui reste instable après cela est supprimé, et un message l'indique. Pour faire revenir le véhicule d'un autre joueur, faites un clic droit sur le joueur dans la liste des joueurs et sélectionnez **Véhicules supprimés de la file d'attente**.

## Actions de touches {#key-actions}

Dans les paramètres des commandes, la catégorie **BeamMP** contient ces actions. Associez-les aux touches de votre choix :

| Action | Ce qu'elle fait |
|---|---|
| **Bring to Front** | Fait réapparaître la fenêtre de chat après qu'elle s'est estompée |
| **Player Nametags** | Affiche ou masque tous les pseudos des joueurs |
| **Queue Events** | Charge toutes les modifications en attente |
| **Toggle Chat** | Affiche ou masque la fenêtre de chat |

## Serveurs avec mods {#servers-with-mods}

Lorsque vous vous connectez à un serveur qui utilise des mods, BeamMP affiche d'abord un avertissement de sécurité sur les mods. Lisez [Sécurité des mods](/fr/players/mod-safety) avant de l'accepter.
