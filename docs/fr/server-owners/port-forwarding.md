---
description: "Redirigez le port BeamMP sur votre routeur domestique, étape par étape : adresse IP statique, connexion au routeur, création de la règle et test avec CheckBeamMP."
---
# Redirection de port

::: danger AVERTISSEMENT :
**La redirection de port est un risque**.

En redirigeant un port, vous reconnaissez les risques liés à l'ouverture de ports de votre réseau domestique au public et renoncez donc à engager la responsabilité de BeamMP pour **tout dommage** pouvant survenir à vous-même ou à votre foyer.

Nous déclinons toute responsabilité quant au contenu des services ou sites externes vers lesquels pointent des liens.

<u>**Si vous ne comprenez pas ce guide, envisagez d'utiliser l'un de nos partenaires.**</u>
:::

::: warning
Vérifiez que votre routeur n'est pas un appareil exclusivement 4G/5G. S'il s'agit d'un appareil hybride, veillez à sélectionner l'adaptateur connecté par câble plus loin, à la section 3 de ce guide !
:::

## Ce que vous allez faire

Créer une règle de redirection de port fait appel à quelques notions de réseau détaillées. Préparez-vous à prendre quelques notes au fil de la procédure.

Ce guide comporte 4 grandes étapes.

## Guide rapide

