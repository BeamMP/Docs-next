---
description: "Tous les paramètres multijoueurs de BeamMP expliqués : général, file d'événements, monocycle par défaut, blobs, pseudos et port du lanceur."
---
# Paramètres multijoueurs

Voici les paramètres de la page des paramètres multijoueurs de BeamMP. Chacun est une entrée repliée : ouvrez-la pour voir ce qu'il fait lorsqu'il est activé et lorsqu'il est désactivé. Si vous débutez, commencez par [Paramètres multijoueur (première configuration)](/fr/get-started/multiplayer-settings-quickstart).

## Général

::: details Afficher les options avancées
Si cette option est activée, tous les paramètres multijoueurs s'affichent

Si elle est désactivée, seuls les paramètres multijoueurs de base s'affichent
:::

::: details Activer la protection contre le clonage de configuration
Si cette option est activée, la configuration de votre véhicule apparu est protégée : les autres joueurs ne peuvent pas l'enregistrer

Si elle est désactivée, la configuration de votre véhicule apparu peut être enregistrée par les autres joueurs
:::

:::: details Disable pausing caused by instabilities
Si cette option est activée, les instabilités de la physique ne mettent pas votre jeu en pause

Si elle est désactivée, les instabilités de la physique mettent votre jeu en pause

::: note
Il est conseillé de la laisser désactivée, car des instabilités répétées peuvent faire planter le jeu
:::
::::

::: details Utilisez des véhicules simplifiés lorsqu'ils sont disponibles
Si cette option est activée, le jeu remplace les véhicules des autres joueurs par leurs versions simplifiées (celles du trafic IA), lorsqu'elles existent

Si elle est désactivée, le jeu utilise les modèles de véhicules d'origine
:::

:::: details Nouveau menu de chat
Si cette option est activée, le chat en jeu s'affiche dans une fenêtre [IMGUI](https://github.com/ocornut/imgui) que l'on peut, par exemple, faire glisser hors du jeu vers un autre écran

Si elle est désactivée, le chat en jeu s'affiche dans l'application d'interface (UI app)

::: note
Faire glisser des fenêtres IMGUI hors de la fenêtre principale du jeu peut causer des problèmes de performances, et peut aussi tromper un logiciel d'enregistrement d'écran, qui enregistre alors la fenêtre du chat à la place de la fenêtre principale du jeu
:::
::::

::: details Activer le lissage de la position du véhicule
Si cette option est activée, BeamMP utilise un algorithme qui lisse les mises à jour de position des véhicules à intervalles réguliers. Peut être utile entre des joueurs ayant un ping élevé, ou lorsqu'une connexion perd beaucoup de paquets

Si elle est désactivée, BeamMP met à jour la position des véhicules dès qu'elle est reçue
:::

::: details Ignorer la fenêtre contextuelle d'avertissement de sécurité de mod
Si cette option est activée, la fenêtre d'avertissement de sécurité sur les mods ne s'affiche pas lorsque vous vous connectez à un serveur qui utilise des mods

Si elle est désactivée, la fenêtre d'avertissement de sécurité sur les mods s'affiche chaque fois que vous vous connectez à un serveur qui utilise des mods
:::

