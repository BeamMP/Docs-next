## Obtenir une AuthKey {#get-an-authkey}

L'AuthKey, aussi appelée « clé d'authentification », est ce qui permet à un serveur **public** d'apparaître dans la liste des serveurs. Elle est aussi recommandée pour les serveurs privés.

- Vous recevez un nombre limité de clés. Une clé ne fonctionne que sur un seul serveur à la fois : vous ne pouvez donc pas faire tourner deux serveurs avec la même clé.
- Vous pouvez obtenir davantage de clés en soutenant le projet. Consultez [Comment obtenir l'accès anticipé ?](/fr/players/faq) dans la FAQ du joueur.
- Il vous faut un compte BeamMP. Vous n'avez pas besoin d'un compte Discord pour créer une clé.

::: warning
Ne partagez jamais votre AuthKey et ne la montrez à personne. Traitez-la comme un mot de passe.
:::

1. Ouvrez [BeamMP Accounts](https://accounts.beammp.com) et connectez-vous. Si vous n'avez pas encore de compte, suivez [Votre compte BeamMP](/fr/players/account).
2. Cliquez sur **Keymaster** dans le menu en haut de la page.
3. Cliquez sur **Create New Server Key**, puis sur **Create Key**. La nouvelle clé est ajoutée à la liste **Your Server Keys**.
4. Dans **Your Server Keys**, cliquez sur **Show Keys**. Chaque clé est abrégée à ses 8 premiers et 4 derniers caractères, avec la date de sa création.
5. Cliquez sur l'icône de copie à côté de la clé. Keymaster copie la clé en entier. Gardez-la pour l'étape suivante.

Une clé ressemble à `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`. Keymaster n'a ni champ pour nommer une clé, ni bouton pour en supprimer une. Une clé que vous n'utilisez pas compte quand même dans votre limite.

### Votre limite de clés

**Your Server Keys** indique combien de clés vous avez utilisées, par exemple `1 / 2 keys used`, ainsi que l'origine des éventuelles clés supplémentaires. Par défaut :

- Chaque compte peut avoir 2 clés.
- Un palier Patreon ajoute une clé par dollar américain entier du prix du palier. Liez d'abord votre compte Patreon dans BeamMP Accounts. Consultez [Votre compte BeamMP](/fr/players/account#linked-accounts).
- Booster le serveur Discord de BeamMP ajoute 5 clés au total, et non 5 par boost. Liez d'abord votre compte Discord dans BeamMP Accounts. Il peut falloir jusqu'à une journée pour qu'un boost apparaisse.

Lorsque vous atteignez la limite, **Create New Server Key** affiche un message **Key Limit Reached** au lieu de créer une clé.

### Remplacer une clé que d'autres ont vue

Si quelqu'un d'autre est susceptible de connaître votre clé, renouvelez-la.

1. Dans **Your Server Keys**, cliquez sur l'icône de rotation à côté de la clé.
2. Cliquez sur **Rotate Key**. L'ancienne clé cesse immédiatement de fonctionner, et le serveur qui l'utilise disparaît de la liste des serveurs.
3. Copiez la nouvelle clé et placez-la dans le paramètre `AuthKey` de votre `ServerConfig.toml`.
4. Redémarrez le serveur.

Une clé bannie par le staff ne peut pas être renouvelée.

### Transférer vos anciennes clés vers BeamMP Accounts

Les clés obtenues avant l'existence de BeamMP Accounts sont liées à votre compte Discord.

1. Dans **Keymaster**, repérez le cadre **Legacy Keys**. Il n'apparaît que lorsqu'il y a quelque chose à faire.
2. Si Discord n'est pas lié, cliquez sur **Link Discord** et connectez-vous avec le compte Discord qui possédait les clés.
3. Cliquez sur le bouton **Migrate**, qui indique le nombre de clés, puis confirmez avec **Migrate Keys**. Chaque clé conserve sa valeur : vos serveurs restent donc en ligne et vous n'avez rien à modifier sur eux.

Les clés transférées comptent dans votre limite. Si elles vous font dépasser celle-ci, vous les conservez toutes, mais vous ne pouvez plus créer de nouvelles clés tant que vous n'êtes pas repassé sous la limite.

Keymaster liste aussi les serveurs en ligne avec vos clés sous **Your Online Servers**, avec leur nombre de joueurs et leur version.
