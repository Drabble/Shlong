# **BeeScreens** - Virtual machine deployment

Debian is used as the OS host for the project.

## Prerequisites

- `ssh` must be installed.

## Configuration

### Update the system

Run the following commands to update the installed softwares to their latest versions:

```sh
# Update the system's package list
sudo apt update

# Upgrade all the installed packages to their latest versions
sudo apt --yes full-upgrade
```

### Install the monitoring services

Go in `Monitoring` -> `Dashboard` and select `VM Instances`.

Click on the items `Monitoring agent status` and `Install agent`.

_or_

Execute the following command:

```sh
curl -sSO https://dl.google.com/cloudagents/add-monitoring-agent-repo.sh
sudo bash add-monitoring-agent-repo.sh
sudo apt update
sudo apt install --yes stackdriver-agent
sudo service stackdriver-agent enable
sudo service stackdriver-agent start
```

### Install Docker and Docker Compose

Run the following commands to install Docker and Dockedr Compose:

```sh
# Install required packages to add an apt repository
sudo apt install --yes \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common

# Add Docker’s official GPG key
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add -

# Add the Docker repository
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/debian \
   $(lsb_release -cs) \
   stable"

# Update the available packages
sudo apt update

# Install Docker Engine
sudo apt install --yes docker-ce docker-ce-cli containerd.io

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Set permissions
sudo chmod +x /usr/local/bin/docker-compose

# Create the `docker` group
sudo groupadd docker

# Add the user to the `docker` group
sudo usermod --append --groups docker $USER
```

Log out and login again and you should be able to run Docker / Docker Compose.
