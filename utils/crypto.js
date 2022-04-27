const rs = require('jsrsasign');
const rsu = require('jsrsasign-util');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
let genCSR_Keypair = (keyName = 'keyTest', pass="SecretPassToSignCertWith",dn = '/C=US/O=TEST', keyalg = "EC", keysize = "4096",  curve="secp256r1") => {
    // program
    // .version('1.0.2 (2016-Sep-11)')
    // .description('generate keypair and CSR, then save them to FILEHEAD.{pub,prv,csr}')
    // .usage('[options] [file head]')
    // .option('-a, --keyalg <RSA|EC>', 'public key algorithm. default=RSA', "RSA")
    // .option('-s, --size <key size>', 'RSA key size. default=2048', "2048")
    // .option('-c, --curve <curve name>', 'EC curve name. default=secp256r1', 'secp256r1')
    // .option('-d, --dn <DN name>', 'subject DN for CSR. default=/C=US/O=TEST', '/C=US/O=TEST')
    // .option('-p, --pass <password>', 'password for PKCS#8 private key. default=passwd', 'passwd')
    // .parse(process.argv);


    // let keyName = 'keyTest';
    // let dn = '/C=US/O=TEST';

    // let keyalg = "RSA"
    // let keysize =  "2048";
    let keyopt, sigalg;
    if (keyalg === "RSA") {
        keyopt = parseInt(keysize);
        sigalg = "SHA256withRSA";
    } else {
       keyopt = curve;
       sigalg = "SHA256withECDSA";
    }

    let pubFile = keyName + ".pub";
    let prvFile = keyName + ".prv";
    let csrFile = keyName + ".csr";

    console.log("generating keypair...");
    let kp = rs.KEYUTIL.generateKeypair(keyalg, keyopt);
    console.log("done.");
    let prvKey = kp.prvKeyObj;
    let pubKey = kp.pubKeyObj;

    let csr = rs.asn1.csr.CSRUtil.newCSRPEM({
        subject: { str: dn },
        sbjpubkey: pubKey,
        sigalg: sigalg,
        sbjprvkey: prvKey
    });

    rsu.saveFile(pubFile, rs.KEYUTIL.getPEM(pubKey));
    rsu.saveFile(prvFile, rs.KEYUTIL.getPEM(prvKey, "PKCS8PRV", pass));
    rsu.saveFile(csrFile, csr);
    let returnObj = {
        pubKey: {
            path: path.join(process.cwd(),pubFile),
            data: rs.KEYUTIL.getPEM(pubKey)
        },
        privKey: {
            path: path.join(process.cwd(),prvFile),
            data:rs.KEYUTIL.getPEM(prvKey, "PKCS8PRV", pass)
        },
        csr: {
            path: path.join(process.cwd(),csrFile),
            data: csr
        },
    }
    return returnObj;

    console.log("all save done.");
}
let genRSAKey = (fileName = "keyTest", keyDir= path.join(process.cwd(),'keys'), keyalg = "rsa", keysize = 2048, curve = "secp256r1", pkcs = "1", hex = false) => {

    let keyname = fileName;
    let kp;
    //   let keyalg = program.keyalg;
    if (keyalg === "rsa") {
        //  let keysize = parseInt(program.keysize);
        console.log("generating RSA " + keysize + "bit key pair...");
        kp = rs.KEYUTIL.generateKeypair("RSA", keysize);
    } else if (keyalg === "ec") {
        console.log("generating EC curve " + curve + " key pair...");
        kp = rs.KEYUTIL.generateKeypair("EC", curve);
    } else {
        throw "unsupported key algorithm: " + keyalg;
    }
    let prvFileName, pubFileName;
    if (keyname !== undefined) {
		prvFileName = keyname + ".prv.pem"
		prvFileName = path.join(keyDir, prvFileName)
		pubFileName = keyname + ".pub.pem"
		pubFileName = path.join(keyDir, pubFileName)

    }

    let prvKey = kp.prvKeyObj;
    let pubKey = kp.pubKeyObj;

    let prvKeyPEM, pubKeyPEM;
    if (pkcs === "8") {
        prvKeyPEM = rs.KEYUTIL.getPEM(prvKey, "PKCS8PRV");
    } else {
        prvKeyPEM = rs.KEYUTIL.getPEM(prvKey, "PKCS1PRV");
    }
    pubKeyPEM = rs.KEYUTIL.getPEM(pubKey);

    if (hex === true && keyalg === "ec") {
        prvKeyPEM = prvKey.prvKeyHex;
        pubKeyPEM = pubKey.pubKeyHex;
        console.log(prvKey.ecparams.keylen)
	}
	if(!fs.existsSync(path.join(process.cwd(),'keys'))){
		fs.mkdirSync(path.join(process.cwd(),'keys'));
	}


    console.log("write private key: " + prvFileName);
    rsu.saveFile(prvFileName, prvKeyPEM)
    console.log("write public key: " + pubFileName);
    rsu.saveFile(pubFileName, pubKeyPEM)
    console.log("done.");
    let returnObj = {
        pubKey: {
            path: pubFileName,
            data: pubKeyPEM
        },
        privKey: {
            path: prvFileName,
            data: prvKeyPEM
        }
    }
    return returnObj;

}

