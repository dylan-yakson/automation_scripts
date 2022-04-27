const fs = require('fs');
const path = require('path');
const {runCommandRemote,uploadFile,runCommandLocal,spawnShellRemote,runInteractiveCommandRemote, downloadFile} = require('../../helpers')
const {Client} = require('ssh2')

const setupWazuh = (sshConfig) => {
    let commands = `
curl -so ~/unattended-installation.sh https://packages.wazuh.com/resources/4.2/open-distro/unattended-installation/unattended-installation.sh && sudo bash ~/unattended-installation.sh
`;
    let completeFlag = false;
    const conn = new Client();
    conn.on('ready', async () => {
        console.log("**************************")
        console.log("Uploading Install Script for Wazuh Security Operations Center")
        console.log("**************************")
        await uploadFile(path.join(__dirname,'config','install.sh'),`./install.sh`,sshConfig)
    
    
        // await uploadFile(path.join(__dirname,'nc_install_custom.sh'),`./nc_install_custom.sh`,sshConfig)
        try{
            await runCommandRemote(commands,conn, async () => {
                console.log("**************************")
                console.log("Restart initiated, waiting before complete before spawning a shell")
                console.log("**************************")
                await conn.end()
                await setTimeout(() => {
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

module.exports = setupWazuh;