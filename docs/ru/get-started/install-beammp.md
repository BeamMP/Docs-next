---
description: "Установите BeamMP в Windows с помощью установщика или соберите лаунчер BeamMP самостоятельно в Linux: для нативной игры или для BeamNG.drive через Proton."
---
# Установка BeamMP

Вам нужен лаунчер BeamMP. В Windows его устанавливает установщик. В Linux его нужно собрать самостоятельно. Лаунчера для macOS нет.

::: warning
BeamMP не работает с пиратскими и устаревшими копиями BeamNG.drive.
:::

## Установка в Windows

1. Перейдите на [beammp.com](https://beammp.com/) и нажмите **Скачать сейчас**.
2. Запустите `BeamMP_Installer.exe` и следуйте инструкциям. Оставьте отмеченным пункт **Create a desktop shortcut**, если хотите, чтобы на рабочем столе появился значок.
3. Запустите лаунчер BeamMP с помощью значка на рабочем столе. Если значка нет, введите «BeamMP-Launcher» в строку поиска Windows.

Установщику не нужны права администратора. По умолчанию он помещает лаунчер в `%AppData%\BeamMP-Launcher`. Лаунчер обновляется сам при запуске. Если не получается, см. [Проблемы обновления лаунчера](/ru/troubleshooting/launcher-update).

Далее: [подключитесь к первому серверу](/ru/get-started/join-first-server).

## Установка в Linux {#install-on-linux}

Установщика или файла для скачивания для Linux нет, поэтому лаунчер нужно собрать самостоятельно. Для этого необходимо базовое понимание того, как собираются приложения.

### Прежде чем начать {#before-you-start}

- Установите BeamNG.drive через Steam. Лаунчер находит игру только через Steam. Он ищет её в этих папках внутри вашей домашней папки: `.steam/root/steamapps`, `.steam/steam/steamapps`, `.var/app/com.valvesoftware.Steam/.steam/root/steamapps` (Flatpak) и `snap/steam/common/.local/share/Steam/steamapps` (Snap). Игра должна находиться в библиотеке Steam, которая указана в `libraryfolders.vdf`.
- Лаунчер читает и записывает пользовательскую папку игры `~/.local/share/BeamNG/BeamNG.drive/current/`. Параметр `--user-path` в Linux не действует.
- Вам нужен компилятор с поддержкой C++20 и `std::format`, например GCC 13 или новее.

Если лаунчер не может найти игру, он показывает `Unsupported Steam installation.`, `libraryfolders.vdf is missing.` или `The game directory was not found.`. См. [Коды ошибок](/ru/troubleshooting/error-codes).

::: warning
В Linux подключение ко второму серверу после выхода с первого может не удаваться. Тогда в окне лаунчера появляется `(Proxy) bind failed with error: 98` или `Connection still alive terminating`. Закройте игру и лаунчер и запустите их снова. Ни в одном релизе лаунчера до v2.8.1 включительно это не исправлено.
:::

### Установка инструментов сборки

Установите базовые инструменты разработки. В большинстве систем они входят в состав пакета:

| Система | Команда |
|---|---|
| Debian, Ubuntu | `sudo apt install build-essential` |
| Fedora | `sudo dnf install cmake gcc gcc-c++ make perl perl-IPC-Cmd perl-FindBin perl-File-Compare perl-File-Copy kernel-headers kernel-devel` |
| Arch | `sudo pacman -S base-devel` |
| openSUSE | `zypper in -t pattern devel-basis` |
| SteamOS (Arch) | `sudo pacman -S base-devel linux-api-headers glibc libconfig` |

Вам также понадобятся `cmake`, `git`, `curl`, `zip`, `unzip`, `tar` и `pkg-config`. Скрипту начальной сборки `vcpkg` нужны `curl`, `zip`, `unzip` и `tar`, а для сборки библиотек `vcpkg` нужен `pkg-config`. Установите те из них, которых нет в вашей системе.

В SteamOS перед установкой пакетов выполните `sudo steamos-readonly disable`, а после установки включите защиту обратно.

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

2. Переключитесь на тег [последнего релиза](https://github.com/BeamMP/BeamMP-Launcher/releases/latest). Если последний релиз — `v2.8.1`, выполните:

   ```bash
   git checkout v2.8.1
   ```

3. В корневом каталоге проекта настройте сборку. `vcpkg` скачивает и собирает библиотеки, перечисленные в `vcpkg.json` (`cpp-httplib`, `nlohmann-json`, `zlib`, `openssl` и `curl`), поэтому в первый раз этот шаг занимает много времени:

   ```bash
   cmake . -B bin -DCMAKE_TOOLCHAIN_FILE=$VCPKG_ROOT/scripts/buildsystems/vcpkg.cmake -DVCPKG_TARGET_TRIPLET=x64-linux
   ```

4. Выполните сборку:

   ```bash
   cmake --build bin --parallel
   ```

   Если во время сборки не хватает оперативной памяти, не указывайте `--parallel`. Тогда сборка будет использовать один поток процессора и меньше оперативной памяти.

5. Переместите готовое приложение из `bin` в отдельную папку и запускайте его оттуда:

   ```bash
   mkdir -p ~/beammp-launcher
   cp bin/BeamMP-Launcher ~/beammp-launcher/
   cd ~/beammp-launcher
   ./BeamMP-Launcher
   ```

Лаунчер создаёт `Launcher.cfg`, кэш модов `Resources` и файл `Launcher.log` в папке, из которой вы его запускаете. Нативный лаунчер для Linux запускает нативную версию BeamNG.drive для Linux из папки игры Steam.

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

1. Запустите лаунчер с аргументом `--no-launch`, чтобы он не запускал нативную версию BeamNG.drive для Linux. Другие аргументы лаунчера описаны на странице [Настройка среды разработки](/ru/developers/dev-environment-setup#turn-on-dev-mode-in-the-launcher).
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

Замените `~/BeamMP/` на папку, в которую вы поместили собранный лаунчер. Лаунчер по-прежнему ищет игру в библиотеке Steam, как описано в разделе [Прежде чем начать](#before-you-start).

::: tip Эмодзи в названиях и чате
Чтобы эмодзи отображались в названиях серверов в списке серверов и во внутриигровом чате, нужен шрифт с их поддержкой. Один из вариантов — [порт шрифта эмодзи Segoe UI из Windows для Linux](https://github.com/mrbvrz/segoe-ui-linux).
:::

### Обновление лаунчера в Linux {#update-the-launcher-on-linux}

Лаунчер для Linux не обновляется сам. Когда существует более новая версия, он показывает `Auto update is NOT implemented for the Linux version. Please update manually ASAP as updates contain security patches.` Пересоберите его из тега самого свежего релиза:

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
