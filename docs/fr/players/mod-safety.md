---
description: "Pourquoi les mods locaux peuvent empêcher BeamMP de fonctionner, et quatre façons d'y remédier : désactiver les mods, créer un nouveau dossier utilisateur, vider le cache du lanceur, nettoyer le dossier content."
---
# Sécurité des mods

BeamMP peut cesser de fonctionner lorsque des mods locaux sont installés. Cette page explique pourquoi, et comment y remédier.

## Pourquoi dois-je désactiver ou supprimer mes mods ?

Avec BeamMP, c'est le serveur auquel vous choisissez de vous connecter qui fournit les mods nécessaires. Ils sont téléchargés et activés automatiquement lors de la connexion.
Avoir des mods locaux installés et actifs empêche souvent BeamMP de fonctionner correctement, même si vous n'avez qu'un seul mod en plus de BeamMP.


Il existe quatre façons de corriger les problèmes causés par les mods lorsque vous utilisez BeamMP.

### Désactiver les mods
Avant de rejoindre un serveur, assurez-vous qu'aucun mod autre que « multiplayerbeammp » n'est activé.
Si cette méthode ne fonctionne pas, par exemple si le jeu se fige ou affiche un écran noir, ou si vous avez toujours des problèmes, essayez la correction suivante.

### Créer un nouveau dossier utilisateur

Cela donne au jeu un dossier utilisateur (user folder) propre.

1. Fermez BeamNG.drive.
2. Ouvrez le lanceur BeamNG et cliquez sur **Manage User Folder**, puis sur **Open user folder**.
3. Renommez le dossier `current`, par exemple en `current_old`.

![Les trois étapes : Manage User Folder dans le lanceur BeamNG, Open user folder, puis renommer le dossier current](../../assets/content/new-userfolder.png)

Le jeu crée alors un nouveau dossier utilisateur propre au prochain démarrage.

::: warning Mes paramètres et mes configurations ont disparu ! Comment les restaurer ?
Si vous avez renommé le dossier utilisateur, vous avez forcé le jeu à en créer un nouveau, propre. Vous pouvez copier les dossiers « settings » et « vehicles » du dossier que vous avez renommé (par exemple `current_old`) vers le nouveau dossier créé.
Assurez-vous que BeamNG.drive est fermé et remplacez tous les éléments à l'emplacement où vous copiez les dossiers. Vous devriez alors retrouver toutes vos configurations et tous vos paramètres tels qu'ils étaient avant.
:::

::: warning Soyez prudent lorsque vous remettez des fichiers ou des dossiers dans le nouveau dossier utilisateur.
Si vous avez résolu des problèmes en renommant le dossier utilisateur, remettre les anciens fichiers peut faire réapparaître ces problèmes.
:::



Une fois cela fait, démarrez BeamNG.drive via le lanceur BeamMP : « multiplayerbeammp » devrait être le seul mod activé disponible dans le dépôt (Repository), et le bouton d'accès à BeamMP devrait apparaître dans le menu principal.
Si vous avez toujours des problèmes pour rejoindre un serveur avec mods, c'est probablement que ce serveur fournit des mods défectueux ou obsolètes.

### Vider le cache du lanceur
Pour nettoyer les mods en cache dans les dossiers de BeamMP, rendez-vous à l'emplacement d'installation de votre lanceur BeamMP. Par défaut, le chemin est « C:\Users\AppData\BeamMP-Launcher\ ». Vous y trouverez un dossier « Resources ».
Supprimez ce dossier pour supprimer tous les mods en cache. Cela peut être utile si vous avez besoin de plus d'espace disque ou si vous voulez éliminer d'anciens mods BeamNG obsolètes.

### Retirer les mods du dossier content
Si vous avez placé des mods dans le dossier content, vous devez les retirer.
Pour accéder au dossier Beamng.drive\content\ et le débarrasser de tous les mods, ouvrez l'emplacement d'installation de BeamNG.drive.
Faites un clic droit sur le dossier `content` et supprimez-le. Vérifiez ensuite les fichiers du jeu via Steam ou Epic Games. Les fichiers de base seront alors téléchargés de nouveau.

::: quote DO_NOT_INSTALL_MODS_HERE.txt
NE copiez PAS les mods dans ce dossier : cela peut entraîner des mods cassés, une installation plus lente des mises à jour, un gestionnaire de mods cassé, un mode sans échec (Safe Mode) cassé, et d'autres problèmes.
:::
