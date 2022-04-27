const fs = require('fs');
const path = require('path');
const {runCommandRemote,uploadFile,downloadFile, runCommandRemoteTesting, runCommandLocal,spawnShellRemote,runInteractiveCommandRemote} = require('../../helpers')
const {Client} = require('ssh2')



const setupSnipeItServer = (sshConfig) => {
    let commands = `
ls -l /usr/bin/mysql_secure_installation
sudo mv ./mysql_secure_installation /usr/bin/mysql_secure_installation_custom
sudo chown root:root /usr/bin/mysql_secure_installation_custom
sudo chmod +x /usr/bin/mysql_secure_installation_custom 
sudo chmod +x ./deploy.sh 
sudo ./deploy.sh
`
    const conn = new Client();
    conn.on('ready', async () => {
        console.log("**************************")
        console.log("Uploading Install Script")
        console.log("**************************")
        await uploadFile(path.join(__dirname,'config','deploy.sh'),`./deploy.sh`,sshConfig)
        await uploadFile(path.join(__dirname,'config','mysql_secure_installation'),`./mysql_secure_installation`,sshConfig)
        // await downloadFile(path.join(__dirname,`mysql_secure_installation`), `/usr/bin/mysql_secure_installation`, sshConfig)

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
                },5000) // Wait for 5 seconds so server has time to restart

            });
        }catch(e){
            console.log(e);
        }
    
    }).connect(sshConfig)
}

module.exports = setupSnipeItServer;
