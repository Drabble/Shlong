# **BeeScreens** - Infrastructure deployment

Google Cloud is used to host the entire infrastructure.

## Prerequisites

- A credit card is required to use the Google Cloud Suite.
- [OpenSSH](https://www.openssh.com/) must be installed.

## Configuration

All the configuration happens through the [Google Cloud Console](https://console.cloud.google.com/) and is meant to be set once.

### Create a new project

Go to `IAM & Admin` -> `Manage Resources` and create a new project. Save the project ID, it will be used later.

### Set a budget limit

Go to `Billing` -> `Budgets & alerts ` and create a new budget.

### Create a service key

Go to `IAM & Admin` -> `Service Accounts`. Click on the default service account -> `Keys` and add a new key (JSON format). Save the key on your computer, it will be used later.

### Generate the public/private SSH keys pair

_These commands are intended to be executed locally **on the client**_

```sh
# Generate the public/private keys pair
ssh-keygen \
  -t ed25519 \
  -f ed25519 \ # or any other path
  -q \
  -N ""
```

### Add the variables to GitLab CI/CD

_TODO: Make usage of Vault and remove these variables from GitLab CI/CD when Vault is set up._

On GitLab, go the project's `Settings` -> `CI/CD`. Collapse the `Variables` section and add the following variables:

**Note**: Most variables require a new line at the end of the variable's content. If omitted, it might not work.

- `GCP_SERVICE_KEY`: Open the Service Key JSON file and copy/paste the content to this unprotected variable (not file).
- `SSH_PRIVATE_KEY`: Open the SSH private key and copy/paste the content to this unprotected variable (not file).
- `SSH_PUBLIC_KEY`: Open the SSH public key and copy/paste the content to this unprotected variable (not file).

### Update the Terraform configuration

_TODO: Improve this part using [Terraform Variables](https://www.terraform.io/docs/language/values/variables.html)._

If needed, edit the Terraform configuration files to reflect the project ID and the VM instances names.

## Manage a VM instance manually

[Terraform](https://www.terraform.io) is used to create and manage the VM instances on Google Cloud Platform through the GitLab CI/CD pipelines. No manual interaction is required and the following documentation is only meant as a reference.

### Create a new free tier instance

- _[GCP Free Tier - Free Extended Trials and Always Free](https://cloud.google.com/free)_

Go in `Compute Engine` -> `VM instances` and create a new instance:

- Name: `beescreens-manual`
- Region: `us-east1 (South Carolina)`
- Zone: `us-east1-b`
- Machine family: `General-purpose`
- Series: `N1`
- Machine type: `f1-micro`
- Boot image: `Debian GNU/Linux 10 (buster)` with 10 GB standard persistant disk
- Firewall: `Allow HTTP and HTTPS traffic`

### Add SSH key

Go in `Compute Engine` -> `Settings` -> `Metadata` -> `SSH Keys` and add the new public SSH key.

## Additional resources

- [Terraform](https://www.terraform.io) - An infrastructure as code software tool to safely and predictably create, change, and improve infrastructure.
