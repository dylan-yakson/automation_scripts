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

const deployWazuhAgent = (sshConfig, wasuhServerHost, wazuhUser="wazuh_user", wasuhPassword="Frgqje-GjDCuEx_7dYpbqJVv2IH2sfeG") => {
    let commands = `
curl -so wazuh-agent-4.2.5.deb https://packages.wazuh.com/4.x/apt/pool/main/w/wazuh-agent/wazuh-agent_4.2.5-1_amd64.deb && sudo WAZUH_MANAGER='137.184.214.172' WAZUH_AGENT_GROUP='default' dpkg -i ./wazuh-agent-4.2.5.deb
sudo systemctl daemon-reload
sudo systemctl enable wazuh-agent
sudo systemctl start wazuh-agent

curl -L -O https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-7.10.2-amd64.deb
sudo dpkg -i filebeat-7.10.2-amd64.deb
cd filebeat-7.10.2-darwin-x86_64/
sudo mv /etc/filebeat/filebeat.yml /etc/filebeat/filebeat-old.yml.old
sudo cat > /etc/filebeat/filebeat.yml << EOF2
output.elasticsearch:
  hosts: ["${wasuhServerHost}"]
  username: "${wazuhUser}"
  password: "${wasuhPassword}"
setup.kibana:
  host: "${wasuhServerHost}"
EOF2

sudo filebeat modules enable nginx
sudo filebeat setup
sudo service filebeat start
`
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

module.exports = deployWazuhAgent;
