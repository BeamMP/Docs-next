---
description: "Die Mod-Sicherheitswarnung, warum lokale Mods BeamMP lahmlegen können und vier Wege zur Lösung von Problemen, die durch Mods verursacht werden."
---
# Mod-Sicherheit

BeamMP-Server können Mods an dein Spiel senden. Diese Seite erklärt die Warnung, die du davor siehst, warum lokale Mods BeamMP lahmlegen können und wie du das behebst.

## Die Mod-Sicherheitswarnung {#the-mod-security-warning}

Wenn du dich mit einem Server verbindest, der Mods hat, zeigt BeamMP das Fenster **Server Mods Detected** an, bevor etwas heruntergeladen wird. Es teilt dir Folgendes mit:

- Die Mods des Servers werden automatisch heruntergeladen und installiert.
- Mods können Code enthalten, der auf deinem PC ausgeführt wird, und dieser Code könnte schädlich sein.
- Du musst den Serverbetreibern vertrauen, bevor du fortfährst, und du fährst auf eigenes Risiko fort.
- BeamMP ist nicht für die Inhalte verantwortlich, die ein Server sendet.

Klicke auf **Download & Join**, um die Mods herunterzuladen und beizutreten. Klicke auf **Cancel & Return**, um dem Server fernzubleiben.

Wenn du den Servern, denen du beitrittst, vertraust, kannst du die Warnung mit **Skip the mod security warning popup** ausschalten, wie unter [Einstellungen anpassen](/de/players/multiplayer-settings) beschrieben. Ein Server ohne Mods zeigt die Warnung nie an.

## Warum muss ich meine Mods deaktivieren oder entfernen?

Bei BeamMP stellt der Server, mit dem du dich verbindest, die nötigen Mods bereit. Sie werden beim Verbinden automatisch heruntergeladen und aktiviert und beim Verlassen wieder aus dem Spiel entfernt.

Während einer Sitzung deaktiviert BeamMP jeden Mod, den der Server nicht gesendet hat. Ausgenommen sind `multiplayerbeammp`, `beammp` und `translations`. Lokale Mods können trotzdem Probleme verursachen, selbst wenn du neben BeamMP nur einen einzigen hast, zum Beispiel wenn sie Spieldateien verändern. Wenn du einen Server verlässt, der Mods gesendet hat, lädt das Spiel sein Lua neu.

Es gibt vier Wege, Probleme zu beheben, die Mods bei der Nutzung von BeamMP verursachen.

### Mods deaktivieren

Stelle vor dem Beitritt zu einem Server sicher, dass außer `multiplayerbeammp` keine Mods aktiviert sind. Wenn das nicht hilft, zum Beispiel weil das Spiel einfriert oder einen schwarzen Bildschirm zeigt, oder du weiterhin Probleme hast, probiere die nächste Lösung.

### Einen neuen Benutzerordner anlegen

Dadurch bekommt das Spiel einen sauberen Benutzerordner.

1. Schließe BeamNG.drive.
2. Öffne den BeamNG-Launcher und klicke auf **Manage User Folder** und dann auf **Open user folder**.
3. Benenne den Ordner `current` um, zum Beispiel in `current_old`.

![Die drei Schritte: Manage User Folder im BeamNG-Launcher, Open user folder, dann das Umbenennen des Ordners current](../../assets/content/new-userfolder.png)

Beim nächsten Start legt das Spiel nun einen neuen, sauberen Benutzerordner an.

::: warning Meine Einstellungen und Konfigurationen sind weg! Wie kann ich sie wiederherstellen?
Wenn du den Benutzerordner umbenannt hast, hast du das Spiel gezwungen, einen neuen, sauberen Benutzerordner anzulegen. Du kannst die Ordner `settings` und `vehicles` aus dem umbenannten Ordner (z. B. `current_old`) in den neu angelegten Ordner kopieren.
Stelle sicher, dass BeamNG.drive geschlossen ist, und ersetze alle Elemente am Zielort der kopierten Ordner. Danach solltest du alle Konfigurationen und Einstellungen wieder so haben wie vorher.
:::

::: warning Sei vorsichtig, wenn du Dateien oder Ordner in den neuen Benutzerordner zurückkopierst.
Wenn du Probleme durch das Umbenennen des Benutzerordners gelöst hast, können sie durch das Zurückkopieren der alten Dateien möglicherweise wieder auftreten.
:::

Starte BeamNG.drive anschließend über den BeamMP-Launcher. `multiplayerbeammp` sollte dann der einzige aktive Mod unter **Repositorium** > **Mods-Manager** sein, und das Menü **Mehr …** sollte den Eintrag **BeamMP** haben.
Wenn du dich weiterhin nicht mit einem Server mit Mods verbinden kannst, stellt er wahrscheinlich defekte oder veraltete Mods bereit.

### Den Launcher-Cache leeren

Der Launcher speichert die Mods, die er heruntergeladen hat, in einem Cache. Um ihn zu leeren, öffne den Ordner, in dem der BeamMP-Launcher installiert ist. Der Cache ist der Ordner `Resources` darin. Wenn die `Launcher.cfg` einen Eintrag `CachingDirectory` enthält, liegt der Cache stattdessen in diesem Ordner.

Lösche den Ordner, um alle zwischengespeicherten Mods zu löschen. Das hilft, wenn du mehr Speicherplatz brauchst oder veraltete Mods loswerden möchtest. Der Launcher lädt die Mods beim nächsten Beitritt zu einem Server, der sie braucht, erneut herunter.

### Mods aus dem content-Ordner entfernen

Wenn du Mods im Ordner `content` abgelegt hast, entferne sie. Öffne den Installationsordner von BeamNG.drive, klicke mit der rechten Maustaste auf den Ordner `content` und lösche ihn. Überprüfe danach die Spieldateien über Steam oder Epic Games. Dadurch werden die Basisdateien erneut heruntergeladen.

::: quote DO_NOT_INSTALL_MODS_HERE.txt
Kopiere KEINE Mods in diesen Ordner: Das kann zu defekten Mods, einer langsameren Installation von Updates, einem defekten Mod-Manager, einem defekten abgesicherten Modus und anderen Problemen führen.
:::
