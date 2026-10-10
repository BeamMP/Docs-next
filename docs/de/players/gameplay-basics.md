---
description: "Was du in BeamMP siehst und tun kannst: Serverliste, Sitzungsleiste, Spielerliste, Namensschilder, Chat, Fahrzeuge anderer Spieler, Ereigniswarteschlange und instabile Fahrzeuge."
---
# Gameplay-Grundlagen

Diese Seite erklärt, was an BeamNG.drive anders ist, wenn du auf einem BeamMP-Server spielst. Die Einstellungen zu den einzelnen Bereichen findest du unter [Einstellungen anpassen](/de/players/multiplayer-settings).

## Die Serverliste

Nach der Anmeldung öffnet sich das BeamMP-Menü mit der Serverliste. Mit den Buttons links legst du fest, was die Liste zeigt:

- **Public Servers**: alle Server. Die offiziellen Server stehen zuerst.
- **Official Servers**, **Featured Servers** und **Partner Servers**: nur Server mit diesem Status.
- **Favorites**: die Server, die du mit **Add Favorite** hinzugefügt hast.
- **Recent**: die letzten 50 Server, mit denen du dich verbunden hast, der neueste zuerst. **Clear Recents** leert die Liste.
- **Direct Connect**: verbinde dich über die Adresse mit einem Server.

So findest du einen Server:

- Gib im Suchfeld etwas ein, um nach Servernamen zu suchen.
- Klicke auf eine Spaltenüberschrift (**Location**, **Title**, **Map** oder **Players**), um zu sortieren. Klicke erneut, um die Reihenfolge umzukehren.
- Mit **Search Filters** grenzt du die Liste nach Spielerzahl (**Empty only**, **Not empty**, **Not full** oder mit **Advanced Player Count** ein Minimum und Maximum), **Total Mod Size**, Tags, Serverversionen, Serverstandorten und Karten ein. Ist **Match all filters** aktiviert, muss ein Server alle Tags haben, die du auswählst. **Reset Filters** setzt die Filter zurück.
- Klicke auf **Refresh**, um die Liste neu zu laden.

Klicke auf einen Server, um seine Details zu sehen: den Besitzer, die Karte, die Beschreibung, die Tags, die Spieler auf dem Server und seine Mods mit ihrer **Total Filesize:**. Mit **Connect** trittst du dem Server bei. **Add Favorite** und **Remove Favorite** ändern deine Favoriten.

Gib unter **Direct Connect** die **Server IP** und den **Server Port** ein oder klicke auf **Paste from Clipboard**, um eine Adresse in der Form `ip:port` einzufügen. Wenn du beides leer lässt, verwendet BeamMP `127.0.0.1` und den Port `30814`. Mit **Connect** trittst du dem Server bei, und **Save as Favorite** fügt ihn zu deinen Favoriten hinzu.

