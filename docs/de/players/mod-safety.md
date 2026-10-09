---
description: "Warum lokale Mods BeamMP lahmlegen können und vier Wege zur Lösung: Mods deaktivieren, neuen Benutzerordner anlegen, Launcher-Cache leeren, content-Ordner bereinigen."
---
# Mod-Sicherheit

BeamMP kann aufhören zu funktionieren, wenn lokale Mods installiert sind. Diese Seite erklärt, warum das so ist und wie du es behebst.

## Warum muss ich meine Mods deaktivieren oder entfernen?

Bei BeamMP stellt der Server, mit dem du dich verbindest, die nötigen Mods bereit. Sie werden beim Verbinden automatisch heruntergeladen und aktiviert.
Lokal installierte und aktive Mods führen oft dazu, dass BeamMP nicht richtig funktioniert, selbst wenn du neben BeamMP nur einen einzigen zusätzlichen Mod hast.


Es gibt vier Wege, Probleme zu beheben, die Mods bei der Nutzung von BeamMP verursachen.

### Mods deaktivieren
Stelle vor dem Beitritt zu einem Server sicher, dass außer „multiplayerbeammp“ keine Mods aktiviert sind.
Wenn das nicht hilft, zum Beispiel weil das Spiel einfriert oder einen schwarzen Bildschirm zeigt, oder du weiterhin Probleme hast, probiere die nächste Lösung.

### Einen neuen Benutzerordner anlegen

Dadurch bekommt das Spiel einen sauberen Benutzerordner.

1. Schließe BeamNG.drive.
2. Öffne den BeamNG-Launcher und klicke auf **Manage User Folder** und dann auf **Open user folder**.
3. Benenne den Ordner `current` um, zum Beispiel in `current_old`.

![Die drei Schritte: Manage User Folder im BeamNG-Launcher, Open user folder, dann das Umbenennen des Ordners current](../../assets/content/new-userfolder.png)

Beim nächsten Start legt das Spiel nun einen neuen, sauberen Benutzerordner an.

::: warning Meine Einstellungen und Konfigurationen sind weg! Wie kann ich sie wiederherstellen?
Wenn du den Benutzerordner umbenannt hast, hast du das Spiel gezwungen, einen neuen, sauberen Benutzerordner anzulegen. Du kannst die Ordner „settings“ und „vehicles“ aus dem umbenannten Ordner (z. B. `current_old`) in den neu angelegten Ordner kopieren.
Stelle sicher, dass BeamNG.drive geschlossen ist, und ersetze alle Elemente am Zielort der kopierten Ordner. Danach solltest du alle Konfigurationen und Einstellungen wieder so haben wie vorher.
:::

::: warning Sei vorsichtig, wenn du Dateien oder Ordner in den neuen Benutzerordner zurückkopierst.
Wenn du Probleme durch das Umbenennen des Benutzerordners gelöst hast, können sie durch das Zurückkopieren der alten Dateien möglicherweise wieder auftreten.
:::



Starte BeamNG.drive anschließend über den BeamMP-Launcher. Im Repository solltest du dann „multiplayerbeammp“ als einzigen aktivierten Mod sehen und im Hauptmenü den Button zum Öffnen von BeamMP haben.
Wenn du dich weiterhin nicht mit einem Server mit Mods verbinden kannst, stellt er wahrscheinlich defekte oder veraltete Mods bereit.

### Den Launcher-Cache leeren
Um zwischengespeicherte Mods aus den BeamMP-Verzeichnissen zu entfernen, gehe zum Installationsort deines BeamMP-Launchers. Standardmäßig lautet der Pfad „C:\Users\AppData\BeamMP-Launcher\“. Dort findest du einen Ordner „Resources“.
Lösche den Ordner, um alle zwischengespeicherten Mods zu löschen. Das kann hilfreich sein, wenn du mehr Speicherplatz brauchst oder veraltete BeamNG-Mods loswerden möchtest.

### Mods aus dem content-Ordner entfernen
Wenn du Mods im Ordner content abgelegt hast, solltest du sie entfernen.
Um den Ordner Beamng.drive\content\ aufzurufen und alle Mods daraus zu entfernen, öffne den Installationsort von BeamNG.drive.
Klicke mit der rechten Maustaste auf den Ordner `content` und lösche ihn. Überprüfe danach die Spieldateien über Steam oder Epic Games. Dadurch werden die Basisdateien erneut heruntergeladen.

::: quote DO_NOT_INSTALL_MODS_HERE.txt
Kopiere KEINE Mods in diesen Ordner: Das kann zu defekten Mods, einer langsameren Installation von Updates, einem defekten Mod-Manager, einem defekten abgesicherten Modus und anderen Problemen führen.
:::
