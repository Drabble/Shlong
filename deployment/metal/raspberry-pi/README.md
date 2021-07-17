# **BeeScreens** - Raspberry Pi deployment

## Introduction

Raspberry Pi boards are used to display the players' content on the big screens.

## Prerequisites

This document will guide you to configure and access the Raspberry Pi remotely. At least the Raspberry Pi Model 2B is required to run this project. The previous generations are not powerful enough to support BeeScreens. A 8GB microSD card is recommended.

On the first run, it is recommended to have the Rapsberry Pi connected to a screen and keyboard. Most of the following configuration can be achieved through the `raspi-config` configuration tool. However, this document will guide you to do all the configuration "by hand" so we get a full understanding of the files location and their meaning.

## Configuration

### Download the Raspberry Pi Operating System

Download the latest [`Raspberry Pi OS Lite`](https://www.raspberrypi.org/software/operating-systems/) system image.

### Write the image on a microSD card

Unzip the previously downloaded system image. You should have a `.img` file availble.

Write the image on a microSD card with a specialized software, such as [balenaEtcher](https://www.balena.io/etcher/) or [Raspberry Pi Imager](https://www.raspberrypi.org/software/).

### Start and log in into the Raspberry Pi

Put the microSD card in the Raspberry Pi and plug in the power supply.

The Raspberry Pi should boot on the new system.

You can log in with the following credentials:

- Username: pi
- Password: raspberry

### Set up keyboard layout

- _["installing `lightdm` in Dockerfile raises interactive keyboard layout menu" Stack Overflow question](https://stackoverflow.com/questions/38165407/installing-lightdm-in-dockerfile-raises-interactive-keyboard-layout-menu)_

Run the following commands to set up the keyboard layout:

```sh
# Set the keyboard layout
sudo tee /etc/default/keyboard > /dev/null <<EOT
# KEYBOARD CONFIGURATION FILE

# Consult the keyboard(5) manual page.

XKBMODEL="pc105"
XKBLAYOUT="en" # or "ch"
XKBVARIANT="" # or "fr"
XKBOPTIONS=""

BACKSPACE="guess"
EOT
```

### Set up locales

- _["How do you set a locale non-interactively on Debian/Ubuntu?" Server Fault question](https://serverfault.com/questions/362903/how-do-you-set-a-locale-non-interactively-on-debian-ubuntu)_

Run the following commands to set up locales:

```sh
# Enable the locales to generate
sudo sed -i "s/^# en_US.*/en_US.UTF-8 UTF-8/" /etc/locale.gen

# Reconfigure the locales
sudo dpkg-reconfigure --frontend=noninteractive locales

# Set the locale
sudo update-locale LANG=en_US.UTF-8
```

### Set up hostname

Run the following commands to set up the hostname:

```sh
# Set the hostname
echo "rpi" | sudo tee /etc/hostname > /dev/null

# Set up the hosts
sudo tee /etc/hosts > /dev/null <<EOT
127.0.0.1       localhost
::1             localhost ip6-localhost ip6-loopback
ff02::1         ip6-allnodes
ff02::2         ip6-allrouters

127.0.1.1       rpi
::1             rpi
EOT
```

### Set up timezone

- _["Setting timezone non-interactively" Raspberry Stack Exchange question](https://raspberrypi.stackexchange.com/questions/87164/setting-timezone-non-interactively)_

Run the following commands to set up the timezone:

```sh
sudo timedatectl set-timezone Europe/Zurich
```

### Create a new user

- _[Securing your Raspberry Pi official documentation](https://www.raspberrypi.org/documentation/configuration/security.md)_

Run the following commands to create a new user and remove the default `pi` user:

```sh
# Create a new user
sudo adduser \
  --gecos "BeeScreens" \
  --home /home/beescreens \
  --shell /bin/bash \
  --disabled-password \
  --quiet \
  beescreens

# Set the password for the new user
echo "beescreens:b33scr33ns" | sudo chpasswd

# Add the new user to the required groups
sudo usermod \
  --append \
  --groups sudo,users \
  beescreens

# Switch to the newly created account
su - beescreens

# Kill all the process used by the `pi` user
sudo pkill -u pi

# Delete the `pi` user
sudo deluser \
  --remove-home \
  pi

# Delete the sudoers file for the `pi` user
sudo rm /etc/sudoers.d/010_pi-nopasswd
```

### Configure the network

- _[Setting up a Raspberry Pi headless official documentation](https://www.raspberrypi.org/documentation/configuration/wireless/headless.md)_
- _[Setting up a wireless LAN via the command line official documentation](https://www.raspberrypi.org/documentation/configuration/wireless/wireless-cli.md)_

Run the following commands to connect to a wireless network:

```sh
# Create the main `wpa_supplicant.conf` file
sudo tee /etc/wpa_supplicant/wpa_supplicant.conf > /dev/null <<EOT
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
country=CH

EOT

# Add a network to the `wpa_supplicant.conf` file
wpa_passphrase "ssid" "password" | sudo tee --append /etc/wpa_supplicant/wpa_supplicant.conf > /dev/null

# Remove all comments from `wpa_supplicant.conf` file to remove the clear password and unnecessary comments
sudo sed -i "/^#/d" /etc/wpa_supplicant/wpa_supplicant.conf

# Reconfigure the `wlan0` network interface
sudo wpa_cli -i wlan0 reconfigure
```

### Update the softwares

- _[Updating and upgrading Raspberry Pi OS official documentation](https://www.raspberrypi.org/documentation/raspbian/updating.md)_
- _[APT official documentation](https://www.raspberrypi.org/documentation/linux/software/apt.md)_

Run the following commands to update the installed softwares to their latest versions:

```sh
# Switch to the testing branch of Raspberry OS
sudo sed -i "s/ buster/ testing/" /etc/apt/sources.list

# Update the system's package list
sudo apt update

# Upgrade all the installed packages to their latest versions
sudo apt --yes full-upgrade

# Update to the latest firmware and kernel
sudo rpi-update

# Remove no longer required packages
sudo apt autoremove --yes
```

### Configure and enable SSH

- _[Securing your Raspberry Pi official documentation](https://www.raspberrypi.org/documentation/configuration/security.md)_
- _[Passwordless SSH access official documentation](https://www.raspberrypi.org/documentation/remote-access/ssh/passwordless.md)_
- _[SSH (Secure Shell) official documentation](https://www.raspberrypi.org/documentation/remote-access/ssh/README.md)_

Run the following commands to configure and enable SSH:

_These commands are intended to be executed **on the Raspberry Pi**_

```sh
# Enable the SSH service on boot
sudo systemctl enable ssh

# Start the SSH service
sudo systemctl start ssh
```

_These commands are intended to be executed **on the client**_

```sh
# Generate the public/private keys pair
ssh-keygen \
  -t ed25519 \
  -f ~/.ssh/beescreens \
  -q \
  -N ""

# Transfer the SSH public key to the Raspberry Pi
ssh-copy-id -i ~/.ssh/beescreens.pub beescreens@<host>

# Connect to the Raspberry Pi without a password
ssh -i ~/.ssh/beescreens beescreens@<host>
```

_These commands are intended to be executed **on the Raspberry Pi**_

```sh
# Update the SSH configuration to only allow connection with public/private keys pair
sudo sed -i "s/^.*ChallengeResponseAuthentication.*$/ChallengeResponseAuthentication no/" /etc/ssh/sshd_config
sudo sed -i "s/^.*PasswordAuthentication.*$/PasswordAuthentication no/" /etc/ssh/sshd_config
sudo sed -i "s/^.*UsePAM.*$/UsePAM no/" /etc/ssh/sshd_config

# Reload the SSH service
sudo service ssh reload
```

### Configure the firewall

- _[Securing your Raspberry Pi official documentation](https://www.raspberrypi.org/documentation/configuration/security.md)_

Run the following commands to configure the firewall:

```sh
# Install the firewall
sudo apt install --yes ufw

# Enable the firewall service on boot
sudo systemctl enable ssh

# Start the firewal service
sudo systemctl start ssh

# Start the firewall
sudo ufw enable

# Allow SSH connections
sudo ufw allow ssh
```

### Extend the life of the microSD card

- _["How can I extend the life of my SD card?" Raspberry Stack Exchange question](https://raspberrypi.stackexchange.com/questions/169/how-can-i-extend-the-life-of-my-sd-card)_
- _["Permanently disable swap on Raspbian Buster" Raspberry Pi Forums](https://www.raspberrypi.org/forums/viewtopic.php?t=244130)_

Run the following commands to tweak and improve the microSD performance:

```sh
# Disable swap
sudo systemctl stop dphys-swapfile
sudo systemctl disable dphys-swapfile

# Mount certain partitions to RAM
sudo tee --append /etc/fstab > /dev/null <<"EOT"

# Custom configuration
tmpfs                 /tmp            tmpfs   defaults,noatime,nosuid,nodev,noexec,mode=0755,size=100M  0 0
tmpfs                 /var/log        tmpfs   defaults,noatime,nosuid,nodev,noexec,mode=0755,size=50M   0 0
EOT
```

### Set `config.txt` boot configuration file

- _[`config.txt` official documentation](https://www.raspberrypi.org/documentation/configuration/config-txt/)_
- _[Memory options in `config.txt` official documentation](https://www.raspberrypi.org/documentation/configuration/config-txt/memory.md)_
- _[Overclocking options in `config.txt` official documentation](https://www.raspberrypi.org/documentation/configuration/config-txt/overclocking.md)_
- _[Raspberry VC4 Gentoo wiki](https://wiki.gentoo.org/wiki/Raspberry_Pi_VC4)_

Run the following commands to set specific configuration through the `config.txt` boot configuration file:

```sh
# Set the configuration
sudo tee /boot/config.txt > /dev/null <<"EOT"
# For more options and information see
# http://rpf.io/configtxt
# Some settings may impact device functionality. See link above for details

[all]
gpu_mem=256
dtoverlay=vc4-kms-v3d

[pi4]
max_framebuffers=2
EOT
```

### Install the display server and the compositing window manager

- _[Wayland official documentation](https://wayland.freedesktop.org/)_
- _[Wayload Debian wiki](https://wiki.debian.org/Wayland)_
- _[Wayland Arch Linux wiki](https://wiki.archlinux.org/index.php/wayland)_
- _[Sway official documentation](https://swaywm.org/)_
- _[Sway Arch Linux wiki](https://wiki.archlinux.org/index.php/Sway)_
- _["No terminal on pure wayland, X11 disabled. (Alacritty/Kitty)" Reddit post](https://www.reddit.com/r/swaywm/comments/i094ed/no_terminal_on_pure_wayland_x11_disabled/fzoe8il/)_

Run the following commands to install the compositing window manager and a terminal:

```sh
# Install the compositing window manager and the terminal
sudo apt install --yes sway sakura

# Create the configuration directories
mkdir --parent ~/.config/sway
mkdir --parent ~/.config/sway/config.d

# Create the configurations
tee ~/.config/sway/config > /dev/null <<"EOT"
### Variables
#
# Logo key. Use Mod1 for Alt.
set $mod Mod4
# Your preferred terminal emulator
set $term sakura

### Output configuration
#
# Default wallpaper (more resolutions are available in /usr/share/backgrounds/sway/)
output * bg /usr/share/backgrounds/sway/Sway_Wallpaper_Blue_1920x1080.png fill
# Hide cursor after 1 sec
seat * hide_cursor 1

### Key bindings
#
# Basics:
#
    # Start a terminal
    bindsym $mod+Return exec $term

    # Kill focused window
    bindsym $mod+Shift+q kill

    # Reload the configuration file
    bindsym $mod+Shift+c reload

    # Exit sway (logs you out of your Wayland session)
    bindsym $mod+Shift+e exec swaymsg exit

include ~/.config/sway/config.d/*
EOT
```

### Install and configure the browser

```sh
# Install Firefox
sudo apt install --yes firefox-esr

# Create a sway configuration to launch Firefox in fullscreen on login
tee ~/.config/sway/config.d/10-firefox-fullscreen > /dev/null <<"EOT"
# Every Firefox instances will be in fullscreen
for_window [app_id="firefox"] fullscreen enable

# Start Firefox on a specific URL
exec MOZ_ENABLE_WAYLAND=1 firefox https://pmw.beescreens.ch
EOT
```

### Create a virtual mouse

- _["How to set absolute mouse cursor position in Wayland without using mouse?" Unix & Linux Stack Exchange question](https://unix.stackexchange.com/questions/422698/how-to-set-absolute-mouse-cursor-position-in-wayland-without-using-mouse)_

The Sway's property `hide_cursor` only takes effect when the mouse has been moved. After a few hours searching to completly hide the mouse from Wayland/Sway, the best solution seems to create a virtual mouse and move it so Sway can hide the cursor. This is very hacky and another solution should be found to resolve this.

```sh
# Add the current user to the `input` group
sudo usermod \
  --append \
  --groups input \
  $USER

# Log out and login again to take effect

# Install the tools to create and manipulate the virtual mouse
sudo apt install evemu-tools

# Save the virtual mouse properties (move information below)
tee ~/virtual-mouse.prop > /dev/null <<"EOT"
N: Logitech MX Master 2S
I: 0003 046d 4069 0111
P: 00 00 00 00 00 00 00 00
B: 00 0b 00 00 00 00 00 00 00
B: 01 fe ff ff ff ff ff ff ff
B: 01 ff ff ef ff df ff be ff
B: 01 ff df 41 d9 fa 7b ff ff
B: 01 07 c0 17 8b f3 0f 13 00
B: 01 01 00 ff ff 00 00 00 00
B: 01 00 00 00 00 46 44 d4 bf
B: 01 2d f3 af 17 ff ff 83 04
B: 01 00 00 00 00 00 00 00 00
B: 01 00 00 00 00 00 00 00 00
B: 01 ff 01 03 00 3f 00 00 00
B: 01 00 00 00 00 00 00 00 00
B: 01 00 00 00 00 00 00 00 00
B: 02 43 19 00 00 00 00 00 00
B: 03 00 00 00 00 01 00 00 00
B: 04 10 00 00 00 00 00 00 00
B: 05 00 00 00 00 00 00 00 00
B: 11 1f 00 00 00 00 00 00 00
B: 12 00 00 00 00 00 00 00 00
B: 14 03 00 00 00 00 00 00 00
B: 15 00 00 00 00 00 00 00 00
B: 15 00 00 00 00 00 00 00 00
A: 20 1 767 0 0 0
EOT

# Create a sway configuration to move the mouse on login
tee ~/.config/sway/config.d/00-move-mouse > /dev/null <<"EOT"
# Create the virtual mouse (see the output for the device name)
exec evemu-device ~/virtual-mouse.prop &

# Manipulate the virtual mouse
exec evemu-event /dev/input/event0 --type EV_REL --code REL_X --value 100
exec evemu-event /dev/input/event0 --type EV_REL --code REL_Y --value 100
EOT
```

**Dump the physical mouse**

These steps are optional as we have already dumped a mouse.

```sh
# View all the available devices
sudo evemu-describe

# Dump the mouse properties
sudo evemu-describe /dev/input/event<the device you want to dump> ~/virtual-mouse.prop

# Create the virtual mouse (see the output for the device name)
evemu-device ~/virtual-mouse.prop &

# Manipulate the virtual mouse
evemu-event /dev/input/event0 --type EV_REL --code REL_X --value 100
evemu-event /dev/input/event0 --type EV_REL --code REL_Y --value 100
```

### Enable auto login

```sh
TODO
```

### Start the UI

```sh
export WLR_NO_HARDWARE_CURSORS=1
sway
```

## Additional resources

- [Raspberry Pi](https://www.raspberrypi.org/) - The Raspberry Pi is a tiny and affordable computer that you can use to learn programming through fun, practical projects.
- [Official documentation](https://www.raspberrypi.org/documentation/) - The official documentation for the Raspberry Pi, written by the Raspberry Pi Foundation with community contributions.
