const fs = require('fs');
const path = require('path');
const {runCommandRemote,uploadFile,runCommandLocal,spawnShellRemote,runInteractiveCommandRemote} = require('../../helpers')
const {Client} = require('ssh2')

const setupTruDeskServer = (sshConfig) => {
let commands = `
sudo chmod +x ./*.sh
sudo ./install.sh
# curl -L -s https://files.trudesk.io/install/ubuntu.sh | sudo bash
`
    let completeFlag = false;
    const conn = new Client();
    conn.on('ready', async () => {
        console.log("**************************")
        console.log("Uploading Install Scripts")
        console.log("**************************")
        console.log("**************************")
        console.log("Running install Script - Please watch the process and provide input when needed")
        console.log("**************************")
        try{
            await uploadFile(path.join(__dirname,'config','install.sh'),`./install.sh`,sshConfig)

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
                },10000) // Wait for 10 seconds so server has time to restart

            });
        }catch(e){
            console.log(e);
        }
    
    }).connect(sshConfig)
}
module.exports = setupTruDeskServer;