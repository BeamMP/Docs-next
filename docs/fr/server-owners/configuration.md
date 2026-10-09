---
description: "Tous les paramètres de ServerConfig.toml pour un serveur BeamMP, les chemins des cartes d'origine, la mise en forme et en couleur du nom du serveur, et la liste des tags."
---
# Configuration du serveur

Les paramètres d'un serveur BeamMP, comment le nommer et lui attribuer des tags, et les chemins des cartes d'origine. Pour installer un serveur, consultez [Héberger un serveur](/fr/server-owners/host-a-server). Pour lire le journal ou mettre à jour le serveur, consultez [Maintenance du serveur](/fr/server-owners/maintenance).

## Le fichier ServerConfig

La configuration du serveur, un fichier nommé `ServerConfig.toml`, utilise le [format TOML](https://toml.io/en/).

::: info Ancien fichier de configuration
L'ancien fichier de configuration du serveur s'appelait `Server.cfg`. Il n'est plus utilisé, et le serveur affiche un avertissement s'il est encore présent. Les deux formats ne sont **pas** compatibles.
:::

La configuration comporte deux sections, `[General]` et `[Misc]`. Les valeurs par défaut sont celles de la version 3.9.4 du serveur.

### La section `[General]`

| Clé | Par défaut | Valeur | Rôle |
|---|---|---|---|
| Port | `30814` | 1024-65535 | Le port réseau sur lequel le serveur sera joignable. (Il doit être unique et ne pas être utilisé par un autre service sur la même machine.) |
| AuthKey | vide | Format AuthKey `xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` où tous les x sont des caractères alphanumériques (chiffres et lettres) | Sert à identifier un serveur public auprès du backend. |
| AllowGuests | `true` | true/false | Indique si les invités sont autorisés à rejoindre le serveur. |
| LogChat | `true` | true/false | Lorsque cette option est activée (true), les messages du chat sont enregistrés dans le fichier server.log. |
| Debug | `false` | true/false | Lorsque cette option est activée (true), affiche davantage de messages dans le journal et fournit plus d'informations. Activez-la si vous rencontrez des problèmes. Cela augmente considérablement la taille du fichier journal. |
| IP | `"::"` | Une adresse IP locale de l'une des interfaces réseau de la machine | Le serveur s'attache à cette adresse IP. Ce n'est **pas** votre adresse IP publique. Utilisez-la si votre machine possède plusieurs interfaces réseau. Vous n'avez pas besoin de la modifier pour que le serveur fonctionne. |
| Private | `true` | true/false | Lorsque cette option est activée (true), votre serveur n'apparaît pas dans la liste des serveurs. Toute personne disposant de la bonne adresse IP et du bon port peut quand même s'y connecter. |
| InformationPacket | `true` | true/false | Lorsque cette option est activée (true), le serveur autorise les clients non authentifiés à obtenir les mêmes informations que dans la liste des serveurs, mais directement auprès du serveur. |
| Name | `"BeamMP Server"` | Tout « texte » | Affiché comme nom / titre de votre serveur dans la liste des serveurs. Vous pouvez utiliser des caractères spéciaux pour le mettre en forme avec des couleurs et des styles. |
| Tags | `"Freeroam"` | Voir la liste des tags autorisés plus bas. | Tags pour la recherche, par ex. Police, Racing, etc. |
| MaxCars | `1` | Tout nombre ≥ 1 | Le nombre maximal de voitures par joueur. Toute voiture supplémentaire qu'un joueur essaie de faire apparaître est supprimée immédiatement. |
| MaxPlayers | `8` | Tout nombre ≥ 1 | Le nombre maximal de joueurs par serveur. Cela n'affecte pas le nombre de véhicules. |
| Map | `"/levels/gridmap_v2/info.json"` | Un emplacement de carte valide, tel que `/levels/gridmap_v2/info.json` | La carte que votre serveur hébergera. Elle doit être installée par défaut (une liste figure plus bas) ou comme mod du serveur. |
| Description | `"BeamMP Default Description"` | Tout « texte » | Affiché comme description du serveur dans la liste des serveurs (si le serveur est public). Vous pouvez utiliser des caractères spéciaux pour la mettre en forme avec des couleurs et des styles. |
| ResourceFolder | `"Resources"` | Un emplacement de dossier valide, tel que « D:\Server\BeamMP\Resources » | Utile pour stocker séparément le serveur et le dossier de ressources. |

### La section `[Misc]`

| Clé | Par défaut | Valeur | Rôle |
|---|---|---|---|
| ImScaredOfUpdates | `true` | true/false | Lorsque cette option est activée (`true`), masque le message périodique qui indique qu'une nouvelle version du serveur est disponible. Le serveur ne se met pas à jour tout seul : consultez [Maintenance du serveur](/fr/server-owners/maintenance#updating-the-server). |
| UpdateReminderTime | `"30s"` | Un nombre suivi de `s`, `min`, `h` ou `d`, par exemple `30s` | La fréquence à laquelle le rappel de mise à jour est affiché dans le terminal. `30d` correspond à tous les 30 jours, `0.5min` à toutes les demi-minutes. |

Les plugins peuvent utiliser leurs propres sections, comme `[MyMod]`.

Vous **devez** définir vous-même l'AuthKey. Elle est vide par défaut. Renseignez l'AuthKey que vous avez obtenue pendant [l'installation du serveur](/fr/server-owners/host-a-server). Ne la partagez avec personne et floutez-la entièrement dans les captures d'écran.

### Noms de toutes les cartes d'origine {#all-vanilla-maps-names}

Voici toutes les cartes d'origine :

- /levels/gridmap_v2/info.json
- /levels/johnson_valley/info.json
- /levels/automation_test_track/info.json
- /levels/east_coast_usa/info.json
- /levels/hirochi_raceway/info.json
- /levels/italy/info.json
- /levels/jungle_rock_island/info.json
- /levels/industrial/info.json
- /levels/small_island/info.json
- /levels/smallgrid/info.json
- /levels/utah/info.json
- /levels/west_coast_usa/info.json
- /levels/driver_training/info.json
- /levels/derby/info.json

### Personnaliser l'apparence du nom de votre serveur {#customize-the-look-of-your-server-name}

Utilisez ces symboles spéciaux avant votre texte pour lui appliquer un effet dans la liste des serveurs :

| Valeur | Description                 |
|:-----:|-----------------------------|
| `^r`  | Réinitialiser               |
| `^p`  | Saut de ligne (descriptions uniquement) |
| `^n`  | Souligné                    |
| `^l`  | Gras                        |
| `^m`  | Barré                       |
| `^o`  | Italique                    |
| `^0`  | Noir                        |
| `^1`  | Bleu                        |
| `^2`  | Vert                        |
| `^3`  | Bleu clair                  |
| `^4`  | Rouge                       |
| `^5`  | Rose                        |
| `^6`  | Orange                      |
| `^7`  | Gris                        |
| `^8`  | Gris foncé                  |
| `^9`  | Violet clair                |
| `^a`  | Vert clair                  |
| `^b`  | Bleu clair                  |
| `^c`  | Orange foncé                |
| `^d`  | Rose clair                  |
| `^e`  | Jaune                       |
| `^f`  | Blanc                       |

### Personnaliser les tags de votre serveur

Les tags permettent aux gens de rechercher un type de serveur précis. Votre serverConfig.toml sera généré avec le tag freeroam `Tags = "Freeroam"`.

Vous pouvez ajouter plusieurs tags séparés par des virgules `Tags = "Events,Offroad,lang:english"` ; la casse n'a pas d'importance.

Vous pouvez choisir dans la liste suivante :

::: tabs

== Âge/Contenu

- `Mature/18+`

== Types de gameplay

- `Freeroam`
- `Roleplay`
- `Economy`
- `Traffic`
- `Challenge`
- `Drift`

== Catégories de course

- `Racing`
- `Racing:NASCAR`
- `Racing:Track`
- `Racing:Drag`
- `Racing:Rally`
- `Touge`

== Tout-terrain

- `Offroad`
- `Crawling`
- `Rally`
- `Dakar`

== Événements de destruction

- `Derby`
- `Arena`

== Météo et conditions horaires

- `Snow/Ice`
- `Rain`
- `Night`
- `Weather`

== Modes de jeu

- `Gamemode`
- `Gamemode:Racing`
- `Gamemode:Rally`
- `Gamemode:Drag`
- `Gamemode:Derby`
- `Gamemode:Infection`
- `Gamemode:Cops-Robbers`
- `Gamemode:Delivery`
- `Gamemode:Sumo`

== Communauté et événements

- `Scenarios`
- `Events`
- `Leaderboard`

== Mods

- `Modded`
- `Mod:BeamPaint`
- `Mod:BeamJoy`
- `Mod:CEI`

== Langues

- `Lang:English`
- `Lang:Russian`
- `Lang:French`
- `Lang:Spanish`
- `Lang:Portuguese`
- `Lang:German`
- `Lang:Polish`
- `Lang:Arabic`

== Autres

- `Vanilla`
- `Moderated`

:::


Si un tag manque dans cette liste, vous pouvez demander son ajout [ici](https://forum.beammp.com/t/introducing-server-tags/1320081)
