const fs = require('fs');
const path = require('path');
const {runCommandRemote,spawnShellRemoteTest,uploadFile,runCommandLocal,spawnShellRemote,runInteractiveCommandRemote, downloadFile} = require('../../helpers')
const {Client} = require('ssh2')
// ***********************************************************************************
// Meant to be ran on Ubuntu 20.04 LTS Arm64
// https://github.com/nextcloud-snap/nextcloud-snap
// ***********************************************************************************

//"**************************"
// Custom Install Script
// Installs the services all at once with minimal user interaction
//"**************************"

const setupIntelOwlServer = (sshConfig) => {
let commands = `
sudo chmod +x ./install.sh
sudo ./install.sh
`
    const conn = new Client();
    conn.on('ready', async () => {
        console.log("**************************")
        console.log("Uploading Install Script for graphana data vis")
        console.log("**************************")
        await uploadFile(path.join(__dirname,'config','install.sh'),`./install.sh`,sshConfig)
        try{
            await runCommandRemote(commands,conn, async () => {
                console.log("**************************")
                console.log("Restart initiated, waiting before complete before spawning a reverse shell")
                console.log("**************************")
                // await downloadFile('./AppTest1.ovpn','/root/AppTest1.ovpn',sshConfig)
                await conn.end()
                await setTimeout(() => {
                    spawnShellRemoteTest(sshConfig);
                },5000) // Wait for 5 seconds then remote in
            });
        }catch(e){
            console.log(e);
        }
    
    }).connect(sshConfig)
}
module.exports = setupIntelOwlServer;