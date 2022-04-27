const fs = require('fs');
const path = require('path');
const {runCommandRemote,uploadFile,runCommandLocal,spawnShellRemote,runInteractiveCommandRemote, downloadFile} = require('../../helpers')
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

const setupWAPTServer = (sshConfig) => {
    let commands = `
    apt install apt-transport-https lsb-release gnupg -y
    wget -O - https://wapt.tranquil.it/$(lsb_release -is)/tiswapt-pub.gpg  | apt-key add -
    echo "deb https://wapt.tranquil.it/$(lsb_release -is)/wapt-2.2/ $(lsb_release -c -s) main" > /etc/apt/sources.list.d/wapt.list

export DEBIAN_FRONTEND=noninteractive
apt update
apt install tis-waptserver tis-waptsetup -y
unset DEBIAN_FRONTEND
sudo /opt/wapt/waptserver/scripts/postconf.sh
`
    let completeFlag = false;
    const conn = new Client();
    conn.on('ready', async () => {
        console.log("**************************")
        console.log("Uploading Install Script for Open VPN")
        console.log("**************************")
        await uploadFile(path.join(__dirname,'config','install.sh'),`./install.sh`,sshConfig)
    
    
        // await uploadFile(path.join(__dirname,'nc_install_custom.sh'),`./nc_install_custom.sh`,sshConfig)
        try{
            await runCommandRemote(commands,conn, async () => {
                console.log("**************************")
                console.log("Restart initiated, waiting before complete before spawning a shell")
                console.log("**************************")
                await downloadFile('./AppTest1.ovpn','/root/AppTest1.ovpn',sshConfig)
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
module.exports = setupWAPTServer;
// remoteIntoServer(sshConfig);
