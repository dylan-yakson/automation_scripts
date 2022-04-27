const fs = require('fs');
const path = require('path');
const {runCommandRemote,uploadFile,runCommandLocal,spawnShellRemote,runInteractiveCommandRemote, downloadFile} = require('../../helpers')
const {Client} = require('ssh2')
// ***********************************************************************************
// Meant to be ran on Ubuntu 20.04 LTS Arm64
// https://github.com/nextcloud-snap/nextcloud-snap
// ***********************************************************************************


//   let sshConfig = {
//     host: '192.168.1.81',
//     port: 22,
//     username: 'ubuntu',
//     password: 'Smile0759'
//   }

//"**************************"
// Custom Install Script
// Installs the services all at once with minimal user interaction
//"**************************"

const setupIVREServer = (sshConfig) => {
    let commands = `
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
    `
    const conn = new Client();
    conn.on('ready', async () => {
        console.log("**************************")
        console.log("Uploading Install Script for IVRE scanner")
        console.log("**************************")
        // await uploadFile(path.join(__dirname,'nc_install_custom.sh'),`./nc_install_custom.sh`,sshConfig)
        try{
            await runCommandRemote(commands,conn, async () => {
                console.log("**************************")
                console.log("Restart initiated, waiting before complete before spawning a reverse shell")
                console.log("**************************")
                // await downloadFile('./AppTest1.ovpn','/root/AppTest1.ovpn',sshConfig)
                await conn.end()
                await setTimeout(() => {
                    const conn2 = new Client();
                    conn2.on('ready', () => {
                        spawnShellRemote(conn2);
                    }).connect(sshConfig)
                },5000) // Wait for 5 seconds then remote in
            });
        }catch(e){
            console.log(e);
        }
    
    }).connect(sshConfig)
}
module.exports = setupIVREServer;