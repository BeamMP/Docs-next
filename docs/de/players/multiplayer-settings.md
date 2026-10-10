---
description: "Alle BeamMP-Multiplayer-Einstellungen erklärt: Allgemein, die Ereigniswarteschlange, Blobs, die Benutzeroberfläche, Namensschilder, Spieler, erweiterte Optionen und das Chat-Fenster."
---
# Einstellungen anpassen

Das sind die Einstellungen auf der Seite **BeamMP** der BeamNG.drive-Optionen, wie in BeamMP 4.22 für BeamNG.drive 0.39. Um sie zu öffnen, klicke auf **Optionen** und wähle **BeamMP**. Jede Einstellung ist immer sichtbar: Es gibt keinen Schalter, der erweiterte Einstellungen ausblendet.

Jede Einstellung unten ist ein eingeklappter Eintrag. Öffne ihn, um den Standardwert zu sehen und was sie bewirkt, wenn sie an oder aus ist. Die Abschnitte folgen den Gruppen auf der Seite: **Allgemein**, **Vehicle Update Queue**, **Blobs**, **Benutzeroberfläche (UI)**, **Spieler** und **Erweitert**. Wenn du neu bist, beginne mit [Multiplayer-Einstellungen für den ersten Start](/de/get-started/multiplayer-settings-quickstart).

## Allgemein {#general}

::: details Enable Config Cloning Protection
Standard: aus.

Wenn aktiviert, können andere Spieler deine Fahrzeuge weder klonen noch speichern. Wenn sie es versuchen, sehen sie **Vehicle Clone Error** oder **Vehicle Save Error**. Wenn du die Einstellung änderst, werden auch die Fahrzeuge aktualisiert, die du bereits gespawnt hast.

Wenn deaktiviert, können andere Spieler deine Fahrzeuge klonen und speichern.
:::

::: details Disable switching to other players vehicles
Standard: aus.

Wenn aktiviert, überspringt das Wechseln zwischen Fahrzeugen die Fahrzeuge anderer Spieler, solange du ein eigenes Fahrzeug hast.

Wenn deaktiviert, schaltet das Wechseln durch jedes gespawnte Fahrzeug.

Die Einräder anderer Spieler werden immer übersprungen, egal wie diese Einstellung steht.
:::

::: details Automatically save your last used Unicycle
Standard: an.

Wenn aktiviert, speichert BeamMP die Konfiguration deines Einrads, wenn du es löschst, und verwendet diese Konfiguration, wenn du dein Einrad das nächste Mal spawnst.

Wenn deaktiviert, wird die Konfiguration deines Einrads beim Löschen nicht gespeichert.
:::

## Ereigniswarteschlange {#event-queue}

Im Spiel heißt diese Gruppe **Vehicle Update Queue**. Wenn ein anderer Spieler ein Fahrzeug spawnt oder ändert, kann BeamMP die Änderung in eine Warteschlange einreihen, statt sie sofort zu laden, damit das Laden deine Fahrt nicht unterbricht.

Solange Änderungen warten, teilt dir eine Meldung mit, wie viele es sind, und die Sitzungsleiste oben am Bildschirm zeigt einen Button **Events queued** an. Die beiden Zahlen auf dem Button sind die wartenden Spawns und die wartenden Änderungen, in dieser Reihenfolge. Der Button erscheint nur, wenn etwas eingereiht ist. Wenn du kein Fahrzeug hast, werden eingereihte Änderungen sofort geladen.

Eingereihte Änderungen werden geladen, wenn:

- du oben am Bildschirm auf **Events queued** klickst.
- du die Taste drückst, die **Queue Events** zugewiesen ist. Weise sie in der Kategorie **BeamMP** der Steuerungseinstellungen zu.
- du auf den Namen eines Spielers klickst, während **Playerlist left click action** auf **Queue events** steht. Dadurch werden nur die Änderungen dieses Spielers geladen. **Queue events** im Rechtsklick-Menü des Spielers bewirkt dasselbe.
- das automatische Laden unten startet.

::: details Enable player vehicle update/edit queuing
Standard: an.