let encryptData = (inFileOrStr = "Path_To_File_Or_Blank_To_Return_Result", pubKeyFileOrStr = "keyTest.pub.pem", saveToFile = true, outFile = "encryptedFile") => {

    // program
    //     .version('1.0.0 (2016-Nov-05)')
    //     .usage('[options] <input plain file> <output encrypted file> <PEM RSA public key file> [RSA|RSAOAEP*]')
    //     .description('encrypt data')
    //     .parse(process.argv);

    let keyObj, inStr, encHex;
    let algName = "RSA";
    let keyStr = "";
    let keyFileOrStr = pubKeyFileOrStr;
    // let inFileOrStr = program.args[0];
    // let outFile = program.args[1];
    // let keyFileOrStr = program.args[2];
    // if (program.args.length > 3) algName = program.args[3];

    try {
        keyStr = rsu.readFile(keyFileOrStr);
    } catch (ex) {
        keyStr = keyFileOrStr;
        saveToFile = false;

    }

    try {
        inStr = rsu.readFile(inFileOrStr);
    } catch (ex) {
        inStr = inFileOrStr;
    }

    try {
        keyObj = rs.KEYUTIL.getKey(keyStr);
    } catch (ex) { };

    if ( (keyObj instanceof rs.RSAKey || keyObj instanceof rs.ECDSA) && keyObj.isPublic) {
        encHex = rs.KJUR.crypto.Cipher.encrypt(inStr, keyObj, algName);
        if (saveToFile) {
            console.log("data encrypted successfully\n");
            rsu.saveFileBinByHex(outFile, encHex);
            return {
				path: path.join(process.cwd(),outFile),
				data: encHex
			};
        } else {
            console.log("data encrypted successfully\n");
            // console.log(encHex);
            return encHex;

        }
    } else {
        // console.log(keyObj);
        console.log("data encryption failed");
    }

}
let decryptData = (inFileOrHex = "Path_To_File_Or_Blank_To_Return_Result", keyFileOrStr = "keyTest.prv.pem", saveToFile = false, outFile = "decrypted.txt") => {

    // program
    //     .version('1.0.0 (2016-Nov-05)')
    //     .usage('[options] <encrypted data file> <output plain file or "-"> <PEM RSA private key file> [RSA|RSAOEAP*>]')
    //     .description('encrypt data')
    //     .parse(process.argv);
    let algName = "RSA";
    let keyObj, inHex, encHex;
    // let algName = "RSA";
    let keyStr = "";

    try {
        keyStr = rsu.readFile(keyFileOrStr);
    } catch (ex) {
        saveToFile = false;
        keyStr = keyFileOrStr;
    }

    try {
        inHex = rs.rstrtohex(rsu.readFile(inFileOrHex));
    } catch (ex) {
        inHex = inFileOrHex;
    }

    try {
        keyObj = rs.KEYUTIL.getKey(keyStr);
    } catch (ex) { };

    if (keyObj instanceof rs.RSAKey && keyObj.isPrivate) {
        let plainStr = rs.KJUR.crypto.Cipher.decrypt(inHex, keyObj, algName);
        if (outFile === "-") {
            process.stdout.write(plainStr);
        } else {
            if (saveToFile) {
                rsu.saveFile(outFile, plainStr);
                console.log("data decrypted and write to file successfully");
                let returnObj = {
                    path: outFile,
                    data: plainStr
                }
                return returnObj;
            } else {
                console.log("data decrypted successfully");
                // console.log(plainStr);
                return plainStr;

            }
        }
    } else {
        console.log("data decryption failed");
    }


}
let signData = (textOrFile = "TestEncrypted", privateKey = "keyTest.prv.pem", outFile = "TestSigned") => {
    // program
    //     .version('1.0.0 (2016-Nov-19)')
    //     .usage('[options] <text or file> <private key> <output signature file> [sig alg]')
    //     .description('sign text or file with specified private key and sig algorithm.')
    //     .parse(process.argv);

    // if (program.args.length !== 3 && program.args.length !== 4)
    //     throw "wrong number of arguments";

    // let textOrFile = program.args[0];
    // let prvFile = program.args[1];
    // let outFile = program.args[2];
    let hashAlg = "SHA1withRSA";
    let prvFile = privateKey;
    // if (program.args.length === 4) hashAlg = program.args[3];

	// 1. private key
	console.log(prvFile);
	let prvPEM = rsu.readFile(prvFile);
	console.log(prvPEM);
    let prv = rs.KEYUTIL.getKey(prvPEM);
    let saveToFile = true;
    //console.log(prv);

    // 2. data to be signed
    let text;
    try {
        text = rsu.readFile(textOrFile);
    } catch (ex) {
        text = textOrFile;
        saveToFile = false;
    }

    let sig = new rs.KJUR.crypto.Signature({ alg: hashAlg });
    sig.init(prv);
    sig.updateString(text);
    let sigHex = sig.sign();
    if (saveToFile) {
		if(!fs.existsSync(path.join(process.cwd(),'keys'))){
			fs.mkdirSync(path.join(process.cwd(),'keys'))
		}

        rsu.saveFileBinByHex(path.join(process.cwd(),'keys',outFile), sigHex);
        let returnObj = {
                path: path.join(process.cwd(),'keys',outFile),
                data: sigHex
        }
        console.log("successfully signed");
        return returnObj;
    } else {
        console.log("successfully signed");
        return sigHex;
    }
    //console.log(sigHex);

}
let verifySignature = (textOrFile = "TestEncrypted", sigFile = "./signature.sig", pubFile = "./keyTest.pub.pem") => {

    // program
    //     .version('1.0.0 (2016-Nov-19)')
    //     .usage('[options] <text or file> <public key> <input signature file> [sig alg]')
    //     .description('verify signature of text or file with specified public and sig algorithm.')
    //     .parse(process.argv);

    // if (program.args.length !== 3 && program.args.length !== 4)
        // throw "wrong number of arguments";

    // let textOrFile = program.args[0];
    // let pubFile = program.args[1];
    // let sigFile = program.args[2];
    let hashAlg = "SHA1withRSA";
    // if (program.args.length === 4) hashAlg = program.args[3];

    // 1. public key
    let pubPEM = rsu.readFile(pubFile);
    let pub = rs.KEYUTIL.getKey(pubPEM);
    //console.log(pub);

    // 2. data to be verifid
    let text;
    try {
        text = rsu.readFile(textOrFile);
    } catch (ex) {
        text = textOrFile;
    }

    // 3. load signature
    let sigHex = rsu.readFileHexByBin(sigFile);

    let sig = new rs.KJUR.crypto.Signature({ alg: hashAlg });
    sig.init(pub);
    sig.updateString(text);
    let isValid = sig.verify(sigHex);

    if (isValid) {
        console.log("signature is valid");
        return true;
    } else {
        console.log("signature is invalid");
        return false;
    }





}
//Encrypting text
function encryptAES(text, key) {
    const IV = crypto.randomBytes(16); // set random initialisation vector

    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), IV);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([IV, encrypted, cipher.final()]);
    // return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
    return encrypted.toString('hex');
 }
 
 // Decrypting text
 function decryptAES(text, key) {
    const bufferedText = Buffer.from(text, 'hex');
    const ivtmp = bufferedText.slice(0, 16);
    const encryptedData = bufferedText.slice(16);
    let iv = ivtmp;
    let encryptedText = Buffer.from(encryptedData, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
 }


module.exports = {genRSAKey, encryptData, decryptData, signData, verifySignature, encryptAES, decryptAES};