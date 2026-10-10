---
description: "Tous les paramètres multijoueurs de BeamMP expliqués : général, file d'événements, blobs, interface, pseudos, joueurs, options avancées et fenêtre de chat."
---
# Paramètres multijoueurs

Voici les paramètres de la page **BeamMP** des options de BeamNG.drive, tels qu'ils sont dans BeamMP 4.22 pour BeamNG.drive 0.39. Pour les ouvrir, cliquez sur **Options** et sélectionnez l'onglet **BeamMP**. Tous les paramètres sont toujours visibles : aucun interrupteur ne masque les paramètres avancés.

Chaque paramètre ci-dessous est une entrée repliée. Ouvrez-la pour voir sa valeur par défaut et ce qu'il fait lorsqu'il est activé et lorsqu'il est désactivé. Les titres suivent les groupes de la page : **Générales**, **Vehicle Update Queue**, **Blobs**, **Interface utilisateur**, **Joueurs** et **Avancées**. Si vous débutez, commencez par [Paramètres multijoueur (première configuration)](/fr/get-started/multiplayer-settings-quickstart).

## Générales {#general}

::: details Activer la protection contre le clonage de configuration
Par défaut : désactivé.

Si cette option est activée, les autres joueurs ne peuvent pas cloner ni enregistrer vos véhicules. Lorsqu'ils essaient, ils voient **Erreur de clonage de véhicule** ou **Erreur de sauvegarde du véhicule**. Modifier ce paramètre met aussi à jour les véhicules que vous avez déjà fait apparaître.

Si elle est désactivée, les autres joueurs peuvent cloner et enregistrer vos véhicules.
:::

::: details Désactiver le passage aux véhicules des autres joueurs
Par défaut : désactivé.

Si cette option est activée, le passage d'un véhicule à l'autre ignore les véhicules des autres joueurs tant que vous avez un véhicule à vous.

Si elle est désactivée, le passage d'un véhicule à l'autre parcourt tous les véhicules apparus.

Les monocycles des autres joueurs sont toujours ignorés, quel que soit ce paramètre.
:::

::: details Sauvegarde automatique de votre dernier personnage utilisé
Par défaut : activé.

Si cette option est activée, BeamMP enregistre la configuration de votre monocycle lorsque vous le supprimez, et utilise cette configuration la prochaine fois que vous le faites apparaître.

Si elle est désactivée, la configuration de votre monocycle n'est pas enregistrée lorsque vous le supprimez.
:::

## File d'événements {#event-queue}

Dans le jeu, ce groupe s'appelle **Vehicle Update Queue**. Lorsqu'un autre joueur fait apparaître ou modifie un véhicule, BeamMP peut mettre la modification en file d'attente au lieu de la charger immédiatement, afin qu'un chargement n'interrompe pas votre conduite.

Tant que des modifications attendent, un message vous indique leur nombre, et la barre de session en haut de l'écran affiche un bouton **Events queued**. Les deux nombres du bouton sont les apparitions en attente et les modifications en attente, dans cet ordre. Le bouton n'apparaît que lorsque quelque chose est en file d'attente. Si vous n'avez pas de véhicule, les modifications en attente se chargent immédiatement.

Les modifications en attente se chargent lorsque :

- vous cliquez sur **Events queued** en haut de l'écran.
- vous appuyez sur la touche associée à **Queue Events**. Associez-la dans la catégorie **BeamMP** des paramètres des commandes.
- vous cliquez sur le nom d'un joueur alors que **Action du clic gauche sur la liste des joueurs** est réglée sur **Événements en file d'attente**. Cela ne charge que les modifications de ce joueur. **Événements en file d'attente** dans le menu clic droit du joueur fait la même chose.
- le chargement automatique décrit plus bas se déclenche.

::: details Activer la file d'attente des mises à jour/modifications des véhicules des joueurs
Par défaut : activé.

Si cette option est activée, l'apparition et les modifications des véhicules des autres joueurs attendent dans la file d'attente jusqu'à ce qu'une des actions ci-dessus les charge.