1. **Attribuer une adresse IP statique à votre ordinateur ou à vos appareils**

   Cette étape est nécessaire pour empêcher l'adresse IP de votre appareil de changer et de rendre la règle de redirection de port inutilisable.

   [Consulter les informations concernant votre routeur](https://portforward.com/router.htm#1)

2. **Se connecter à votre routeur**

   Cela se fait généralement en trouvant l'adresse IP de la « passerelle par défaut » (Default Gateway), que vous obtenez en exécutant `ipconfig` dans une invite de commandes, puis en la saisissant dans la barre d'adresse d'un navigateur web.

3. **Rediriger les ports vers votre ordinateur**

   Trouvez la section de redirection de port dans l'interface web de votre routeur. La plupart des routeurs la placent sous Network, Advanced ou LAN.

4. **Vérifier que votre port est bien redirigé**

   Utilisez un outil tel que CheckBeamMP pour vérifier que la règle fonctionne.

   <form action="https://check.beammp.com/api/v2/beammp" method="get" target="_blank">
    <label for="ip">Adresse IP :</label>
    <input type="text" id="ip" name="ip"><br>
    <label for="port">Port :</label>
    <input type="text" id="port" name="port"><br>
    <input type="submit" value="CheckBeamMP">
   </form>

## Guide détaillé

### Attribuer une adresse IP statique

#### Méthode 1 : utiliser une réservation DHCP

Une autre façon de définir une adresse IP statique sur votre réseau local consiste à utiliser la fonction de réservation DHCP de votre routeur. Tous les routeurs ne proposent pas cette fonction, ce n'est donc peut-être pas une option pour vous. Recherchez sur Internet le modèle de votre routeur pour trouver son manuel. 

Si vous y êtes parvenu, passez directement à [Se connecter à votre routeur](#log-in-to-your-router)

#### Méthode 2 : définir une adresse IP statique sous Windows

##### Trouver votre adresse IP, votre passerelle et vos serveurs DNS actuels

Avant de pouvoir configurer une adresse IP statique, nous devons connaître vos paramètres réseau actuels. 
Vous allez devoir les noter : préparez donc une fenêtre de bloc-notes. 
Pour cette étape, nous allons utiliser l'invite de commandes.

Ouvrez une invite de commandes. Les 3 principales façons sont :

- Appuyez sur la touche Windows, commencez à saisir « cmd », puis appuyez sur Entrée lorsque « Invite de commandes » est en surbrillance.


<figure class="image image_resized" style="width:62%;">

![Le menu Démarrer de Windows avec Invite de commandes en surbrillance](../../assets/content/win11-open-cmd.png)

</figure>

Une fois dans l'invite de commandes, exécutez la commande suivante :
```
ipconfig /all
```
Vous verrez de nombreuses informations.
Si vous avez des adaptateurs réseau virtuels ou plusieurs adaptateurs, vous en verrez encore davantage. 
Il est courant de voir de nombreux adaptateurs virtuels si Hyper-V ou Docker est installé.

<figure class="image image_resized" style="width:62%;">

![Invite de commandes affichant le résultat de ipconfig, avec l'adresse IPv4, le masque de sous-réseau, la passerelle par défaut et les serveurs DNS en surbrillance](../../assets/content/win11-command-prompt-ipconfig-highlighted.png)

</figure>

Il est recommandé d'utiliser une connexion réseau filaire pour l'ordinateur qui fera tourner ce serveur, mais cela fonctionne aussi avec une connexion sans fil.
Vous devez chercher dans cette liste un adaptateur qui dispose d'une connexion Internet active. Parcourez la liste et trouvez-en un auquel une passerelle par défaut est attribuée. 
De nombreux adaptateurs virtuels n'ont pas de passerelle par défaut. 

Voici des exemples d'adresses IPv4 locales, dont au moins un de vos adaptateurs devrait avoir une.
Vous devrez noter les informations de votre adaptateur.

- 192.168.x.x
- 10.x.x.x.
- 172.16.x.x - 172.31.x.x

Masque de sous-réseau (le plus souvent 255.255.255.0)
</br>
Passerelle par défaut (le plus souvent 192.168.0.1 ou 192.168.1.1)

::: info À noter
BeamMP ne prend actuellement pas en charge l'IPv6 pour l'hébergement d'un serveur. 
:::

##### Modifier les paramètres de l'adaptateur

Nous devons maintenant modifier les paramètres de votre adaptateur réseau pour que votre PC conserve la configuration IP qu'il utilise actuellement. Pour accéder aux paramètres de votre réseau, la méthode la plus rapide est la suivante :

- Appuyez une fois sur la touche Windows
- Saisissez « connexions réseau » jusqu'à ce que « Afficher les connexions réseau » apparaisse.
- Appuyez sur la touche Entrée


<figure class="image image_resized" style="width:62%;">

![Le menu Démarrer de Windows affichant Afficher les connexions réseau](../../assets/content/win11-start-menu-view-network-connections.png)

</figure>

Vous devriez voir la liste des connexions réseau de votre ordinateur. 
Si Hyper-V ou Docker est installé, il peut y en avoir beaucoup. 
Cherchez les adaptateurs dont le nom n'est pas « Hyper-V ».

<figure class="image image_resized" style="width:62%;">

![La fenêtre Connexions réseau avec l'adaptateur Ethernet](../../assets/content/win11-network-connections.png)

</figure>


Faites un clic droit sur votre adaptateur et choisissez Propriétés. Si `Protocole Internet version 4 (TCP/IPv4)` n'est pas coché, il ne s'agit pas du bon adaptateur. Choisissez-en un autre.

<figure class="image image_resized" style="width:62%;">

![La fenêtre des propriétés d'Ethernet avec l'entrée IPv4 en surbrillance](../../assets/content/win11-ethernet-properties-highlighted.png)

</figure>

Double-cliquez sur `Protocole Internet version 4 (TCP/IPv4)`. Remplacez `Obtenir une adresse IP automatiquement` par `Utiliser l'adresse IP suivante`.

Renseignez l'adresse IP, le masque de sous-réseau, la passerelle par défaut et le serveur DNS préféré avec les informations de l'invite de commandes (ipconfig /all).

Vous pouvez aussi, au lieu d'utiliser vos propres serveurs DNS, utiliser ceux de Cloudflare ou de Google :

- DNS Cloudflare : 1.1.1.1, 1.0.0.1
- DNS Google : 8.8.8.8, 8.8.4.4


<figure class="image image_resized" style="width:62%;">

![La fenêtre des propriétés IPv4 avec l'adresse IP, le masque de sous-réseau, la passerelle par défaut et les serveurs DNS renseignés](../../assets/content/win11-network-settings-static-ip.png)

</figure>

Cliquez sur OK, puis de nouveau sur OK : votre adaptateur est maintenant passé du DHCP à une adresse statique. Naviguez sur le web pour vérifier que vous avez toujours une connexion Internet. Si ce n'est pas le cas, remettez vos paramètres sur Obtenir une adresse IP automatiquement et essayez la méthode suivante.

### Se connecter à votre routeur {#log-in-to-your-router}

Maintenant que votre appareil a une adresse IP statique, vous êtes prêt à rediriger le port pour BeamMP !

Pour commencer, nous devons nous connecter à votre routeur. Plus tôt, l'un des paramètres que vous avez notés est votre passerelle par défaut. C'est l'adresse IP de votre routeur.

La plupart des routeurs utilisent une page web hébergée localement pour leur gestion. Pour afficher le menu et les paramètres de votre routeur :

- Ouvrez un navigateur web. Firefox, Chrome ou Edge conviennent très bien.
- Dans la barre d'adresse, saisissez l'adresse IP de votre passerelle par défaut, par exemple 192.168.0.1 ou 192.168.1.1, puis appuyez sur Entrée

Vous devriez maintenant voir l'écran de connexion de votre routeur. Tous les routeurs n'exigent pas de connexion, mais la plupart le font. Vous devez connaître le nom d'utilisateur et le mot de passe de votre routeur. Si vous ne vous êtes jamais connecté, ils sont très probablement réglés sur les valeurs d'usine ou, dans certains cas, inscrits sur un autocollant au dos de votre routeur.

Voici quelques-uns des identifiants d'usine les plus courants :

| Nom d'utilisateur | Mot de passe |
| ----------------- | ------------ |
| admin             | admin        |
| admin             | password     |
| {vide}            | admin        |
| {vide}            | password     |

Essayez différentes combinaisons de admin, password, et en laissant les champs vides. *Là où il est indiqué vide, essayez de laisser la valeur vide.* 

### Créer les règles de redirection

#### Trouver la section de redirection

Trouvez la section de redirection de port dans l'interface web de votre routeur. Parcourez le routeur en cliquant sur les onglets ou les liens en haut ou à gauche de chaque page. La plupart des routeurs placent la section de redirection de port sous Network, Advanced ou LAN. Cherchez les mots-clés suivants pour vous aider à la trouver :

- Port Forwarding
- Forwarding
- Port Range Forwarding
- Virtual Servers
- Apps & Gaming
- Advanced Setup/Settings
- NAT

#### Saisir les informations

Une fois la section de redirection de port de votre routeur trouvée, vous pouvez saisir les informations nécessaires.
Votre routeur proposera un endroit où saisir les ports à rediriger et l'adresse IP de destination vers laquelle les diriger. Si votre routeur indique à la fois des ports internes et externes, donnez-leur la même valeur. 

BeamMP nécessite le port 30814 en UDP et en TCP (sauf si vous l'avez modifié dans votre [ServerConfig.toml](/fr/server-owners/host-a-server#configure-the-server)). 

::: info Remarque
Le **Port** par défaut est **30814**, mais vous pouvez choisir n'importe quel autre nombre supérieur à 1024 et inférieur à 65535 ; notez alors ce que vous avez choisi si ce n'est pas 30814\. Vous devez rediriger à la fois **TCP** et **UDP**.
</br>
Il est recommandé de garder le port par défaut, car il est très peu probable qu'il soit utilisé par un autre service sur votre PC.
</br>
Cependant, si vous hébergez plusieurs serveurs sur une même machine, chaque serveur a besoin d'un port différent. Serveur 1 : 30814, serveur 2 : 30815, par exemple.
:::

Sur certains routeurs, vous devrez peut-être créer 2 règles, une pour l'UDP et une pour le TCP, tandis que d'autres permettent de faire les deux avec une seule règle !

La plupart des routeurs ont un bouton « save » (enregistrer), et certains exigent un redémarrage pour que les modifications prennent effet.

### Tester le port

Il existe plusieurs façons de tester la connexion.

Nous recommandons d'utiliser notre outil **CheckBeamMP**, car il teste les problèmes et protocoles propres à BeamMP.

<form action="https://check.beammp.com/api/v2/beammp" method="get" target="_blank">
  <label for="ip">Adresse IP :</label>
  <input type="text" id="ip" name="ip"><br>
  <label for="port">Port :</label>
  <input type="text" id="port" name="port"><br>
  <input type="submit" value="CheckBeamMP">
</form>

Pour cela, il faut connaître votre adresse IPv4 publique, ce qui peut aussi se faire de plusieurs façons. La principale consiste à utiliser le site [whatsmyip.org](https://whatsmyip.org/), un site simple qui affiche votre adresse IP publique. Vous cherchez une adresse IP au format xxx.xxx.xxx.xxx

Rendez-vous sur le lien suivant en remplaçant « IP » par votre véritable adresse IPv4 et « Port » par le port de votre serveur. Veillez à ne laisser aucun espace.
https://check.beammp.com/api/v2/beammp/ip/port

::: success status: ok
Si vous obtenez le résultat ci-dessus, vous pouvez maintenant rejoindre votre serveur !
Il y a 2 façons de le rejoindre : directement avec les informations que vous avez saisies dans CheckBeamMP, ou, si votre serveur est défini comme « public », via la liste des serveurs.
Comme vous hébergez un serveur sur site, utilisez 127.0.0.1 (localhost) si le serveur tourne sur le même PC que celui sur lequel vous jouez, ou l'adresse IPv4 locale (LAN) de la machine qui fait tourner le serveur.
:::

::: failure status: error
Si la connexion échoue complètement, votre FAI utilise peut-être le CGNAT (Carrier Grade Network Address Translation). Pour plus de détails, consultez [Vérifier le CGNAT](/fr/server-owners/cgnat),
  ou ouvrez un ticket Server Support sur notre [serveur Discord](https://discord.gg/beammp), dans le canal `#support`, et l'un des membres de notre équipe s'occupera de votre ticket !
  Si seul le TCP fonctionne et que l'UDP échoue, revérifiez les règles du pare-feu et de redirection de port.
:::
