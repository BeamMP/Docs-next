---
description: "Réponses aux questions courantes sur les serveurs BeamMP : installation, Linux, configuration requise, joueurs qui ne peuvent pas se connecter, bugs et AuthKey compromise."
---
# FAQ du serveur

Questions fréquentes et problèmes connus concernant l'hébergement d'un serveur BeamMP.

## Mise en place

### Comment puis-je créer mon propre serveur ?

Tout ce dont vous avez besoin se trouve dans [Héberger un serveur](/fr/server-owners/host-a-server), ou dans [Configuration du serveur sur un VPS](/fr/server-owners/setup-vps) si vous passez par un hébergeur.

### Puis-je faire tourner un serveur sous Linux ?

Oui. Nous fournissons des binaires pour de nombreuses distributions Linux sur la [page de la dernière version](https://github.com/BeamMP/BeamMP-Server/releases/latest). S'il n'y en a pas pour votre distribution, vous pouvez le compiler à partir des sources sur [GitHub](https://github.com/BeamMP/BeamMP-Server). Les [instructions de compilation](https://github.com/BeamMP/BeamMP-Server#build-instructions) expliquent comment faire.

### Quelle est la configuration minimale requise ?

| | Exigence |
|---|---|
| RAM | 50 Mio ou plus utilisables, sans compter le système d'exploitation |
| CPU | Plus de 1 GHz, de préférence multicœur |
| OS | Windows ou Linux (en théorie tout système POSIX) |
| GPU | Aucun |
| Disque | 10 Mio plus les mods et les plugins |
| Bande passante | 5 à 10 Mb/s en envoi |

## Les joueurs ne peuvent pas se connecter

### Les joueurs extérieurs à mon réseau ne peuvent pas rejoindre mon serveur hébergé à domicile

Si d'autres joueurs obtiennent le code d'erreur 10060, 10061 ou 10038 dans leur lanceur, vérifiez les points suivants. Le guide complet est [Redirection de port](/fr/server-owners/port-forwarding).

- Redirigez le port 30814, ou le port que vous avez défini dans `ServerConfig.toml`, à la fois en TCP et en UDP.
- Autorisez BeamMP dans le pare-feu Windows, pour les connexions entrantes et sortantes. Désactiver le pare-feu ne fonctionne généralement **pas**.
- Assurez-vous de ne pas utiliser de VPN. Il peut causer des problèmes.
- Assurez-vous que le serveur fonctionne, sans erreurs ni avertissements.

Pendant que le serveur fonctionne, vous pouvez tester si le port est bien redirigé avec CheckBeamMP :

<form action="https://check.beammp.com/api/v2/beammp" method="get" target="_blank">
  <label for="ip">Adresse IP :</label>
  <input type="text" id="ip" name="ip"><br>
  <label for="port">Port :</label>
  <input type="text" id="port" name="port"><br>
  <input type="submit" value="CheckBeamMP">
</form>

Certains fournisseurs d'accès à Internet ne vous donnent pas d'adresse IPv4 dédiée (CGNAT) : la redirection de port peut alors ne pas fonctionner même si votre routeur la propose. Consultez [Vérifier le CGNAT](/fr/server-owners/cgnat). La redirection de port est impossible sur une connexion mobile (4G ou 5G).

### Je vois mon serveur dans la liste, mais je n'arrive pas à le rejoindre moi-même

Si le serveur tourne sur le même ordinateur que le jeu, connectez-vous avec **Direct Connect**, en utilisant l'adresse IP `127.0.0.1` et le port de votre serveur.

Pour rejoindre votre propre serveur hébergé à domicile via la liste des serveurs, votre routeur doit prendre en charge le NAT loopback. Peu de routeurs domestiques le font.

## Autres questions

<!--@include: ../_parts/faq-code-and-bugs.md-->

### Combien d'AuthKeys puis-je avoir, et comment en obtenir davantage ?

Par défaut, un compte peut avoir 2 AuthKeys. Les paliers Patreon et le boost du serveur Discord de BeamMP en ajoutent d'autres. **Keymaster**, dans [BeamMP Accounts](https://accounts.beammp.com), indique combien de clés vous avez utilisées et d'où vient chaque clé supplémentaire. Les étapes se trouvent dans [Obtenir une AuthKey](/fr/server-owners/host-a-server#get-an-authkey).

### Mon AuthKey a été compromise. Que dois-je faire ?

Renouvelez la clé dans **Keymaster**. L'ancienne clé cesse immédiatement de fonctionner. Placez la nouvelle clé dans votre `ServerConfig.toml` et redémarrez le serveur. Les étapes se trouvent dans [Obtenir une AuthKey](/fr/server-owners/host-a-server#get-an-authkey).

Si vous ne parvenez pas à renouveler la clé vous-même, par exemple parce que vous ne pouvez pas vous connecter à BeamMP Accounts, créez un ticket **Account Support** sur [Discord](https://discord.gg/beammp).
