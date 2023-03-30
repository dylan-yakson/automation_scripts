const fs = require('fs');
const path = require('path');
const {runCommandRemote,spawnShellRemoteTest, uploadFile,runCommandLocal,spawnShellRemote,runInteractiveCommandRemote} = require('../../helpers')
const {Client} = require('ssh2')

const setupHELKServer = (sshConfig) => {
    let commands = `
sudo apt install git
git clone https://github.com/Cyb3rWard0g/HELK.git
cd HELK/docker
sudo chmod +x ./helk_install.sh
sudo ./helk_install.sh
`
    const conn = new Client();
    conn.on('ready', async () => {
        console.log("**************************")
        console.log("Uploading Install Script for HELK4")
        console.log("**************************")
        // await uploadFile(path.join(__dirname,'config','gitea.sh'),`./install.sh`,sshConfig)
    
    
        // await uploadFile(path.join(__dirname,'nc_install_custom.sh'),`./nc_install_custom.sh`,sshConfig)
        try{
            await runCommandRemote(commands,conn, () => {
                console.log("**************************")
                console.log("Restart initiated, waiting before complete before spawning a reverse shell")
                console.log("**************************")
                conn.end()
                setTimeout(() => {
                    spawnShellRemoteTest(sshConfig)
                },10000) // Wait for 20 seconds so server has time to restart
            });
        }catch(e){
            console.log(e);
        }
    
    }).connect(sshConfig)
}

module.exports = setupHELKServer;
