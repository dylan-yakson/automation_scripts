sudo apt update -y 
sudo apt install zip unzip -y 

# sudo apt install nginx -y 
sudo add-apt-repository ppa:ondrej/nginx-mainline -y
sudo apt update -y
sudo apt install nginx-core nginx-common nginx nginx-full -y
# https://www.linuxbabe.com/security/modsecurity-nginx-debian-ubuntu
sudo sed -i 's/# deb-src/deb-src/' /etc/apt/sources.list.d/ondrej-ubuntu-nginx-mainline-*.list
sudo apt update -y

# Download NGINX Source 
sudo chown root:root /usr/local/src/ -R 
sudo mkdir -p /usr/local/src/nginx
cd /usr/local/src/nginx/
sudo apt install dpkg-dev -y
sudo apt source nginx

# Install Mod Security
sudo apt install git
sudo git clone --depth 1 -b v3/master --single-branch https://github.com/SpiderLabs/ModSecurity /usr/local/src/ModSecurity/
cd /usr/local/src/ModSecurity/
sudo apt install gcc make build-essential autoconf automake libtool libcurl4-openssl-dev liblua5.3-dev libfuzzy-dev ssdeep gettext pkg-config libpcre3 libpcre3-dev libxml2 libxml2-dev libcurl4 libgeoip-dev libyajl-dev doxygen -y
sudo git submodule init
sudo git submodule update
sudo ./build.sh 
sudo ./configure 
sudo make -j2
sudo make install 

# Mod Security Nginx Connector 
sudo git clone --depth 1 https://github.com/SpiderLabs/ModSecurity-nginx.git /usr/local/src/ModSecurity-nginx/
NGINX_DIRECTORY_TMP="/usr/local/src/nginx/nginx-$(ls /usr/local/src/nginx | grep nginx- | grep -m 1 -oE '([0-9]{1,})\.([0-9]{1,})\.([0-9]{1,})')"
# cd /usr/local/src/nginx/nginx-1.21.4/
cd $NGINX_DIRECTORY_TMP
sudo apt build-dep nginx -y
sudo apt install uuid-dev -y
sudo ./configure --with-compat --add-dynamic-module=/usr/local/src/ModSecurity-nginx
sudo make modules
sudo cp objs/ngx_http_modsecurity_module.so /usr/share/nginx/modules/

sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.original 


# Change NGINX rules and config values
# 5i = insert after line 5 
sudo sed -i '5i load_module modules\/ngx_http_modsecurity_module.so;' /etc/nginx/nginx.conf 
sudo sed -i '14i \\tmodsecurity on;' /etc/nginx/nginx.conf
sudo sed -i '15i \\tmodsecurity_rules_file \/etc\/nginx\/modsec\/main.conf;' /etc/nginx/nginx.conf 

#Redirect bad requests to ic3
sudo sed -i '57i \\terror_page 404 500 502 503 504 https://www.ic3.gov;' /etc/nginx/nginx.conf 




sudo mkdir /etc/nginx/modsec/
sudo cp /usr/local/src/ModSecurity/modsecurity.conf-recommended /etc/nginx/modsec/modsecurity.conf


sudo sed -i 's/SecRuleEngine DetectionOnly/SecRuleEngine On/' /etc/nginx/modsec/modsecurity.conf
sudo sed -i 's/SecAuditLogParts ABIJDEFHZ/SecAuditLogParts ABCEFHJKZ/' /etc/nginx/modsec/modsecurity.conf
sudo sed -i 's/SecRequestBodyAccess On/SecRequestBodyAccess Off/' /etc/nginx/modsec/modsecurity.conf

sudo echo 'Include /etc/nginx/modsec/modsecurity.conf' >> /etc/nginx/modsec/main.conf
sudo cp /usr/local/src/ModSecurity/unicode.mapping /etc/nginx/modsec/
sudo systemctl restart nginx

# Install NGINX Modules
# Enable OWASP Core Rule Set 
cd ~
CORE_RULESET_RELEASE_VERSION=$(curl -sL https://github.com/coreruleset/coreruleset/releases/ | grep /coreruleset- | grep -m 1 -oE '([0-9]{1,})\.([0-9]{1,})\.([0-9]{1,})'| head -1)
CORE_RULESET_RELEASE_URL="https://github.com/coreruleset/coreruleset/archive/v$CORE_RULESET_RELEASE_VERSION.tar.gz" 

sudo wget $CORE_RULESET_RELEASE_URL
#sudo tar xvf v3.3.2.tar.gz 
sudo tar xvf v$CORE_RULESET_RELEASE_VERSION.tar.gz
#sudo mv coreruleset-3.3.2/ /etc/nginx/modsec/ 
sudo mv coreruleset-$CORE_RULESET_RELEASE_VERSION/ /etc/nginx/modsec/
#sudo mv /etc/nginx/modsec/coreruleset-3.3.2/crs-setup.conf.example /etc/nginx/modsec/coreruleset-3.3.2/crs-setup.conf 
sudo mv /etc/nginx/modsec/coreruleset-$CORE_RULESET_RELEASE_VERSION/crs-setup.conf.example /etc/nginx/modsec/coreruleset-$CORE_RULESET_RELEASE_VERSION/crs-setup.conf

sudo cp /etc/nginx/modsec/main.conf /etc/nginx/modsec/main.conf.original
# sudo sed -i '$a Include /etc/nginx/modsec/coreruleset-3.3.2/crs-setup.conf' /etc/nginx/modsec/main.conf 
# sudo sed -i '$a Include /etc/nginx/modsec/coreruleset-3.3.2/rules/*.conf' /etc/nginx/modsec/main.conf
sudo sed -i "\$a Include /etc/nginx/modsec/coreruleset-$CORE_RULESET_RELEASE_VERSION/crs-setup.conf" /etc/nginx/modsec/main.conf 
sudo sed -i "\$a Include /etc/nginx/modsec/coreruleset-$CORE_RULESET_RELEASE_VERSION/rules/*.conf" /etc/nginx/modsec/main.conf

sudo systemctl restart nginx

# sudo cp /etc/nginx/nginx.conf.old /etc/nginx/nginx.conf
sudo apt install snapd -y 
sudo snap install core; 
sudo snap refresh core;

ip4=$(/sbin/ip -o -4 addr list eth0 | awk '{print $4}' | cut -d/ -f1)


# Install NPM 
# curl -fsSL https://deb.nodesource.com/setup_17.x | sudo -E bash -
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

cd ~
# Copy Nginx Config for react app
sudo cp ./reactapp.conf /etc/nginx/sites-available/default
sudo touch /var/log/reactapp.access.log 
sudo touch /var/log/reactapp.error.log
# Unzip App 
# sudo unzip ./app.zip -d ./app
# sudo cp ./.env ./app/.env
# cd ./app 
# sudo npm i -g yarn
# sudo yarn
# sudo yarn run build 
# sudo cp -r ./build/. /var/www/html


# Configure NGINX 
sudo ufw allow 'Nginx HTTP'
sudo ufw allow 'Nginx HTTPS'
sudo service nginx restart



# Pulls server IP (Public or private depending on the server)
sudo snap install --classic certbot
# Make the snap command available
sudo ln -s /snap/bin/certbot /usr/bin/certbot
# Public cert with domain name & Autoconfigure NGINX
# sudo certbot --nginx -d 123leave.com   -d www.123leave.com 


cd ~ 
exit