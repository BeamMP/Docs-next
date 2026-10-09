---
description: "Ayuda a mejorar la documentación de BeamMP: edita una página en GitHub, previsualiza tus cambios, sigue la guía de estilo y mira qué pasa tras abrir un pull request."
---
# Contribuir

Puedes ayudar a mejorar esta documentación corrigiendo un error, añadiendo algo que falta o escribiendo una página. Esta página explica cómo.

## Antes de escribir

Lee la [guía de estilo](https://github.com/__repo__/blob/main/STYLE_GUIDE.md). Explica cómo debe leerse una página, cuándo usar cada recuadro y cómo escribir imágenes y enlaces.

Las páginas en inglés son la referencia. Cambia la página en inglés y los demás idiomas la seguirán. Para ayudar con la traducción, consulta [Traducir](#translating).

## Editar una página en GitHub

Es la forma más rápida para correcciones ortográficas y gramaticales y pequeñas adiciones. Requiere algunos conocimientos de Markdown.

1. Haz clic en **Editar esta página** al final de la página que quieras cambiar.
2. Haz un fork del proyecto en tu propia cuenta de GitHub.
3. Realiza tus cambios.
4. Haz commit de tus cambios en tu fork.
5. Abre un pull request contra [@repo@](https://github.com/__repo__).

## Previsualizar tus cambios en local

Para cualquier cosa más grande, previsualiza tus cambios mientras escribes.

1. Haz un fork del proyecto y clona tu fork.
2. Instala [Node.js](https://nodejs.org) 22 o posterior y luego ejecuta `npm install`.
3. Ejecuta `npm run dev` y abre la dirección que muestra. La página se actualiza a medida que editas.
4. Realiza tus cambios y luego ejecuta `npm test` y `npm run check`. La comprobación detecta enlaces rotos, recuadros sin cerrar, imágenes que faltan y páginas que no se muestran.
5. Haz commit en tu fork y abre un pull request.

## Qué ocurre después

Un miembro del equipo de moderación de mods de BeamMP revisa tu pull request y lo aprueba o solicita cambios. Cuando hayas hecho los cambios, lo revisamos de nuevo. Una vez fusionado, se despliega automáticamente.

## Traducir {#translating}

La documentación se traduce a varios idiomas con [GitLocalize](https://gitlocalize.com/repo/9180). GitLocalize puede mostrar un párrafo como «sin traducir» cuando en realidad ya lo está, así que comprueba que una página no esté ya traducida antes de cambiarla.
