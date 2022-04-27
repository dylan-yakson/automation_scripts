const fs = require('fs');
const path = require('path');
const {runCommandRemote,uploadFile,runCommandLocal,spawnShellRemote,runInteractiveCommandRemote,pullGitRepo,zipFolder, deleteIfExists} = require('../../helpers')
const {Client} = require('ssh2')
const generateNginxConfig = require('./helpers');

let defaultenv = `GENERATE_SOURCEMAP=false`
const updateReactServer = (sshConfig, port, siteName, reactenvFile=`GENERATE_SOURCEMAP=false`,reactAppPath='./app', popShell=false) => {
    // Add MSAL redirect URL
    reactenvFile = reactEnvFile + `\nREACT_MSAL_REDIRECT_URL=https://${siteName}`
    let commands = `
cd ~
sudo rm -rf ./app
sudo unzip ./app.zip -d ./app
sudo cp ./.env ./app/.env
cd ./app
sudo npm i -g yarn
sudo yarn
sudo yarn run build 
sudo cp -r ./build/. /var/www/html

sudo service nginx reload
sudo service nginx restart
cd ~
exit
    `
    let completeFlag = false;
    const conn = new Client();
    zipFolder(reactAppPath,'./app.zip')
    conn.on('ready', async () => {
        console.log("**************************")
        console.log("Uploading Install Script")
        console.log("**************************")
        // fs.writeFileSync(path.join(__dirname,`reactapp.conf`),generateNginxConfig(appname,sshConfig.host,`/root/certs/${sshConfig.host}.pem`,`/root/certs/${sshConfig.host}-key.pem`,port))
        // fs.writeFileSync(path.join(__dirname,`reactapp.conf`),generateNginxConfig(siteName,sshConfig.host,port))
        fs.writeFileSync(path.join(__dirname,'reactapp.env'),reactEnvFile)
        // await uploadFile(path.join(__dirname,`${appname}.conf`),`${appname}.conf`,sshConfig)
        await uploadFile(path.join(__dirname,'reactapp.env'),`./.env`,sshConfig)
        await uploadFile(path.join(__dirname,'app.zip'),`./app.zip`,sshConfig)
        try{
            await runCommandRemote(commands,conn, () => {

                console.log("**************************")
                console.log("Deployment Complete! :)")
                console.log("")
                if(popShell){
                    console.log("Waiting 20 seconds and popping a shell")
                }
                console.log("**************************")
                conn.end()
                // deleteIfExists(path.resolve('./app'), 'dir')
                // deleteIfExists(path.resolve('./app.zip'), 'file')
                deleteIfExists(path.resolve('./reactapp.conf'), 'file')
                deleteIfExists(path.resolve('./reactapp.env'), 'file')
                deleteIfExists(path.resolve('./app.zip'), 'file')
                if(popShell){
                    setTimeout(() => {
                        const conn2 = new Client();
                        conn2.on('ready', () => {
                            // Cleanup
                            spawnShellRemote(conn2);
                        }).connect(sshConfig)
                    },20000) // Wait for 20 seconds so server has time to restart
                }
            });
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


// previsionServer(sshConfig, "80","kpitboard.xyz",reactEnvFile, false);// "http://192.168.1.67:3000/Key-Performance-Petroleum/KOA-rewrite-live-dylan-only.git");
// remoteIntoServer(sshConfig);
// console.log("Cleaning up...")
module.exports = updateReactServer;
