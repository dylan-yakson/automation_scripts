const fs = require('fs');
const path = require('path');
const {runCommandRemote,uploadFile,runCommandLocal,spawnShellRemote,runInteractiveCommandRemote, deleteIfExists} = require('../../helpers')
const {generateNginxConfig} = require('./genNginxConfig');
const {Client} = require('ssh2')
// ***********************************************************************************
// Meant to be ran on Ubuntu 20.04 LTS Arm64
// https://github.com/nextcloud-snap/nextcloud-snap
// ***********************************************************************************


  
// let officelocalFileName = path.join(__dirname,'onlyoffice.sh');
// let officeremoteFileName = `./onlyoffice.sh`
// spawnShellRemote(connection)


//"**************************"
// Custom Install Script
// Installs the services all at once with minimal user interaction
//"**************************"



const previsionServer = (sshConfig,siteName) => {
    let completeFlag = false;
    let commands = `

cd /var/www/nextcloud/
#===================================== Install Apps =====================================

sudo -u www-data php occ app:install calendar
sudo -u www-data php occ app:install contacts
sudo -u www-data php occ app:install files_pdfviewer
sudo -u www-data php occ app:install text
sudo -u www-data php occ app:install deck
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
sudo -u www-data php occ app:install mail
sudo -u www-data php occ app:install electronicsignatures
sudo -u www-data php occ app:install shifts
sudo -u www-data php occ app:install appointments
sudo -u www-data php occ app:install backup
sudo -u www-data php occ app:install richdocumentscode
sudo -u www-data php occ app:install richdocuments
sudo -u www-data php occ app:install activitylog
sudo -u www-data php occ app:install tasks
sudo -u www-data php occ app:install rainloop
sudo -u www-data php occ app:install apporder
sudo -u www-data php occ app:install files_automatedtagging
sudo -u www-data php occ app:install auto_mail_accounts
sudo -u www-data php occ app:install bruteforcesettings
sudo -u www-data php occ app:install impersonate
sudo -u www-data php occ app:install extract
sudo -u www-data php occ app:install files_mindmap
sudo -u www-data php occ app:install onlyoffice
sudo -u www-data php occ app:install twofactor_totp
sudo -u www-data php occ app:install twofactor_u2f
sudo -u www-data php occ app:install gestion
sudo -u www-data php occ app:install maps
sudo -u www-data php occ app:install integration_whiteboard

sudo service nginx restart

# ================= End General Nextcloud Config =================

# Reboot
# sudo reboot
# exit;


`
    const conn = new Client();
    conn.on('ready', async () => {
        console.log("**************************")
        console.log(`Installing Nextcloud Apps on ${siteName}`)
        console.log("**************************")

        try{
            await runCommandRemote(commands,conn, () => {
                console.log("**************************")
                console.log("Restart initiated, waiting before complete before spawning a reverse shell")
                console.log("**************************")
                // deleteIfExists(path.join(__dirname,`nextcloud.conf`),'file')
                conn.end()
                setTimeout(() => {
                    const conn2 = new Client();
                    conn2.on('ready', () => {
                        spawnShellRemote(conn2);
                    }).connect(sshConfig)
                },20000) // Wait for 20 seconds so server has time to restart

            });
        }catch(e){
            console.log(e);
        }
    
    }).connect(sshConfig)
}
const remoteIntoServer = (sshConfig) => {
    let completeFlag = false;
    const conn = new Client();
    conn.on('ready', () => {
        spawnShellRemote(conn);
    }).connect(sshConfig)
}
//webadmin
let sshConfig = {
    host: '64.227.1.152',
    port: 22,
    username: 'root',
    privateKey: fs.readFileSync('C:\\Users\\DylanJackson\\Desktop\\DigitalOcean\\Key2\\Key2_rsa', 'utf8'),
    passphrase: 'Smile0759' // Password for key - replace with prompt
  }
//   let sshConfig = {
//     host: '192.168.1.60',
//     port: 22,
//     username: 'ubuntu',
//     password: 'Smile0759'
//   }


let newServerConfig = {
    dbusername: 'ncadmin',
    dbpass: 'Smile0759'
}
previsionServer(sshConfig,'kpsectest.com','rTsAy4KPZJ7whsdfsdfF-root','rTsAy4KasdfsadfPZJ7whF');
// remoteIntoServer(sshConfig);
