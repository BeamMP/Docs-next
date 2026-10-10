---
description: "在 Windows 上使用安装程序安装 BeamMP，或在 Linux 上自行编译 BeamMP 启动器（配合原生版游戏，或通过 Proton 运行的 BeamNG.drive）。"
---
# 安装 BeamMP

你需要 BeamMP 启动器。在 Windows 上，安装程序会为你完成安装；在 Linux 上，你需要自己编译。macOS 没有对应的启动器。

::: warning
BeamMP 无法在盗版或过时的 BeamNG.drive 上运行。
:::

## 在 Windows 上安装

1. 前往 [beammp.com](https://beammp.com/)，点击 **Download Now**。
2. 运行 `BeamMP_Installer.exe`，并按照提示操作。如果你想在桌面上放一个图标，请保持选中 **Create a desktop shortcut**。
3. 通过桌面图标启动 BeamMP 启动器。如果没有图标，请在 Windows 搜索栏中搜索“BeamMP-Launcher”。

安装程序不需要管理员权限。默认情况下，它会把启动器安装到 `%AppData%\BeamMP-Launcher`。启动器会在启动时自行更新。如果它无法更新，请参阅[启动器更新问题](/zh/troubleshooting/launcher-update)。

下一步：[加入你的第一个服务器](/zh/get-started/join-first-server)。

## 在 Linux 上安装 {#install-on-linux}

Linux 目前没有安装程序，也没有可下载的版本，所以你需要自己编译启动器。你需要对如何编译应用程序有基本的了解。

### 开始之前 {#before-you-start}

- 通过 Steam 安装 BeamNG.drive。启动器只能通过 Steam 找到游戏。它会在你的主文件夹下的这些文件夹中查找：`.steam/root/steamapps`、`.steam/steam/steamapps`、`.var/app/com.valvesoftware.Steam/.steam/root/steamapps`（Flatpak）和 `snap/steam/common/.local/share/Steam/steamapps`（Snap）。游戏必须位于 `libraryfolders.vdf` 中列出的某个 Steam 库里。
- 启动器会读写位于 `~/.local/share/BeamNG/BeamNG.drive/current/` 的游戏用户文件夹。`--user-path` 选项在 Linux 上不起作用。
- 你需要一个支持 C++20 和 `std::format` 的编译器，例如 GCC 13 或更新版本。

如果启动器找不到游戏，它会显示 `Unsupported Steam installation.`、`libraryfolders.vdf is missing.` 或 `The game directory was not found.`。请参阅[错误代码](/zh/troubleshooting/error-codes)。

::: warning
在 Linux 上，离开第一个服务器后再加入第二个服务器可能会失败。此时启动器窗口会显示 `(Proxy) bind failed with error: 98` 或 `Connection still alive terminating`。请关闭游戏和启动器，然后重新启动它们。截至 v2.8.1，还没有任何启动器版本修复这个问题。
:::

### 安装编译工具

安装基本的开发工具。在大多数系统上，它们都包含在某个软件包中：

| 系统 | 命令 |
|---|---|
| Debian、Ubuntu | `sudo apt install build-essential` |
| Fedora | `sudo dnf install cmake gcc gcc-c++ make perl perl-IPC-Cmd perl-FindBin perl-File-Compare perl-File-Copy kernel-headers kernel-devel` |
| Arch | `sudo pacman -S base-devel` |
| openSUSE | `zypper in -t pattern devel-basis` |
| SteamOS (Arch) | `sudo pacman -S base-devel linux-api-headers glibc libconfig` |

你还需要 `cmake`、`git`、`curl`、`zip`、`unzip`、`tar` 和 `pkg-config`。`vcpkg` 的引导脚本需要 `curl`、`zip`、`unzip` 和 `tar`，而 `vcpkg` 编译这些库时需要 `pkg-config`。请安装你的系统中缺少的那些。

在 SteamOS 上，安装软件包之前请先运行 `sudo steamos-readonly disable`，安装完成后再将其重新启用。

### 获取 vcpkg

克隆 `vcpkg`，对其执行引导脚本，并将其加入你的 `PATH`：

1. 克隆它：

   ```bash
   git clone https://github.com/microsoft/vcpkg.git
   ```

2. 执行引导脚本：

   ```bash
   ./vcpkg/bootstrap-vcpkg.sh
   ```

3. 将它加入你的 `PATH`：

   ```bash
   export VCPKG_ROOT="$(pwd)/vcpkg"
   export PATH=$VCPKG_ROOT:$PATH
   ```

### 编译启动器 {#build-the-launcher}

1. 克隆 [BeamMP-Launcher](https://github.com/BeamMP/BeamMP-Launcher) 仓库，然后进入该目录：

   ```bash
   git clone https://github.com/BeamMP/BeamMP-Launcher.git
   cd BeamMP-Launcher
   ```

   如果你以前没有克隆过仓库，请参阅 GitHub 的[克隆仓库](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)指南。

2. 检出[最新发布版本](https://github.com/BeamMP/BeamMP-Launcher/releases/latest)的标签。如果最新版本是 `v2.8.1`，请运行：

   ```bash
   git checkout v2.8.1
   ```

3. 在项目的根目录中，配置编译。`vcpkg` 会下载并编译 `vcpkg.json` 中列出的库（`cpp-httplib`、`nlohmann-json`、`zlib`、`openssl` 和 `curl`），所以第一次执行这一步需要一段时间：

   ```bash
   cmake . -B bin -DCMAKE_TOOLCHAIN_FILE=$VCPKG_ROOT/scripts/buildsystems/vcpkg.cmake -DVCPKG_TARGET_TRIPLET=x64-linux
   ```

4. 开始编译：

   ```bash
   cmake --build bin --parallel
   ```

   如果编译时内存不足，请去掉 `--parallel`。这样编译只会使用一个 CPU 线程，占用的内存也更少。

5. 将编译好的应用程序从 `bin` 中移出，放到它自己的文件夹里，并从该文件夹运行：

   ```bash
   mkdir -p ~/beammp-launcher
   cp bin/BeamMP-Launcher ~/beammp-launcher/
   cd ~/beammp-launcher
   ./BeamMP-Launcher
   ```

启动器会在你运行它的文件夹中创建 `Launcher.cfg`、`Resources` 模组缓存和 `Launcher.log` 文件。原生 Linux 版启动器会从 Steam 游戏文件夹启动原生 Linux 版 BeamNG.drive。

::: details Fedora：vcpkg 在编译 OpenSSL 时失败
如果 vcpkg 在编译 OpenSSL 时因内核头文件错误而失败，请确保已安装以下依赖项：

```bash
sudo dnf install kernel-headers kernel-devel gcc gcc-c++ make perl
```

然后清理 vcpkg 缓存，并重新运行配置命令：

```bash
rm -rf $VCPKG_ROOT/buildtrees/openssl
```
:::

### 通过 Proton 运行 BeamNG.drive

你可以将原生 Linux 版启动器与通过 Proton 运行的 BeamNG.drive 搭配使用。

1. 使用 `--no-launch` 启动启动器，这样它就不会启动原生 Linux 版 BeamNG.drive。更多启动器参数请参阅[开发环境设置](/zh/developers/dev-environment-setup#turn-on-dev-mode-in-the-launcher)页面。
2. 让 Proton 版游戏使用 Linux 版游戏的用户文件夹，因为原生启动器只会写入该文件夹。可以用符号链接来实现：
   1. 找到 Linux 版 BeamNG.drive 的用户文件夹，通常是 `~/.local/share/BeamNG/BeamNG.drive`，并将其重命名，例如改为 `BeamNG.drive_old`。
   2. 找到 Proton 版 BeamNG.drive 的用户文件夹，通常是 `~/.local/share/Steam/steamapps/compatdata/284160/pfx/drive_c/users/steamuser/AppData/Local/BeamNG/BeamNG.drive`。
   3. 将两者链接起来：

      ```bash
      ln -s ~/.local/share/Steam/steamapps/compatdata/284160/pfx/drive_c/users/steamuser/AppData/Local/BeamNG/BeamNG.drive ~/.local/share/BeamNG
      ```

3. 在 Steam 中打开游戏的**属性**，并将启动选项替换为：

   ```bash
   ~/BeamMP/BeamMP-Launcher --no-launch & %command% ; killall BeamMP-Launcher
   ```

   这样 Steam 在启动游戏的同时就会启动启动器。

请把 `~/BeamMP/` 改成你存放所编译启动器的文件夹。启动器仍然会在 Steam 库中查找游戏，详见[开始之前](#before-you-start)。

::: tip 名称和聊天中的表情符号
要在服务器列表的服务器名称以及游戏内聊天中显示表情符号，你需要一款包含表情符号的字体。一个可行的选择是 [Windows Segoe UI 表情符号字体的 Linux 移植版](https://github.com/mrbvrz/segoe-ui-linux)。
:::

### 在 Linux 上更新启动器 {#update-the-launcher-on-linux}

Linux 版启动器不会自行更新。当存在更新的版本时，它会显示 `Auto update is NOT implemented for the Linux version. Please update manually ASAP as updates contain security patches.` 请从最新发布版本的标签重新编译它：

1. 进入启动器文件夹，并获取新的标签：

   ```bash
   export VCPKG_ROOT="$(pwd)/vcpkg"
   cd BeamMP-Launcher
   git fetch --tags
   ```

2. 与[编译启动器](#build-the-launcher)时一样，检出[最新发布版本](https://github.com/BeamMP/BeamMP-Launcher/releases/latest)的标签。
3. 重新编译，并将其复制到你的启动器文件夹：

   ```bash
   cmake . -B bin -DCMAKE_TOOLCHAIN_FILE=$VCPKG_ROOT/scripts/buildsystems/vcpkg.cmake -DVCPKG_TARGET_TRIPLET=x64-linux
   cmake --build bin --parallel
   cp bin/BeamMP-Launcher ~/beammp-launcher/
   cd ~/beammp-launcher
   ./BeamMP-Launcher
   ```

下一步：[加入你的第一个服务器](/zh/get-started/join-first-server)。
