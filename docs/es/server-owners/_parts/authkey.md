## Conseguir una AuthKey {#get-an-authkey}

La AuthKey, también llamada «clave de autenticación» («Authentication Key»), es lo que hace que un servidor **público** aparezca en la lista de servidores. También se recomienda para los servidores privados.

- Tienes un número limitado de claves. Una clave solo funciona en un servidor a la vez, así que no puedes ejecutar dos servidores con la misma clave.
- Puedes conseguir más claves apoyando el proyecto. Consulta [¿Cómo consigo el acceso anticipado?](/es/players/faq) en las Preguntas frecuentes del jugador.
- Necesitas una cuenta de BeamMP. No hace falta una cuenta de Discord para crear una clave.

::: warning
No compartas nunca tu AuthKey ni se la enseñes a nadie. Trátala como una contraseña.
:::

1. Abre [BeamMP Accounts](https://accounts.beammp.com) e inicia sesión. Si aún no tienes una cuenta, sigue [Tu cuenta de BeamMP](/es/players/account).
2. Haz clic en **Keymaster** en el menú de la parte superior de la página.
3. Haz clic en **Create New Server Key** y después en **Create Key**. La clave nueva se añade a la lista **Your Server Keys**.
4. En **Your Server Keys**, haz clic en **Show Keys**. Cada clave aparece abreviada, con sus primeros 8 y sus últimos 4 caracteres, junto a la fecha en que la creaste.
5. Haz clic en el icono de copiar que hay junto a la clave. Keymaster copia la clave completa. Guárdala para el siguiente paso.

Una clave tiene este aspecto: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`. Keymaster no tiene ningún campo para ponerle nombre a una clave ni ningún botón para borrarla. Una clave que no uses sigue contando para tu límite.

### Tu límite de claves

**Your Server Keys** muestra cuántas claves has usado, por ejemplo `1 / 2 keys used`, y de dónde vienen las claves adicionales. De forma predeterminada:

- Cada cuenta puede tener 2 claves.
- Un nivel de Patreon añade una clave por cada dólar estadounidense entero del precio del nivel. Antes tienes que vincular tu cuenta de Patreon en BeamMP Accounts. Consulta [Tu cuenta de BeamMP](/es/players/account#linked-accounts).
- Impulsar («boost») el servidor de Discord de BeamMP añade 5 claves en total, no 5 por cada impulso. Antes tienes que vincular tu cuenta de Discord en BeamMP Accounts. Puede tardar hasta un día en aparecer el impulso.

Cuando llegas al límite, **Create New Server Key** muestra un mensaje **Key Limit Reached** en lugar de crear una clave.

### Sustituir una clave que otras personas han visto

Si alguien más puede conocer tu clave, rótala.

1. En **Your Server Keys**, haz clic en el icono de rotar que hay junto a la clave.
2. Haz clic en **Rotate Key**. La clave antigua deja de funcionar al instante y el servidor que la usa desaparece de la lista de servidores.
3. Copia la clave nueva y ponla en el ajuste `AuthKey` de tu `ServerConfig.toml`.
4. Reinicia el servidor.

Una clave que el personal ha bloqueado («banned») no se puede rotar.

### Mover tus claves antiguas a BeamMP Accounts

Las claves que conseguiste antes de que existiera BeamMP Accounts están vinculadas a tu cuenta de Discord.

1. En **Keymaster**, busca el recuadro **Legacy Keys**. Solo aparece mientras hay algo que hacer.
2. Si Discord no está vinculado, haz clic en **Link Discord** e inicia sesión con la cuenta de Discord que era propietaria de las claves.
3. Haz clic en el botón **Migrate**, que indica el número de claves, y confirma con **Migrate Keys**. Cada clave conserva su valor, así que tus servidores siguen en línea y no tienes que cambiar nada en ellos.

Las claves migradas cuentan para tu límite. Si te hacen pasarlo, las conservas todas, pero no puedes crear claves nuevas hasta que vuelvas a estar por debajo del límite.

Keymaster también muestra en **Your Online Servers** los servidores que están en línea con tus claves, con su número de jugadores y su versión.
