require('dotenv').config()
const fs = require('fs');
const path = require('path');
const {Client} = require('ssh2')

const hardenServer = require('./templates/LinuxServerHarden/digitalocean');
const setupOpenVpn = require('./templates/OpenVPN/openvpn');
const addVpnUser = require('./templates/OpenVPN/newUser');

const setupIVREServer = require('./templates/IVRE/index');
const { setupDepTrackServer, setupJenkinsServer, setupJSScanServer } = require('./templates/jenkins/index');
const setupMythicServer = require('./templates/mythic/mythic');
const setupNextCloudNginx = require('./templates/nextcloud-nginx/digitalocean');
const setupNodeRedServer = require('./templates/node-red/digitalocean');
const setupGiteaServer = require('./templates/gitea/gitea');
const backupGiteaServer = require('./templates/gitea/backup');
const setupTruDeskServer = require('./templates/trudesk/digitalocean');
const setupSnipeItServer = require('./templates/snipeit/snipeit');
const setupFaradayServer = require('./templates/faraday/faraday');

const setupReactAppHardened = require('./templates/react-app-hardened/digitalocean');
const updateReactServer = require('./templates/react-app-update-live/digitalocean');
const setupWazuh = require('./templates/wazuh/install');
const deployWazuhAgent = require('./templates/wazuh/deployAgent');
const setupHELKServer = require('./templates/HELK/helk');

const { createMasterKeys, encryptFile, decryptFile } = require('./utils/index');

const {spawnShellRemote, pullKeyValuesFromLogFile, pullKeyValuesFromLogString} = require('./helpers');


const serverHost = 'xxx.xxx.xxx.xxx';
const masterKeyRootPath =  path.join(__dirname,'keys');
const masterKeyFilePath = path.join(masterKeyRootPath, 'mastamane.prv.pem');

const encryptedKeyPath =  path.join(__dirname,'keys','key77');

// createMasterKeys('mastamane', masterKeyRootPath, 'superdupersecretkeybitchaz', encryptedKeyPath )

// Initial Config used on new droplets 
// let sshConfig1 = {
//     host: serverHost,
//     port: 22,
//     username: 'root',
//     // password: process.env.INITIAL_CONFIG_PASS,
//     privateKey: fs.readFileSync(process.env.INITIAL_CONFIG_KEY_PATH, 'utf8'),
//     passphrase: process.env.INITIAL_CONFIG_KEY_PASSPHRASE, 
//   }
// hardenServer(sshConfig1, 'k0a', masterKeyFilePath, encryptedKeyPath);

const logString = decryptFile(`./keys/${serverHost}.log-encrypted`, masterKeyFilePath,encryptedKeyPath, false, './clean')
// // Pulls updated config from hardened droplets 
const serverCreds = pullKeyValuesFromLogString(logString)
console.log(serverCreds)
let sshConfig = {
    host: serverHost,
    username: serverCreds.user,
    // Can be a string, Buffer, or parsed key containing a private key
    privateKey: serverCreds.sshKey,
    // `passphrase` only required for encrypted keys
    passphrase: serverCreds.sshKeyPass,
  }
setupHELKServer(sshConfig);
// setupSnipeItServer(sshConfig);
// setupWazuh(sshConfig);
// deployWazuhAgent(sshConfig,'x.x.x.x','wazuhUser','wasuhPassword');
// setupOpenVpn(sshConfig)
// setupNodeRedServer(sshConfig, "1880","katalystintegrations.com","dj0759", "node-red-password", true);

// let reactEnvFile = `REACT_APP_NODE_KEY=${process.env.REACT_APP_NODE_KEY}
// GENERATE_SOURCEMAP=false
// PROD_URI=https://kp01-01.com`;
// setupReactAppHardened(sshConfig, "80","kp01-01.com",reactEnvFile, path.join(__dirname, 'app'));

// const conn2 = new Client();
// conn2.on('ready', () => {
//     // Cleanup
//     spawnShellRemote(conn2);
// }).connect(sshConfig)