Wenn aktiviert, warten die Fahrzeug-Spawns und -Änderungen anderer Spieler in der Warteschlange, bis eine der obigen Aktionen sie lädt.

Wenn deaktiviert, werden die Fahrzeug-Spawns und -Änderungen anderer Spieler sofort geladen.
:::

::: details Automatically apply queued vehicle changes
Standard: an. Wird nur angezeigt, solange das Einreihen aktiviert ist.

Wenn aktiviert, werden eingereihte Änderungen geladen, sobald dein Fahrzeug für die unter **Queue apply timeout** eingestellte Zeit höchstens so schnell wie **Queue apply speed threshold** war.

Wenn deaktiviert, werden eingereihte Änderungen nur geladen, wenn du sie selbst lädst.
:::

::: details Queue apply speed threshold
Standard: 2 m/s. Ein Schieberegler von 0 bis 10 m/s. Wird nur angezeigt, solange das automatische Laden aktiviert ist.

Dein Fahrzeug muss für die unter **Queue apply timeout** eingestellte Zeit höchstens so schnell sein, bevor eingereihte Änderungen geladen werden.
:::

::: details Queue apply timeout
Standard: 3 s. Ein Schieberegler von 0 bis 20 s. Wird nur angezeigt, solange das automatische Laden aktiviert ist.

Dein Fahrzeug muss so lange höchstens so schnell wie **Queue apply speed threshold** sein, bevor eingereihte Änderungen geladen werden.
:::

::: details Enable automatic part sync
Standard: an.

Wenn aktiviert, wird eine Änderung an den Teilen deines Fahrzeugs etwa 15 Sekunden nach deiner letzten Änderung an andere Spieler gesendet.

Wenn deaktiviert, werden deine Teileänderungen nicht automatisch gesendet.
:::

::: details Skip queue if spectating others
Standard: aus.

Wenn aktiviert, werden eingereihte Änderungen sofort geladen, solange das Fahrzeug, in dem du dich befindest, nicht dein eigenes ist.

Wenn deaktiviert, warten eingereihte Änderungen in der Warteschlange, genau wie wenn du dein eigenes Fahrzeug steuerst.
:::

::: details Don't queue Unicycles (Snowmen/Beamlings)
Standard: an.

Wenn aktiviert, werden die Spawns und Änderungen von Einrädern anderer Spieler sofort geladen.

Wenn deaktiviert, werden Einräder genau wie andere Fahrzeuge eingereiht.
:::

## Blobs

Ein Blob ist eine farbige Kugel, die für ein Fahrzeug steht, das bei dir nicht gespawnt ist. Er hat eine von vier Farben:

- Die Farbe für eingereihte Fahrzeuge: Das Fahrzeug wartet in der Warteschlange.
- Die Farbe für unzulässige Fahrzeuge: Das Fahrzeug kann nicht gespawnt werden, weil sein Mod fehlt.
- Die Farbe für gelöschte Fahrzeuge: Du hast das Fahrzeug gelöscht. Um es zurückzuholen, klicke in der Spielerliste mit der rechten Maustaste auf seinen Besitzer und wähle **Queue deleted vehicles**.
- Magenta: jedes andere Fahrzeug, das noch nicht gespawnt ist. Diese Farbe kannst du nicht ändern.

::: details Enable blobs for unspawned vehicles
Standard: an.

Wenn aktiviert, siehst du anstelle jedes nicht gespawnten Fahrzeugs einen Blob.

Wenn deaktiviert, ist ein nicht gespawntes Fahrzeug unsichtbar.
:::

::: details Queued vehicle
Standard: angezeigt, `#FF6400`.

