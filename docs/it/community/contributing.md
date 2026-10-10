---
description: "Aiuta a migliorare la documentazione di BeamMP: modifica una pagina su GitHub, vedi un'anteprima in locale, segui la guida di stile e scopri cosa succede quando apri una pull request."
---
# Contribuire

Puoi aiutare a migliorare questa documentazione correggendo un errore, aggiungendo qualcosa che manca o scrivendo una pagina. Questa pagina spiega come fare.

## Prima di scrivere

Leggi la [guida di stile](https://github.com/__repo__/blob/main/STYLE_GUIDE.md). Spiega come deve essere scritta una pagina, quando usare ciascun riquadro e come scrivere immagini e link.

Le pagine in inglese sono quelle di riferimento. Modifica la pagina in inglese e le altre lingue seguiranno. Per aiutare con le traduzioni, consulta [Traduzioni](#translating).

## Modifica una pagina su GitHub

È il modo più veloce per correggere errori di ortografia e grammatica e per piccole aggiunte. Richiede una certa conoscenza di Markdown.

1. Clicca su **Edit this page** in fondo alla pagina che vuoi modificare.
2. Fai una fork del progetto sul tuo account GitHub.
3. Fai le tue modifiche.
4. Fai commit delle modifiche sulla tua fork.
5. Apri una pull request su [@repo@](https://github.com/__repo__).

## Anteprima delle modifiche in locale

Per modifiche più ampie, guarda un'anteprima mentre scrivi.

1. Fai una fork del progetto e clona la tua fork.
2. Installa [Node.js](https://nodejs.org) 22 o successivo, poi esegui `npm install`.
3. Esegui `npm run dev` e apri l'indirizzo che viene stampato. La pagina si aggiorna mentre modifichi.
4. Fai le tue modifiche, poi esegui `npm test` e `npm run check`. Il controllo trova link non funzionanti, riquadri non chiusi, immagini mancanti e pagine che non vengono visualizzate.
5. Fai commit sulla tua fork e apri una pull request.

## Cosa succede dopo

Un membro del Mod Team di BeamMP esamina la tua pull request e la approva oppure chiede delle modifiche. Quando hai fatto le modifiche, la esaminiamo di nuovo. Una volta unita con il merge, viene rilasciata automaticamente.

## Traduzioni {#translating}

L'inglese è la versione di riferimento. Le altre lingue hanno le stesse pagine negli stessi percorsi, quindi una modifica parte dalla pagina in inglese.

1. Esegui `npm run check:translations`. Elenca le traduzioni non aggiornate perché la loro pagina in inglese è cambiata.
2. Aggiorna ciascuna partendo dalla pagina in inglese. Mantieni titoli, riquadri, immagini e link, e non tradurre il codice, i comandi, i nomi dei file né le chiavi delle impostazioni.
3. Registra l'aggiornamento: `npm run check:translations -- --record de/players/faq.md`.

Per le impostazioni e i pulsanti del mod, francese e cinese usano le etichette esatte dei file di traduzione del mod. Tedesco, spagnolo, italiano e russo mantengono le etichette in inglese, perché il gioco le mostra in inglese. Le regole complete sono nel [README](https://github.com/__repo__#translations).
