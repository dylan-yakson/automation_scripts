#!/bin/bash
sudo apt -y --no-install-recommends install mongodb python3-pymongo \
      python3-crypto python3-bottle python3-openssl apache2 \
      libapache2-mod-wsgi-py3 dokuwiki
git clone https://github.com/ivre/ivre
cd ivre
python3 setup.py build
sudo python3 setup.py install
cd /var/www/html ## or depending on your version /var/www
rm index.html
ln -s /usr/local/share/ivre/web/static/* .
cd /var/lib/dokuwiki/data/pages
ln -s /usr/local/share/ivre/dokuwiki/doc
cd /var/lib/dokuwiki/data/media
ln -s /usr/local/share/ivre/dokuwiki/media/logo.png
ln -s /usr/local/share/ivre/dokuwiki/media/doc
cd /usr/share/dokuwiki
patch -p0 < /usr/local/share/ivre/dokuwiki/backlinks.patch
cd /etc/apache2/mods-enabled
for m in rewrite.load wsgi.conf wsgi.load ; do
>  [ -L $m ] || ln -s ../mods-available/$m ; done
cd ../
echo 'Alias /cgi "/usr/local/share/ivre/web/wsgi/app.wsgi"' > conf-enabled/ivre.conf
echo '<Location /cgi>' >> conf-enabled/ivre.conf
echo 'SetHandler wsgi-script' >> conf-enabled/ivre.conf
echo 'Options +ExecCGI' >> conf-enabled/ivre.conf
echo 'Require all granted' >> conf-enabled/ivre.conf
echo '</Location>' >> conf-enabled/ivre.conf
sed -i 's/^\\(\\s*\\)#Rewrite/\\1Rewrite/' /etc/dokuwiki/apache.conf
echo 'WEB_GET_NOTEPAD_PAGES = "localdokuwiki"' >> /etc/ivre.conf
service apache2 reload  ## or start
yes | ivre ipinfo --init
yes | ivre scancli --init
yes | ivre view --init
yes | ivre flowcli --init
yes | sudo ivre runscansagentdb --init
sudo ivre ipdata --download