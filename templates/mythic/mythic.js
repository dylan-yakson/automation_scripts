const fs = require('fs');
const path = require('path');
const {runCommandRemote,uploadFile,runCommandLocal,spawnShellRemote,runInteractiveCommandRemote} = require('../../helpers')
const {Client} = require('ssh2')

const setupMythicServer = (sshConfig) => {
let commands = `
sudo chmod +x ./install.sh
sudo ./install.sh
`
    let completeFlag = false;
    const conn = new Client();
    conn.on('ready', async () => {
        console.log("**************************")
        console.log("Uploading Install Script for Mythic C2 Server")
        console.log("**************************")
        await uploadFile(path.join(__dirname,'config','mythic.sh'),`./install.sh`,sshConfig)
    
    
        // await uploadFile(path.join(__dirname,'nc_install_custom.sh'),`./nc_install_custom.sh`,sshConfig)
        try{
            await runCommandRemote(commands,conn, () => {
                console.log("**************************")
                console.log("Restart initiated, waiting before complete before spawning a reverse shell")
                console.log("**************************")
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
module.exports = setupMythicServer;

// remoteIntoServer(sshConfig);
