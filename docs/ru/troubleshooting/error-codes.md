---
description: "Что означают коды ошибок и сообщения в окне лаунчера BeamMP, например 10060, 10048 или Failed to find the game, и как исправить каждую из них."
---
# Коды ошибок

На этой странице перечислены коды ошибок и сообщения, которые может показать лаунчер, и что делать в каждом случае. Сообщения приведены для лаунчера v2.8.1. Об ошибках в окне сервера см. [Коды ошибок сервера](/ru/server-owners/error-codes).

Всё, что показывает лаунчер, он также записывает в файл `Launcher.log` в папке, где лежит лаунчер. При каждом запуске лаунчера этот файл начинается заново, поэтому в нём хранится только последний запуск. Если лаунчер сразу закрывается, прочитайте этот файл.

## Сетевые коды

Число после `error:` или `Error code:` — это код сокета Windows. В Linux вместо него указан системный номер ошибки.

| Windows (Linux) | Описание | Возможное решение |
|---|---|---|
| 10048 (98) | `bind failed with error`: порт лаунчера или следующий за ним уже занят чем-то другим. Порты по умолчанию — `4444` и `4445` | Запускайте только один лаунчер одновременно и перезагрузите компьютер. Если порты использует другая программа, [измените порт лаунчера](/ru/troubleshooting/launcher-port). В Linux это также происходит, когда вы заходите на второй сервер: закройте игру и лаунчер и запустите их снова |
| 10060, 10061 (110, 111) | `Client: connect failed! Error code`: ни один сервер не ответил по указанному IP-адресу и порту | Если вы владелец сервера, проверьте переадресацию портов и правила брандмауэра, описанные на странице [Запуск сервера](/ru/server-owners/host-a-server). Если вы не владелец, выберите другой сервер или свяжитесь с владельцем |
| 10054 (104) | Соединение сброшено удалённой стороной | Сервер, к которому вы были подключены, отключился или перезапустился. Повторите попытку позже |
| 10038 | `(Game) send failed with error`: лаунчер попытался отправить данные игре после того, как игра отключилась. Это сообщение показывает лаунчер v2.8.0 | Обновите лаунчер до последней версии |
| `DNS lookup failed! on` и далее имя | Лаунчер не смог найти адрес сервера по введённому вами имени | Проверьте имя. Используйте вместо него IP-адрес сервера |

## Запуск игры

