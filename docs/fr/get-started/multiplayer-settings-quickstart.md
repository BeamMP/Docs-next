---
description: "Les quelques paramètres multijoueur de BeamMP à connaître dès votre première session : chat, pseudos, lissage, file d'événements et port du lanceur."
---
# Paramètres multijoueur (première configuration)

BeamMP possède ses propres paramètres multijoueur. Vous n'avez besoin d'en modifier aucun pour jouer. Voici ceux qu'il vaut mieux connaître dès votre première session. Chaque paramètre est décrit dans la page [Paramètres multijoueurs](/fr/players/multiplayer-settings).

## Trouver les paramètres {#find-the-settings}

Dans BeamNG.drive, cliquez sur **Options** et sélectionnez l'onglet **BeamMP**. Tous les paramètres se trouvent sur cette page, répartis en groupes. Il n'y a aucun interrupteur pour des paramètres masqués.

## Paramètres que vous voudrez peut-être modifier {#settings-you-may-want-to-change}

| Paramètre | Ce qu'il fait | À modifier quand |
|---|---|---|
| **Nouveau menu de chat** | Affiche le chat en jeu dans une fenêtre que vous pouvez faire glisser hors du jeu, par exemple vers un autre écran | Vous voulez le chat sur un second écran |
| **Activer le lissage de la position du véhicule** | Lisse les données de position des joueurs dont la connexion est instable, ce qui réduit les téléportations des véhicules | Un joueur a un ping élevé, ou votre connexion perd beaucoup de paquets |
| **Utilisez des véhicules simplifiés lorsqu'ils sont disponibles** | Remplace les véhicules des autres joueurs par les versions simplifiées du trafic de BeamNG.drive, lorsqu'il y en a une | Les performances sont mauvaises sur un serveur très fréquenté |
| **Ignorer la fenêtre contextuelle d'avertissement de sécurité de mod** | Masque l'avertissement affiché lorsque vous vous connectez à un serveur qui utilise des mods | Vous vous connectez souvent aux mêmes serveurs, et vous leur faites confiance |
| **Masquer les noms d'utilisateur** | Empêche l'affichage des pseudos | Les pseudos vous gênent |
| **Activer la file d'attente des mises à jour/modifications des véhicules des joueurs** | Met en file d'attente l'apparition et les modifications des véhicules des autres joueurs au lieu de les charger immédiatement | Vous voulez que les véhicules apparaissent quand vous le décidez ; voir [la file d'événements](/fr/players/multiplayer-settings#event-queue) |
| **Activer la protection contre le clonage de configuration** | Empêche les autres joueurs de cloner ou d'enregistrer vos véhicules | Vous ne voulez pas que d'autres copient votre création |

## Paramètres à ne pas toucher {#settings-to-leave-alone}

- **Afficher l'activité réseau dans la console** écrit tout dans les fichiers journaux, qui peuvent atteindre des centaines de mégaoctets en quelques minutes.
- **Port du lanceur :** ne doit être modifié que si le port 4444 ne peut pas être utilisé. Si vous le modifiez, définissez `Port` dans `Launcher.cfg` sur le même nombre. Voir [Changer le port du lanceur](/fr/troubleshooting/launcher-port).

Étape suivante : [Bases du gameplay](/fr/players/gameplay-basics).
