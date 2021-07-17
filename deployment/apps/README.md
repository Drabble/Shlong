# **Shlong** - Applications deployment

## Introduction

Docker is used to run the entire infrastructure.

## Prerequisites

The following prerequisites must be filled to run this project:

- [Docker](https://docs.docker.com/get-docker/) must be installed.
- [git](https://git-scm.com/) must be installed.

## Clone the repository

```sh
# Clone the repository
git clone https://gitlab.com/shlong/shlong.git shlong
```

## Configure the services

```sh
# Move to the cloned directory
cd shlong/deployment/apps

# For each service, edit the environment variables file if needed
vim [<service>/*].env

# Other configuration might be required in the service's README.md
cat <service>/README.md
```

## Start the infrastructure

```sh
# Move to the cloned directory
cd shlong/deployment/apps

# Start the infrastructure
docker compose --detach
```

## Stop the infrastructure

```sh
# Move to the cloned directory
cd shlong/deployment/apps

# Stop the infrastructure
docker compose down
```

## Update the infrastructure

Fetch the latest available version of the Docker images from the remote registry.

```sh
# Move to the cloned directory
cd shlong/deployment/apps

# Update the infrastructure
docker compose pull
```

## Additional resources

- [Docker](https://docs.docker.com/get-docker/) - An open platform for developing, shipping, and running applications.
- [Docker Compose](https://docs.docker.com/compose/) - A tool for defining and running multi-container Docker applications.
- [git](https://git-scm.com/) - a free and open source distributed version control system.
