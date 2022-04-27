const fs = require('fs');
const path = require('path');
const {runCommandRemote,uploadFile,runCommandLocal,spawnShellRemote,runInteractiveCommandRemote,pullGitRepo,zipFolder, deleteIfExists} = require('../../helpers')
const {Client} = require('ssh2')
const generateNginxConfig = require('./helpers');




//"**************************"
// Custom Install Script
// Installs the services all at once with minimal user interaction
//"**************************"
let defaultenv = `REACT_APP_NODE_KEY=34534534
GENERATE_SOURCEMAP=false
PROD_URI=https://localhost:3000`;
const setupReactAppHardened = (sshConfig, port, siteName, reactEnvFile=defaultenv, reactAppPath='./app', popShell=false) => {
    // Add MSAL redirect URL
    reactEnvFile = reactEnvFile + `\nREACT_MSAL_REDIRECT_URL=https://${siteName}`

        // pullGitRepo(GitRepoPath,'./app',true, './app.zip')

        const zipPath =  path.resolve(path.join(__dirname, './app.zip'));
        zipFolder(reactAppPath,zipPath)
        // # sudo certbot --nginx -d ${siteName} -d www.${siteName}
    let commands = `
sudo chmod +x ./install.sh
sudo ./install.sh
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
sudo certbot --nginx --agree-tos --hsts --staple-ocsp --must-staple -d www.${siteName},${siteName} --email dylan.jackson@kppetro.com
sudo service nginx reload
sudo service nginx restart`

    // Give it time to save zip
        let completeFlag = false;
        const conn = new Client();
        conn.on('ready', async () => {
            console.log("**************************")
            console.log("Uploading Install Script")
            console.log("**************************")
            // fs.writeFileSync(path.join(__dirname,`reactapp.conf`),generateNginxConfig(appname,sshConfig.host,`/root/certs/${sshConfig.host}.pem`,`/root/certs/${sshConfig.host}-key.pem`,port))
            fs.writeFileSync(path.join(__dirname,`reactapp.conf`),generateNginxConfig(siteName,sshConfig.host,port))
            fs.writeFileSync(path.join(__dirname,'reactapp.env'),reactEnvFile)
            // await uploadFile(path.join(__dirname,`${appname}.conf`),`${appname}.conf`,sshConfig)
            await uploadFile(path.join(__dirname,'config','install.sh'),`./install.sh`,sshConfig)
            await uploadFile(path.join(__dirname,'reactapp.conf'),`./reactapp.conf`,sshConfig)
            await uploadFile(path.join(__dirname,'reactapp.env'),`./.env`,sshConfig)
            await uploadFile(zipPath,`./app.zip`,sshConfig)
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
                    deleteIfExists(path.resolve('./app.zip'), 'file')
                    deleteIfExists(path.resolve('./reactapp.conf'), 'file')
                    deleteIfExists(path.resolve('./reactapp.env'), 'file')
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

module.exports = setupReactAppHardened;