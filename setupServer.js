require('dotenv').config()
const fs = require('fs');
const path = require('path');
const {Client} = require('ssh2')
const { encryptFile, decryptFile, createMasterKeys } = require('./utils/index')

const hardenServer = require('./templates/LinuxServerHarden/digitalocean');

const serverList = [
  process.env.SERVER_IP
]; 
const masterKeyRootPath =  path.join(__dirname,'keys');
const masterKeyFilePath = path.join(masterKeyRootPath, 'mastamane.prv.pem');
const encryptedKeyPath =  path.join(masterKeyRootPath,'mastafilekey');

for(let i in serverList){
  const serverIP = serverList[i];
  console.log(`Setting up: ${serverIP}`);

  // createMasterKeys('mastamane', masterKeyRootPath, 'superdupersecretkey', encryptedKeyPath )
  const logString = decryptFile(`./kpkey/crypt-rsa`, masterKeyFilePath,encryptedKeyPath, false, './clean')
  console.log(logString);
  // Initial Config used on new droplets 
  let sshConfig1 = {
      host: serverIP,
      port: 22,
      username: 'root',
      privateKey: logString, 
      passphrase: process.env.INITIAL_CONFIG_KEY_PASSPHRASE || process.argv[2], 
    }
  hardenServer(sshConfig1, 'test_user', masterKeyFilePath, encryptedKeyPath);
}
