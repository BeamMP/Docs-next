---
description: "Perché le mod locali possono impedire a BeamMP di funzionare e quattro modi per risolvere: disattivare le mod, creare una nuova cartella utente, svuotare la cache del Launcher, pulire la cartella content."
---
# Sicurezza mod

BeamMP può smettere di funzionare quando hai delle mod locali installate. Questa pagina spiega perché succede e come risolvere.

## Perché devo disattivare o rimuovere le mie mod?

In BeamMP è il server a cui decidi di connetterti a fornire le mod necessarie. Vengono scaricate e attivate automaticamente al momento della connessione.
Avere mod locali installate e attive spesso impedisce a BeamMP di funzionare correttamente, anche se hai una sola mod in più oltre a BeamMP.


Ci sono quattro modi per risolvere i problemi causati dalle mod quando usi BeamMP.

### Disattiva le mod
Prima di entrare in un server, assicurati di non avere attiva nessuna mod oltre a 'multiplayerbeammp'.
Se questo metodo non funziona, ad esempio il gioco si blocca / mostra una schermata nera, oppure hai ancora problemi, prova la soluzione successiva.

### Crea una nuova cartella utente

In questo modo il gioco ottiene una cartella utente pulita.

1. Chiudi BeamNG.drive.
2. Apri il launcher di BeamNG e clicca su **Manage User Folder**, poi su **Open user folder**.
3. Rinomina la cartella `current`, ad esempio in `current_old`.

![I tre passaggi: Manage User Folder nel launcher di BeamNG, Open user folder, poi la rinomina della cartella current](../../assets/content/new-userfolder.png)

Al prossimo avvio il gioco crea una nuova cartella utente, pulita.

::: warning Le mie impostazioni e configurazioni sono sparite! Come le ripristino?
Se hai rinominato la cartella utente, hai costretto il gioco a creare una nuova cartella utente pulita. Puoi copiare le cartelle 'settings' e 'vehicles' dalla cartella che hai rinominato (ad esempio `current_old`) nella nuova cartella creata dal gioco.
Assicurati che BeamNG.drive sia chiuso e sostituisci tutti gli elementi nella destinazione in cui copi le cartelle. A questo punto dovresti avere di nuovo tutte le configurazioni e le impostazioni com'erano prima.
:::

::: warning Fai attenzione quando rimetti file/cartelle nella nuova cartella utente.
Se hai risolto dei problemi rinominando la cartella utente, rimettere i vecchi file potrebbe far ricomparire i problemi che avevi.
:::



Quando hai finito, avvia BeamNG.drive tramite il Launcher di BeamMP: nel repository dovresti avere 'multiplayerbeammp' come unica mod attiva, oltre al pulsante nel menu principale per entrare in BeamMP.
Se hai ancora problemi a entrare in un server con mod, è probabile che quel server fornisca mod difettose o non aggiornate.

### Svuota la cache del Launcher
Per ripulire le mod in cache dalle cartelle di BeamMP, vai nella cartella in cui hai installato il Launcher di BeamMP. Per impostazione predefinita il percorso è 'C:\Users\AppData\BeamMP-Launcher\'. Al suo interno trovi una cartella 'Resources'.
Eliminala per cancellare tutte le mod in cache. Può essere utile se ti serve più spazio sul disco o se vuoi eliminare le mod di BeamNG non aggiornate.

### Rimuovi le mod dalla cartella content
Se hai messo delle mod nella cartella content, devi rimuoverle.
Per accedere alla cartella Beamng.drive\content\ e ripulirla da tutte le mod, apri la cartella in cui è installato BeamNG.drive.
Fai clic destro sulla cartella `content` ed eliminala. Poi verifica i file del gioco tramite Steam o Epic Games. In questo modo vengono scaricati di nuovo i file di base.

::: quote DO_NOT_INSTALL_MODS_HERE.txt
Do NOT copy mods into this folder: it can lead to broken mods, slower installation of updates, a broken mod manager, broken Safe Mode and others.
:::
