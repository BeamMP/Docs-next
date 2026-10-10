---
description: "Mettez à jour le lanceur BeamMP manuellement s'il ne parvient pas à se mettre à jour ou affiche un écran vide : téléchargez-le sous Windows, ou recompilez-le sous Linux."
---
# Problèmes de mise à jour du lanceur

Le lanceur ne parvient pas à se mettre à jour, ou affiche un écran vide ? Ce guide explique comment le mettre à jour manuellement.

Sous Windows, vous devez déjà avoir installé BeamMP à l'aide de l'installateur fourni sur [notre site web](https://beammp.com) avant de suivre ces étapes.

## Comment le lanceur se met à jour

Sous Windows, le lanceur vérifie auprès de `backend.beammp.com` si une version plus récente existe à chaque démarrage. S'il y en a une, il la télécharge, vérifie sa signature et conserve l'ancien fichier sous le nom `BeamMP-Launcher.back` dans le même dossier. Il redémarre ensuite. Le lanceur ignore cette vérification lorsque vous le démarrez avec `--no-update` ou `--dev`.

Si la mise à jour échoue, le lanceur affiche l'un de ces messages :

- `Failed to download the launcher update! Please try manually updating it`
- `The authenticity of the updated launcher could not be verified, it was corrupted or tampered with.`

Vérifiez votre connexion Internet et votre pare-feu ou votre antivirus, comme dans [Exclusions Defender / pare-feu](/fr/troubleshooting/defender-exclusions). Mettez ensuite le lanceur à jour manuellement.

Sous Linux, le lanceur ne se met jamais à jour tout seul. Suivez [Mettre à jour le lanceur sous Linux](/fr/get-started/install-beammp#update-the-launcher-on-linux) au lieu des étapes ci-dessous.

## Installer un nouveau lanceur

1. Téléchargez directement le dernier lanceur depuis [GitHub](https://github.com/BeamMP/BeamMP-Launcher/releases/latest/download/BeamMP-Launcher.exe).
2. Fermez le lanceur.
3. Rendez-vous dans le dossier qui contient `BeamMP-Launcher.exe`. Par défaut, il s'agit de `C:\Users\<username>\AppData\Roaming\BeamMP-Launcher`. Remplacez `<username>` par le nom d'utilisateur de votre session Windows. Si vous avez installé BeamMP ailleurs, par exemple dans `D:\BeamMP-Launcher`, utilisez ce dossier.
4. Remplacez le lanceur existant dans le dossier BeamMP-Launcher par le nouveau.
5. Démarrez le lanceur comme d'habitude et vérifiez qu'il fonctionne.

## Toujours des problèmes ?

Créez un ticket d'assistance sur notre [serveur Discord](https://discord.gg/BeamMP).