Während du dich verbindest, zeigt **Connecting to server…** den Fortschritt an, einschließlich jedes Mods, der heruntergeladen wird. Klicke auf **Cancel**, um abzubrechen. Wenn der Server Mods hat, siehst du zuerst die Mod-Sicherheitswarnung, die unter [Mod-Sicherheit](/de/players/mod-safety#the-mod-security-warning) beschrieben ist.

## Die Sitzungsleiste

In einer Sitzung zeigt die HUD-App **BeamMP Session** oben am Bildschirm den Servernamen, die Anzahl der **Players**, deinen **Ping** in ms und einen Button **Leave** an. Mit **Leave** trennst du die Verbindung und kehrst zum Hauptmenü zurück. Der Button **Events queued** erscheint, wenn Änderungen auf das Laden warten, wie unter [Die Ereigniswarteschlange](#the-event-queue) beschrieben.

Das Pausenmenü hat außerdem einen Reiter **BeamMP**. **Player List** zeigt jeden Spieler mit seinem Ping sowie Buttons, um einen Namen zu kopieren und das Profil des Spielers zu öffnen. **Server Details** zeigt die Informationen des Servers an. Die Serveradresse bleibt verborgen, bis du auf **Reveal** klickst.

Wenn der Server dich entfernt, zeigt eine Meldung den Grund an, mit **Return to menu** und **Continue offline**.

## Die Spielerliste

Die HUD-App **BeamMP Player List** zeigt den Namen und den Ping jedes Spielers an. Sie ist verborgen, bis du auf ihren Pfeil-Button (**<** oder **>**) klickst, und derselbe Button blendet sie wieder aus. **↔** und **↕** verschieben die Liste innerhalb ihres Rahmens seitwärts und nach oben oder unten. Wenn **Show the player ID's** aktiviert ist, hat sie außerdem eine Spalte mit der ID jedes Spielers. Ein Spieler mit eingereihten Änderungen wird hervorgehoben, wenn **Highlight queued players** aktiviert ist.

Hat ein Spieler eine Rolle, folgt auf seinen Namen ein Rollen-Tag, zum Beispiel `[EA]`. Die Rollen-Tags sind unter [Namensschilder](#nametags) beschrieben.

Ein Klick auf einen Namen führt die Aktion aus, die du unter **Playerlist left click action** gewählt hast. Standard ist **Queue events**. Ein Rechtsklick auf einen Namen öffnet ein Menü mit diesen Aktionen:

- **Copy name**
- **Delete all vehicles**: löscht die Fahrzeuge des Spielers in deinem Spiel.
- **Queue events**
- **Switch camera to**: lässt dich dem Spieler zuschauen.
- **Open profile**: öffnet das Forumsprofil des Spielers.
- **Queue deleted vehicles**: holt die Fahrzeuge dieses Spielers zurück, die du gelöscht hast.

Mods können diesem Menü eigene Buttons hinzufügen.

## Namensschilder {#nametags}

Jeder Spieler hat ein Namensschild über seinem Fahrzeug. Es enthält das Rollen-Tag und optional die Entfernung sowie die Namen der Spieler, die dem Fahrzeug zuschauen. Du kannst Namensschilder ausblenden, sie je nach Entfernung ausblenden lassen und die Entfernung anzeigen. Die Tastenaktion **Player Nametags** blendet alle Namensschilder aus und wieder ein.

Die Rolle des BeamMP-Kontos eines Spielers bestimmt das Tag:

| Tag | Kurzform |
|---|---|
| `[Early Access]` | `[EA]` |
| `[Contributor]` | `[CO]` |
| `[Content Creator]` | `[CC]` |
| `[Events Team]` | `[Events]` |
| `[Support]` | `[Staff]` |
| `[BeamMP Staff]` | `[Staff]` |
| `[Moderator]` | `[Mod]` |
| `[Admin]` | `[Adm]` |
| `[BeamMP Dev]` | `[Dev]` |
| `[BeamNG Developer]`, `[BeamNG Staff]`, `[BeamNG Affiliate]` | `[BNG]` |

Spieler ohne Rolle haben kein Tag. Ein Server kann einem Spieler oder einem Fahrzeug auch ein eigenes Tag geben.

## Chat

Der Chat befindet sich standardmäßig in der HUD-App **BeamMP Chat**. Gib im Feld etwas ein und sende es mit **Send**. Eine Nachricht kann bis zu 500 Zeichen lang sein. Drücke im Feld `↑`, um deine letzte Nachricht zurückzuholen. Nachrichten verblassen nach ein paar Sekunden und erscheinen wieder, wenn du die Maus über den Chat bewegst. **↔** und **↕** verschieben den Chat.

Ist **New chat menu** aktiviert, befindet sich der Chat in einem eigenen Fenster, das du aus dem Spiel herausziehen kannst. Die Einstellungen dazu findest du unter [Das Chat-Fenster](/de/players/multiplayer-settings#the-chat-window).

## Fahrzeuge anderer Spieler

- Die Fahrzeuge anderer Spieler erscheinen in deinem Spiel, und ihre Teileänderungen werden mit dir synchronisiert. Deine eigenen Teileänderungen werden etwa 15 Sekunden nach deiner letzten Änderung automatisch an andere Spieler gesendet, wenn **Enable automatic part sync** aktiviert ist.
- Beim Wechseln zwischen Fahrzeugen kannst du die Fahrzeuge anderer Spieler überspringen. Aktiviere dafür **Disable switching to other players vehicles**. Die Einräder anderer Spieler werden immer übersprungen.
- Wenn du von deinem Einrad zum Fahrzeug eines anderen Spielers wechselst, geht die Kamera in eine Beifahrerperspektive.
- Ein Fahrzeug, das bei dir noch nicht gespawnt ist, wird als farbige Kugel angezeigt, die man Blob nennt. Siehe [Blobs](/de/players/multiplayer-settings#blobs).
- Wenn ein Spieler ein Fahrzeug spawnt, das einen Mod verwendet, den du nicht hast, überspringt BeamMP es und zeigt eine Meldung an. Das Fahrzeug bleibt ein Blob.
- Ist **Show Player names on license plates** aktiviert, zeigt ein Nummernschild den Namen des Spielers an, dem das Fahrzeug gehört.
- Um deinen Aufbau zu schützen, aktiviere **Enable Config Cloning Protection**. Andere Spieler können dein Fahrzeug dann weder klonen noch speichern. Sie sehen **Vehicle Clone Error** oder **Vehicle Save Error**.

## Die Ereigniswarteschlange {#the-event-queue}

Wenn ein anderer Spieler ein Fahrzeug spawnt oder bearbeitet, kann dein Spiel die Änderung in eine Warteschlange einreihen, statt sie sofort zu laden, damit das Laden deine Fahrt nicht unterbricht. Eine Meldung teilt dir mit, dass eine Änderung eingereiht ist, und in der Sitzungsleiste erscheint der Button **Events queued**. Er zeigt die Anzahl der wartenden Spawns und dann die Anzahl der wartenden Änderungen an, zum Beispiel `2|1`.

Eingereihte Änderungen werden geladen, wenn du:

- auf **Events queued** klickst.
- die Taste drückst, die du **Queue Events** zugewiesen hast.
- auf den Namen eines Spielers klickst oder in seinem Menü **Queue events** auswählst. Dadurch werden nur die Änderungen dieses Spielers geladen.

Sie werden außerdem automatisch geladen, wenn du lange genug langsam gefahren bist, und sofort, wenn du kein Fahrzeug hast. Siehe [die Einstellungen zur Ereigniswarteschlange](/de/players/multiplayer-settings#event-queue).

## Instabile Fahrzeuge

Physik-Instabilitäten pausieren das Spiel in einer Sitzung nicht. Stattdessen setzt BeamMP die Physik eines instabilen Fahrzeugs zurück. Das gilt für jedes Fahrzeug in der Sitzung, deines oder das eines anderen Spielers.

Wenn dasselbe Fahrzeug immer wieder instabil wird, schaltet BeamMP es kurz ab und zeigt eine Warnung an, danach schaltet es das Fahrzeug wieder ein. Ein Fahrzeug, das danach weiterhin instabil wird, wird gelöscht, und eine Meldung weist darauf hin. Um das Fahrzeug eines anderen Spielers zurückzuholen, klicke in der Spielerliste mit der rechten Maustaste auf den Spieler und wähle **Queue deleted vehicles**.

## Tastenaktionen

In den Steuerungseinstellungen hat die Kategorie **BeamMP** diese Aktionen. Weise ihnen die Tasten zu, die du möchtest:

| Aktion | Was sie bewirkt |
|---|---|
| **Bring to Front** | Zeigt das Chat-Fenster wieder an, nachdem es verblasst ist |
| **Player Nametags** | Zeigt alle Namensschilder an oder blendet sie aus |
| **Queue Events** | Lädt alle eingereihten Änderungen |
| **Toggle Chat** | Zeigt das Chat-Fenster an oder blendet es aus |

## Server mit Mods

Wenn du dich mit einem Server verbindest, der Mods hat, zeigt BeamMP zuerst eine Mod-Sicherheitswarnung an. Lies [Mod-Sicherheit](/de/players/mod-safety), bevor du sie akzeptierst.
