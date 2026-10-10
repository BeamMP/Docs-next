---
description: "Cambia a mano la porta del Launcher di BeamMP quando il Launcher non si connette al gioco: imposta la porta nelle opzioni di BeamNG e in Launcher.cfg."
---
# Cambiare la porta del Launcher

Il Launcher non si connette al gioco? Questa guida spiega come cambiare a mano la porta del Launcher. La porta deve essere la stessa nel gioco e nel Launcher.

La porta predefinita è `4444`. Il Launcher usa questa porta e quella successiva, `4445`, sul tuo computer. Entrambe usano TCP ed entrambe devono essere libere. Se un altro programma ne usa una, il Launcher mostra `bind failed with error`, come elencato in [Codici di errore](/it/troubleshooting/error-codes).

1. Avvia BeamNG.drive.
2. Nel menu principale vai su **Options**, poi su **BeamMP**.
3. Apri il gruppo **Advanced**.
4. In **Launcher port**, cambia il numero con un altro, ad esempio `4567`.
5. Chiudi BeamNG.drive.
6. Fai clic con il tasto destro sul collegamento del Launcher di BeamMP e scegli **Apri percorso file**.
7. Apri `Launcher.cfg` con un editor di testo.
8. Cambia il numero in `"Port": 4444,` con la porta che hai impostato nel gioco, in questo esempio `4567`.
9. Salva il file e chiudi l'editor. Mantieni il file in un JSON valido: se il Launcher non riesce a leggerlo, mostra `Config failed to parse make sure it's valid JSON!` e si chiude.
10. Avvia il Launcher.

Se continua a non connettersi, prova un'altra porta. Usa un numero da 1024 a 65534, perché il Launcher usa anche il numero successivo.

::: tip
Puoi impostare la porta senza modificare `Launcher.cfg`. Avvia il Launcher con `--port 4567`. L'opzione da riga di comando sostituisce il valore in `Launcher.cfg`. Le altre opzioni sono in [Configurazione dell’ambiente di sviluppo](/it/developers/dev-environment-setup#turn-on-dev-mode-in-the-launcher).
:::

## Hai ancora problemi?

Crea un ticket di supporto sul nostro [server Discord](https://discord.gg/BeamMP).
