#!/bin/bash
sudo apt-get update -y
sudo apt-get ugrade -y
sudo apt-get install net-tools -y

sudo rm -rf ./Mythic
sudo git clone https://github.com/its-a-feature/Mythic
cd Mythic 
sudo chmod +x ./*.sh
# sudo apt install apg -y
sudo cat > ./env << EOF
COMPOSE_PROJECT_NAME = mythic
DEFAULT_OPERATION_NAME = Peace Above War
EOF

# ./install_docker_ubuntu.sh
./install_docker_debian.sh

./mythic-cli mythic start


# Agents / Droppers
./mythic-cli install github https://github.com/MythicAgents/Medusa.git
./mythic-cli install github https://github.com/MythicAgents/Apollo.git
./mythic-cli install github https://github.com/MythicAgents/poseidon.git
./mythic-cli install github https://github.com/MythicAgents/hermes.git
./mythic-cli install github https://github.com/MythicAgents/orthrus.git
./mythic-cli install github https://github.com/MythicAgents/atlas.git
./mythic-cli install github https://github.com/MythicAgents/merlin
./mythic-cli install github https://github.com/MythicAgents/Nimplant.git
./mythic-cli install github https://github.com/MythicAgents/apfell.git
./mythic-cli install github https://github.com/MythicAgents/scarecrow_wrapper.git
./mythic-cli install github https://github.com/MythicAgents/typhon.git



# C2 Profiles
./mythic-cli install github https://github.com/MythicC2Profiles/dns.git
./mythic-cli install github https://github.com/MythicC2Profiles/http.git
./mythic-cli install github https://github.com/MythicC2Profiles/dynamichttp.git
./mythic-cli install github https://github.com/MythicC2Profiles/websocket.git


sudo ./mythic-cli config get MYTHIC_ADMIN_PASSWORD


# Full Config For Reference
# hasura_secret =$(apg -a 1)
# JWT_SECRET =$(apg -a 1)
# POSTGRES_PASSWORD =$(apg -a 1)
# RABBITMQ_PASSWORD =$(apg -a 1)

# sudo cat > ./env << EOF2
# ALLOWED_IP_BLOCKS = 0.0.0.0/0 
# COMPOSE_PROJECT_NAME = mythic
# DEFAULT_OPERATION_NAME = legoyo
# DOCUMENTATION_HOST = 137.184.212.218
# DOCUMENTATION_PORT = 8090
# EXCLUDED_C2_PROFILES = 
# EXCLUDED_PAYLOAD_TYPES = 
# HASURA_HOST = 137.184.212.218
# HASURA_PORT = 8080
# HASURA_SECRET = kD9So7u*UM&kn2
# JWT_SECRET = $JWT_SECRET
# MYTHIC_ADMIN_PASSWORD = kD9So7u*UM&kn2
# MYTHIC_ADMIN_USER = mythic_admin
# MYTHIC_DEBUG = false
# MYTHIC_SERVER_HOST = 137.184.212.218
# MYTHIC_SERVER_PORT = 17443
# NGINX_PORT = 7443
# POSTGRES_DB = mythic_db
# POSTGRES_HOST = 137.184.212.218
# POSTGRES_PASSWORD = kD9So7u*UM&kn2
# POSTGRES_PORT = 5432
# POSTGRES_USER = mythic_user
# RABBITMQ_HOST = 137.184.212.218
# RABBITMQ_PASSWORD = kD9So7u*UM&kn2
# RABBITMQ_PORT = 5672
# RABBITMQ_USER = mythic_user
# RABBITMQ_VHOST = mythic_vhost
# REDIS_PORT = 6379
# SERVER_HEADER = nginx 1.2
# SIEM_LOG_NAME = 
# WEB_KEEP_LOGS = false
# WEB_LOG_SIZE = 1024000
# EOF2