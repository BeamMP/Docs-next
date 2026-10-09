---
description: "Alle BeamMP-Multiplayer-Einstellungen erklärt: Allgemeines, die Ereigniswarteschlange, das Standard-Einrad, Blobs, Namensschilder und der Launcher-Port."
---
# Einstellungen anpassen

Das sind die Einstellungen auf der Multiplayer-Einstellungsseite von BeamMP. Jede ist ein eingeklappter Eintrag: Öffne ihn, um zu sehen, was sie bewirkt, wenn sie an oder aus ist. Wenn du neu bist, beginne mit [Multiplayer-Einstellungen für den ersten Start](/de/get-started/multiplayer-settings-quickstart).

## Allgemeines

::: details Show advanced options
Wenn aktiviert, siehst du alle Multiplayer-Einstellungen

Wenn deaktiviert, siehst du nur die grundlegenden Multiplayer-Einstellungen
:::

::: details Enable config cloning protection
Wenn aktiviert, ist die Konfiguration deines gespawnten Fahrzeugs davor geschützt, von anderen Spielern gespeichert zu werden

Wenn deaktiviert, kann die Konfiguration deines gespawnten Fahrzeugs von anderen Spielern gespeichert werden
:::

:::: details Disable pausing caused by instabilities
Wenn aktiviert, lösen Physik-Instabilitäten keine Pause in deinem Spiel aus

Wenn deaktiviert, lösen Physik-Instabilitäten eine Pause in deinem Spiel aus

::: note
Es wird empfohlen, die Einstellung deaktiviert zu lassen, da wiederholte Instabilitäten das Spiel zum Absturz bringen können
:::
::::

::: details Use simplified vehicles when available
Wenn aktiviert, ersetzt das Spiel die Fahrzeuge anderer Spieler durch ihre vereinfachten Versionen (aus dem KI-Verkehr), sofern vorhanden

Wenn deaktiviert, verwendet das Spiel die vorgesehenen Fahrzeugmodelle
:::

