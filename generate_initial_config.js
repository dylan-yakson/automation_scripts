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

const { createMasterKeys, encryptFileWithPhrase, decryptFileWithPhrase ,encryptFile, decryptFile } = require('./utils/index');

const {spawnShellRemote, spawnShellRemoteTest, pullKeyValuesFromLogFile, pullKeyValuesFromLogString, spawnShellandRunCommand} = require('./helpers');


const serverHost = process.env.SERVER_IP;
const masterKeyRootPath =  path.join(__dirname,'keys');
const masterKeyFilePath = path.join(masterKeyRootPath, 'mastamane.prv.pem');
const encryptedKeyPath =  path.join(masterKeyRootPath,'mastafilekey');

// Creates master keys to encrypt credentials of hardened servers
// This should be kept offline on a spare USB if possible.
createMasterKeys('mastamane', masterKeyRootPath, 'superdupersecretkey', encryptedKeyPath )

// // // Pulls updated config from hardened droplets if you need to manually do something
// const logString = decryptFile(`./keys/${serverHost}.log-encrypted`, masterKeyFilePath,encryptedKeyPath, false, './clean')
// console.log(logString);
// const serverCreds = pullKeyValuesFromLogString(logString)
// console.log(serverCreds);
// encryptFileWithPhrase(masterKeyFilePath,'Smile0759',true,'./mastamane.prv.pem.enc')
// decryptFileWithPhrase('./mastamane.prv.pem.enc','Smile0759',true,'./mastamane.prv.pem')

