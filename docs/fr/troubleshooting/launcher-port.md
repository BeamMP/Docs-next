---
description: "Modifiez manuellement le port du lanceur BeamMP lorsqu'il ne se connecte pas au jeu : définissez le port dans les options de BeamNG et dans Launcher.cfg."
---
# Changer le port du lanceur

Le lanceur ne se connecte pas au jeu ? Ce guide explique comment modifier manuellement le port du lanceur. Le port doit être le même dans le jeu et dans le lanceur.

Le port par défaut est `4444`. Le lanceur utilise ce port et le suivant, `4445`, sur votre propre ordinateur. Les deux utilisent TCP, et les deux doivent être libres. Si un autre programme en utilise un, le lanceur affiche `bind failed with error`, comme indiqué dans [Codes d'erreur](/fr/troubleshooting/error-codes).

1. Démarrez BeamNG.drive.
2. Dans le menu principal, allez dans **Options**, puis dans l'onglet **BeamMP**.
3. Ouvrez le groupe **Avancées**.
4. Dans **Port du lanceur :**, remplacez le numéro par un autre, par exemple `4567`.
5. Fermez BeamNG.drive.
6. Faites un clic droit sur le raccourci du lanceur BeamMP et choisissez **Ouvrir l'emplacement du fichier**.
7. Ouvrez `Launcher.cfg` dans un éditeur de texte.
8. Remplacez le numéro dans `"Port": 4444,` par le port que vous avez défini dans le jeu, ici `4567`.
9. Enregistrez le fichier et fermez l'éditeur. Veillez à ce que le fichier reste un JSON valide : si le lanceur ne parvient pas à le lire, il affiche `Config failed to parse make sure it's valid JSON!` et se ferme.
10. Démarrez le lanceur.

Si la connexion ne fonctionne toujours pas, essayez un autre port. Utilisez un numéro de 1024 à 65534, car le lanceur utilise aussi le numéro suivant.

::: tip
Vous pouvez définir le port sans modifier `Launcher.cfg`. Démarrez le lanceur avec `--port 4567`. L'option de ligne de commande remplace la valeur de `Launcher.cfg`. Les autres options sont décrites dans [Configuration de l’environnement de développement](/fr/developers/dev-environment-setup#turn-on-dev-mode-in-the-launcher).
:::

## Toujours des problèmes ?

Créez un ticket d'assistance sur notre [serveur Discord](https://discord.gg/BeamMP).
