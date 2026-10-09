# Comment créer des exclusions dans le pare-feu et l'antivirus Windows Defender ?

:::: info
Avant de modifier le pare-feu, assurez-vous que votre réseau est défini sur « privé » dans les paramètres réseau de Windows (si vous vous trouvez sur un réseau privé).

::: danger AVERTISSEMENT :
**Les exclusions du pare-feu / de Defender représentent un risque**.

En créant des exclusions, vous reconnaissez les risques liés à l'autorisation de programmes sur votre PC et à l'ouverture de ports de votre réseau domestique sur Internet, et vous renoncez donc à tout recours contre BeamMP pour **tout dommage** pouvant en résulter pour vous ou votre foyer.

Nous déclinons toute responsabilité quant au contenu des services ou sites web externes vers lesquels nous renvoyons.
:::
::::

## 1. Exclusion du pare-feu Defender pour BeamMP-Launcher.

1. Ouvrez le `Windows Defender Firewall with advanced setting` (« Pare-feu Windows Defender avec fonctions avancées de sécurité »).
2. Dans la fenêtre, cliquez sur `Inbound` (« Règles de trafic entrant ») pour ouvrir l'onglet des exclusions entrantes.
3. Cliquez sur `Create new rule` (« Nouvelle règle… ») en haut à droite pour créer une nouvelle exclusion.
4. Sélectionnez `Program` (« Programme ») pour créer une exclusion propre à un programme.
5. Saisissez le chemin complet vers `BeamMP-Launcher.exe`. Par défaut, il s'agit de `%appdata%\BeamMP-Launcher\BeamMP-Launcher.exe` (sans guillemets).
6. Veillez à autoriser la connexion.
7. Donnez un nom à l'exclusion (par exemple « BeamMP-Launcher ») et enregistrez-la.
9. Redémarrez votre PC.

## 1.1 Exclusion du pare-feu Defender pour BeamMP-Server.

1. Ouvrez le `Windows Defender Firewall with advanced setting` (« Pare-feu Windows Defender avec fonctions avancées de sécurité »).
2. Dans la fenêtre, cliquez sur `Inbound` (« Règles de trafic entrant ») pour ouvrir l'onglet des exclusions entrantes.
3. Cliquez sur `Create new rule` (« Nouvelle règle… ») en haut à droite pour créer une nouvelle exclusion.
4. Sélectionnez `Port` pour créer une exclusion propre à un port.
5. Saisissez le même port que dans le fichier ServerConfig.toml.
6. Saisissez le chemin complet vers `BeamMP-Server.exe`. Le fichier se trouve à l'endroit où vous l'avez placé après l'avoir téléchargé.
7. Veillez à autoriser la connexion.
8. Donnez un nom à l'exclusion (par exemple « BeamMP-Server ») et enregistrez-la.
9. Redémarrez votre PC.

## 2. Exclusion de l'antivirus Defender pour BeamMP-Launcher/Server.

1. Ouvrez l'application `Windows Security` (« Sécurité Windows »).
2. Cliquez sur le premier élément, `virus and threat protection` (« Protection contre les virus et menaces »).
3. Cliquez sur `Manage settings` (« Gérer les paramètres ») sous « Paramètres de protection contre les virus et menaces ».
4. Faites défiler la page jusqu'à la section `Exclusions`.
5. Cliquez sur « Ajouter une exclusion » (« Add an exclusion ») et sélectionnez `process` (« Processus »).
6. Saisissez `BeamMP-Launcher.exe` ou `BeamMP-Server.exe` dans le champ et enregistrez.
7. Redémarrez votre PC.

## Toujours des problèmes ?

Ouvrez un sujet sur le [forum](https://forum.beammp.com) ou sur notre [serveur Discord](https://discord.gg/beammp), dans le canal `#support`.
