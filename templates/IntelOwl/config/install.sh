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
	# sudo reboot 
fi
# clone the IntelOwl project repository
git clone https://github.com/intelowlproject/IntelOwl
cd IntelOwl/

# construct environment files from templates
cd docker/
cp env_file_app_template env_file_app
cp env_file_postgres_template env_file_postgres
cp env_file_integrations_template env_file_integrations

# start the app
cd ..
./initialize.sh
python3 start.py prod up

# create a super user 
docker exec -ti intelowl_uwsgi python3 manage.py createsuperuser