Si elle est désactivée, l'apparition et les modifications des véhicules des autres joueurs se chargent immédiatement.
:::

::: details Appliquer automatiquement les modifications de véhicules en attente
Par défaut : activé. Affiché uniquement lorsque la mise en file d'attente est activée.

Si cette option est activée, les modifications en attente se chargent dès que votre véhicule est resté à la vitesse définie dans **Seuil de vitesse d'application de la file d'attente** ou en dessous pendant la durée définie dans **Délai d'application de la file d'attente**.

Si elle est désactivée, les modifications en attente ne se chargent que lorsque vous les chargez vous-même.
:::

::: details Seuil de vitesse d'application de la file d'attente
Par défaut : 2 m/s. Un curseur de 0 à 10 m/s. Affiché uniquement lorsque le chargement automatique est activé.

Votre véhicule doit rouler à cette vitesse ou en dessous pendant la durée définie dans **Délai d'application de la file d'attente** pour que les modifications en attente se chargent.
:::

::: details Délai d'application de la file d'attente
Par défaut : 3 s. Un curseur de 0 à 20 s. Affiché uniquement lorsque le chargement automatique est activé.

Votre véhicule doit rouler à la vitesse définie dans **Seuil de vitesse d'application de la file d'attente** ou en dessous pendant cette durée pour que les modifications en attente se chargent.
:::

::: details Activer la synchronisation automatique des pièces
Par défaut : activé.

Si cette option est activée, une modification que vous apportez aux pièces de votre véhicule est envoyée aux autres joueurs environ 15 secondes après votre dernière modification.

Si elle est désactivée, vos modifications de pièces ne sont pas envoyées automatiquement.
:::

::: details Passez la file d'attente si vous êtes spectateur
Par défaut : désactivé.

Si cette option est activée, les modifications en attente se chargent immédiatement tant que le véhicule dans lequel vous êtes n'est pas le vôtre.

Si elle est désactivée, les modifications en attente restent dans la file d'attente, comme lorsque vous conduisez votre propre véhicule.
:::

::: details Ne mettez pas en file d'attente les bonhommes de neige et Beamlings
Par défaut : activé.

Si cette option est activée, l'apparition et les modifications des monocycles des autres joueurs se chargent immédiatement.

Si elle est désactivée, les monocycles sont mis en file d'attente comme les autres véhicules.
:::

## Blobs {#blobs}

Un blob est une sphère colorée qui remplace un véhicule qui n'est pas encore apparu chez vous. Il a l'une de ces quatre couleurs :

- La couleur « file d'attente » : le véhicule attend dans la file d'attente.
- La couleur « illégal » : le véhicule ne peut pas apparaître, parce que son mod est manquant.
- La couleur « supprimé » : vous avez supprimé le véhicule. Pour le faire revenir, faites un clic droit sur son propriétaire dans la liste des joueurs et sélectionnez **Véhicules supprimés de la file d'attente**.
- Magenta : tout autre véhicule qui n'est pas encore apparu. Vous ne pouvez pas modifier cette couleur.

::: details Activer les blobs pour les véhicules non générés
Par défaut : activé.

Si cette option est activée, vous voyez un blob à la place de chaque véhicule qui n'est pas encore apparu.

Si elle est désactivée, un véhicule qui n'est pas encore apparu est invisible.
:::

::: details Véhicule en file d'attente
Par défaut : affiché, `#FF6400`.

