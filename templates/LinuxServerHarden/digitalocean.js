const fs = require('fs');
const path = require('path');
const {runCommandRemote,uploadFile,runCommandLocal,spawnShellRemote,runInteractiveCommandRemote, downloadFile} = require('../../helpers')
const {Client} = require('ssh2')
const { encryptFile, decryptFile } = require('../../utils/index')

//"**************************"
// Custom Install Script
// Installs the services all at once with minimal user interaction
//"**************************"


const hardenServer = (sshConfig, username, masterKeyPath, encryptedKeyPath) => {
    let commands = `
sudo chmod +x ./deploy.sh 
sudo ./deploy.sh -u ${username}
tail -n 50 /tmp/linux_init_harden_v1.0.log > ./${sshConfig.host}.log
`

    let completeFlag = false;
    const conn = new Client();
    const rsakeyPath = masterKeyPath;
    const aesencryptedKeyPath = encryptedKeyPath;
    conn.on('ready', async () => {
        console.log("**************************")
        console.log("Uploading Install Script")
        console.log("**************************")
        await uploadFile(path.join(__dirname,'config','deploy.sh'),`./deploy.sh`,sshConfig)

        try{
            await runCommandRemote(commands,conn, async () => {
                console.log("**************************")
                console.log("Finished updating security configuration :) Downloading keys then cleaning up")
                console.log("**************************")
                await downloadFile(path.join(__dirname,'../../keys/',`${sshConfig.host}.log`), `./${sshConfig.host}.log`, sshConfig)
                // await downloadFile(path.join(__dirname,'../../keys/',`${sshConfig.host}-full.log`), "/tmp/linux_init_harden_v1.0.log",sshConfig)
                // await downloadFile(path.join(__dirname,'../../keys/',`${sshConfig.host}-key`), `/home/${username}/.ssh/${username}.pem`,sshConfig)

                
                conn.end()
                setTimeout(() => {
                    const conn2 = new Client();
                    let commands = `
                    sudo chmod +x ./deploy-postinstall.sh 
                    sudo ./deploy-postinstall.sh -u ${username}
                    `
                    conn2.on('ready', async () => {
                        await uploadFile(path.join(__dirname,'config','deploy-postinstall.sh'),`./deploy-postinstall.sh`,sshConfig)

                        try{
                            await runCommandRemote(commands,conn2, () => {
                                const logFilePath = path.join(__dirname,'../../keys/',`${sshConfig.host}.log`);
                                const encryptedFilePath = path.join(__dirname,'../../keys/',`${sshConfig.host}.log-encrypted`);
                                encryptFile(logFilePath, rsakeyPath, aesencryptedKeyPath,true, encryptedFilePath);
                                fs.unlinkSync(logFilePath);
                                console.log("**************************")
                                console.log("Post Install completed")
                                console.log("**************************")
                                conn2.end()
                            });
                        }catch(e){
                            console.log(e);
                        }
                    }).connect(sshConfig)
                },3000) // Wait for 3 seconds so server has time to restart
            });
        }catch(e){
            console.log(e);
        }
    
    }).connect(sshConfig)
}
// let sshConfig = {
//     host: '192.168.1.79',
//     port: 22,
//     username: 'ubuntu',
//     password: 'Smile0759'
//   }
module.exports = hardenServer;
// remoteIntoServer(sshConfig);