Das Kontrollkästchen **Queued vehicle** schaltet den Blob für Fahrzeuge in der Warteschlange an oder aus. Das Feld **HEX color value (ex: #FF6400)** legt seine Farbe fest.
:::

::: details Illegal vehicle
Standard: angezeigt, `#000000`.

Das Kontrollkästchen **Illegal vehicle** schaltet den Blob für Fahrzeuge an oder aus, die nicht gespawnt werden können. Das Feld **HEX color value (ex: #FF6400)** legt seine Farbe fest.
:::

::: details Deleted vehicle
Standard: angezeigt, `#333333`.

Das Kontrollkästchen **Deleted vehicle** schaltet den Blob für Fahrzeuge an oder aus, die du gelöscht hast. Das Feld **HEX color value (ex: #FF6400)** legt seine Farbe fest.
:::

## Benutzeroberfläche {#user-interface}

::: details Skip the mod security warning popup
Standard: aus.

Wenn aktiviert, wird die Mod-Sicherheitswarnung beim Verbinden mit einem Server mit Mods nicht angezeigt. Die Mods werden ohne Nachfrage heruntergeladen.

Wenn deaktiviert, wird die Warnung jedes Mal angezeigt, wenn du dich mit einem Server mit Mods verbindest. Siehe [Mod-Sicherheit](/de/players/mod-safety#the-mod-security-warning).
:::

::: details Allow the serverlist to refresh ingame
Standard: aus.

Wenn aktiviert, kann die Serverliste aktualisiert werden, während du in einer Sitzung bist. Das kann Lag-Spitzen verursachen.

Wenn deaktiviert, zeigt die Serverliste weiterhin die Liste von vor deinem Beitritt an, bis du die Sitzung verlässt.
:::

::: details HUD App Style
Standard: **Old**. Zur Auswahl stehen **Old** und **Redesign**.

Das legt das Aussehen der BeamMP-HUD-Apps fest: der Sitzungsleiste, der Spielerliste und des Chats.
:::

:::: details New chat menu
Standard: aus.

Wenn aktiviert, wird der Ingame-Chat in einem [ImGui](https://github.com/ocornut/imgui)-Fenster angezeigt, das du aus dem Spiel heraus auf einen anderen Monitor ziehen kannst. Siehe [Das Chat-Fenster](#the-chat-window).

Wenn deaktiviert, wird der Ingame-Chat in der HUD-App **BeamMP Chat** angezeigt.

::: warning
Das Herausziehen eines ImGui-Fensters aus dem Hauptfenster des Spiels kann Leistungsprobleme verursachen und Bildschirmaufnahme-Software dazu bringen, statt des Spiels das Chat-Fenster aufzunehmen.
:::
::::

### Namensschilder

Die anderen Einstellungen für Namensschilder sind nicht verfügbar, solange **Hide player nametags** aktiviert ist.

::: details Hide player nametags
Standard: aus.

Wenn aktiviert, werden keine Namensschilder gezeichnet.

Wenn deaktiviert, wird das Namensschild jedes Spielers über seinem Fahrzeug gezeichnet. Die Tastenaktion **Player Nametags** in den Steuerungseinstellungen blendet alle Namensschilder aus und wieder ein, bis du das Spiel neu startest.
:::

::: details Show distance from other players
Standard: an.

Wenn aktiviert, endet ein Namensschild mit der Entfernung zum Fahrzeug, wenn es mehr als 10 m entfernt ist. Die Entfernung verwendet das Einheitensystem des Spiels.

Wenn deaktiviert, zeigt ein Namensschild keine Entfernung an.
:::

::: details Hide nametags behind objects
Standard: aus.

Wenn aktiviert, verdecken Objekte wie Gebäude ein Namensschild, das hinter ihnen liegt.

Wenn deaktiviert, werden Namensschilder über allem gezeichnet.
:::

::: details Shorten nametag and role tags
Standard: aus.

Wenn aktiviert, werden lange Namen auf **Nametag length limit** gekürzt, und Rollen-Tags verwenden ihre Kurzform, zum Beispiel `[EA]` statt `[Early Access]`.

Wenn deaktiviert, werden Namen und Rollen-Tags in voller Länge angezeigt.
:::

::: details Nametag length limit
Standard: 32. Ein Schieberegler von 0 bis 50. Verfügbar, solange **Shorten nametag and role tags** aktiviert ist.

Das ist die größte Anzahl an Zeichen eines Namens, die angezeigt wird. Ein Name, der mehr als drei Zeichen über dem Limit liegt, wird auf das Limit gekürzt und endet auf `...`.
:::

::: details Show spectators' nametag under vehicle nametags
Standard: an.

Wenn aktiviert, werden die Namen der Spieler, die einem Fahrzeug zuschauen, unter seinem Namensschild angezeigt.

Wenn deaktiviert, werden Zuschauer nicht angezeigt.
:::

::: details Same color for spectator nametags
Standard: aus. Verfügbar, solange **Show spectators' nametag under vehicle nametags** aktiviert ist.

Wenn aktiviert, hat jedes Namensschild eines Zuschauers denselben grauen Hintergrund.

Wenn deaktiviert, hat das Namensschild eines Zuschauers einen Hintergrund, der die Rolle des Zuschauers widerspiegelt.
:::

::: details Fade nametags in/out
Standard: aus.

Wenn aktiviert, wird ein Namensschild je nach Entfernung zu seinem Fahrzeug ausgeblendet, gemäß **Fade distance**. **Invert nametag fade direction** legt fest, in welche Richtung es ausgeblendet wird.

Wenn deaktiviert, wird ein Namensschild bei jeder Entfernung mit voller Deckkraft gezeichnet.
:::

::: details Fade distance
Standard: 40 m. Ein Schieberegler von 0 bis 1500 m. Verfügbar, solange **Fade nametags in/out** aktiviert ist.

Ein Namensschild ist direkt neben dem Fahrzeug vollständig sichtbar und bei dieser Entfernung vollständig durchsichtig. Ist **Invert nametag fade direction** aktiviert, ist es umgekehrt.
:::

::: details Don't fully hide nametags
Standard: aus. Verfügbar, solange **Fade nametags in/out** aktiviert ist.

Wenn aktiviert, behält ein Namensschild bei jeder Entfernung eine Mindestdeckkraft von 30 Prozent.

Wenn deaktiviert, kann ein Namensschild vollständig durchsichtig werden.
:::

::: details Invert nametag fade direction
Standard: aus. Verfügbar, solange **Fade nametags in/out** aktiviert ist.

Wenn aktiviert, sind Namensschilder in der Nähe des Fahrzeugs durchsichtig und werden besser sichtbar, je weiter es entfernt ist.

Wenn deaktiviert, sind Namensschilder in der Nähe des Fahrzeugs sichtbar und werden ausgeblendet, je weiter es entfernt ist.
:::

### Spielerliste {#player-list}

::: details Show the player ID's
Standard: an.

Wenn aktiviert, hat die Spielerliste eine zusätzliche Spalte mit der ID jedes Spielers. Die ID ist für das Server-Team nützlich.

Wenn deaktiviert, zeigt die Spielerliste nur die Namen und den Ping an.
:::

::: details Highlight queued players
Standard: an.

Wenn aktiviert, wird ein Spieler mit eingereihten Änderungen in der Spielerliste hervorgehoben.

Wenn deaktiviert, wird kein Spieler hervorgehoben.
:::

::: details Playerlist left click action
Standard: **Queue events**.

Das legt fest, was ein Linksklick auf den Namen eines Spielers in der Spielerliste bewirkt. Zur Auswahl stehen:

- **Queue events**: lädt die eingereihten Änderungen dieses Spielers.
- **Switch camera to**: lässt dich dem Spieler zuschauen.
- **Open profile**: öffnet das Forumsprofil des Spielers.
- **Delete all vehicles**: löscht alle Fahrzeuge des Spielers in deinem Spiel.
- **Queue deleted vehicles**: reiht die Fahrzeuge des Spielers ein, die du gelöscht hast.
- **Copy name**: kopiert den Namen des Spielers.

Ein Rechtsklick auf einen Namen öffnet immer ein Menü mit allen diesen Aktionen.
:::

## Spieler {#players}

::: details Show Player names on license plates
Standard: an.

Wenn aktiviert, zeigt das Nummernschild des Fahrzeugs eines anderen Spielers den Namen dieses Spielers an.

Wenn deaktiviert, ändert BeamMP den Text auf dem Nummernschild nicht.
:::

:::: details Fade out vehicles as they get closer
Standard: aus.

Wenn aktiviert, werden die Fahrzeuge anderer Spieler ausgeblendet, je näher sie kommen. Ab 20 m Entfernung sind sie vollständig sichtbar und an deiner Position vollständig durchsichtig. Das funktioniert nur, solange Namensschilder angezeigt werden.

Wenn deaktiviert, bleiben die Fahrzeuge anderer Spieler bei jeder Entfernung vollständig sichtbar.

::: info
Das ändert nur das Aussehen des Fahrzeugs, nicht seine Physik. Es ist für die Verwendung mit ausgeschalteten Kollisionen gedacht. Die entsprechende Einstellung des Spiels findest du in den **Gameplay**-Optionen.
:::
::::

::: details Use simplified vehicles when available
Standard: aus.

Wenn aktiviert, werden die Fahrzeuge anderer Spieler durch die vereinfachten Verkehrsversionen von BeamNG.drive ersetzt, sofern es für ein Fahrzeug eine gibt. Das verringert die Genauigkeit von Kollisionen und Optik und verbessert die Leistung.

Wenn deaktiviert, verwendet das Spiel die Fahrzeugmodelle, die der andere Spieler gewählt hat.
:::

## Erweitert {#advanced}

::: details Enable vehicle position smoothing
Standard: aus.

Wenn aktiviert, glättet BeamMP die Positionsdaten von Spielern mit einer instabilen Verbindung. Das verringert das Springen von Fahrzeugen und Rubber-Banding.

Wenn deaktiviert, aktualisiert BeamMP die Fahrzeugpositionen so, wie sie eintreffen.
:::

:::: details Show network activity in the console
Standard: aus.

Wenn aktiviert, wird die Netzwerkaktivität von BeamMP in der Konsole angezeigt.

Wenn deaktiviert, zeigt die Konsole sie nicht an.

::: danger
Die Konsolenausgabe wird auch in die Logdateien geschrieben. Ist die Einstellung aktiviert, können sie innerhalb weniger Minuten auf mehrere hundert Megabyte anwachsen.
:::
::::

:::: details Launcher port
Standard: 4444.

Das ist der Port, den das Spiel für die Kommunikation mit dem Launcher verwendet. Ändere ihn nur, wenn Port 4444 nicht verwendet werden kann. Setze `Port` in der `Launcher.cfg` auf dieselbe Zahl.

::: tip
Der Port, den du eingibst, ist der erste von zwei. Das Spiel verwendet auch den nächsten Port: bei 4444 ist das 4445. Der erste überträgt die zentralen Netzwerkpakete und der zweite die Spiel-Netzwerkpakete.
:::
::::

## Das Chat-Fenster {#the-chat-window}

Wenn **New chat menu** aktiviert ist, ist der Chat ein ImGui-Fenster mit eigenen Einstellungen. Klicke auf das Zahnrad-Symbol in der Titelleiste des Fensters, um sie zu öffnen. Sie haben zwei Reiter, jeweils mit den Buttons **Reset to default** und **Save**. Die Einstellungen werden in `settings/BeamMP/chat.json` gespeichert.

::: details General tab
**Inactive fade**: standardmäßig an. Wenn aktiviert, wird das Fenster ausgeblendet, wenn du es nicht benutzt.

**Fade time**: standardmäßig 2,5 s, mindestens 0,1 s. Wie lange das Fenster wartet, bevor es ausgeblendet wird.

**Fade when collapsed**: standardmäßig aus. Wenn aktiviert, wird das Fenster auch ausgeblendet, wenn es eingeklappt ist.

**Show on message**: standardmäßig an. Wenn aktiviert, erscheint das Fenster wieder, wenn eine Nachricht eintrifft.

**Keep active on Enter**: standardmäßig an. Wenn aktiviert, bleibt der Cursor im Nachrichtenfeld, nachdem du `Enter` gedrückt hast.
:::

::: details Theming tab
Legt die Farben des Fensters fest: **Window Background**, **Button Background**, **Button Hovered**, **Button Active**, **Text Color**, **Primary Color** und **Secondary Color**.
:::

Die Tastenaktionen **Bring to Front** und **Toggle Chat** in den Steuerungseinstellungen lassen das Fenster nach dem Ausblenden wieder erscheinen bzw. blenden es aus.
