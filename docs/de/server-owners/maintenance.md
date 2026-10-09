---
description: "Einen laufenden BeamMP-Server pflegen: die Logdatei des Servers lesen, den Server unter Windows oder Linux aktualisieren und auf neue Versionen prüfen."
---
# Server Wartung

Wie du einen BeamMP-Server pflegst, der bereits läuft: die Logdatei und das Aktualisieren. Die Einstellungen der `ServerConfig.toml` findest du unter [Server-Konfiguration](/de/server-owners/configuration).

## Die Logdatei des Servers

Diese Datei wird erzeugt, wenn der Server läuft. Sie spiegelt die Meldungen wider, die du in der Konsole siehst, wenn du den Server startest. Hänge diese Datei jedes Mal an, wenn du Hilfe vom Support-Team brauchst. Sie zeigt niemals deinen AuthKey, daher kannst du sie normalerweise unverändert senden.

Das Format ist wie folgt (das Präfix $ steht für „Variable“, siehe unten):
```
[$DATE $TIME] $CONTEXT [$LOG_LEVEL] $MESSAGE
```
Dabei gilt:

- `$DATE` ist das Datum der Meldung, zum Beispiel 21/07/2021
- `$TIME` ist die Uhrzeit der Meldung, zum Beispiel 11:05:23
- `$CONTEXT` (nur im Debug-Modus sichtbar und vor allem für Entwickler relevant) ist der Kontext der Meldung. Das ist entweder:
	- `(Player ID) “Player Name”`, wobei die ID des Spielers für die Moderation nützlich ist
	- Ein Kurzname wie „HeartbeatThread“
- `$LOG_LEVEL` ist eine der Wichtigkeitsstufen einer Meldung:
	- `DEBUG`: Nur im Debug-Modus sichtbar, meist sehr zahlreich und nur für Entwickler wichtig
	- `INFO`: Allgemeine Informationen
	- `LUA`: Meldung eines Lua-Plugins
	- `WARN`: Beschreibt in der Regel etwas, das nicht passieren sollte
	- `ERROR`: Etwas ist ziemlich schiefgelaufen oder war sehr unerwartet
	- `FATAL`: Etwas ist passiert, das den Server zum Herunterfahren bringt
- `$MESSAGE` ist die Meldung selbst, meist etwas, das du beachten und verstehen solltest. Manchmal ist sie kryptisch, aber die Faustregel lautet: Solange mit dem Server sichtbar nichts im Argen liegt und es keine ERRORs gibt, ist alles in Ordnung.

## Den Server aktualisieren {#updating-the-server}

### Warum aktualisieren

Wann immer ein neues Update erscheint, solltest du deinen Server aktualisieren. Meist enthält es Fehlerbehebungen sowie Verbesserungen bei Stabilität und Sicherheit, neben den allgemeinen neuen Funktionen und Ähnlichem.

Um Neuigkeiten zu Updates zu erhalten, folge dem „update“-Kanal auf dem Discord-Server, achte im Forum darauf oder schau auf die [GitHub-Releases-Seite](https://github.com/BeamMP/BeamMP-Server/releases) bzw. frag dort nach.

### So aktualisierst du

#### Wenn du einen Hosting-Anbieter nutzt, der Partner von BeamMP ist

Wenn du einen Hosting-Anbieter nutzt, der Partner von BeamMP ist, funktionieren die folgenden Anweisungen wahrscheinlich nicht. Wir empfehlen, auf nähere Informationen deines Hosting-Anbieters zu warten oder ihn um Hilfe zu bitten.

#### Den Server selbst verwalten

Der Server wird aktualisiert, indem du die alte ausführbare Datei durch die neue ersetzt. Wenn du nicht sicher bist, wie das geht, findest du unten Schritt-für-Schritt-Anleitungen für Windows und Linux.

Wenn du den Server aus dem Quellcode erstellt hast, musst du ihn nur neu erstellen. Führe vor dem Neuerstellen `git submodule update --init --recursive` aus.

#### Unter Windows

1. Stelle sicher, dass du die [Visual C++ Redistributables](https://aka.ms/vs/17/release/vc_redist.x64.exe) installiert hast, damit der Server laufen kann.
2. Gehe auf [BeamMP.com](https://beammp.com/) und klicke auf die Schaltfläche „Download Server“.
3. Nach dem Download solltest du eine Datei namens `BeamMP-Server.exe` sehen. Wir nennen sie die „neue ausführbare Datei“.
4. Gehe in den Ordner, in dem deine aktuelle ausführbare Datei `BeamMP-Server.exe` liegt (normalerweise derselbe Ordner wie deine `ServerConfig.toml`). Wir nennen sie die „alte ausführbare Datei“.
5. Ersetze die alte ausführbare Datei durch die neue (zum Beispiel, indem du die neue Datei in den Ordner kopierst oder verschiebst).

#### Unter Linux

1. Gehe auf [BeamMP.com](https://beammp.com/) und klicke auf die Schaltfläche „Download Server“. Du wirst zur GitHub-Release-Seite des Servers weitergeleitet.
2. Lade die richtige Version für deine Distribution herunter. Der Einfachheit halber heißt sie ab jetzt `BeamMP-Server-xxx`, wobei `xxx` für die Version deiner Distribution steht.
3. Nach dem Download solltest du je nach heruntergeladener Version eine Datei namens `BeamMP-Server-xxx` sehen. Wir nennen sie die „neue ausführbare Datei“.
4. Gehe in den Ordner, in dem deine aktuelle ausführbare Datei `BeamMP-Server-xxx` liegt (normalerweise derselbe Ordner wie deine `ServerConfig.toml`). Wir nennen sie die „alte ausführbare Datei“.
5. Ersetze die alte ausführbare Datei durch die neue (zum Beispiel, indem du die neue Datei in den Ordner kopierst oder verschiebst).
6. Öffne in dem Ordner, in dem du gerade die ausführbare Datei ersetzt hast, ein Terminal und führe `sudo chmod +x BeamMP-Server-xxx` aus. Damit stellst du sicher, dass der Server gestartet werden kann.

### Automatische Updates

Der Server unterstützt (noch) keine automatischen Updates oder Update-Benachrichtigungen.

Du kannst aber die GitHub-API nach der neuesten Version fragen, indem du die Version des Servers mit den Tags vergleichst. Die Tags erhältst du per GET-Anfrage an `https://api.github.com/repos/BeamMP/BeamMP-Server/git/refs/tags`.
