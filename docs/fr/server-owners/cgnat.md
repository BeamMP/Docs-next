---
description: "Découvrez si votre connexion Internet est derrière un CGNAT, ce qui empêche les joueurs de rejoindre un serveur BeamMP hébergé à domicile même si les ports sont redirigés."
---
# Vérifier le CGNAT

Vos exclusions de pare-feu et vos règles de redirection de port sont correctement configurées, et pourtant personne ne peut rejoindre votre serveur hébergé à domicile ? Vous êtes peut-être derrière un CGNAT.

Si vous utilisez un hébergeur et rencontrez des problèmes de connexion, contactez-le. Si vous souhaitez un VPS, ou si vous ne pouvez pas héberger chez vous, consultez les [services d'hébergement partenaires](/fr/server-owners/host-a-server#partnered-hosting-services).

## Qu'est-ce que le CGNAT ?

Le NAT de niveau opérateur (CGNAT, Carrier-grade NAT) est un dispositif utilisé par certains fournisseurs d'accès à Internet, qui rend difficile la redirection de ports vers votre domicile. Pour une explication détaillée de ce que c'est et de la raison pour laquelle c'est un problème pour l'hébergement à domicile, consultez [Carrier-grade NAT sur Wikipédia](https://en.wikipedia.org/wiki/Carrier-grade_NAT).

## Vérifier le CGNAT

### Méthode 1 : tracer la route

1. Ouvrez une invite de commandes et exécutez :
   ```text
   tracert -4 beammp.com
   ```
   Elle affiche une série de sauts réseau. Attendez la fin de l'opération, qui peut aller jusqu'à 30 sauts.
2. Le premier saut est votre routeur, modem ou passerelle, et diffère selon les appareils. Regardez les premières adresses IP qui suivent.
3. Si plusieurs adresses comprises entre `100.64.x.x` et `100.127.x.x`, ou commençant par `10.`, apparaissent après le premier saut, vous êtes très probablement derrière un CGNAT.

Les plages officielles pour les réseaux locaux sont `10.0.0.x`, `192.168.x.x` et `172.16.x.x`.

### Méthode 2 : comparer les adresses IP

Trouvez l'adresse IP WAN dans l'interface de votre routeur et comparez-la à l'adresse affichée sur [whatsmyip.org](https://whatsmyip.org). Si elles ne sont **pas** identiques, vous êtes derrière un CGNAT.

## Si vous êtes derrière un CGNAT

Appelez votre fournisseur d'accès à Internet (FAI) pour obtenir de l'aide. Selon le FAI, il se peut qu'il ne propose pas d'adresses IP dynamiques dédiées. Une IP statique n'est pas nécessaire.

::: warning
Les FAI ne proposent parfois une adresse IP dédiée qu'en **option payante**. Comparez le prix avec nos services d'hébergement partenaires : ils sont peut-être moins chers.
:::

Voici un exemple de réseau qui n'est pas derrière un CGNAT :

![Un schéma réseau d'une connexion qui n'est pas derrière un CGNAT](https://github.com/user-attachments/assets/fee21a50-cbb0-4322-9c26-d9f04f88ae37)
