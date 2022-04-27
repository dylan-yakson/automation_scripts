const fs = require('fs');
const path = require('path');
const {runCommandRemote,uploadFile,runCommandLocal,spawnShellRemote,runInteractiveCommandRemote, downloadFile,createIfNotExists, deleteIfExists} = require('../../helpers')
const {Client} = require('ssh2')
// ***********************************************************************************
// Meant to be ran on Ubuntu 20.04 LTS Arm64
// https://github.com/nextcloud-snap/nextcloud-snap
// ***********************************************************************************

let sshConfig = {
    host: '134.209.121.201',
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
  
//"**************************"
// Custom Install Script
// Installs the services all at once with minimal user interaction
//"**************************"
let commands = `
sudo rm -rf /var/tmp/Nextcloud_Backups
sudo mkdir /var/tmp/Nextcloud_Backups
sudo mkdir /var/tmp/Nextcloud_Backups/nextcloud-backupdir 
sudo mkdir /var/tmp/Nextcloud_Backups/apache2-backupdir 
sudo mkdir /var/tmp/Nextcloud_Backups/letsencrypt-backupdir
#Put in maintenance mode
cd /var/www/nextcloud && sudo -u www-data php occ maintenance:mode --on 
sudo service apache2 stop
sudo apt-get install zip -y


# Backup Nextcloud Files
sudo rsync -Aavx /var/www/nextcloud/ /var/tmp/Nextcloud_Backups/nextcloud-backupdir/
sudo rsync -Aavx /etc/apache2/ /var/tmp/Nextcloud_Backups/apache2-backupdir/
sudo rsync -Aavx /etc/letsencrypt/ /var/tmp/Nextcloud_Backups/letsencrypt-backupdir/

# Backup Postgres Database 
sudo -u ncadmin pg_dump nextcloud_db  -f /var/tmp/nextcloud-sqlbkp.bak
sudo mv /var/tmp/nextcloud-sqlbkp.bak /var/tmp/Nextcloud_Backups/nextcloud-sqlbackup.bak

#Zip Backup Folder

cd /var/tmp/Nextcloud_Backups/nextcloud-backupdir/ && zip -r Nextcloud_Backup.zip *
cd /var/tmp/Nextcloud_Backups/nextcloud-backupdir && mv ./Nextcloud_Backup.zip ../Nextcloud_Backup.zip

cd /var/tmp/Nextcloud_Backups/apache2-backupdir/ && zip -r apache2.zip *
cd /var/tmp/Nextcloud_Backups/apache2-backupdir && mv ./apache2.zip ../apache2.zip

cd /var/tmp/Nextcloud_Backups/letsencrypt-backupdir/ && zip -r letsencrypt.zip *
cd /var/tmp/Nextcloud_Backups/letsencrypt-backupdir && mv ./letsencrypt.zip ../letsencrypt.zip

`

const previsionServer = (sshConfig) => {
    let completeFlag = false;
    const conn = new Client();
    let sourceBackupDir = path.join(__dirname,'backups')
    createIfNotExists(sourceBackupDir,'dir')
    let current_datetime = new Date(Date.now())
    let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + "_" + current_datetime.getHours() + "-" + current_datetime.getMinutes() + "-" + current_datetime.getSeconds() 
    let TimeStampedDirname = `backups-${formatted_date}`
    let currentBackupDir = path.join(sourceBackupDir,TimeStampedDirname)
    createIfNotExists(currentBackupDir,'dir');


    conn.on('ready', async () => {
        console.log("**************************")
        console.log("Putting Nextcloud in Maintenance Mode & backing up directories...")
        console.log("**************************")
        try{
            await runCommandRemote(commands,conn, async () => {
                console.log("**************************")
                console.log("Finished backup up directories! Copying over zip files...")
                console.log("**************************")
                await downloadFile(path.join(currentBackupDir,'Nextcloud_App_Backup.zip'),'/var/tmp/Nextcloud_Backups/Nextcloud_Backup.zip',sshConfig)
                await downloadFile(path.join(currentBackupDir,'Nextcloud_PostgresSQL_Backup.zip'),'/var/tmp/Nextcloud_Backups/nextcloud-sqlbackup.bak',sshConfig)
                await downloadFile(path.join(currentBackupDir,'Nextcloud_Apache2_Backup.zip'),'/var/tmp/Nextcloud_Backups/apache2.zip',sshConfig)
                await downloadFile(path.join(currentBackupDir,'Nextcloud_LetsEncrypt_Backup.zip'),'/var/tmp/Nextcloud_Backups/letsencrypt.zip',sshConfig)
                console.log("**************************")
                console.log("Finished downloading backups! Cleaning up and turning off maintenance mode...")
                console.log("**************************")
                let finishCommands = `
                sudo rm -rf /var/tmp/Nextcloud_Backups ~/Nextcloud_Backups
                sudo systemctl restart apache2
                cd /var/www/nextcloud && sudo -u www-data php occ maintenance:mode --off
                exit;
                `
                
                await runCommandRemote(finishCommands,conn, () => {
                    console.log("**************************")
                    console.log("Backup Process completed!")
                    console.log("**************************")
                    conn.end()
                    process.disconnect;
                    // setTimeout(() => {
                    //     const conn3 = new Client();
                    //     conn3.on('ready', () => {
                    //         spawnShellRemote(conn3);
                    //     }).connect(sshConfig)
                    // },20000) // Wait for 20 seconds so server has time to restart
    
                });
               
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
previsionServer(sshConfig);
// remoteIntoServer(sshConfig);
