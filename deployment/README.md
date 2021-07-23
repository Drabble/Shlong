# **Shlong** - Deployment

This directory contains all the instructions to deploy Shlong and its applications.

The structure is as follow:

| Directory        | Description                                                       | Technologies involved |
|------------------|-------------------------------------------------------------------|-----------------------|
| [metal](./metal) | Bare metal server and SoC installation and configuration          | Ansible               |
| [infra](./infra) | Request and configure a virtual machine from a cloud provider     | Terraform             |
| [apps](./apps)   | All the applications (Shlong and more) to deploy on the cloud | Docker                |
| [cicd](./cicd)   | Orchestrate the deployment from the source code to production     | Github                |
