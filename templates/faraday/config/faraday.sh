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
ip4=$(/sbin/ip -o -4 addr list eth0 | awk '{print $4}' | cut -d/ -f1)

# sudo apt-get update -y
# sudo apt-get ugrade -y
# sudo apt-get install net-tools -y

# # Postgres
# sudo apt-get install postgresql -y
# # Install pip 
# sudo apt-get install python3-pip -y 
# # Script to create postgres user automatically
# sudo -i -u postgres psql -c "CREATE DATABASE faraday;"
# sudo -i -u postgres psql -c "CREATE USER faraday_postgresql WITH password 'Smile0759';"
# sudo -i -u postgres psql -c "GRANT ALL privileges ON DATABASE faraday TO faraday_postgresql;"


# docker run \
#     -v ~/.faraday/doc:/faraday-license \
#     -v ~/.faraday/storage:/faraday-storage \
#     -p 5985:5985 \
#     -e PGSQL_HOST="$ip4" \
#     -e PGSQL_PASSWD='Smile0759' \
#     -e PGSQL_USER='faraday_postgresql' \
#     -e PGSQL_DBNAME='faraday' \
#     -e LISTEN_ADDR="$ip4" \
#     faradaysec/faraday:latest

