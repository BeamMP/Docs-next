---
description: "Einen laufenden BeamMP-Server pflegen: die Logdatei des Servers lesen, den Server unter Windows oder Linux aktualisieren und auf neue Versionen prüfen."
---
# Server Wartung

Wie du einen BeamMP-Server pflegst, der bereits läuft: die Logdatei und das Aktualisieren. Die Einstellungen der `ServerConfig.toml` findest du unter [Server-Konfiguration](/de/server-owners/configuration).

## Die Logdatei des Servers

Diese Datei wird erzeugt, wenn der Server läuft. Sie spiegelt die Meldungen wider, die du in der Konsole siehst, wenn du den Server startest. Die Datei heißt `Server.log`. Wenn der Server startet, benennt er das Log des vorherigen Laufs in `Server.old.log` um und ersetzt dabei die ältere `Server.old.log`. Hänge diese Datei jedes Mal an, wenn du Hilfe vom Support-Team brauchst. Sie zeigt niemals deinen AuthKey, daher kannst du sie normalerweise unverändert senden.

Das Format ist wie folgt (das Präfix $ steht für „Variable“, siehe unten):

```
[$DATE $TIME] $CONTEXT [$LOG_LEVEL] $MESSAGE
```

Dabei gilt:

- `$DATE` ist das Datum der Meldung als Tag/Monat/Jahr, zum Beispiel 21/07/21
- `$TIME` ist die Uhrzeit der Meldung, zum Beispiel 11:05:23. Im Debug-Modus werden auch Millisekunden angezeigt, zum Beispiel 11:05:23.142
- `$CONTEXT` (nur im Debug-Modus sichtbar und vor allem für Entwickler relevant) ist der Kontext der Meldung. Das ist entweder:
	- `(Player ID) “Player Name”`, wobei die ID des Spielers für die Moderation nützlich ist
	- Ein Kurzname wie „HeartbeatThread“
- `$LOG_LEVEL` ist eine der Wichtigkeitsstufen einer Meldung:
	- `DEBUG`: Nur im Debug-Modus sichtbar, meist sehr zahlreich und nur für Entwickler wichtig
	- `EVENT`: Nur im Debug-Modus sichtbar, ein Lua-Ereignis, das der Server ausgelöst hat
	- `INFO`: Allgemeine Informationen
	- `LUA`: Meldung eines Lua-Plugins
	- `LUA WARN` und `LUA ERROR`: Eine Warnung oder ein Fehler des Lua-Plugin-Systems, etwa ein Fehler im Code eines Plugins
	- `WARN`: Beschreibt in der Regel etwas, das nicht passieren sollte
	- `ERROR`: Etwas ist ziemlich schiefgelaufen oder war sehr unerwartet
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
2. Lade die Datei für deine Distribution und deinen Prozessortyp herunter. Ihr Name sieht aus wie `BeamMP-Server.debian.12.x86_64`. Lade die `debuginfo`-Dateien nicht herunter. Der Einfachheit halber heißt sie ab jetzt `BeamMP-Server-xxx`, wobei `xxx` für die Version deiner Distribution steht.
3. Nach dem Download solltest du je nach heruntergeladener Version eine Datei namens `BeamMP-Server-xxx` sehen. Wir nennen sie die „neue ausführbare Datei“.
4. Gehe in den Ordner, in dem deine aktuelle ausführbare Datei `BeamMP-Server-xxx` liegt (normalerweise derselbe Ordner wie deine `ServerConfig.toml`). Wir nennen sie die „alte ausführbare Datei“.
5. Ersetze die alte ausführbare Datei durch die neue (zum Beispiel, indem du die neue Datei in den Ordner kopierst oder verschiebst).
6. Öffne in dem Ordner, in dem du gerade die ausführbare Datei ersetzt hast, ein Terminal und führe `sudo chmod +x BeamMP-Server-xxx` aus. Damit stellst du sicher, dass der Server gestartet werden kann.

### Update-Meldungen

Der Server aktualisiert sich nicht selbst. Er prüft beim Start, ob es eine neuere Version gibt, und gibt eine Meldung aus, wenn das der Fall ist. Die Meldung wird im Abstand von `UpdateReminderTime` erneut ausgegeben, es sei denn, `ImScaredOfUpdates` ist `true`, was der Standardwert ist. Beide Einstellungen stehen in der [Server-Konfiguration](/de/server-owners/configuration#the-misc-section). Ein Hosting-Anbieter kann die Meldung ersetzen: siehe die Anbieter-Einstellungen im [Server Handbuch](/de/server-owners/manual#provider-settings).

Um per Skript auf eine neue Version zu prüfen, kannst du die GitHub-API nach der neuesten Version fragen, indem du die Version des Servers mit den Tags vergleichst. Die Tags erhältst du per GET-Anfrage an `https://api.github.com/repos/BeamMP/BeamMP-Server/git/refs/tags`.