La case **Véhicule en file d'attente** active ou désactive le blob des véhicules en file d'attente. Le champ **Valeur de couleur HEX (ex : #FF6400)** définit sa couleur.
:::

::: details Véhicule illégal
Par défaut : affiché, `#000000`.

La case **Véhicule illégal** active ou désactive le blob des véhicules qui ne peuvent pas apparaître. Le champ **Valeur de couleur HEX (ex : #FF6400)** définit sa couleur.
:::

::: details Véhicule supprimé
Par défaut : affiché, `#333333`.

La case **Véhicule supprimé** active ou désactive le blob des véhicules que vous avez supprimés. Le champ **Valeur de couleur HEX (ex : #FF6400)** définit sa couleur.
:::

## Interface utilisateur {#user-interface}

::: details Ignorer la fenêtre contextuelle d'avertissement de sécurité de mod
Par défaut : désactivé.

Si cette option est activée, l'avertissement de sécurité sur les mods ne s'affiche pas lorsque vous vous connectez à un serveur qui utilise des mods. Les mods se téléchargent sans demander.

Si elle est désactivée, l'avertissement s'affiche chaque fois que vous vous connectez à un serveur qui utilise des mods. Consultez [Sécurité des mods](/fr/players/mod-safety#the-mod-security-warning).
:::

::: details Autoriser la mise à jour de la liste des serveurs en jeu
Par défaut : désactivé.

Si cette option est activée, la liste des serveurs peut être actualisée pendant que vous êtes dans une session. Cela peut provoquer des pics de latence.

Si elle est désactivée, la liste des serveurs continue d'afficher la liste d'avant votre connexion jusqu'à ce que vous quittiez la session.
:::

::: details Style d'application HUD
Par défaut : **Original**. Les choix sont **Original** et **Nouveau**.

Ce paramètre définit l'apparence des applications HUD de BeamMP : la barre de session, la liste des joueurs et le chat.
:::

:::: details Nouveau menu de chat
Par défaut : désactivé.

Si cette option est activée, le chat en jeu s'affiche dans une fenêtre [ImGui](https://github.com/ocornut/imgui) que vous pouvez faire glisser hors du jeu vers un autre écran. Consultez [La fenêtre de chat](#the-chat-window).

Si elle est désactivée, le chat en jeu s'affiche dans l'application HUD **BeamMP Chat**.

::: warning
Faire glisser une fenêtre ImGui hors de la fenêtre principale du jeu peut causer des problèmes de performances, et peut aussi amener un logiciel d'enregistrement d'écran à enregistrer la fenêtre du chat à la place du jeu.
:::
::::

### Pseudos {#nametags}

Les autres paramètres de pseudos sont indisponibles tant que **Masquer les noms d'utilisateur** est activé.

::: details Masquer les noms d'utilisateur
Par défaut : désactivé.

Si cette option est activée, aucun pseudo n'est affiché.

Si elle est désactivée, le pseudo de chaque joueur est affiché au-dessus de son véhicule. L'action de touche **Player Nametags** des paramètres des commandes masque et affiche tous les pseudos jusqu'au redémarrage du jeu.
:::

::: details Afficher la distance par rapport aux autres joueurs
Par défaut : activé.

Si cette option est activée, un pseudo se termine par la distance jusqu'au véhicule lorsque celui-ci est à plus de 10 m. La distance utilise le système d'unités du jeu.

Si elle est désactivée, un pseudo n'affiche pas de distance.
:::

::: details Cacher les noms d'utilisateur derrière des objets
Par défaut : désactivé.

Si cette option est activée, les objets tels que les bâtiments masquent un pseudo qui se trouve derrière eux.

Si elle est désactivée, les pseudos sont affichés par-dessus tout.
:::

::: details Raccourcir les noms et rôles d'utilisateur
Par défaut : désactivé.

Si cette option est activée, les noms longs sont tronqués à **limite de longueur des noms d'utilisateur**, et les étiquettes de rôle utilisent leur forme courte, comme `[EA]` pour `[Early Access]`.

Si elle est désactivée, les noms et les étiquettes de rôle sont affichés en entier.
:::

::: details limite de longueur des noms d'utilisateur
Par défaut : 32. Un curseur de 0 à 50. Disponible lorsque **Raccourcir les noms et rôles d'utilisateur** est activé.

C'est le plus grand nombre de caractères d'un nom qui sont affichés. Un nom qui dépasse la limite de plus de trois caractères est tronqué à la limite et se termine par `...`.
:::

::: details Afficher le nom des spectateurs sous les noms des véhicules
Par défaut : activé.

Si cette option est activée, les noms des joueurs qui regardent un véhicule en mode spectateur sont affichés sous son pseudo.

Si elle est désactivée, les spectateurs ne sont pas affichés.
:::

::: details Même couleur pour les noms des spectateurs
Par défaut : désactivé. Disponible lorsque **Afficher le nom des spectateurs sous les noms des véhicules** est activé.

Si cette option est activée, le pseudo de chaque spectateur a le même fond gris.

Si elle est désactivée, le pseudo d'un spectateur a un fond qui reflète le rôle du spectateur.
:::

::: details Faire apparaître/disparaître progressivement les noms d'utilisateur
Par défaut : désactivé.

Si cette option est activée, un pseudo s'estompe avec la distance jusqu'à son véhicule, selon **Distance de fondu**. **Inverser le sens de fondu des noms d'utilisateur** définit dans quel sens il s'estompe.

Si elle est désactivée, un pseudo est affiché avec une opacité totale, quelle que soit la distance.
:::

::: details Distance de fondu
Par défaut : 40 m. Un curseur de 0 à 1500 m. Disponible lorsque **Faire apparaître/disparaître progressivement les noms d'utilisateur** est activé.

Un pseudo est entièrement visible à côté du véhicule et entièrement transparent à cette distance. Lorsque **Inverser le sens de fondu des noms d'utilisateur** est activé, c'est l'inverse.
:::

::: details Ne masquez pas complètement les noms d'utilisateur
Par défaut : désactivé. Disponible lorsque **Faire apparaître/disparaître progressivement les noms d'utilisateur** est activé.

Si cette option est activée, un pseudo conserve une opacité minimale de 30 pour cent, quelle que soit la distance.

Si elle est désactivée, un pseudo peut devenir entièrement transparent.
:::

::: details Inverser le sens de fondu des noms d'utilisateur
Par défaut : désactivé. Disponible lorsque **Faire apparaître/disparaître progressivement les noms d'utilisateur** est activé.

Si cette option est activée, les pseudos sont transparents près du véhicule et deviennent plus visibles à mesure que l'on s'en éloigne.

Si elle est désactivée, les pseudos sont visibles près du véhicule et s'estompent à mesure que l'on s'en éloigne.
:::

### Liste des joueurs {#player-list}

::: details Afficher les identifiants des joueurs
Par défaut : activé.

Si cette option est activée, la liste des joueurs a une colonne supplémentaire avec l'ID de chaque joueur. L'ID est utile pour le staff du serveur.

Si elle est désactivée, la liste des joueurs n'affiche que les noms et le ping.
:::

::: details Mettre en évidence les joueurs en file d'attente
Par défaut : activé.

Si cette option est activée, un joueur qui a des modifications en attente est mis en évidence dans la liste des joueurs.

Si elle est désactivée, aucun joueur n'est mis en évidence.
:::

::: details Action du clic gauche sur la liste des joueurs
Par défaut : **Événements en file d'attente**.

Ce paramètre définit ce que fait un clic gauche sur le nom d'un joueur dans la liste des joueurs. Les choix sont :

- **Événements en file d'attente** : charge les modifications en attente de ce joueur.
- **Changer de caméra vers** : vous regardez le joueur en mode spectateur.
- **Ouvrir le profil** : ouvre le profil du joueur sur le forum.
- **Supprimer tous les véhicules** : supprime tous les véhicules du joueur dans votre jeu.
- **Véhicules supprimés de la file d'attente** : met en file d'attente les véhicules du joueur que vous avez supprimés.
- **Copier le nom** : copie le nom du joueur.

Un clic droit sur un nom ouvre toujours un menu avec toutes ces actions.
:::

## Joueurs {#players}

::: details Afficher les noms des joueurs sur les plaques d'immatriculation
Par défaut : activé.

Si cette option est activée, la plaque d'immatriculation du véhicule d'un autre joueur affiche le nom de ce joueur.

Si elle est désactivée, BeamMP ne modifie pas le texte des plaques d'immatriculation.
:::

:::: details Faire disparaître les véhicules à mesure qu'ils s'approchent
Par défaut : désactivé.

Si cette option est activée, les véhicules des autres joueurs s'estompent à mesure qu'ils se rapprochent. Ils sont entièrement visibles à partir de 20 m et entièrement transparents à votre position. Cela ne fonctionne que lorsque les pseudos sont affichés.

Si elle est désactivée, les véhicules des autres joueurs restent entièrement visibles quelle que soit la distance.

::: info
Cela ne change que l'apparence du véhicule, pas sa physique. Ce paramètre est conçu pour être utilisé avec les collisions désactivées. Le paramètre du jeu correspondant se trouve dans les options **Jouabilité**.
:::
::::

::: details Utilisez des véhicules simplifiés lorsqu'ils sont disponibles
Par défaut : désactivé.

Si cette option est activée, les véhicules des autres joueurs sont remplacés par les versions simplifiées du trafic de BeamNG.drive, pour les véhicules qui en ont une. Cela réduit la précision des collisions et du rendu, et améliore les performances.

Si elle est désactivée, le jeu utilise les modèles de véhicules choisis par l'autre joueur.
:::

## Avancées {#advanced}

::: details Activer le lissage de la position du véhicule
Par défaut : désactivé.

Si cette option est activée, BeamMP lisse les données de position des joueurs dont la connexion est instable. Cela réduit les téléportations et l'effet élastique des véhicules.

Si elle est désactivée, BeamMP met à jour la position des véhicules dès qu'elle est reçue.
:::

:::: details Afficher l'activité réseau dans la console
Par défaut : désactivé.

Si cette option est activée, l'activité réseau de BeamMP est affichée dans la console.

Si elle est désactivée, la console ne l'affiche pas.

::: danger
La sortie de la console est aussi écrite dans les fichiers journaux. Lorsque ce paramètre est activé, ils peuvent atteindre des centaines de Mo en quelques minutes.
:::
::::

:::: details Port du lanceur :
Par défaut : 4444. Le jeu affiche l'indication « Ne le modifiez pas sauf si vous y êtes absolument obligé ».

C'est le port que le jeu utilise pour communiquer avec le lanceur. Ne le modifiez que si le port 4444 ne peut pas être utilisé. Définissez `Port` dans `Launcher.cfg` sur le même nombre.

::: tip
Le port que vous indiquez n'est que le premier de deux. Le jeu utilise aussi le port suivant : avec 4444, c'est 4445. Le premier transporte les paquets réseau principaux et le second les paquets réseau du jeu.
:::
::::

## La fenêtre de chat {#the-chat-window}

Lorsque **Nouveau menu de chat** est activé, le chat est une fenêtre ImGui avec ses propres paramètres. Cliquez sur l'icône en forme d'engrenage dans la barre de titre de la fenêtre pour les ouvrir. Ils sont répartis en deux onglets, chacun avec les boutons **Reset to default** et **Save**. Les paramètres sont enregistrés dans `settings/BeamMP/chat.json`.

::: details Onglet General
**Inactive fade** : activé par défaut. Si cette option est activée, la fenêtre s'estompe lorsque vous ne l'utilisez pas.

**Fade time** : 2,5 s par défaut, au minimum 0,1 s. Le temps que la fenêtre attend avant de s'estomper.

**Fade when collapsed** : désactivé par défaut. Si cette option est activée, la fenêtre s'estompe aussi lorsqu'elle est réduite.

**Show on message** : activé par défaut. Si cette option est activée, la fenêtre réapparaît lorsqu'un message arrive.

**Keep active on Enter** : activé par défaut. Si cette option est activée, le curseur reste dans la zone de message après que vous avez appuyé sur `Enter`.
:::

::: details Onglet Theming
Définit les couleurs de la fenêtre : **Window Background**, **Button Background**, **Button Hovered**, **Button Active**, **Text Color**, **Primary Color** et **Secondary Color**.
:::

Les actions de touche **Bring to Front** et **Toggle Chat** des paramètres des commandes font réapparaître la fenêtre après qu'elle s'est estompée, et la masquent.
