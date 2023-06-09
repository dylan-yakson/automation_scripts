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
const setupIntelOwlServer = require('./templates/IntelOwl');
const setupHiveServer = require('./templates/TheHive');
const setupSupersetServer = require('./templates/superset');
const setupSpiderFoot = require('./templates/spiderfoot');

const { createMasterKeys, encryptFile, decryptFile } = require('./utils/index');

const {spawnShellRemote, spawnShellRemoteTest, uploadFile, pullKeyValuesFromLogFile, pullKeyValuesFromLogString, spawnShellandRunCommand, uploadFileSync} = require('./helpers');


const serverHost = '1192.168.1.3';  //process.env.SERVER_IP;
const masterKeyRootPath =  path.join(__dirname,'keys');
const masterKeyFilePath = path.join(masterKeyRootPath, 'mastamane.prv.pem');
const encryptedKeyPath =  path.join(masterKeyRootPath,'mastafilekey');

let sshConfig = {
    host: serverHost,
    username: serverCreds.user,
    // Can be a string, Buffer, or parsed key containing a private key
    privateKey: serverCreds.sshKey,
    // `passphrase` only required for encrypted keys
    passphrase: serverCreds.sshKeyPass,
  }
// uploadFileSync('./nodered-settings.js', '/root/.node-red/nodered-settings.js',sshConfig);
spawnShellRemoteTest(sshConfig)
// setupOpenVpn(sshConfig)
// setupIntelOwlServer(sshConfig);
// setupHELKServer(sshConfig);
// setupSnipeItServer(sshConfig);
// setupWazuh(sshConfig);
// deployWazuhAgent(sshConfig,'x.x.x.x','wazuhUser','wasuhPassword');
// setupNodeRedServer(sshConfig, "1880","honeypot02jaja.com","dj0759", "node-red-pass", true);
// setupHiveServer(sshConfig);
// setupSupersetServer(sshConfig);
// setupSpiderFoot(sshConfig, "dj0759", "boopadupabitchassssssss")
// setupGiteaServer(sshConfig);
// backupGiteaServer(sshConfig);
// setupIVREServer(sshConfig);
// let reactEnvFile = `REACT_APP_NODE_KEY=${process.env.REACT_APP_NODE_KEY}
// GENERATE_SOURCEMAP=false


