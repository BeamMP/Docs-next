---
description: "Modifiez manuellement le port du lanceur BeamMP lorsqu'il ne se connecte pas au jeu : définissez le port dans les options de BeamNG et dans launcher.cfg."
---
# Changer le port du lanceur

Le lanceur ne se connecte pas au jeu ? Ce guide explique comment modifier manuellement le port du lanceur. Le port doit être le même dans le jeu et dans le lanceur.

1. Démarrez BeamNG.drive.
2. Dans le menu principal, allez dans **Options**, puis dans **Multijoueur**.
3. Activez **Afficher les options avancées**.
4. Faites défiler jusqu'en bas.
5. Dans **Port du lanceur**, remplacez le numéro par un autre, par exemple `4567`.
6. Fermez BeamNG.drive.
7. Faites un clic droit sur le raccourci du lanceur BeamMP et choisissez **Ouvrir l'emplacement du fichier**.
8. Ouvrez `launcher.cfg` dans un éditeur de texte.
9. Remplacez le numéro dans `"Port": 4444,` par le port que vous avez défini dans le jeu, ici `4567`.
10. Enregistrez le fichier et fermez l'éditeur.
11. Démarrez le lanceur.

Si la connexion ne fonctionne toujours pas, essayez un autre port. Tout numéro compris approximativement entre 2000 et 65535 est un port valide.

## Toujours des problèmes ?

Créez un ticket d'assistance sur notre [serveur Discord](https://discord.gg/BeamMP).
