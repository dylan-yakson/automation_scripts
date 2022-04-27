const fs = require('fs');
const path = require('path');
const {runCommandRemote,uploadFile,runCommandLocal,spawnShellRemote,runInteractiveCommandRemote, deleteIfExists} = require('../../helpers')
const {generateNginxConfig} = require('./genNginxConfig');
const {Client} = require('ssh2')

const setupNextCloudNginx = (sshConfig,siteName, adminpassword, databasepassword,spawnShell=false) => {
    let completeFlag = false;
    let commands = `
sudo chmod +x ./install.sh
sudo ./install.sh
sudo certbot --nginx --agree-tos --no-eff-email --hsts --staple-ocsp --must-staple -d www.${siteName},${siteName} --email dylan.jackson@kppetro.com


#Install Nextcloud 
# # automate mariadb install 
sudo mysql --user=root <<_EOF_
UPDATE mysql.user SET Password=PASSWORD('${adminpassword}') WHERE User='root';
DELETE FROM mysql.user WHERE User='';
DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');
DROP DATABASE IF EXISTS test;
DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%';
FLUSH PRIVILEGES;
_EOF_

# Create Nextcloud DB Mariadb 
sudo mysql --user=root <<_EOF_
CREATE DATABASE nextcloud;
CREATE USER 'ncadmin'@'localhost' IDENTIFIED BY '${databasepassword}';
GRANT ALL ON nextcloud.* TO 'ncadmin'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
_EOF_

# Download nextcloud zip folder
sudo wget https://download.nextcloud.com/server/releases/nextcloud-23.0.0.zip

# Move to correct directory and unzip
sudo cp ./nextcloud-23.0.0.zip /var/www/nextcloud.zip 
cd /var/www
sudo unzip ./nextcloud.zip
sudo rm -rf ./nextcloud.zip 


# Edit permissions to use ocp
sudo chown -R www-data:www-data /var/www/nextcloud/
sudo chmod -R 755 /var/www/nextcloud/
cd ~
sudo cp ./nextcloud.conf /etc/nginx/sites-available/nextcloud.conf
sudo ln -s /etc/nginx/sites-available/nextcloud.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo systemctl restart nginx.service

# Start setup
cd /var/www/nextcloud/

# Install and set up the database
sudo -u www-data php occ  maintenance:install --database 'mysql' --database-name 'nextcloud'  --database-user 'ncadmin' --database-pass '${databasepassword}' --admin-user 'webadmin' --admin-pass '${adminpassword}'

# ================= StartGeneral Nextcloud Config =================
# Set SMTP mail
sudo -u www-data php occ config:system:set mail_smtpmode --value="smtp"

# Forget login/session after 30 minutes
sudo -u www-data php occ config:system:set remember_login_cookie_lifetime --value="1800"

# Set logrotate (max 10 MB)
sudo -u www-data php occ config:system:set log_rotate_size --value="10485760"

# Set trashbin retention obligation (save it in trashbin for 60 days or delete when space is needed)
sudo -u www-data php occ config:system:set trashbin_retention_obligation --value="auto, 60"

# Set versions retention obligation (save versions for 180 days or delete when space is needed)
sudo -u www-data php occ config:system:set versions_retention_obligation --value="auto, 180"

# Set activity retention obligation (save activity feed for 120 days, defaults to 365 days otherwise)
sudo -u www-data php occ config:system:set activity_expire_days --value="120"

# Remove simple signup
sudo -u www-data php occ config:system:set simpleSignUpLink.shown --type=bool --value=false

# Set chunk_size for files app to 100MB (defaults to 10MB)
sudo -u www-data php occ config:app:set files max_chunk_size --value="104857600"

cd /var/www/nextcloud/
sudo -u www-data php occ config:system:set trusted_domains 1 --value=${siteName}
#===================================== Install Apps =====================================
sudo -u www-data php occ app:install mail
sudo -u www-data php occ app:install calendar
sudo -u www-data php occ app:install contacts
sudo -u www-data php occ app:install files_pdfviewer
sudo -u www-data php occ app:install text
sudo -u www-data php occ app:install groupfolders
sudo -u www-data php occ app:install cospend
sudo -u www-data php occ app:install forms
sudo -u www-data php occ app:install circles
sudo -u www-data php occ app:install side_menu
sudo -u www-data php occ app:install announcementcenter
sudo -u www-data php occ app:install drawio
sudo -u www-data php occ app:install external
sudo -u www-data php occ app:install notes
sudo -u www-data php occ app:install passwords
sudo -u www-data php occ app:install files_accesscontrol
sudo -u www-data php occ app:install files_rightclick
sudo -u www-data php occ app:install files_videoplayer
sudo -u www-data php occ app:install workflow_ocr
sudo -u www-data php occ app:install dashboard
sudo -u www-data php occ app:install spreed
sudo -u www-data php occ app:install electronicsignatures
sudo -u www-data php occ app:install shifts
sudo -u www-data php occ app:install appointments
sudo -u www-data php occ app:install tasks

sudo -u www-data php occ app:install twofactor_totp
sudo -u www-data php occ app:install twofactor_webauthn
sudo -u www-data php occ app:install maps
sudo -u www-data php occ app:install extract
sudo -u www-data php occ app:install richdocuments
sudo -u www-data php occ app:install deck
sudo -u www-data php occ app:install bruteforcesettings
sudo -u www-data php occ app:install files_downloadactivity


sudo -u www-data php occ app:install gestion
sudo -u www-data php occ app:install activitylog

#sudo -u www-data php occ app:install files_automatedtagging
#
# sudo -u www-data php occ app:install impersonate
# 
# sudo -u www-data php occ app:install onlyoffice
# sudo -u www-data php occ app:install integration_whiteboard
## Backup Plugin breaks nextcloud - causes memory segmentation fault
# sudo -u www-data php occ app:uninstall backup
# sudo -u www-data php occ app:install auto_mail_accounts ## not compatible with this version of the server
# sudo -u www-data php occ app:install files_mindmap ## not compatible with this version of the server
# 
# sudo -u www-data php occ app:install rainloop ## not compatible with this version of the server
# sudo -u www-data php occ app:install apporder ## not compatible with this version of the server
# 
#sudo -u www-data php occ app:remove gestion
#sudo -u www-data php -d memory_limit=512M occ app:install richdocumentscode #BREAKING
#sudo -u www-data php occ app:remove richdocuments

# Configure NGINX 
sudo iptables -I INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT -p tcp --dport 443 -j ACCEPT
# Configure NGINX 
sudo ufw allow 'Nginx HTTP'
sudo ufw allow 'Nginx HTTPS'
sudo service nginx restart

# ================= End General Nextcloud Config =================

# Reboot
# sudo reboot
# exit;


`
    const conn = new Client();
    conn.on('ready', async () => {
        console.log("**************************")
        console.log(`Uploading Install Scripts for ${siteName}`)
        console.log("**************************")
        fs.writeFileSync(path.join(__dirname,`nextcloud.conf`),generateNginxConfig(siteName))

        await uploadFile(path.join(__dirname,'nextcloud.conf'),`./nextcloud.conf`,sshConfig)
        await uploadFile(path.join(__dirname,'config','install.sh'),`./install.sh`,sshConfig)
        console.log("**************************")
        console.log("Running install Script - Please watch the process and provide input when needed")
        console.log("**************************")
        try{
            await runCommandRemote(commands,conn, () => {
                console.log("**************************")
                console.log("Restart initiated, waiting before complete before spawning a reverse shell")
                console.log("**************************")
                conn.end()
                deleteIfExists(path.join(__dirname,`nextcloud.conf`),'file')

                if(spawnShell){
                    setTimeout(() => {
                        const conn2 = new Client();
                        conn2.on('ready', () => {
                            spawnShellRemote(conn2);
                        }).connect(sshConfig)
                    },5000) // Wait for 5 seconds before3 remoting in
                } else {
                    process.exit();
                }


            });
        }catch(e){
            console.log(e);
        }
    
    }).connect(sshConfig)
}

// setupNextCloudNginx(sshConfig,'kppetro.dev','adminpassword','databasepassword', true);
module.exports = setupNextCloudNginx;
