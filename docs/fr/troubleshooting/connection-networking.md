---
description: "Résolvez les problèmes de connexion à BeamMP : trouvez l'adresse IP de votre serveur, testez que votre port est ouvert avec CheckBeamMP et vérifiez si vous êtes derrière un CGNAT."
---
# Problèmes de connexion / réseau

Utilisez cette page lorsque vous ou vos joueurs ne parvenez pas à vous connecter à un serveur BeamMP.

## Trouver l'adresse IP de votre serveur

### Un serveur chez un hébergeur

L'adresse IP s'affiche dans l'interface de gestion du serveur de l'hébergeur. Vous pouvez également trouver l'adresse IP de vos serveurs sur le site [Keymaster](https://keymaster.beammp.com/login).

### Un serveur à domicile

Ouvrez [whatsmyip.org](https://whatsmyip.org) dans un navigateur. Il affiche l'adresse IPv4 publique vue depuis Internet.

`127.0.0.1` est l'adresse locale (localhost). Vous seul pouvez l'utiliser, et uniquement si le serveur tourne sur le même ordinateur que le jeu.

## Tester que votre port est ouvert

Si vous rencontrez toujours des problèmes de connexion avec un serveur hébergé à domicile, vérifiez votre [redirection de port](/fr/server-owners/port-forwarding), puis testez-la avec CheckBeamMP pendant que le serveur fonctionne :

<form action="https://check.beammp.com/api/v2/beammp" method="get" target="_blank">
  <label for="ip">Adresse IP :</label>
  <input type="text" id="ip" name="ip"><br>
  <label for="port">Port :</label>
  <input type="text" id="port" name="port"><br>
  <input type="submit" value="CheckBeamMP">
</form>

## Vérifier le CGNAT

Certains fournisseurs d'accès à Internet compliquent la redirection de ports. [Vérifiez le CGNAT](/fr/server-owners/cgnat) pour savoir si vous pouvez héberger un serveur à domicile.

## Autres problèmes de connexion

- Le lanceur affiche les codes d'erreur 10060 ou 10061 : consultez les [codes d'erreur](/fr/troubleshooting/error-codes).
- Le lanceur ne se connecte pas au jeu : consultez [Changer le port du lanceur](/fr/troubleshooting/launcher-port).
- Un pare-feu ou un antivirus bloque peut-être BeamMP : consultez [Exclusions Defender / pare-feu](/fr/troubleshooting/defender-exclusions).
