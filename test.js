require('dotenv').config()
const fs = require('fs');
const path = require('path');
const {Client} = require('ssh2')
const { encryptFile, decryptFile } = require('./utils/index')

const hardenServer = require('./templates/LinuxServerHarden/digitalocean');

const serverHost = '192.168.1.65'; // Replace with .env?
// const serverHost = '207.154.226.27'; // Replace with .env?

const masterKeyRootPath =  path.join(__dirname,'keys');
const masterKeyFilePath = path.join(masterKeyRootPath, 'mastamane.prv.pem');
const encryptedKeyPath =  path.join(masterKeyRootPath,'mastafilekey');


const encryptFileBasePath =  path.join(__dirname,'dokey');

const fileToEncrypt1 = path.join(encryptFileBasePath, 'dokey_rsa');
const cryptname1 = path.join(encryptFileBasePath, 'crypt-rsa');
const fileToEncrypt2 = path.join(encryptFileBasePath, 'dokey_rsa.pub');
const cryptname2 = path.join(encryptFileBasePath, 'crypt-pub');


// encryptFile(fileToEncrypt1, masterKeyFilePath, encryptedKeyPath,true, cryptname1);
// encryptFile(fileToEncrypt2, masterKeyFilePath, encryptedKeyPath,true, cryptname2);
const logString = decryptFile(cryptname2, masterKeyFilePath,encryptedKeyPath, false, './clean')
console.log(logString)
fs.writeFileSync('./test-pub',logString)
// const logString = decryptFile(`./keys/${serverHost}.log-encrypted`, masterKeyFilePath,encryptedKeyPath, false, './clean')
// console.log(logString);
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
// const encryptedFilePath = path.join(masterKeyRootPath,`${serverHost}.log-encrypted`);
// const logFilePath = path.join(masterKeyRootPath, `${serverHost}.log`);
// encryptFile(logFilePath, masterKeyFilePath, encryptedKeyPath,true, encryptedFilePath);
