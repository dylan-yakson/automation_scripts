#!/bin/bash
echo "Checking if docker is installed"
if sudo dpkg -l docker >/dev/null; then 
  echo "Docker already Installed"
else
	echo "Docker not installed. Installing now...\n\n Pease note you will have to restart your system after this\n\n"
	# Install Docker
  sudo apt-get update -y
  sudo apt-get upgrade -y
  sudo apt-get -y install git net-tools
	sudo apt-get -y remove docker docker-engine docker.io containerd runc
	sudo apt-get -y update
	sudo apt-get -y install \
		apt-transport-https \
		ca-certificates \
		curl \
		gnupg \
		lsb-release
	 curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

	echo \
	"deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
	$(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

	sudo apt-get -y update
	sudo apt-get -y install docker-ce docker-ce-cli containerd.io
	 
	#Install Docker Compose 
	sudo apt-get -y install docker-compose 
	echo "\n=============== Docker installed - Reboot required ==============="
	sudo reboot 
fi
# Remove and delete prior docker containers
# TODO: Remove this
# sudo docker stop $(sudo docker ps -a -q) && sudo docker rm $(sudo docker ps -a -q)

ip4=$(/sbin/ip -o -4 addr list eth0 | awk '{print $4}' | cut -d/ -f1)

sudo apt-get install postgresql -y
sudo apt-get install net-tools ca-certificates -y 
sudo apt install libpq-dev -y
sudo apt install npm -y
sudo npm i -g heroku #Install heroku CLI
# sudo -i -u postgres psql -c "CREATE DATABASE gitea;"
# sudo -i -u postgres psql -c "CREATE USER gitadmin WITH password 'Smile0759';"
# sudo -i -u postgres psql -c "GRANT ALL privileges ON DATABASE gitea TO gitadmin;"

sudo docker run -p 9000:9000 -d --restart=always hub4rpi64/sonarqube:8.3.1.34397 

sudo npm install -g @cyclonedx/bom # To generate SBOM for dependency analysis
# Install the CLI version to merge projects that have multiple directories into a single file for analysis
sudo wget https://github.com/CycloneDX/cyclonedx-cli/releases/download/v0.19.0/cyclonedx-linux-$(dpkg --print-architecture)
sudo mv ./cyclonedx-linux-arm64 ~/cyclonedx
sudo chmod +x ~/cyclonedx
sudo cp ~/cyclonedx /usr/bin/cyclonedx
# sudo ln -s ~/cyclonedx /usr/bin/cyclonedx
