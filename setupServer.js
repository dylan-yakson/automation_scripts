require('dotenv').config()
const fs = require('fs');
const path = require('path');
const {Client} = require('ssh2')
const { encryptFile, decryptFile } = require('./utils/index')

const hardenServer = require('./templates/LinuxServerHarden/digitalocean');

const serverHost = '136.244.87.168'; // Replace with .env?
const masterKeyRootPath =  path.join(__dirname,'keys');
const masterKeyFilePath = path.join(masterKeyRootPath, 'mastamane.prv.pem');
const encryptedKeyPath =  path.join(masterKeyRootPath,'mastafilekey');

// createMasterKeys('mastamane', masterKeyRootPath, 'superdupersecretkeybitchaz', encryptedKeyPath )
const logString = decryptFile(`./dokey/crypt-rsa`, masterKeyFilePath,encryptedKeyPath, false, './clean')
// Initial Config used on new droplets 
let sshConfig1 = {
    host: serverHost,
    port: 22,
    username: 'root',
    password: "9[eYcm{vZpu9eUbL", //process.argv[2], //process.env.INITIAL_CONFIG_PASS,
    // privateKey: logString, //fs.readFileSync(process.env.INITIAL_CONFIG_KEY_PATH, 'utf8'),
    // passphrase: process.argv[2] || process.env.INITIAL_CONFIG_KEY_PASSPHRASE, 
  }
hardenServer(sshConfig1, 'k0a', masterKeyFilePath, encryptedKeyPath);
