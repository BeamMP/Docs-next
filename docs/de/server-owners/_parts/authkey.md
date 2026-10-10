## Einen AuthKey besorgen {#get-an-authkey}

Der AuthKey, auch „Authentifizierungsschlüssel“ genannt, sorgt dafür, dass ein **öffentlicher** Server in der Serverliste erscheint. Auch für private Server wird er empfohlen.

- Du bekommst nur eine begrenzte Anzahl an Schlüsseln. Ein Schlüssel funktioniert immer nur für einen Server gleichzeitig, du kannst also nicht zwei Server mit demselben Schlüssel betreiben.
- Weitere Schlüssel bekommst du, wenn du das Projekt unterstützt. Siehe [Wie bekomme ich Early Access?](/de/players/faq) in der Spieler-FAQ.
- Du brauchst ein BeamMP-Konto. Ein Discord-Konto brauchst du nicht, um einen Schlüssel zu erstellen.

::: warning
Gib deinen AuthKey niemals weiter und zeige ihn niemandem. Behandle ihn wie ein Passwort.
:::

1. Öffne [BeamMP Accounts](https://accounts.beammp.com) und melde dich an. Wenn du noch kein Konto hast, folge der Anleitung [Dein BeamMP-Konto](/de/players/account).
2. Klicke oben auf der Seite im Menü auf **Keymaster**.
3. Klicke auf **Create New Server Key** und dann auf **Create Key**. Der neue Schlüssel wird zur Liste **Your Server Keys** hinzugefügt.
4. Klicke in **Your Server Keys** auf **Show Keys**. Jeder Schlüssel wird auf seine ersten 8 und letzten 4 Zeichen gekürzt angezeigt, zusammen mit dem Datum, an dem du ihn erstellt hast.
5. Klicke auf das Kopieren-Symbol neben dem Schlüssel. Der Keymaster kopiert den ganzen Schlüssel. Behalte ihn für den nächsten Schritt.

Ein Schlüssel sieht so aus: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`. Im Keymaster gibt es kein Feld für einen Schlüsselnamen und keine Schaltfläche zum Löschen eines Schlüssels. Ein Schlüssel, den du nicht benutzt, zählt trotzdem zu deinem Limit.

### Dein Schlüssellimit

**Your Server Keys** zeigt, wie viele Schlüssel du schon verwendet hast, zum Beispiel `1 / 2 keys used`, und woher eventuelle zusätzliche Schlüssel stammen. Standardmäßig gilt:

- Jedes Konto kann 2 Schlüssel haben.
- Eine Patreon-Stufe fügt für jeden vollen US-Dollar des Stufenpreises einen Schlüssel hinzu. Verknüpfe dafür zuerst dein Patreon-Konto in BeamMP Accounts. Siehe [Dein BeamMP-Konto](/de/players/account#linked-accounts).
- Das Boosten des BeamMP-Discord-Servers fügt insgesamt 5 Schlüssel hinzu, nicht 5 pro Boost. Verknüpfe dafür zuerst dein Discord-Konto in BeamMP Accounts. Es kann bis zu einen Tag dauern, bis ein Boost angezeigt wird.

Wenn du das Limit erreicht hast, zeigt **Create New Server Key** die Meldung **Key Limit Reached** an, statt einen Schlüssel zu erstellen.

### Einen Schlüssel ersetzen, den andere gesehen haben

Wenn jemand anderes deinen Schlüssel kennen könnte, tausche ihn aus.

1. Klicke in **Your Server Keys** auf das Rotieren-Symbol neben dem Schlüssel.
2. Klicke auf **Rotate Key**. Der alte Schlüssel funktioniert sofort nicht mehr, und der Server, der ihn verwendet, verschwindet aus der Serverliste.
3. Kopiere den neuen Schlüssel und trage ihn bei der Einstellung `AuthKey` in deiner `ServerConfig.toml` ein.
4. Starte den Server neu.

Ein Schlüssel, den das Team gesperrt hat, kann nicht ausgetauscht werden.

### Deine alten Schlüssel zu BeamMP Accounts übertragen

Schlüssel, die du bekommen hast, bevor es BeamMP Accounts gab, sind an dein Discord-Konto gebunden.

1. Suche im **Keymaster** das Feld **Legacy Keys**. Es wird nur angezeigt, solange etwas zu tun ist.
2. Wenn Discord nicht verknüpft ist, klicke auf **Link Discord** und melde dich mit dem Discord-Konto an, dem die Schlüssel gehörten.
3. Klicke auf die Schaltfläche **Migrate**, auf der die Anzahl der Schlüssel steht, und bestätige mit **Migrate Keys**. Jeder Schlüssel behält seinen Wert, deine Server bleiben also online und du musst an ihnen nichts ändern.

Übertragene Schlüssel zählen zu deinem Limit. Wenn du dadurch darüber liegst, behältst du trotzdem alle Schlüssel, kannst aber keine neuen erstellen, bis du wieder unter dem Limit bist.

Der Keymaster listet unter **Your Online Servers** außerdem die Server auf, die mit deinen Schlüsseln online sind, mit Spielerzahl und Version.
