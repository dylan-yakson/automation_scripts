sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt-get install postgresql -y

sudo -i -u postgres psql -c "CREATE DATABASE onlyoffice;"
sudo -i -u postgres psql -c "CREATE USER onlyoffice WITH password 'Smile0759';"
sudo -i -u postgres psql -c "GRANT ALL privileges ON DATABASE onlyoffice TO onlyoffice;"

sudo apt-get install rabbitmq-server -y
sudo apt-get install nginx-extras -y

# Change Port to 3434
echo onlyoffice-documentserver onlyoffice/ds-port select 3434 | sudo debconf-set-selections


sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys CB2DE8E5
echo "deb https://download.onlyoffice.com/repo/debian squeeze main" | sudo tee /etc/apt/sources.list.d/onlyoffice.list


sudo apt-get update -y
sudo apt-get install ttf-mscorefonts-installer -y
sudo apt-get install onlyoffice-documentserver -y
