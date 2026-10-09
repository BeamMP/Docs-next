# Contribuir a la documentación de BeamMP

BeamMP usa [Material for MkDocs](https://squidfunk.github.io/mkdocs-material) como tema. Es un tema para [MkDocs](https://www.mkdocs.org).
La documentación completa se encuentra en sus respectivos sitios web.

## Primeros pasos

Para contribuir a esta documentación puedes seguir uno de los dos enfoques que se describen a continuación:

### 1. Editar directamente los archivos Markdown

Editar directamente los archivos Markdown es el enfoque más rápido y el más adecuado para ediciones puntuales, como correcciones ortográficas o gramaticales, o nuevos fragmentos de contenido. 
Eso sí, este enfoque requiere conocimientos previos de Markdown, ya que necesitarás entender qué resultado producirá tu contribución.

Si quieres seguir este enfoque, sigue estos pasos:

1. Haz clic en editar en la página que quieras modificar.
2. Haz un fork del proyecto en tu propia cuenta de GitHub.
3. Realiza los cambios que consideres oportunos.
4. Haz commit de tus cambios en tu fork.
5. Abre un pull request contra nuestro repositorio [aquí](https://github.com/__repo__).

Una vez creado tu pull request, un miembro del equipo de moderación de mods de BeamMP lo revisará y lo aprobará o solicitará algunos cambios.
Si se solicitaron cambios y ya los has completado, volveremos a revisar tu pull request.
Después, tus cambios se fusionarán en el repositorio y se desplegarán automáticamente como parte de nuestra integración continua.

### 2. Editar con vista previa en directo

Editar nuestra documentación de esta forma sigue un enfoque similar al de la opción 1, pero te permite previsualizar tus cambios.

1. Haz clic en editar en la página que quieras modificar.
2. Haz un fork del proyecto en tu propia cuenta de GitHub.
3. Clona el proyecto en local.
4. Configura Material for MkDocs siguiendo su guía [aquí](https://squidfunk.github.io/mkdocs-material/getting-started/)
5. Ejecuta `mkdocs serve` desde la carpeta donde clonaste el fork para iniciar el servidor de documentación con recarga automática.
6. Realiza los cambios que consideres oportunos.
7. Haz commit de tus cambios en tu fork.
8. Abre un pull request contra nuestro repositorio [aquí](https://github.com/__repo__).


## Estructura del proyecto

    mkdocs.yml    # El archivo de configuración.
    docs/
        index.md  # La página de inicio de la documentación.
        ...       # Otras páginas Markdown, imágenes y otros archivos.
