---
description: "Установите BeamMP на Windows с помощью установщика или соберите лаунчер BeamMP самостоятельно в Linux, с Proton или без него."
---
# Установка BeamMP

Вам нужен лаунчер BeamMP. В Windows его устанавливает установщик. В Linux его нужно собрать самостоятельно.

::: warning
BeamMP не работает с пиратскими и устаревшими копиями BeamNG.drive.
:::

## Установка в Windows

1. Перейдите на [beammp.com](https://beammp.com/) и нажмите **Скачать сейчас**.
2. Запустите `BeamMP_Installer.exe` и следуйте инструкциям.
3. На рабочем столе появится значок лаунчера BeamMP. Если его нет, введите «BeamMP» в строку поиска Windows.

Далее: [подключитесь к первому серверу](/ru/get-started/join-first-server).

## Установка в Linux {#install-on-linux}

Установщика для Linux пока нет, поэтому лаунчер нужно собрать самостоятельно. Для этого необходимо базовое понимание того, как собираются приложения.

### Установка инструментов сборки

Установите базовые инструменты разработки. В большинстве систем они входят в состав пакета:

| Система | Команда |
|---|---|
| Debian, Ubuntu | `sudo apt install build-essential` |
| Fedora | `sudo dnf install cmake gcc gcc-c++ make perl perl-IPC-Cmd perl-FindBin perl-File-Compare perl-File-Copy kernel-headers kernel-devel` |
| Arch | `sudo pacman -S base-devel` |
| openSUSE | `zypper in -t pattern devel-basis` |
| SteamOS (Arch) | `sudo pacman -S base-devel linux-api-headers glibc libconfig` |

::: info SteamOS
Перед установкой пакетов выполните `sudo steamos-readonly disable`, а после установки включите защиту обратно.
:::

### Получение vcpkg

Склонируйте `vcpkg`, выполните его начальную сборку (bootstrap) и добавьте в `PATH`:

1. Склонируйте его:
   ```bash
   git clone https://github.com/microsoft/vcpkg.git
   ```
2. Выполните начальную сборку:
   ```bash
   ./vcpkg/bootstrap-vcpkg.sh
   ```
3. Добавьте его в `PATH`:
   ```bash
   export VCPKG_ROOT="$(pwd)/vcpkg"
   export PATH=$VCPKG_ROOT:$PATH
   ```
### Сборка лаунчера {#build-the-launcher}

1. Склонируйте репозиторий [BeamMP-Launcher](https://github.com/BeamMP/BeamMP-Launcher), затем перейдите в него:
   ```bash
   git clone https://github.com/BeamMP/BeamMP-Launcher.git
   cd BeamMP-Launcher
   ```
   Если вы раньше не клонировали репозитории, прочитайте руководство GitHub по [клонированию репозитория](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository).

2. Переключитесь на тег [последнего релиза](https://github.com/BeamMP/BeamMP-Launcher/releases/latest). Если последний релиз — `v2.8.0`, выполните:
   ```bash
   git checkout v2.8.0
   ```
3. В корневом каталоге проекта настройте сборку:
   ```bash
   cmake . -B bin -DCMAKE_TOOLCHAIN_FILE=$VCPKG_ROOT/scripts/buildsystems/vcpkg.cmake -DVCPKG_TARGET_TRIPLET=x64-linux
   ```
4. Выполните сборку:
   ```bash
   cmake --build bin --parallel
   ```
5. Переместите готовое приложение из `bin` в отдельную папку и запускайте его оттуда:
   ```bash
   mkdir -p ~/beammp-launcher
   cp bin/BeamMP-Launcher ~/beammp-launcher/
   cd ~/beammp-launcher
   ./BeamMP-Launcher
   ```
Нативный лаунчер для Linux запускается и работает с нативной версией BeamNG.drive для Linux.

::: tip Не хватает оперативной памяти?
Не указывайте `--parallel`. Тогда сборка будет использовать один поток процессора и меньше оперативной памяти.
:::

::: info Отладочная сборка
Без `-DCMAKE_BUILD_TYPE=Release` вы соберёте отладочную версию. Она больше по размеру, но в ней нет ошибки, из-за которой лаунчер может подключиться к серверу только один раз.
:::

::: details Fedora: vcpkg завершается с ошибкой при сборке OpenSSL
Если vcpkg завершается с ошибками заголовков ядра во время сборки OpenSSL, убедитесь, что установлены все зависимости:
```bash
sudo dnf install kernel-headers kernel-devel gcc gcc-c++ make perl
```
Затем очистите кэш vcpkg и снова выполните команду настройки:
```bash
rm -rf $VCPKG_ROOT/buildtrees/openssl
```
:::

### Использование BeamNG.drive через Proton

Нативный лаунчер для Linux можно использовать с BeamNG.drive, запущенной через Proton.

1. Запустите лаунчер с аргументом `--no-launch`, чтобы он не запускал нативную версию BeamNG.drive для Linux. Другие аргументы лаунчера описаны на странице [Настройка среды разработки](/ru/developers/dev-environment-setup).
2. Сделайте так, чтобы игра под Proton использовала пользовательскую папку игры для Linux, потому что нативный лаунчер записывает данные только в неё. Для этого подойдёт символическая ссылка:
   1. Найдите пользовательскую папку BeamNG.drive для Linux, обычно `~/.local/share/BeamNG/BeamNG.drive`, и переименуйте её, например в `BeamNG.drive_old`.
   2. Найдите пользовательскую папку BeamNG.drive под Proton, обычно `~/.local/share/Steam/steamapps/compatdata/284160/pfx/drive_c/users/steamuser/AppData/Local/BeamNG/BeamNG.drive`.
   3. Свяжите их:
      ```bash
      ln -s ~/.local/share/Steam/steamapps/compatdata/284160/pfx/drive_c/users/steamuser/AppData/Local/BeamNG/BeamNG.drive ~/.local/share/BeamNG
      ```
3. В Steam откройте **Свойства** игры и замените параметры запуска на:
   ```bash
   ~/BeamMP/BeamMP-Launcher --no-launch & %command% ; killall BeamMP-Launcher
   ```
   После этого Steam будет запускать лаунчер вместе с игрой.

Замените `~/BeamMP/` на папку, в которую вы поместили собранный лаунчер. Каждый раз, когда выходит новый релиз лаунчера, его нужно заново собирать из нужного тега git.

::: tip Эмодзи в названиях и чате
Чтобы эмодзи отображались в названиях серверов в списке серверов и во внутриигровом чате, нужен шрифт с их поддержкой. Один из вариантов — [порт шрифта эмодзи Segoe UI из Windows для Linux](https://github.com/mrbvrz/segoe-ui-linux).
:::

### Обновление лаунчера в Linux

1. Перейдите в папку лаунчера и загрузите новые теги:
   ```bash
   export VCPKG_ROOT="$(pwd)/vcpkg"
   cd BeamMP-Launcher
   git fetch --tags
   ```
2. Переключитесь на тег [последнего релиза](https://github.com/BeamMP/BeamMP-Launcher/releases/latest), как описано в разделе [Сборка лаунчера](#build-the-launcher).
3. Соберите его заново и скопируйте в папку с лаунчером:
   ```bash
   cmake . -B bin -DCMAKE_TOOLCHAIN_FILE=$VCPKG_ROOT/scripts/buildsystems/vcpkg.cmake -DVCPKG_TARGET_TRIPLET=x64-linux
   cmake --build bin --parallel
   cp bin/BeamMP-Launcher ~/beammp-launcher/
   cd ~/beammp-launcher
   ./BeamMP-Launcher
   ```
Далее: [подключитесь к первому серверу](/ru/get-started/join-first-server).
