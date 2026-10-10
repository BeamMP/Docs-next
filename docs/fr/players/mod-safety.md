---
description: "L'avertissement de sécurité sur les mods, pourquoi des mods locaux peuvent empêcher BeamMP de fonctionner, et quatre façons de corriger les problèmes dus aux mods."
---
# Sécurité des mods

Les serveurs BeamMP peuvent envoyer des mods à votre jeu. Cette page explique l'avertissement que vous voyez avant cela, pourquoi des mods locaux peuvent empêcher BeamMP de fonctionner, et comment y remédier.

## L'avertissement de sécurité sur les mods {#the-mod-security-warning}

Lorsque vous vous connectez à un serveur qui utilise des mods, BeamMP affiche la fenêtre **Serveur moddé détecté** avant tout téléchargement. Elle vous indique que :

- les mods du serveur sont téléchargés et installés automatiquement.
- les mods peuvent contenir du code qui s'exécute sur votre PC, et ce code pourrait être malveillant.
- vous devez faire confiance aux propriétaires du serveur avant de continuer, et vous continuez à vos propres risques.
- BeamMP n'est pas responsable du contenu qu'un serveur envoie.

Cliquez sur **Télécharger et rejoindre** pour télécharger les mods et rejoindre le serveur. Cliquez sur **Annulation et retour** pour ne pas entrer dans le serveur.

Si vous faites confiance aux serveurs que vous rejoignez, vous pouvez désactiver l'avertissement avec **Ignorer la fenêtre contextuelle d'avertissement de sécurité de mod**, comme décrit dans [Paramètres multijoueurs](/fr/players/multiplayer-settings). Un serveur sans mods n'affiche jamais l'avertissement.

## Pourquoi dois-je désactiver ou supprimer mes mods ? {#why-do-i-have-to-deactivate-or-remove-my-mods}

Avec BeamMP, c'est le serveur auquel vous vous connectez qui fournit les mods nécessaires. Ils sont téléchargés et activés automatiquement lors de la connexion, puis retirés du jeu lorsque vous quittez le serveur.

Pendant une session, BeamMP désactive tous les mods que le serveur n'a pas envoyés. Les exceptions sont `multiplayerbeammp`, `beammp` et `translations`. Des mods locaux peuvent tout de même causer des problèmes, même si vous n'en avez qu'un seul en plus de BeamMP, par exemple lorsqu'ils modifient des fichiers du jeu. Lorsque vous quittez un serveur qui a envoyé des mods, le jeu recharge son Lua.

Il existe quatre façons de corriger les problèmes causés par les mods lorsque vous utilisez BeamMP.

### Désactiver les mods {#deactivate-mods}

Avant de rejoindre un serveur, assurez-vous qu'aucun mod autre que `multiplayerbeammp` n'est activé. Si cette méthode ne fonctionne pas, par exemple si le jeu se fige ou affiche un écran noir, ou si vous avez toujours des problèmes, essayez la correction suivante.

### Créer un nouveau dossier utilisateur {#create-a-new-user-folder}

Cela donne au jeu un dossier utilisateur (user folder) propre.

1. Fermez BeamNG.drive.
2. Ouvrez le lanceur BeamNG et cliquez sur **Manage User Folder**, puis sur **Open user folder**.
3. Renommez le dossier `current`, par exemple en `current_old`.

![Les trois étapes : Manage User Folder dans le lanceur BeamNG, Open user folder, puis renommer le dossier current](../../assets/content/new-userfolder.png)

Le jeu crée alors un nouveau dossier utilisateur propre au prochain démarrage.

::: warning Mes paramètres et mes configurations ont disparu ! Comment les restaurer ?
Si vous avez renommé le dossier utilisateur, vous avez forcé le jeu à en créer un nouveau, propre. Vous pouvez copier les dossiers `settings` et `vehicles` du dossier que vous avez renommé (par exemple `current_old`) vers le nouveau dossier.
Assurez-vous que BeamNG.drive est fermé et remplacez tous les éléments du dossier dans lequel vous copiez. Vous devriez alors retrouver toutes vos configurations et tous vos paramètres tels qu'ils étaient avant.
:::

::: warning Soyez prudent lorsque vous remettez des fichiers dans le nouveau dossier utilisateur.
Si vous avez résolu vos problèmes en renommant le dossier utilisateur, remettre les anciens fichiers peut les faire réapparaître.
:::

Une fois cela fait, démarrez BeamNG.drive avec le lanceur BeamMP. `multiplayerbeammp` devrait être le seul mod actif sous **Dépôt** > **Gestionnaire de mods**, et le menu **Plus...** devrait avoir l'entrée **BeamMP**.
Si vous avez toujours des problèmes pour rejoindre un serveur avec mods, c'est probablement que ce serveur envoie des mods défectueux ou obsolètes.

### Vider le cache du lanceur {#clear-the-launcher-cache}

Le lanceur conserve les mods qu'il a téléchargés dans un cache. Pour le vider, ouvrez le dossier où le lanceur BeamMP est installé. Le cache est le dossier `Resources` qui s'y trouve. Si `Launcher.cfg` contient une entrée `CachingDirectory`, le cache se trouve à la place dans ce dossier.

Supprimez le dossier pour supprimer tous les mods en cache. Cela est utile si vous avez besoin de plus d'espace disque ou si vous voulez éliminer d'anciens mods obsolètes. Le lanceur télécharge de nouveau les mods la prochaine fois que vous rejoignez un serveur qui en a besoin.

### Retirer les mods du dossier content {#remove-mods-from-the-content-folder}

Si vous avez placé des mods dans le dossier `content`, retirez-les. Ouvrez le dossier d'installation de BeamNG.drive, faites un clic droit sur le dossier `content` et supprimez-le. Vérifiez ensuite les fichiers du jeu via Steam ou Epic Games. Les fichiers de base seront alors téléchargés de nouveau.

::: quote DO_NOT_INSTALL_MODS_HERE.txt
NE copiez PAS les mods dans ce dossier : cela peut entraîner des mods cassés, une installation plus lente des mises à jour, un gestionnaire de mods cassé, un mode sans échec (Safe Mode) cassé, et d'autres problèmes.
:::
