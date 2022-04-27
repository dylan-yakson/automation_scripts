const fs = require('fs');
const path = require('path');
const {runCommandRemote,uploadFile,runCommandLocal,spawnShellRemote,runInteractiveCommandRemote} = require('../../helpers')
const {Client} = require('ssh2')



const setupSnipeItServer = (sshConfig) => {
    let commands = `
stty -echo
sudo chmod +x ./deploy.sh 
sudo ./deploy.sh
`
    const conn = new Client();
    conn.on('ready', async () => {
        console.log("**************************")
        console.log("Uploading Install Script")
        console.log("**************************")
        await uploadFile(path.join(__dirname,'config','deploy.sh'),`./deploy.sh`,sshConfig)

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
