const fs = require('fs');
const path = require('path');
const {runCommandRemote,uploadFile,runCommandLocal,spawnShellRemote,runInteractiveCommandRemote, downloadFile} = require('../../helpers')
const {Client} = require('ssh2')

const backupGiteaServer = (sshConfig) => {
    let completeFlag = false;
    const conn = new Client();
    let InstallCommands = `
sudo rm -rf /tmp/giteabackup.zip
sudo rm -rf /tmp/snap.gitea/tmp/giteabackup.zip
sudo gitea dump -f /tmp/giteabackup.zip --type zip
echo "Copying Backup File to Tmp Directory"
sudo cp /tmp/snap.gitea/tmp/giteabackup.zip /tmp/giteabackup.zip
sudo chown ubuntu:ubuntu /tmp/giteabackup.zip
echo "Finished Copying File."

`
    let CleanupCommands = `
sudo rm -rf /tmp/giteabackup.zip
`
    conn.on('ready', async () => {
        console.log("**************************")
        console.log("Running backup script for Gitea")
        console.log("**************************")
    
        // await uploadFile(path.join(__dirname,'nc_install_custom.sh'),`./nc_install_custom.sh`,sshConfig)
        try{
            await runCommandRemote(InstallCommands,conn, () => {
                console.log("**************************")
                console.log("Starting download for giteabackup.zip")
                console.log("**************************")
                // downloadFile(path.join(__dirname,'giteabackup.zip'),`/tmp/giteabackup.zip`,sshConfig)
                downloadFile(path.join('F:\\Servers','giteabackup.zip'),`/tmp/giteabackup.zip`,sshConfig)
                conn.end()
                setTimeout(() => {
                    const conn2 = new Client();
                    conn2.on('ready', async () => {
                        await runCommandRemote(CleanupCommands,conn2, () => {
                            console.log("**************************")
                            console.log("Cleaning up and stopping script")
                            console.log("**************************")
                            conn2.end()
                        });                    
                    }).connect(sshConfig)
                },5000) // Wait for 20 seconds so server has time to restart
            });
        }catch(e){
            console.log(e);
        }
    
    }).connect(sshConfig)
}

module.exports = backupGiteaServer;
