---
description: "Обновите лаунчер BeamMP вручную, если он не может обновиться сам или показывает пустой экран: скачайте последнюю версию в Windows или пересоберите лаунчер в Linux."
---
# Проблемы обновления лаунчера

Лаунчер не может обновиться или показывает пустой экран? Это руководство объясняет, как обновить его вручную.

В Windows прежде чем следовать ему, вы должны были уже установить BeamMP с помощью установщика с [нашего сайта](https://beammp.com).

## Как обновляется лаунчер

В Windows лаунчер при каждом запуске проверяет на `backend.beammp.com`, нет ли новой версии. Если она есть, он скачивает её, проверяет подпись и сохраняет старый файл под именем `BeamMP-Launcher.back` в той же папке. Затем он перезапускается. Лаунчер пропускает эту проверку, если запустить его с `--no-update` или `--dev`.

Если обновление не удалось, лаунчер показывает одно из этих сообщений:

- `Failed to download the launcher update! Please try manually updating it`
- `The authenticity of the updated launcher could not be verified, it was corrupted or tampered with.`

Проверьте подключение к интернету, а также брандмауэр или антивирус, как описано в разделе [Исключения Defender / брандмауэра](/ru/troubleshooting/defender-exclusions). Затем обновите лаунчер вручную.

В Linux лаунчер никогда не обновляется сам. Вместо шагов ниже следуйте инструкции [Обновление лаунчера в Linux](/ru/get-started/install-beammp#update-the-launcher-on-linux).

## Установка нового лаунчера

1. Скачайте последнюю версию лаунчера напрямую с [GitHub](https://github.com/BeamMP/BeamMP-Launcher/releases/latest/download/BeamMP-Launcher.exe).
2. Закройте лаунчер.
3. Перейдите в папку, где находится `BeamMP-Launcher.exe`. По умолчанию это `C:\Users\<username>\AppData\Roaming\BeamMP-Launcher`. Замените `<username>` на ваше имя пользователя Windows. Если вы установили BeamMP в другое место, например `D:\BeamMP-Launcher`, используйте эту папку.
4. Замените имеющийся лаунчер в папке BeamMP-Launcher новым.
5. Запустите лаунчер как обычно и убедитесь, что он работает.

## Проблема остаётся?

Создайте обращение в поддержку на нашем [сервере Discord](https://discord.gg/BeamMP).
