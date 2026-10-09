---
description: "Les quelques paramètres multijoueur de BeamMP à connaître dès votre première session : chat, pseudos, lissage, file d'événements et port du lanceur."
---
# Paramètres multijoueur (première configuration)

BeamMP possède ses propres paramètres multijoueur. Vous n'avez besoin d'en modifier aucun pour jouer. Voici ceux qu'il vaut mieux connaître dès votre première session. Chaque paramètre est décrit dans la page [Paramètres multijoueurs](/fr/players/multiplayer-settings).

## Afficher tous les paramètres

Activez **Afficher les options avancées** pour afficher tous les paramètres multijoueur. Lorsque cette option est désactivée, seuls les paramètres de base apparaissent.

## Paramètres que vous voudrez peut-être modifier

| Paramètre | Ce qu'il fait | À modifier quand |
|---|---|---|
| **Nouveau menu de chat** | Affiche le chat en jeu dans une fenêtre que vous pouvez sortir du jeu, par exemple vers un autre écran | Vous voulez le chat sur un second écran |
| **Activer le lissage de la position du véhicule** | Lisse le mouvement des véhicules des autres joueurs à intervalles réguliers | Un joueur a un ping élevé, ou votre connexion perd beaucoup de paquets |
| **Utilisez des véhicules simplifiés lorsqu'ils sont disponibles** | Remplace les véhicules des autres joueurs par leurs versions simplifiées, lorsqu'elles existent | Vous les préférez aux modèles complets |
| **Ignorer la fenêtre contextuelle d'avertissement de sécurité de mod** | Masque l'avertissement affiché lorsque vous vous connectez à un serveur qui utilise des mods | Vous vous connectez souvent aux mêmes serveurs |
| **Masquer les noms d'utilisateur** | Empêche l'affichage des pseudos | Les pseudos vous gênent |
| **Activer la file d'attente des mises à jour/modifications des véhicules des joueurs** | Met en file d'attente l'apparition et les modifications des véhicules des autres joueurs au lieu de les charger immédiatement | Vous voulez que les véhicules apparaissent quand vous le décidez ; voir [la file d'événements](/fr/players/multiplayer-settings#event-queue) |

## Paramètres à ne pas toucher

- Il est préférable de laisser **Disable pausing caused by instabilities** désactivé. Des instabilités répétées peuvent faire planter le jeu.
- **Afficher l'activité réseau dans la console** écrit tout dans les fichiers journaux, qui peuvent atteindre des centaines de mégaoctets en quelques minutes.
- **Port du lanceur** ne doit être modifié que si le port 4444 ne peut pas être utilisé. Si vous le modifiez, modifiez-le aussi dans `launcher.cfg`. Voir [Changer le port du lanceur](/fr/troubleshooting/launcher-port).

Étape suivante : [Bases du gameplay](/fr/players/gameplay-basics).