::: details Activer la file d'attente des mises à jour/modifications des véhicules des joueurs
Si cette option est activée, l'apparition et les modifications des véhicules des autres joueurs sont mises en file d'attente. Consultez la section [File d'événements](#event-queue) pour plus de détails

Si elle est désactivée, l'apparition et les modifications des véhicules des autres joueurs sont chargées instantanément par le jeu
:::

::: details Activer la synchronisation automatique des pièces
Si cette option est activée, les pièces de vos véhicules sont automatiquement synchronisées avec les autres joueurs après quelques secondes

Si elle est désactivée, vous devez cliquer sur le bouton de synchronisation des pièces dans le sélecteur de pièces pour envoyer une synchronisation aux autres joueurs
:::

::: details Désactiver le passage aux véhicules des autres joueurs
Si cette option est activée, le passage d'un véhicule à l'autre avec la touche Tab ignore les véhicules des autres joueurs

Si elle est désactivée, la touche Tab parcourt tous les véhicules apparus
:::

:::: details Faire disparaître les véhicules à mesure qu'ils s'approchent
Si cette option est activée, les autres véhicules s'estompent à mesure qu'ils se rapprochent

Si elle est désactivée, les autres véhicules restent entièrement visibles quelle que soit la distance

::: note
Cela n'affecte que le maillage 3D visible d'un véhicule, pas son maillage physique de nœuds et de poutres (node-beam-mesh). Pour désactiver aussi la physique, vous devez activer `Simplified collision physics` dans les paramètres de Gameplay
:::
::::

::: details Afficher les identifiants des joueurs
Si cette option est activée, la liste des joueurs en jeu affiche une colonne supplémentaire avec l'ID de chaque joueur. Utile pour le développement ou la modération

Si elle est désactivée, la liste des joueurs en jeu n'affiche que les colonnes du nom du joueur et du ping
:::

::: details Autoriser la mise à jour de la liste des serveurs en jeu
Si cette option est activée, la liste des serveurs se met à jour à intervalles réguliers pendant que vous jouez. Cela peut provoquer des pics de latence

Si elle est désactivée, la liste des serveurs ne se met à jour qu'à l'ouverture du menu principal
:::

## File d'événements {#event-queue}

::: details Mettre en évidence les joueurs en file d'attente
Si cette option est activée, les joueurs ayant un événement en attente sont mis en évidence dans la liste des joueurs en jeu

Si elle est désactivée, les joueurs ne sont pas mis en évidence individuellement
:::

::: details Apply vehicle changes with
Si ce paramètre est réglé sur `Left mouse button`, un clic gauche sur le nom d'un joueur dans la liste des joueurs charge les événements en attente. Un clic droit permet de regarder ce joueur en mode spectateur

Si ce paramètre est réglé sur `Right mouse button`, un clic droit sur le nom d'un joueur dans la liste des joueurs charge les événements en attente. Un clic gauche permet de regarder ce joueur en mode spectateur
:::

::: details Appliquer automatiquement les modifications de véhicules en attente
Si cette option est activée, les événements en attente sont chargés automatiquement dès que votre vitesse reste sous le seuil de vitesse pendant la durée définie comme délai

Si elle est désactivée, les événements en attente ne se chargent que manuellement, en cliquant soit sur le bouton `Events` en haut de l'écran, soit sur le nom d'un joueur dans la liste des joueurs
:::

::: details Seuil de vitesse d'application de la file d'attente
Ce paramètre définit le seuil de vitesse du chargement automatique de la file d'événements. Votre véhicule doit rouler plus lentement que ce seuil pendant plus longtemps que `Délai d'application de la file d'attente` pour que les événements en attente soient chargés
:::

::: details Délai d'application de la file d'attente
Ce paramètre définit le délai du chargement automatique de la file d'événements. Votre véhicule doit rouler plus lentement que `Seuil de vitesse d'application de la file d'attente` pendant cette durée pour que les événements en attente soient chargés
:::

::: details Passez la file d'attente si vous êtes spectateur
Si cette option est activée, un événement est chargé instantanément si vous regardez un autre joueur en mode spectateur

Si elle est désactivée, un événement est mis en file d'attente comme lorsque vous êtes sur votre propre véhicule
:::

::: details Ne mettez pas en file d'attente les bonhommes de neige et Beamlings
Si cette option est activée, un événement concernant un bonhomme de neige ou un Beamling est chargé instantanément

Si elle est désactivée, les bonshommes de neige et les Beamlings sont mis en file d'attente comme les autres véhicules
:::

## Monocycle par défaut

::: details Configuration du personnage par défaut
Ce paramètre définit la variante de monocycle chargée par défaut. Vous pouvez choisir parmi des configurations prédéfinies ou vos propres configurations, si vous avez enregistré des configurations de monocycle personnalisées
:::

::: details Sauvegarde automatique de votre dernier personnage utilisé
Si cette option est activée, votre dernier monocycle utilisé est enregistré automatiquement et rechargé la prochaine fois que vous le faites apparaître

Si elle est désactivée, votre configuration de monocycle par défaut apparaît à chaque fois
:::

## Blobs

::: details Activer les blobs pour les véhicules non générés
Si cette option est activée, vous voyez une sphère de substitution, ou blob, à la place d'un véhicule qui n'est pas encore apparu

Si elle est désactivée, un véhicule qui n'est pas encore apparu est invisible
:::

:::: details Ajuster les couleurs
::: details Visible
Si cette option est activée, un blob est affiché, avec la couleur ci-dessous

Si elle est désactivée, aucun blob n'est affiché pour la fonction indiquée
:::

::: details Valeur de couleur HEX (ex : #FF6400)
Queued vehicle : la couleur d'un blob lorsque l'apparition d'un véhicule est en attente. Valeur standard : #FF6400

Illegal vehicle : la couleur d'un blob lorsqu'un véhicule est illégal, par exemple à cause d'un mod chargé en dehors du serveur (sideloaded). Valeur standard : #000000

Deleted vehicle : la couleur d'un blob lorsqu'un véhicule a été supprimé par l'utilisateur. Valeur standard : #333333
:::
::::

## Pseudos

::: details Masquer les noms d'utilisateur
Si cette option est activée, les pseudos des joueurs ne sont pas affichés

Si elle est désactivée, les pseudos des joueurs sont affichés selon la position relative de leurs véhicules
:::

::: details Afficher la distance par rapport aux autres joueurs
Si cette option est activée, le pseudo est précédé de la distance jusqu'au véhicule correspondant

Si elle est désactivée, aucune distance supplémentaire n'est affichée dans le pseudo
:::

::: details Faire apparaître/disparaître progressivement les noms d'utilisateur
Si cette option est activée, un pseudo apparaît ou disparaît progressivement selon `Fade distance` et `Invert nametag fade direction`

Si elle est désactivée, un pseudo est affiché avec l'opacité standard, quelle que soit la distance jusqu'au véhicule correspondant
:::

:::: details Fade distance/Invert nametag fade direction
::: details Fondu en sortie
Les pseudos deviennent moins visibles à mesure qu'un joueur s'éloigne

`Fade distance` définit la distance à laquelle un pseudo est affiché avec une opacité minimale
:::

::: details Fondu en entrée
Les pseudos deviennent plus visibles à mesure qu'un joueur s'éloigne

`Fade distance` définit la distance à laquelle un pseudo est affiché avec une opacité maximale
:::
::::

::: details Ne masquez pas complètement les noms d'utilisateur
Si cette option est activée, un pseudo ne peut pas devenir totalement invisible : il conserve une opacité minimale quelle que soit la distance

Si elle est désactivée, les pseudos peuvent devenir totalement invisibles
:::

::: details Raccourcir les noms et rôles d'utilisateur
Si cette option est activée, `Nametag length limit` tronque les pseudos et les rôles à la limite de caractères définie

Si elle est désactivée, les pseudos et les étiquettes de rôle sont affichés en entier
:::

::: details Afficher le nom des spectateurs sous les noms des véhicules
Si cette option est activée, le nom d'un spectateur est ajouté sous le pseudo d'un joueur

Si elle est désactivée, aucun nom de spectateur n'est ajouté aux pseudos
:::

::: details Même couleur pour les noms des spectateurs
Si cette option est activée, le nom d'un spectateur est toujours entouré d'un fond gris

Si elle est désactivée, le nom d'un spectateur est entouré d'un fond coloré, qui reflète le rôle du spectateur
:::

## Autres paramètres

:::: details Afficher l'activité réseau dans la console
Si cette option est activée, l'activité réseau de BeamMP est affichée dans la console

Si elle est désactivée, aucune autre activité réseau n'est affichée dans la console

::: danger
Soyez prudent avec ce paramètre, car toute la sortie de la console est aussi écrite dans les fichiers journaux

Ils peuvent atteindre des centaines de Mo en quelques minutes lorsque ce paramètre est activé
:::
::::

:::: details Port du lanceur
Ce paramètre définit le port utilisé pour communiquer avec le lanceur

Ne le modifiez que si le port standard 4444 ne peut pas être utilisé

N'oubliez pas de le modifier aussi côté lanceur, en modifiant `Launcher.cfg`

::: tip
Le port indiqué n'est que le premier de deux : le second port utilisé le suit directement, c'est-à-dire le port + 1

Le premier port transporte les paquets réseau principaux, le second les paquets réseau du jeu, tous deux en TCP
:::
::::
