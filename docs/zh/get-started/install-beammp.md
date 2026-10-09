---
description: "在 Windows 上使用安装程序安装 BeamMP，或在 Linux 上自行编译 BeamMP 启动器（可使用或不使用 Proton）。"
---
# 安装 BeamMP

你需要 BeamMP 启动器。在 Windows 上，安装程序会为你完成安装；在 Linux 上，你需要自己编译。

::: warning
BeamMP 无法在盗版或过时的 BeamNG.drive 上运行。
:::

## 在 Windows 上安装

1. 前往 [beammp.com](https://beammp.com/)，点击 **Download Now**。
2. 运行 `BeamMP_Installer.exe`，并按照提示操作。
3. BeamMP 启动器的图标会出现在你的桌面上。如果没有出现，请在 Windows 搜索栏中搜索“BeamMP”。

下一步：[加入你的第一个服务器](/zh/get-started/join-first-server)。

## 在 Linux 上安装 {#install-on-linux}

Linux 目前还没有安装程序，所以你需要自己编译启动器。你需要对如何编译应用程序有基本的了解。

### 安装编译工具

安装基本的开发工具。在大多数系统上，它们都包含在某个软件包中：

| 系统 | 命令 |
|---|---|
| Debian、Ubuntu | `sudo apt install build-essential` |
| Fedora | `sudo dnf install cmake gcc gcc-c++ make perl perl-IPC-Cmd perl-FindBin perl-File-Compare perl-File-Copy kernel-headers kernel-devel` |
| Arch | `sudo pacman -S base-devel` |
| openSUSE | `zypper in -t pattern devel-basis` |
| SteamOS (Arch) | `sudo pacman -S base-devel linux-api-headers glibc libconfig` |

::: info SteamOS
安装软件包之前，请先运行 `sudo steamos-readonly disable`，安装完成后再将其重新启用。
:::

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

2. 检出[最新发布版本](https://github.com/BeamMP/BeamMP-Launcher/releases/latest)的标签。如果最新版本是 `v2.8.0`，请运行：
   ```bash
   git checkout v2.8.0
   ```
3. 在项目的根目录中，配置编译：
   ```bash
   cmake . -B bin -DCMAKE_TOOLCHAIN_FILE=$VCPKG_ROOT/scripts/buildsystems/vcpkg.cmake -DVCPKG_TARGET_TRIPLET=x64-linux
   ```
4. 开始编译：
   ```bash
   cmake --build bin --parallel
   ```
5. 将编译好的应用程序从 `bin` 中移出，放到它自己的文件夹里，并从该文件夹运行：
   ```bash
   mkdir -p ~/beammp-launcher
   cp bin/BeamMP-Launcher ~/beammp-launcher/
   cd ~/beammp-launcher
   ./BeamMP-Launcher
   ```
原生 Linux 版启动器会启动，并使用原生 Linux 版 BeamNG.drive。

::: tip 内存不足？
去掉 `--parallel`。这样编译只会使用一个 CPU 线程，占用的内存也更少。
:::

::: info 调试版本
如果不加 `-DCMAKE_BUILD_TYPE=Release`，编译出来的就是调试版本。它的体积更大，但不存在启动器只能连接一次服务器的 bug。
:::

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

1. 使用 `--no-launch` 启动启动器，这样它就不会启动原生 Linux 版 BeamNG.drive。更多启动器参数请参阅[开发环境设置](/zh/developers/dev-environment-setup)页面。
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

请把 `~/BeamMP/` 改成你存放所编译启动器的文件夹。每次启动器发布新版本时，你都必须从正确的 git 标签重新编译启动器。

::: tip 名称和聊天中的表情符号
要在服务器列表的服务器名称以及游戏内聊天中显示表情符号，你需要一款包含表情符号的字体。一个可行的选择是 [Windows Segoe UI 表情符号字体的 Linux 移植版](https://github.com/mrbvrz/segoe-ui-linux)。
:::

### 在 Linux 上更新启动器

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
