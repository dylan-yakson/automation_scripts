const fs = require('fs');
const path = require('path');
const {runCommandRemote,uploadFile,runCommandLocal,spawnShellRemote,runInteractiveCommandRemote} = require('../../helpers')
const {Client} = require('ssh2')
const generateNginxConfig = require('./helpers');
// ***********************************************************************************
// Meant to be ran on Ubuntu 20.04 LTS Arm64
// https://github.com/nextcloud-snap/nextcloud-snap
// ***********************************************************************************

// let sshConfig = {
//     host: '143.244.175.205',
//     port: 22,
//     username: 'root',
//     privateKey: fs.readFileSync('C:\\Users\\DylanJackson\\Desktop\\DigitalOcean\\Key2\\Key2_rsa', 'utf8'),
//     passphrase: 'Smile0759' // Password for key - replace with prompt
//   }
//   let sshConfig = {
//     host: '192.168.1.39',
//     port: 22,
//     username: 'ubuntu',
//     password: 'Smile0759'
//   }
  let sshConfig = {
    host: '192.168.1.60',
    port: 22,
    username: 'ubuntu',
    password: 'Smile0759'
  }

let newServerConfig = {
    dbusername: 'ncadmin',
    dbpass: 'Smile0759'
}
  
// let officelocalFileName = path.join(__dirname,'onlyoffice.sh');
// let officeremoteFileName = `./onlyoffice.sh`
// spawnShellRemote(connection)


//"**************************"
// Custom Install Script
// Installs the services all at once with minimal user interaction
//"**************************"


const previsionServer = (sshConfig,port,appname) => {
    let completeFlag = false;
    const conn = new Client();
    let commands = `
    sudo pm2 delete 0

    sudo chmod +x ./install.sh
    sudo ./install.sh
    sudo unzip ~/${appname}.zip
    cd ~/app 
    cd ~/app && sudo npm i
    cd ~/app && sudo npm i @azure/msal-browser
    cd ~/app && sudo npm i react-router-dom
    cd ~/app && sudo npm run build 
    sudo mkdir /var/www/${appname}
    sudo cp -r ~/app/build /var/www/${appname}
    sudo pm2 serve /var/www/${appname}/build/ ${port} --spa --name "${appname}"
    sudo pm2 startup
    sudo pm2 save

    sudo cp ~/${appname}.conf /etc/nginx/sites-available/${appname}.conf
    ln -s ../sites-available/${appname}.conf
    sudo service nginx restart
    `    
    // sudo pm2 serve /var/www/salesreport/build/ 1313 --ssl-cert /root/certs/192.168.1.39.pem --ssl-key /root/certs/192.168.1.39-key.pem --spa

    // sudo pm2 serve /var/www/${appname}/build/ ${port} --spa --name "${appname}"
    // sudo pm2 start --name "${appname}" --watch "PORT=${port} HTTPS=true SSL_CRT_FILE=/root/certs/${sshConfig.host}.pem SSL_KEY_FILE=/root/certs/${sshConfig.host}-key.pem" ./node_modules/react-scripts/scripts/start.js 

    // let commands = `
    // sudo chmod +x ./install.sh
    // sudo ./install.sh
    // sudo cp ./${appname}.conf /etc/nginx/sites-enabled/${appname}.conf
    // sudo sed -i $'s/\r$//' /etc/nginx/sites-enabled/${appname}.conf
    // sudo unzip ./app.zip 
    // cd app 
    // sudo npm i
    // sudo npm i @azure/msal-browser
    // sudo npm i react-router-dom
    // sudo npm run build 
    // sudo mkdir /var/www/${appname}
    // sudo cp -r ./build /var/www/${appname}
    // sudo service nginx reload 
    // sudo service nginx restart
    // `

    conn.on('ready', async () => {
        console.log("**************************")
        console.log("Uploading Install Script")
        console.log("**************************")
        // fs.writeFileSync(path.join(__dirname,`reactapp.conf`),generateNginxConfig(appname,sshConfig.host,`/root/certs/${sshConfig.host}.pem`,`/root/certs/${sshConfig.host}-key.pem`,port))
        fs.writeFileSync(path.join(__dirname,`reactapp.conf`),generateNginxConfig(appname,sshConfig.host,``,``,port))

        // await uploadFile(path.join(__dirname,`${appname}.conf`),`${appname}.conf`,sshConfig)
        await uploadFile(path.join(__dirname,'config','install.sh'),`./install.sh`,sshConfig)
        await uploadFile(path.join(__dirname,'reactapp.conf'),`./reactapp.conf`,sshConfig)
        await uploadFile(path.join(__dirname,'app.zip'),`./${appname}.zip`,sshConfig)
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
                },20000) // Wait for 20 seconds so server has time to restart

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
previsionServer(sshConfig, "1313","salesreport");
// remoteIntoServer(sshConfig);
