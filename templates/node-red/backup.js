const fs = require('fs');
const path = require('path');
const {runCommandRemote,uploadFile,runCommandLocal,spawnShellRemote,runInteractiveCommandRemote,pullGitRepo,zipFolder, deleteIfExists, downloadFolder, downloadFile} = require('../../helpers')
const {Client} = require('ssh2')


//   let sshConfig = {
//     host: '192.168.1.60',
//     port: 22,
//     username: 'ubuntu',
//     password: 'Smile0759'
//   }


//"**************************"
// Custom Install Script
// Installs the services all at once with minimal user interaction
//"**************************"
let defaultenv = `GENERATE_SOURCEMAP=false`
const backupNodeRedServer = (sshConfig, popShell=false) => {
    // Add MSAL redirect URL
    let commands = `
    sudo apt install zip -y 
    sudo mkdir ~/node-red-backup 
    sudo cp -r /root/.node-red ~/node-red-backup/
    sudo zip -r ~/node-red-backup.zip ~/node-red-backup
    `

    let completeFlag = false;
    const conn = new Client();
    conn.on('ready', async () => {
        
        console.log("**************************")
        console.log("Running Node-Red backup script")
        console.log("**************************")
        // await uploadFile(path.join(__dirname,'config','install.sh'),`./install.sh`,sshConfig)
        try{
            await runCommandRemote(commands,conn, async () => {
                await downloadFile( path.join(__dirname,'backups','node-red-backup.zip'),'./node-red-backup.zip',sshConfig)
                let cleanupscript = `
                sudo rm -rf ~/node-red-backup
                `
                await runCommandRemote(cleanupscript,conn, async () => {
                    console.log("**************************")
                    console.log("Finished downloading backup folder. Running Cleanup :)")
                    console.log("")
                    if(popShell){
                        console.log("Waiting 20 seconds and popping a shell")
                    }
                    console.log("**************************")
                    conn.end()
    
                    if(popShell){
                        await setTimeout(() => {
                            const conn2 = new Client();
                            conn2.on('ready', () => {
                                // Cleanup
                                spawnShellRemote(conn2);
                            }).connect(sshConfig)
                        },20000) // Wait for 20 seconds so server has time to restart
                    }
                })
               
            });

        }catch(e){
            console.log(e);
        }


    }).connect(sshConfig)
}

module.exports = backupNodeRedServer;

