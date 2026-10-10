---
description: "Aidez à améliorer la documentation de BeamMP : modifiez une page sur GitHub, prévisualisez vos changements en local, suivez le guide de style et découvrez ce qui se passe après une pull request."
---
# Contribution

Vous pouvez aider à améliorer cette documentation en corrigeant une erreur, en ajoutant ce qui manque ou en écrivant une page. Cette page explique comment faire.

## Avant d'écrire

Lisez le [guide de style](https://github.com/__repo__/blob/main/STYLE_GUIDE.md). Il explique comment une page doit se lire, quand utiliser chaque type de bloc, et comment écrire les images et les liens.

Les pages en anglais font référence. Modifiez la page anglaise, et les autres langues suivent. Pour aider à traduire, consultez [Traduction](#translating).

## Modifier une page sur GitHub

C'est le moyen le plus rapide pour les fautes d'orthographe, de grammaire et les petits ajouts. Il nécessite quelques connaissances de Markdown.

1. Cliquez sur **Edit this page** en bas de la page que vous souhaitez modifier.
2. Faites un fork du projet sur votre propre compte GitHub.
3. Effectuez vos modifications.
4. Validez-les (commit) dans votre fork.
5. Ouvrez une pull request vers [@repo@](https://github.com/__repo__).

## Prévisualiser vos changements en local

Pour toute modification plus importante, prévisualisez vos changements pendant que vous écrivez.

1. Faites un fork du projet et clonez votre fork.
2. Installez [Node.js](https://nodejs.org) 22 ou une version plus récente, puis exécutez `npm install`.
3. Exécutez `npm run dev` et ouvrez l'adresse affichée. La page se met à jour au fil de vos modifications.
4. Effectuez vos modifications, puis exécutez `npm test` et `npm run check`. La vérification détecte les liens morts, les blocs non fermés, les images manquantes et les pages qui ne s'affichent pas.
5. Validez dans votre fork et ouvrez une pull request.

## Et ensuite

Un membre de la Mod Team de BeamMP examine votre pull request, puis l'approuve ou demande des modifications. Une fois les modifications effectuées, nous l'examinons de nouveau. Dès qu'elle est fusionnée, elle est déployée automatiquement.

## Traduction {#translating}

L'anglais est la version de référence. Les autres langues ont les mêmes pages aux mêmes chemins : une modification commence donc dans la page en anglais.

1. Lancez `npm run check:translations`. La commande liste les traductions qui sont périmées parce que leur page en anglais a changé.
2. Mettez chacune à jour à partir de la page en anglais. Conservez les titres, les encadrés, les images et les liens, et ne traduisez ni le code, ni les commandes, ni les noms de fichiers, ni les clés de réglage.
3. Enregistrez la mise à jour : `npm run check:translations -- --record de/players/faq.md`.

Pour les réglages et les boutons du mod lui-même, le français et le chinois utilisent les libellés exacts des fichiers de traduction du mod. L'allemand, l'espagnol, l'italien et le russe gardent les libellés anglais, car le jeu les affiche en anglais. Les règles complètes se trouvent dans le [README](https://github.com/__repo__#translations).
