# Update & install deps
sudo apt update -y
sudo apt upgrade -y 
sudo apt install -y nginx mariadb-client mariadb-server
# Install PHP 
sudo apt-get install software-properties-common
# Below is apparantly fixed with nginx-mainline
# sudo add-apt-repository ppa:ondrej/php
# sudo apt update -y 
# TODO sudo nano /etc/php/7.4/fpm/php.ini
# file_uploads = On
# allow_url_fopen = On
# short_open_tag = On
# memory_limit = 256M
# upload_max_filesize = 100M
# max_execution_time = 360
# date.timezone = America/Chicago

sudo apt install -y zip unzip

# ======================== START NGINX / ModSecurity ========================
sudo add-apt-repository ppa:ondrej/nginx-mainline -y
sudo apt update -y
sudo apt install nginx-core nginx-common nginx nginx-full -y
sudo apt install -y php7.4-fpm php7.4-imagick php7.4-common php7.4-mysql php7.4-gmp php7.4-imap php7.4-json php7.4-pgsql php7.4-ssh2 php7.4-sqlite3 php7.4-ldap php7.4-curl php7.4-intl php7.4-mbstring php7.4-xmlrpc php7.4-gd php7.4-xml php7.4-cli php7.4-zip

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
cd $NGINX_DIRECTORY_TMP
sudo apt build-dep nginx -y
sudo apt install uuid-dev -y
sudo ./configure --with-compat --add-dynamic-module=/usr/local/src/ModSecurity-nginx
sudo make modules
sudo cp objs/ngx_http_modsecurity_module.so /usr/share/nginx/modules/
# Copy Nginx Config in case of an issue
sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.original 


# Change NGINX rules and config values
# 5i = insert after line 5 
sudo sed -i '5i load_module modules\/ngx_http_modsecurity_module.so;' /etc/nginx/nginx.conf 
sudo sed -i '14i \\tmodsecurity on;' /etc/nginx/nginx.conf
sudo sed -i '15i \\tmodsecurity_rules_file \/etc\/nginx\/modsec\/main.conf;' /etc/nginx/nginx.conf 
sudo sed -i '57i \\terror_page 404 500 502 503 504 https:\/\/www.ic3.gov;' /etc/nginx/nginx.conf 


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
# Changed v3.3.0 to v3.3.2
# sudo wget https://github.com/coreruleset/coreruleset/archive/v3.3.2.tar.gz
# sudo tar xvf v3.3.2.tar.gz
# sudo mv coreruleset-3.3.2/ /etc/nginx/modsec/
# sudo mv /etc/nginx/modsec/coreruleset-3.3.2/crs-setup.conf.example /etc/nginx/modsec/coreruleset-3.3.2/crs-setup.conf

# sudo cp /etc/nginx/modsec/main.conf /etc/nginx/modsec/main.conf.original
# sudo sed -i '$a Include /etc/nginx/modsec/coreruleset-3.3.2/crs-setup.conf' /etc/nginx/modsec/main.conf 
# sudo sed -i '$a Include /etc/nginx/modsec/coreruleset-3.3.2/rules/*.conf' /etc/nginx/modsec/main.conf
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
sudo snap install certbot --classic
sudo ln -s /snap/bin/certbot /usr/bin/certbot
# ======================== END NGINX / ModSecurity ========================

