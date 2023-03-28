const fs = require('fs');
const path = require('path');
const {runCommandRemote,spawnShellRemoteTest,uploadFile,runCommandLocal,spawnShellRemote,runInteractiveCommandRemote, downloadFile} = require('../../helpers')
const {Client} = require('ssh2')
// ***********************************************************************************
// Meant to be ran on Ubuntu 20.04 LTS Arm64
// https://github.com/nextcloud-snap/nextcloud-snap
// ***********************************************************************************


//   let sshConfig = {
//     host: '192.168.1.81',
//     port: 22,
//     username: 'ubuntu',
//     password: 'Smile0759'
//   }

//"**************************"
// Custom Install Script
// Installs the services all at once with minimal user interaction
//"**************************"

const setupSpiderFoot = (sshConfig, user, password) => {
let commands = `
sudo apt-get update -y 
sudo apt-get upgrade -y
sudo apt-get install python3 -y
sudo apt-get install python3-pip -y 
git clone https://github.com/smicallef/spiderfoot.git
cd spiderfoot
sudo python3 -m pip install -r requirements.txt
sudo python3 ./sf.py -l 0.0.0.0:5001 
sudo mkdir /root/.spiderfoot
sudo tee -a /root/.spiderfoot/passwd <<EOF
${user}:${password}
EOF
sudo python3 ./sf.py -l 0.0.0.0:5001 
`
    const conn = new Client();
    conn.on('ready', async () => {
        console.log("**************************")
        console.log("Uploading Install Script for superset data vis")
        console.log("**************************")
        // await uploadFile(path.join(__dirname,'config','install.sh'),`./install.sh`,sshConfig)
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
module.exports = setupSpiderFoot;