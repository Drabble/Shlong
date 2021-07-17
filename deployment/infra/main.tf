terraform {
  backend "http" {
  }
}

provider "google" {
  credentials = file("service-key.json")
  project     = "beescreens"
  region      = "us-east1-b"
}

resource "random_id" "instance_id" {
  byte_length = 8
}

// A single Compute Engine instance
resource "google_compute_instance" "default" {
  name         = "beescreens-vm-${random_id.instance_id.hex}"
  machine_type = "f1-micro"
  zone         = "us-east1-b"

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-10"
    }
  }

  metadata = {
    ssh-keys = "beescreens:${file("id_ed25519.pub")}"
  }

  // Install the minimum required packages on the VM
  metadata_startup_script = "sudo apt update; sudo apt install -yq build-essential python-pip; pip install ansible-core"

  network_interface {
    network = "default"

    access_config {
      // Include this section to give the VM an external ip address
    }
  }
}

resource "google_compute_firewall" "default" {
  name    = "beescreens-app-firewall"
  network = "default"

  allow {
    protocol = "icmp"
  }

  allow {
    protocol = "tcp"
    ports    = ["80", "443"]
  }
}
