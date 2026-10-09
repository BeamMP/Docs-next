---
description: "La signification des codes d'erreur et des messages de la fenêtre du lanceur BeamMP, comme 10060 ou Launcher Update failed, et comment résoudre chacun."
---
# Codes d'erreur

Cette page liste les codes d'erreur et les messages que le lanceur peut afficher, et ce qu'il faut faire dans chaque cas. Pour les erreurs affichées dans la fenêtre d'un serveur, consultez les [codes d'erreur serveur](/fr/server-owners/error-codes).


| Code | Description | Solution possible |
|---|---|---|
| 10048 | Quelque chose d'autre utilise déjà le port du lanceur | Assurez-vous qu'une seule instance de BeamMP-Launcher fonctionne à la fois. Essayez de redémarrer votre ordinateur. |
| 10038 / 10060 / 10061 | Aucun serveur n'a répondu sur cette adresse IP et / ou ce port | Si vous êtes le propriétaire du serveur, vérifiez la redirection de port et/ou les règles du pare-feu décrites dans [Héberger un serveur](/fr/server-owners/host-a-server). Si vous n'êtes pas le propriétaire du serveur, choisissez un autre serveur ou contactez le propriétaire si vous le connaissez. |
| 10054 | Connexion réinitialisée par le pair | Le serveur auquel vous vous connectez est hors ligne. |
| Failed to find the game please launch it. Report this if the issue persists code 3. | Le lanceur n'a pas trouvé les informations du jeu (dossier du jeu, dossier de profil, version, etc.) dans l'entrée du registre | Lancez le jeu au moins une fois pour que les valeurs du registre soient créées. |
| Failed to find the game please launch it. Report this if the issue persists code 4. | Le lanceur n'a pas pu lire les informations du jeu (dossier du jeu, dossier de profil, version, etc.) dans l'entrée du registre | Cette erreur apparaît surtout chez les utilisateurs d'une **copie piratée** du jeu. Si vous avez acheté le jeu, lancez-le au moins une fois pour que les valeurs du registre soient créées. |
| Failed to Launch the game! launcher closing soon | Le lanceur n'a pas trouvé l'exécutable du jeu | Lancez le jeu au moins une fois avant de relancer le lanceur. |
| Game Closed! launcher closing soon | Le jeu a été fermé | Ce message apparaît lorsque le jeu est fermé ou lorsqu'il n'a pas réussi à démarrer. |
| Launcher Update failed! | Le lanceur n'a pas réussi à télécharger une nouvelle version | Vérifiez votre connexion Internet et les règles de votre pare-feu / antivirus afin que le lanceur ne soit pas bloqué. |
| Logger file init failed | Le lanceur n'a pas la permission de créer des fichiers | Exécutez le lanceur en tant qu'administrateur. |
| Please close the game and try again | Le jeu est déjà ouvert et le lanceur ne peut pas vider le dossier `multiplayer/mods` | Fermez le jeu et réessayez. |
| Please launch the game at least once | Le lanceur a tenté de modifier le dossier du jeu et a échoué | Lancez le jeu au moins une fois avant de relancer le lanceur. |
| Primary Servers Offline! Sorry for the inconvenience! | Le lanceur n'a pas réussi à vérifier s'il existe une mise à jour | Vérifiez votre connexion Internet et les règles de votre pare-feu. Si le problème ne vient pas de votre côté, consultez le [salon des mises à jour de BeamMP](<https://discord.com/channels/601558901657305098/697596153943949352>) sur notre Discord. |
| Sorry Backend System Outage! Don't worry it will back on soon! | Le backend de BeamMP n'a pas répondu | Vérifiez votre connexion Internet et les règles de votre pare-feu. Si le problème ne vient pas de votre côté, consultez le [salon des mises à jour de BeamMP](<https://discord.com/channels/601558901657305098/697596153943949352>) sur notre Discord. |
| Stuck on updating | Le lanceur est bloqué sur la mise à jour et ne passe pas à l'étape suivante | Exécutez le lanceur en tant qu'administrateur et vérifiez les règles de votre antivirus afin que le lanceur ne soit pas bloqué. |

Si le lanceur se ferme immédiatement, consultez le fichier `Launcher.log` dans le dossier où vous avez installé BeamMP.
