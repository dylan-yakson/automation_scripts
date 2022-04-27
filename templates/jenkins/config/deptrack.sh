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
sudo docker stop $(sudo docker ps -a -q) && sudo docker rm $(sudo docker ps -a -q)
# sudo docker system prune
# sudo docker rmi $(docker images -a -q)
# Pull the image from the Docker Hub OWASP repo
# sudo docker pull dependencytrack/bundled

# # Creates a dedicated volume where data can be stored outside the container
# sudo docker volume create --name dependency-track

# # Run the bundled container with 8GB RAM on port 8080
# sudo docker run -d -m 6192m -p 9090:8080 --name dependency-track -v dependency-track:/data dependencytrack/bundled
# sudo rm -rf ./deptrack
ip4=$(/sbin/ip -o -4 addr list eth0 | awk '{print $4}' | cut -d/ -f1)

# sudo rm -rf ./deptrack
# sudo mkdir ./deptrack
# # sudo cp ./deptrack-docker-compose.yml ./deptrack/docker-compose.yml 
# cd ./deptrack 
curl -LO https://dependencytrack.org/docker-compose.yml
# # sed -i 's/"8080:8080"/"9080:8080"/g' ./docker-compose.yml
# # sed -i 's/"8081:8081"/"9081:8081"/g' ./docker-compose.yml
# sed -i "s/localhost/$ip4/g" docker-compose.yml
# sudo docker-compose up -d
sudo apt update -y 
sudo apt upgrade -y
sudo apt install python3.8-venv -y 
sudo apt install python3-pip -y 
# sudo mkdir ./njsscan
# sudo docker pull opensecurity/njsscan --platform linux/x86_64
# sudo docker run -v $HOME/njsscan:/src opensecurity/njsscan /src 

# sudo git clone https://github.com/ajinabraham/nodejsscan.git
# cd nodejsscan
# sudo python3 -m venv venv
# source venv/bin/activate
# sudo pip install -r requirements.txt
# sudo python3 manage.py recreate-db # Run once to create database schema

# # # Pull the image from the Docker Hub OWASP repo
# sudo docker pull dependencytrack/bundled  --platform linux/x86_64

# # # Creates a dedicated volume where data can be stored outside the container
# sudo docker volume create --name dependency-track

# # # Run the bundled container with 8GB RAM on port 8080
# sudo docker run -d -p 8080:8080 --name dependency-track -v dependency-track:/data dependencytrack/bundled

# sudo docker pull jetbrains/teamcity-server --platform linux/x86_64

# sudo docker run -d jetbrains/teamcity-server --name teamcity-server
sudo  mkdir dependencytrack
sudo cp ./docker-compose.yml ./dependencytrack/docker-compose.yml
cd dependencytrack
# Downloads the latest Docker Compose file
# sudo curl -LO https://dependencytrack.org/docker-compose.yml

# Starts the stack using Docker Compose
sudo docker-compose up -d

# Install SBOM stuff 
