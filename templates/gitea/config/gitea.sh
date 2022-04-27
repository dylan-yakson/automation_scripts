sudo apt-get update -y
sudo apt-get ugrade -y
sudo apt-get install net-tools -y
sudo apt-get install snapd -y
sudo snap install core 
sudo snap install gitea 

# Installing Postgres
sudo apt-get install postgresql -y


sudo -i -u postgres psql -c "CREATE DATABASE gitea;"
sudo -i -u postgres psql -c "CREATE USER gitadmin WITH password 'Smile0759';"
sudo -i -u postgres psql -c "GRANT ALL privileges ON DATABASE gitea TO gitadmin;"


