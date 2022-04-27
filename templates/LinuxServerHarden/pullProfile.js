const fs = require('fs');
const path = require('path');
const {runCommandRemote,uploadFile,runCommandLocal,spawnShellRemote,runInteractiveCommandRemote, downloadFile} = require('../../helpers')
const {Client} = require('ssh2')
const { utils: { parseKey }, Server } = require('ssh2');
//"**************************"
// Custom Install Script
// Installs the services all at once with minimal user interaction
//"**************************"
let commands = `
sudo chmod +x ./deploy.sh 
sudo ./deploy.sh
`


const previsionServer = (sshConfig) => {
    let completeFlag = false;
    const conn = new Client();
    conn.on('ready', async () => {
        console.log("**************************")
        console.log("Uploading Install Script")
        console.log("**************************")
        // await uploadFile(path.join(__dirname,'config','deploy.sh'),`./deploy.sh`,sshConfig)

        try{
            await downloadFile(path.join(__dirname,`${sshConfig.host}.log`), "/tmp/linux_init_harden_v1.0.log",sshConfig)

            // await runCommandRemote(commands,conn, async () => {
            //     console.log("**************************")
            //     console.log("Restart initiated, waiting before complete before spawning a reverse shell")
            //     console.log("**************************")
            //     // await downloadFile(path.join(__dirname,`${sshConfig.host}.log`), "/tmp/linux_init_harden_v1.0.log",sshConfig)

                conn.end()
            //     // setTimeout(() => {
            //     //     const conn2 = new Client();
            //     //     conn2.on('ready', () => {
            //     //         spawnShellRemote(conn2);
            //     //     }).connect(sshConfig)
            //     // },10000) // Wait for 20 seconds so server has time to restart
            // });
        }catch(e){
            console.log(e);
        }
    
    }).connect(sshConfig)
}
const remoteIntoServer = (sshConfig) => {
    let completeFlag = false;
    const conn = new Client();
    conn.on('ready', () => {
        spawnShellRemote(conn);
    }).connect(sshConfig)
}

// let sshConfig = {
//     host: '137.184.36.156',
//     port: 22,
//     username: 'root',
//     privateKey: fs.readFileSync('C:\\Users\\DylanJackson\\Desktop\\DigitalOcean\\Key2\\Key2_rsa', 'utf8'),
//     passphrase: 'Smile0759' // Password for key - replace with prompt
//   }
  let sshConfig = {
    host: '137.184.36.156',
    username: 'wxsdbg78',
    // Can be a string, Buffer, or parsed key containing a private key
    privateKey: fs.readFileSync(path.join(__dirname, 'key'), 'utf8'),
    // `passphrase` only required for encrypted keys
    passphrase:'lfn8Sok6I2qDyzt',
  }
previsionServer(sshConfig);
// remoteIntoServer(sshConfig);