| Сообщение | Описание | Возможное решение |
|---|---|---|
| `Failed to find the game please launch it. Report this if the issue persists code 3` | Windows. Файл `%LocalAppData%\BeamNG\BeamNG.Drive.ini` существует, но лаунчер не может его прочитать | Один раз запустите BeamNG.drive, чтобы он заново записал этот файл |
| `... code 4` | Windows. `installPath` в `BeamNG.Drive.ini` указывает на несуществующую папку | Один раз запустите BeamNG.drive из его текущей папки или исправьте `installPath` в файле |
| `... code 5` | Windows. В `BeamNG.Drive.ini` нет `installPath` | Один раз запустите BeamNG.drive |
| `... code 6` | Windows. Файла `BeamNG.Drive.ini` нет, а в разделе реестра `HKEY_CURRENT_USER\Software\BeamNG\BeamNG.drive` нет значения `rootpath` | Один раз запустите BeamNG.drive |
| `... code 7` | Windows. Файла `BeamNG.Drive.ini` нет, и раздела реестра `HKEY_CURRENT_USER\Software\BeamNG\BeamNG.drive` не существует | Один раз запустите BeamNG.drive |
| `Unsupported Steam installation.` | Linux. Ни в одной из известных лаунчеру папок Steam нет папки `steamapps` | Список папок см. в разделе [Прежде чем начать](/ru/get-started/install-beammp#before-you-start). Свяжите свою папку с одной из них |
| `libraryfolders.vdf is missing.` | Linux. В папке Steam нет файла `libraryfolders.vdf` | Один раз запустите Steam и повторите попытку |
| `The game directory was not found.` | Linux. BeamNG.drive не находится ни в одной библиотеке Steam из списка в `libraryfolders.vdf` | Установите BeamNG.drive через Steam |
| `Failed to Launch the game! launcher closing soon` | Лаунчеру не удалось запустить `BeamNG.drive.exe` (Windows) или `BinLinux/BeamNG.drive.x64` (Linux) в папке игры. В Windows далее следуют код и текст ошибки Windows | Проверьте целостность файлов игры в Steam и один раз запустите игру, прежде чем запускать лаунчер |
| `Game Closed! launcher closing soon` | Игра завершилась. Лаунчер закрывается через 5 секунд | Это нормально, когда вы закрываете игру. Если игра закрылась сама, снова запустите лаунчер |
| `We were unable to clean the multiplayer mods folder! Is the game still running or do you have something open in that folder?` | При запуске лаунчер очищает папку `mods/multiplayer` в пользовательской папке игры, и сделать это не удалось | Закройте игру и все программы, которые используют эту папку, затем снова запустите лаунчер |

## Собственные файлы лаунчера

| Сообщение | Описание | Возможное решение |
|---|---|---|
| `logger file init failed!` | Лаунчер не может создать `Launcher.log` в своей папке | Переместите лаунчер в папку, в которую можно записывать |
| `Config failed to parse make sure it's valid JSON!` | `Launcher.cfg` не является корректным JSON. Лаунчер закрывается | Исправьте файл или удалите его. Лаунчер создаст новый с настройками по умолчанию |
| `Failed to open Launcher.cfg!`, `Failed to write config on disk!` | Лаунчер не может прочитать или создать `Launcher.cfg` в папке, из которой запущен | Запустите его из папки, в которую можно записывать |
| `Failed to create caching directory` | Лаунчер не может создать папку кэша модов; это `Resources`, если только вы не задали `CachingDirectory` в `Launcher.cfg` | Задайте в `CachingDirectory` папку, в которую можно записывать |
| `Exception in main()` | Критическая ошибка. Лаунчер закрывается через 5 секунд | Прочитайте текст после неё и задайте вопрос на [форуме](https://forum.beammp.com) или на [сервере Discord](https://discord.gg/beammp) |

## Обновления и серверы BeamMP

| Сообщение | Описание | Возможное решение |
|---|---|---|
| `Failed to download the launcher update! Please try manually updating it` | Windows. Лаунчеру не удалось скачать своё обновление | См. [Проблемы обновления лаунчера](/ru/troubleshooting/launcher-update) |
| `The authenticity of the updated launcher could not be verified, it was corrupted or tampered with.` | Windows. У скачанного обновления нет действительной подписи, поэтому лаунчер его удалил | Скачайте лаунчер со [страницы релизов на GitHub](https://github.com/BeamMP/BeamMP-Launcher/releases/latest), как описано в разделе [Проблемы обновления лаунчера](/ru/troubleshooting/launcher-update) |
| `Auto update is NOT implemented for the Linux version.` | Linux. Существует более новый лаунчер | Пересоберите лаунчер: см. [Обновление лаунчера в Linux](/ru/get-started/install-beammp#update-the-launcher-on-linux) |
| `GET to ... failed` или `POST to ... failed`, затем `Curl error` | Лаунчеру не удалось связаться с сервером BeamMP. Текст после этого указывает причину, например тайм-аут или ошибку сертификата | Проверьте подключение к интернету и правила брандмауэра. Если с вашей стороны проблем нет, загляните в [канал обновлений BeamMP](<https://discord.com/channels/601558901657305098/697596153943949352>) на нашем сервере Discord |
| `Invalid hash from backend, skipping update check.` | Бэкенд BeamMP не дал корректного ответа. Лаунчер пропускает проверку и продолжает работу | Проверьте подключение к интернету и правила брандмауэра |
| `Failed to communicate with the auth system!` | Сервер входа в аккаунт не ответил | Проверьте подключение к интернету и правила брандмауэра, затем повторите попытку |
| `Invalid answer from authentication servers, please try again later!` | Сервер входа в аккаунт дал ответ, который лаунчер не может прочитать | Повторите попытку позже |

## Моды

| Сообщение | Описание | Возможное решение |
|---|---|---|
| `Mod '...' is protected and therefore must be placed in the Resources/Caching folder manually here:` и далее путь | Сервер использует защищённый мод, который лаунчер не скачивает | Получите файл у его автора и поместите в папку, указанную в сообщении, сохранив имя файла |
| `Server cannot find` и далее имя файла | У сервера нет файла мода, который он перечислил | Сообщите об этом владельцу сервера |
| `Failed to write or download the entire file ... (hash mismatch)` | Файл мода скачался некорректно | Подключитесь снова. Лаунчер заново проверит файл и скачает его ещё раз |
| `Failed copy to the mods folder!` | Лаунчеру не удалось скопировать мод в папку игры `mods/multiplayer` | Закройте игру и все программы, которые используют эту папку, затем подключитесь снова |
