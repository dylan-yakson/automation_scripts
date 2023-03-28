const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const {genRSAKey, encryptData, decryptData, signData, verifySignature, encryptAES, decryptAES} = require('./crypto');

const createMasterKeys = (keyname='test', masterRSAKeyPath=path.join(process.cwd(),'keys'), passphrase = 'MySuperSecretKey', encryptedKeyPath = './keys/key1a') => {
    const generatedRSAKeys = genRSAKey(keyname,masterRSAKeyPath);
    let ENC_KEY = passphrase;
    ENC_KEY = crypto.createHash('sha256').update(String(ENC_KEY)).digest('base64').substr(0, 32);
    let encryptedKey = encryptData(ENC_KEY.toString(), generatedRSAKeys.pubKey.path, true, encryptedKeyPath);
    return {generatedRSAKeys, encryptedKey};
}
const encryptFile = (filePath, rsaPrivKey, encryptedKeyPath = './keys/key1a', newFile=false, newFilePath='./keys/decryptedFile') => {
    let decryptedKey = decryptData(encryptedKeyPath, rsaPrivKey, false);
    let test = encryptAES(fs.readFileSync(filePath, 'utf-8'), decryptedKey);
    if(newFile){
        fs.writeFileSync(newFilePath, test, 'utf8')
    }
    return test
}
const decryptFile = (filePath, rsaPrivKey, encryptedKeyPath = './keys/key1a', newFile=false, newFilePath='./keys/decryptedFile') => {
    let decryptedKey = decryptData(encryptedKeyPath, rsaPrivKey, false);
    let test = decryptAES(fs.readFileSync(filePath, 'utf-8'), decryptedKey);
    if(newFile){
        fs.writeFileSync(newFilePath, test, 'utf8')
    }
    return test
}
const decryptFileWithPhrase = (filePath, passphrase, newFile=false, newFilePath='./keys/decryptedFile') => {
    let ENC_KEY = passphrase;
    ENC_KEY = crypto.createHash('sha512').update(String(ENC_KEY)).digest('base64').substr(0, 32);
    let test = decryptAES(fs.readFileSync(filePath, 'utf-8'), ENC_KEY);
    if(newFile){
        fs.writeFileSync(newFilePath, test, 'utf8')
    }
    return test
}
const encryptFileWithPhrase = (filePath, passphrase, newFile=false, newFilePath='./keys/decryptedFile') => {
    let ENC_KEY = passphrase;
    ENC_KEY = crypto.createHash('sha512').update(String(ENC_KEY)).digest('base64').substr(0, 32);

    let test = encryptAES(fs.readFileSync(filePath, 'utf-8'), ENC_KEY);
    if(newFile){
        fs.writeFileSync(newFilePath, test, 'utf8')
    }
    return test
}
// let filePath = path.join(__dirname,'164.92.223.219.log');
// let encryptedFilePath = path.join(__dirname,'164.92.223.219.log');
// encryptFile(filePath, keys.privKey.path,encryptedFilePath);
// decryptFile(encryptedFilePath, keys.privKey.path, false,  './clean')

module.exports = {
    encryptFileWithPhrase,
    decryptFileWithPhrase,
    createMasterKeys,
    encryptFile,
    decryptFile
}