const fs = require('fs');
const path = require('path');
const {runCommandRemote,uploadFile,runCommandLocal,spawnShellRemote,runInteractiveCommandRemote,pullGitRepo,zipFolder, deleteIfExists, downloadFolder, downloadFile} = require('../../helpers')
const {Client} = require('ssh2')
const {genNodeConfig} = require('./generateNodeConfig');
const {generateNginxConfig} = require('./generateNginxConfig');
const { config } = require('process');




//   let sshConfig = {
//     host: '192.168.1.60',
//     port: 22,
//     username: 'ubuntu',
//     password: 'Smile0759'
//   }


//"**************************"
// Custom Install Script
// Installs the services all at once with minimal user interaction
//"**************************"
let defaultenv = `GENERATE_SOURCEMAP=false`
const previsionServer = (sshConfig, port, siteName, popShell=false) => {

    let commands = `
    sudo cp ~/.node-red/db/internal.db ~/dbbackup/internal.db
    sudo cp ~/.node-red/db/test.db ~/dbbackup/test.db
    sudo cp ~/.node-red/db/backup.db ~/dbbackup/backup.db
`
    let completeFlag = false;
    const conn = new Client();
    // deleteIfExists(path.join(__dirname,`nodered.conf`),'file')
    // deleteIfExists(path.join(__dirname,`nodered-settings.js`),'file')
    const LocalDBBackupDir = path.join(__dirname,'backups','dbbackup' );
    const LocalDBBackupDirTimeStamped = path.join(LocalDBBackupDir,new Date(Date.now()).toDateString().trim().replace(/ /g,"_"));
    if(!fs.existsSync(LocalDBBackupDirTimeStamped)){
        fs.mkdirSync(LocalDBBackupDirTimeStamped, {"recursive": true });
    }
    conn.on('ready', async () => {
        
        console.log("**************************")
        console.log("Uploading Install Script")
        console.log("**************************")


        // await uploadFile(path.join(__dirname,'reactapp.conf'),`./reactapp.conf`,sshConfig)
        // await uploadFile(path.join(__dirname,'reactapp.env'),`./.env`,sshConfig)
        // await uploadFile(path.join(__dirname,'app.zip'),`./app.zip`,sshConfig)
        // try{
                await downloadFile(path.join(LocalDBBackupDirTimeStamped, 'internal.db'), "./.node-red/db/internal.db", sshConfig);
                await downloadFile(path.join(LocalDBBackupDirTimeStamped,  'test.db'), "./.node-red/db/test.db", sshConfig);
                await downloadFile(path.join(LocalDBBackupDirTimeStamped,  'backup.db'), "./.node-red/db/backup.db", sshConfig);
                // await runCommandRemote(commands,conn, async () => {

        //         console.log("**************************")
        //         console.log("Deployment Complete! :)")
        //         console.log("")
        //         if(popShell){
        //             console.log("Waiting 20 seconds and popping a shell")
        //         }
        //         console.log("**************************")
        //         conn.end()

        //         // deleteIfExists(path.resolve('./app'), 'dir')
        //         // deleteIfExists(path.resolve('./app.zip'), 'file')
        //         // deleteIfExists(path.resolve('./reactapp.conf'), 'file')
        //         // deleteIfExists(path.resolve('./reactapp.env'), 'file')
        //         if(popShell){
        //             setTimeout(() => {
        //                 const conn2 = new Client();
        //                 conn2.on('ready', () => {
        //                     // Cleanup
        //                     spawnShellRemote(conn2);
        //                 }).connect(sshConfig)
        //             },5000) // Wait for 5 seconds so server has time to restart
        //         }
            // });
        // }catch(e){
        //     console.log(e);
        // }


    }).connect(sshConfig)
}
const remoteIntoServer = (sshConfig) => {
    let completeFlag = false;
    const conn = new Client();
    conn.on('ready', () => {
        spawnShellRemote(conn);
    }).connect(sshConfig)
}

let sshConfig = {
    host: '134.209.77.141',
    port: 22,
    username: 'root',
    privateKey: fs.readFileSync('C:\\Users\\DylanJackson\\Desktop\\DigitalOcean\\Key2\\Key2_rsa', 'utf8'),
    pkeyPath: 'C:\\Users\\DylanJackson\\Desktop\\DigitalOcean\\Key2\\Key2_rsa',
    passphrase: 'Smile0759' // Password for key - replace with prompt
  }
previsionServer(sshConfig, "1880","kppetro.co",true);
// remoteIntoServer(sshConfig);
// console.log("Cleaning up...")
// fs.writeFileSync(path.join(__dirname,`nodered-settings.js`),genNodeConfig("123leave.com","1880"))
// fs.writeFileSync(path.join(__dirname,`nodered.conf`),generateNginxConfig(sshConfig.host,"kppetro.co","1880"))
// console.log(`ssh root@${sshConfig.host} -i ${sshConfig.pkeyPath}`)
// runCommandLocal(`ssh root@${sshConfig.host} -i ${sshConfig.pkeyPath}`)