:::: details New chat menu
Wenn aktiviert, wird der Ingame-Chat in einem [IMGUI](https://github.com/ocornut/imgui)-Fenster angezeigt, das du zum Beispiel aus dem Spiel heraus auf einen anderen Monitor ziehen kannst

Wenn deaktiviert, wird der Ingame-Chat in der UI-App angezeigt

::: note
Das Herausziehen von IMGUI-Fenstern aus dem Hauptfenster des Spiels kann Leistungsprobleme verursachen und Bildschirmaufnahme-Software dazu bringen, statt des Hauptfensters des Spiels das Chat-Fenster aufzunehmen
:::
::::

::: details Enable vehicle position smoothing
Wenn aktiviert, verwendet BeamMP einen Algorithmus, der Fahrzeugpositions-Updates in regelmäßigen Abständen glättet. Das kann bei Spielern mit hohem Ping oder bei einer Verbindung mit vielen verlorenen Paketen hilfreich sein

Wenn deaktiviert, aktualisiert BeamMP die Fahrzeugpositionen so, wie sie empfangen werden
:::

::: details Skip the mod security warning popups
Wenn aktiviert, wird das Mod-Sicherheits-Popup beim Verbinden mit einem Server mit Mods nicht angezeigt

Wenn deaktiviert, wird das Mod-Sicherheits-Popup jedes Mal angezeigt, wenn du dich mit einem Server mit Mods verbindest
:::

::: details Enable player vehicle update/edit queuing
Wenn aktiviert, werden die Fahrzeug-Spawns und -Änderungen anderer Spieler in eine Warteschlange eingereiht. Details findest du im Abschnitt [Ereigniswarteschlange](#event-queue)

Wenn deaktiviert, werden die Fahrzeug-Spawns und -Änderungen anderer Spieler sofort vom Spiel geladen
:::

::: details Enable automatic part sync
Wenn aktiviert, werden die Teile deiner Fahrzeuge nach ein paar Sekunden automatisch mit anderen Spielern synchronisiert

Wenn deaktiviert, musst du in der Teileauswahl auf den Button für die Teile-Synchronisierung klicken, um die Synchronisierung an andere Spieler zu senden
:::

::: details Disable switching to other players' vehicles
Wenn aktiviert, überspringt das Durchschalten der Fahrzeuge mit Tab die Fahrzeuge anderer Spieler

Wenn deaktiviert, schaltet das Durchschalten mit Tab durch jedes gespawnte Fahrzeug
:::

:::: details Fade out vehicles as they get closer
Wenn aktiviert, werden andere Fahrzeuge ausgeblendet, je näher sie kommen

Wenn deaktiviert, bleiben andere Fahrzeuge unabhängig von der Entfernung vollständig sichtbar

::: note
Das betrifft nur das sichtbare 3D-Mesh eines Fahrzeugs, nicht sein Physik-Node-Beam-Mesh. Um auch die Physik zu deaktivieren, musst du in den Gameplay-Einstellungen `Simplified collision physics` aktivieren
:::
::::

::: details Show the player IDs
Wenn aktiviert, hat die Ingame-Spielerliste eine zusätzliche Spalte mit der ID jedes Spielers. Nützlich für die Entwicklung oder Moderation

Wenn deaktiviert, zeigt die Ingame-Spielerliste nur die Spalten für Spielername und Ping
:::

::: details Allow the serverlist to refresh ingame
Wenn aktiviert, wird die Serverliste während des Spielens in regelmäßigen Abständen aktualisiert. Das kann Lag-Spitzen verursachen

Wenn deaktiviert, wird die Serverliste nur aktualisiert, wenn du das Hauptmenü öffnest
:::

## Ereigniswarteschlange {#event-queue}

::: details Highlight queued players
Wenn aktiviert, werden Spieler mit einem eingereihten Ereignis in der Ingame-Spielerliste hervorgehoben

Wenn deaktiviert, werden Spieler nicht einzeln hervorgehoben
:::

::: details Apply vehicle changes with
Bei `Left mouse button` lädt ein Klick mit der linken Maustaste auf den Namen eines Spielers in der Spielerliste die eingereihten Ereignisse. Ein Klick mit der rechten Maustaste lässt dich diesem Spieler zuschauen

Bei `Right mouse button` lädt ein Klick mit der rechten Maustaste auf den Namen eines Spielers in der Spielerliste die eingereihten Ereignisse. Ein Klick mit der linken Maustaste lässt dich diesem Spieler zuschauen
:::

::: details Automatically apply queued vehicle changes
Wenn aktiviert, werden die eingereihten Ereignisse automatisch geladen, sobald du für die als Timeout festgelegte Zeitspanne unter der Geschwindigkeitsschwelle geblieben bist

Wenn deaktiviert, werden die eingereihten Ereignisse nur manuell geladen, indem du entweder auf den Button `Events` oben am Bildschirm oder auf den Namen eines Spielers in der Spielerliste klickst
:::

::: details Queue apply speed threshold
Diese Einstellung legt die Geschwindigkeitsschwelle für das automatische Laden der Ereigniswarteschlange fest. Dein Fahrzeug muss länger als `Queue apply timeout` langsamer als dieser Wert sein, damit die eingereihten Ereignisse geladen werden
:::

::: details Queue apply timeout
Diese Einstellung legt die Zeitverzögerung für das automatische Laden der Ereigniswarteschlange fest. Dein Fahrzeug muss für diese Zeit langsamer als `Queue apply speed threshold` sein, damit die eingereihten Ereignisse geladen werden
:::

::: details Skip queue if spectating others
Wenn aktiviert, wird ein Ereignis sofort geladen, wenn du einem anderen Spieler zuschaust

Wenn deaktiviert, wird ein Ereignis eingereiht, genau wie wenn du dein eigenes Fahrzeug steuerst
:::

::: details Don't queue Unicycles (Snowmen/Beamlings)
Wenn aktiviert, wird ein Ereignis, das einen Schneemann bzw. ein Beamling betrifft, sofort geladen

Wenn deaktiviert, werden Schneemänner bzw. Beamlings genau wie andere Fahrzeuge eingereiht
:::

## Standard-Einrad

::: details Default Unicycle config
Diese Einstellung legt fest, welche Einrad-Variante standardmäßig geladen wird. Du kannst zwischen vorgefertigten Konfigurationen und deinen eigenen wählen, falls du eigene Einrad-Konfigurationen gespeichert hast
:::

::: details Automatically save your last used Unicycle
Wenn aktiviert, wird dein zuletzt verwendetes Einrad automatisch gespeichert und wieder geladen, sobald du es erneut spawnst

Wenn deaktiviert, wird jedes Mal deine Standard-Einrad-Konfiguration gespawnt
:::

## Blobs

::: details Enable blobs for unspawned vehicles
Wenn aktiviert, siehst du anstelle eines nicht gespawnten Fahrzeugs eine Platzhalterkugel, einen sogenannten Blob

Wenn deaktiviert, ist ein nicht gespawntes Fahrzeug unsichtbar
:::

:::: details Tune colors
::: details Visible
Wenn aktiviert, wird ein Blob in der unten angegebenen Farbe gezeichnet

Wenn deaktiviert, wird für die angegebene Funktion kein Blob gezeichnet
:::

::: details RGB HEX values
Queued vehicle: Die Farbe, die ein Blob verwendet, wenn ein Fahrzeug zum Spawnen eingereiht ist. Standardwert #FF6400

Illegal vehicle: Die Farbe, die ein Blob verwendet, wenn ein Fahrzeug unzulässig ist, zum Beispiel durch einen Mod, der von außen eingeschleust wurde. Standardwert #000000

Deleted vehicle: Die Farbe, die ein Blob verwendet, wenn ein Fahrzeug vom Benutzer gelöscht wurde. Standardwert #333333
:::
::::

## Namensschilder

::: details Hide player nametags
Wenn aktiviert, werden die Namensschilder der Spieler nicht gezeichnet

Wenn deaktiviert, werden die Namensschilder der Spieler entsprechend der relativen Position ihrer Fahrzeuge gezeichnet
:::

::: details Show distance from other players
Wenn aktiviert, steht vor dem Namensschild die Entfernung zum jeweiligen Fahrzeug

Wenn deaktiviert, wird keine zusätzliche Entfernung im Namensschild angezeigt
:::

::: details Fade nametags in/out
Wenn aktiviert, wird ein Namensschild entsprechend `Fade distance` und `Invert nametag fade direction` ein- oder ausgeblendet

Wenn deaktiviert, wird ein Namensschild unabhängig von der Entfernung zum jeweiligen Fahrzeug mit der Standard-Deckkraft gezeichnet
:::

:::: details Fade distance/Invert nametag fade direction
::: details Fade out
Namensschilder werden weniger sichtbar, je weiter ein Spieler entfernt ist

`Fade distance` legt die Entfernung fest, bei der ein Namensschild mit minimaler Deckkraft gezeichnet wird
:::

::: details Fade in
Namensschilder werden besser sichtbar, je weiter ein Spieler entfernt ist

`Fade distance` legt die Entfernung fest, bei der ein Namensschild mit maximaler Deckkraft gezeichnet wird
:::
::::

::: details Don't fully hide nametags
Wenn aktiviert, kann ein Namensschild nicht vollständig unsichtbar werden, sondern behält unabhängig von der Entfernung eine minimale Deckkraft

Wenn deaktiviert, können Namensschilder vollständig unsichtbar werden
:::

::: details Shorten nametag and role tags
Wenn aktiviert, kürzt `Nametag length limit` Namensschilder und Rollen auf die festgelegte Anzahl von Zeichen

Wenn deaktiviert, werden Namensschilder und Rollen-Tags in voller Länge angezeigt
:::

::: details Show spectators' nametag under vehicle nametags
Wenn aktiviert, wird der Name eines Zuschauers unter dem Namensschild eines Spielers angefügt

Wenn deaktiviert, werden keine Namen von Zuschauern zu den Namensschildern hinzugefügt
:::

::: details Same color for spectator nametags
Wenn aktiviert, hat der Name eines Zuschauers immer einen grauen Hintergrund

Wenn deaktiviert, hat der Name eines Zuschauers einen farbigen Hintergrund, der die Rolle des Zuschauers widerspiegelt
:::

## Weitere Einstellungen

:::: details Show network activity in the console
Wenn aktiviert, wird die Netzwerkaktivität von BeamMP in der Konsole angezeigt

Wenn deaktiviert, wird keine weitere Netzwerkaktivität in der Konsole angezeigt

::: danger
Sei vorsichtig mit dieser Einstellung, denn die gesamte Konsolenausgabe wird auch in die Logdateien geschrieben

Wenn die Einstellung aktiviert ist, können sie innerhalb weniger Minuten auf mehrere hundert MB anwachsen
:::
::::

:::: details Launcher port
Diese Einstellung legt den Port fest, der für die Kommunikation mit dem Launcher verwendet wird

Sollte nur geändert werden, wenn der Standardport 4444 nicht verwendet werden kann

Vergiss nicht, ihn auch auf der Launcher-Seite zu ändern, indem du die `launcher.cfg` anpasst

::: tip
Der angegebene Port ist nur der erste von zwei Ports. Der zweite verwendete Port folgt direkt darauf, also Port + 1

Der erste Port überträgt zentrale Netzwerkpakete, der zweite Spiel-Netzwerkpakete, beide über TCP
:::
::::
