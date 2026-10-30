Vagrant.configure("2") do |config|
  config.vm.box = "eurolinux-vagrant/centos-stream-9"
  config.vm.network "private_network", ip: "192.168.56.13"

  config.vm.provision "shell", inline: <<-SHELL
    echo "=== Starting Automated Provisioning for YMB Zone B ==="

    # 1. Install Docker prerequisites and repository
    dnf install -y dnf-plugins-core
    dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
    dnf install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    # 2. Start and enable Docker daemon
    systemctl enable --now docker

    # 3. Create custom Docker bridge network if it doesn't exist
    docker network ls | grep -q prf-network || docker network create prf-network

    # 4. Build and run Student Portfolio container (Corrected path)
    cd /vagrant/student-portfolio
    docker build -t studentportfolio .
    docker rm -f studentportfolio || true
    docker run -d --name studentportfolio --network prf-network -p 3000:80 studentportfolio

    # 5. Build and run Banking App container (Corrected path)
    cd /vagrant/banking-app
    docker build -t bankingapp .
    docker rm -f bankingapp || true
    docker run -d --name bankingapp --network prf-network -p 5090:5090 bankingapp

    echo "=== YMB Containers Successfully Deployed ==="
  SHELL
end