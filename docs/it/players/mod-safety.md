---
description: "L'avviso sulla sicurezza delle mod, perché le mod locali possono impedire a BeamMP di funzionare e quattro soluzioni ai problemi causati dalle mod."
---
# Sicurezza mod

I server BeamMP possono inviare mod al tuo gioco. Questa pagina spiega l'avviso che vedi prima che succeda, perché le mod locali possono impedire a BeamMP di funzionare e come risolvere.

## L'avviso sulla sicurezza delle mod {#the-mod-security-warning}

Quando ti connetti a un server che ha delle mod, BeamMP mostra la finestra **Server Mods Detected** prima di scaricare qualsiasi cosa. Ti avvisa che:

- le mod del server vengono scaricate e installate automaticamente.
- le mod possono contenere codice che viene eseguito sul tuo PC, e quel codice potrebbe essere dannoso.
- devi fidarti dei proprietari del server prima di continuare, e continui a tuo rischio.
- BeamMP non è responsabile dei contenuti che un server invia.

Clicca su **Download & Join** per scaricare le mod ed entrare. Clicca su **Cancel & Return** per non entrare nel server.

Se ti fidi dei server a cui ti connetti, puoi disattivare l'avviso con **Skip the mod security warning popup**, come descritto in [Impostazioni multigiocatore](/it/players/multiplayer-settings). Un server senza mod non mostra mai l'avviso.

## Perché devo disattivare o rimuovere le mie mod?

In BeamMP è il server a cui ti connetti a fornire le mod necessarie. Vengono scaricate e attivate automaticamente al momento della connessione e vengono rimosse di nuovo dal gioco quando esci.

Durante una sessione, BeamMP disattiva ogni mod che il server non ha inviato. Le eccezioni sono `multiplayerbeammp`, `beammp` e `translations`. Le mod locali possono comunque causare problemi, anche se ne hai una sola oltre a BeamMP, ad esempio quando modificano i file del gioco. Quando lasci un server che ha inviato delle mod, il gioco ricarica il suo Lua.

Ci sono quattro modi per risolvere i problemi causati dalle mod quando usi BeamMP.

### Disattiva le mod

Prima di entrare in un server qualsiasi, assicurati di non avere attiva nessuna mod oltre a `multiplayerbeammp`. Se questo metodo non funziona, ad esempio il gioco si blocca o mostra una schermata nera, oppure hai ancora problemi, prova la soluzione successiva.

### Crea una nuova cartella utente

In questo modo il gioco ottiene una cartella utente pulita.

1. Chiudi BeamNG.drive.
2. Apri il launcher di BeamNG e clicca su **Manage User Folder**, poi su **Open user folder**.
3. Rinomina la cartella `current`, ad esempio in `current_old`.

![I tre passaggi: Manage User Folder nel launcher di BeamNG, Open user folder, poi la rinomina della cartella current](../../assets/content/new-userfolder.png)

Al prossimo avvio il gioco crea una nuova cartella utente, pulita.

::: warning Le mie impostazioni e configurazioni sono sparite! Come le ripristino?
Se hai rinominato la cartella utente, hai costretto il gioco a creare una nuova cartella utente pulita. Puoi copiare le cartelle `settings` e `vehicles` dalla cartella che hai rinominato (ad esempio `current_old`) nella nuova cartella.
Assicurati che BeamNG.drive sia chiuso e sostituisci tutti gli elementi nella cartella in cui copi. A questo punto dovresti avere di nuovo tutte le configurazioni e le impostazioni com'erano prima.
:::

::: warning Fai attenzione quando rimetti i file nella nuova cartella utente.
Se hai risolto i problemi rinominando la cartella utente, rimettere i vecchi file potrebbe far ricomparire i problemi.
:::

Quando hai finito, avvia BeamNG.drive tramite il Launcher di BeamMP. `multiplayerbeammp` dovrebbe essere l'unica mod attiva in **Repository** > **Mods Manager**, e il menu **More...** dovrebbe avere la voce **BeamMP**.
Se hai ancora problemi a entrare in un server con mod, è probabile che quel server invii mod difettose o non aggiornate.

### Svuota la cache del Launcher

Il Launcher conserva in una cache le mod che ha scaricato. Per svuotarla, apri la cartella in cui è installato il Launcher di BeamMP. La cache è la cartella `Resources` al suo interno. Se `Launcher.cfg` ha una voce `CachingDirectory`, la cache si trova invece in quella cartella.

Elimina la cartella per cancellare tutte le mod in cache. Può essere utile se ti serve più spazio sul disco o se vuoi eliminare le mod non aggiornate. Il Launcher scarica di nuovo le mod la prossima volta che entri in un server che le richiede.

### Rimuovi le mod dalla cartella content

Se hai messo delle mod nella cartella `content`, devi rimuoverle. Apri la cartella di installazione di BeamNG.drive, fai clic destro sulla cartella `content` ed eliminala. Poi verifica i file del gioco tramite Steam o Epic Games. In questo modo vengono scaricati di nuovo i file di base.

::: quote DO_NOT_INSTALL_MODS_HERE.txt
Do NOT copy mods into this folder: it can lead to broken mods, slower installation of updates, a broken mod manager, broken Safe Mode and others.
:::
