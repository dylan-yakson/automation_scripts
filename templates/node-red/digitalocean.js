const fs = require('fs');
const path = require('path');
const {runCommandRemote,uploadFile,runCommandLocal,spawnShellRemote,runInteractiveCommandRemote,pullGitRepo,zipFolder, deleteIfExists} = require('../../helpers')
const {Client} = require('ssh2')
const {genNodeConfig} = require('./generateNodeConfig');
const {generateNginxConfig} = require('./generateNginxConfig');
const { config } = require('process');
const bcrypt = require('bcryptjs');

let defaultenv = `GENERATE_SOURCEMAP=false`
const setupNodeRedServer = (sshConfig, port, siteName,username,password, popShell=false) => {
    const hashedPassword = bcrypt.hashSync(password, 8);
    let commands = `
sudo chmod +x ./install.sh
sudo ./install.sh
sudo pm2 stop 0 
# # HTTPS CERT
sudo certbot --nginx --agree-tos --no-eff-email --hsts --staple-ocsp --must-staple -d www.${siteName},${siteName} --email dylan.jackson@kppetro.com
sudo ufw allow ${port}
sudo cp ~/nodered.conf /etc/nginx/sites-available/default
sudo chown ${sshConfig.username}:${sshConfig.username}  /root -R
sudo cp ~/settings.js /root/.node-red/settings.js 
sudo pm2 start 0
# # Install Node-Red Modules
cd /root/.node-red 
sudo npm install node-red-contrib-mssql-plus --unsafe-perm --save --save-dev
sudo npm uninstall mongodb
sudo npm uninstall node-red-mongodb
sudo npm uninstall -g node-red-mongodb 
sudo npm install mongodb
sudo npm install node-red-node-mongodb --unsafe-perm --save --save-dev
sudo npm install node-red-node-email --unsafe-perm --save --save-dev
sudo npm install pdfkit --unsafe-perm --save --save-dev
sudo service nginx start
sudo pm2 restart 0
#sudo reboot
`
    let completeFlag = false;
    const conn = new Client();
    deleteIfExists(path.join(__dirname,`nodered.conf`),'file')
    deleteIfExists(path.join(__dirname,`nodered-settings.js`),'file')
    conn.on('ready', async () => {
        
        console.log("**************************")
        console.log("Uploading Install Script")
        console.log("**************************")

        fs.writeFileSync(path.join(__dirname,`nodered.conf`),generateNginxConfig(sshConfig.host,siteName,port))
        fs.writeFileSync(path.join(__dirname,`nodered-settings.js`),genNodeConfig(siteName,port,username,hashedPassword))
        await uploadFile(path.join(__dirname,'config','install.sh'),`./install.sh`,sshConfig)
        await uploadFile(path.join(__dirname,'nodered.conf'),`./nodered.conf`,sshConfig)
        await uploadFile(path.join(__dirname,'nodered-settings.js'),`./settings.js`,sshConfig)
        try{
            await runCommandRemote(commands,conn, () => {

                console.log("**************************");
                console.log("Deployment Complete! :)");
                console.log("");
                console.log("**************************");
                conn.end();
                console.log(`ssh root@${sshConfig.host} -i ${sshConfig.pkeyPath}`);

                if(popShell){
                    console.log("Waiting 20 seconds and popping a shell")
                    setTimeout(() => {
                        const conn2 = new Client();
                        conn2.on('ready', () => {
                            // Cleanup
                            spawnShellRemote(conn2);
                        }).connect(sshConfig)
                    },5000); // Wait for 5 seconds so server has time to digest
                }
            });
        }catch(e){
            console.log(e);
        }


    }).connect(sshConfig)
}

module.exports = setupNodeRedServer;
// sudo certbot --nginx --agree-tos --no-eff-email --hsts --staple-ocsp --must-staple -d www.katalystintegrations.com,katalystintegrations.com --email dylan.jackson@kppetro.com
