const fs = require('fs');
const path = require('path');

const sftpClient = require('ssh2-sftp-client');
const { exec } = require('child_process');

// ***********************************************************************************
// Public key authentication and non-interactive (exec) command execution
// ***********************************************************************************
const Zip = require("adm-zip");

const downloadGitRepo = require("download-git-repo")

let zipFolder = (folderPath, zipName= "./app.zip") => {
  var zip = new Zip(); 
  // creates new in memory zip
  if(fs.existsSync(folderPath)){
    zip.addLocalFolder(folderPath)
  }else {
    fs.mkdirSync(folderPath)
    zip.addLocalFolder(folderPath)

  }
  return zip.writeZip(zipName)
}

let pullGitRepo = (repo,localFilePath='./app',zip=true,zipName='./app.zip') => {
  // const pullGitRepo = exec(`cd ${__dirname} && git pull ${repo} app`);
  // return pullGitRepo;

   downloadGitRepo(`direct:${repo}`,localFilePath, { clone: true }, function (err) {
    if(zip){
      return zipFolder(localFilePath,zipName)
    }
  return console.log(err ? 'Error' : 'Success')
  })
}
const deleteIfExists = (path, fileOrDir='file') => {
  switch(fileOrDir){
      case 'file':
          if(fs.existsSync(path)){
              fs.unlinkSync(path)
          }
          break;
      case 'dir':
          if(fs.existsSync(path)){
              fs.rmdirSync(path,{ recursive: true })
          }
          break;
      default:
          break;
  }
  return 'finished'
}
const createIfNotExists = (path, fileOrDir='file') => {
  switch(fileOrDir){
      case 'file':
          if(!fs.existsSync(path)){
              fs.writeFileSync(path,'','utf8')
          }
          break;
      case 'dir':
          if(!fs.existsSync(path)){
              fs.mkdirSync(path,{ recursive: true })
          }
          break;
      default:
          break;
  }
  return 'finished'
}
let runCommandRemote = (command, conn,callbackfunction=()=>{console.log("Command Finished")}) => {
    // conn.on('ready', () => {
        return conn.exec(command,{ pty: true }, (err, stream) => {
            if (err) throw err;
    
            const stdinListener = (data) => {
                // skipNext = true;
                stream.stdin.write(data);
            };
    
            stream.on('close', function() {
                process.stdin.removeListener("data", stdinListener)
                // conn.end();
                callbackfunction()

            }).stderr.on('data', function(data) {
               conn.end();
              console.log(data);
            });
 
    
            // skip next stops double printing of input
            // let skipNext = false;
            stream.stdout.on("data", (data) => {
                // if (skipNext) { return skipNext = false; }
                if(data){
                  process.stdout.write(data);
                }
            }).stderr.on('data',function(data){
                console.log(data);
                stream.close();
                callbackfunction()

                // conn.end();
            })
    
            process.stdin.on("data", stdinListener)
    
          });
          
    // }).connect(connectionOptions);
}
let runInteractiveCommandRemote = (command, conn) => {
    // const conn = new Client();
    // conn.on('ready', () => {
        conn.shell(function(err, stream) {
            if (err) throw err;
            stream.on('close', function() {
              conn.end();
            }).on('data', function(data) {
              console.log('>' + data);
            });
            stream.end(`${command}\nexit\n`);
          });
    // }).connect(connectionOptions);
}
let spawnShellRemote = ( conn) => {
    console.log("**************************")
    console.log("Remoting in")
    console.log("**************************")
    // const conn = new Client();
    // conn.on('ready', () => {
        conn.shell(true,(err, stream) => {
            if (err) throw err;
            // stream.on('close', () => {
            //   console.log('Stream :: close');
            //   conn.end();
            // }).on('data', (data) => {
            //   console.log('OUTPUT: ' + data);
            // });
            // stream.pipe()
            // stream.end('ls -l\nexit\n');
            stream.on('close', function() {
                process.stdin.removeListener("data", stdinListener)
                conn.end();
            }).stderr.on('data', function(data) {
                if (skipNext) { return skipNext = false; }
                process.stdout.write(data);
            });

            // skip next stops double printing of input
            let skipNext = true;
            const stdinListener = (data) => {
              skipNext = true;
              stream.stdin.write(data);
            };
            stream.stdout.on("data", (data) => {
                if (skipNext) { return skipNext = false; }
                process.stdout.write(data);
            })

            process.stdin.on("data", stdinListener)

        });
    // }).connect(connectionOptions);
}


let uploadFile = (localFilePath, remoteFilePath, connectionOptions) => {
    
    let sftpServer = new sftpClient();
    return sftpServer.connect(connectionOptions).then(() => {
        return sftpServer.put(localFilePath,remoteFilePath)
      }).then(data => {
        console.log(data);
        sftpServer.end();
        return;
      }).catch(err => {
        console.log(err, 'catch error');
        sftpServer.end();
      });

}
let downloadFile = (localFilePath, remoteFilePath, connectionOptions) => {
  console.log(`Starting download for ${remoteFilePath}`)
  let sftpServer = new sftpClient();
  try{
    let dst = fs.createWriteStream(localFilePath);
    return sftpServer.connect(connectionOptions).then(() => {
      return sftpServer.get(remoteFilePath,dst)
    }).then(data => {
      // console.log(data);
      console.log(`\nDownloaded ${remoteFilePath} \n\tTo ${localFilePath}\n`)
      sftpServer.end();
      return;
    }).catch(err => {
      console.log(err, 'catch error');
      sftpServer.end();
    });
  }catch(Error){
      console.log("unable to create write stream to local file:")
      console.log(Error);
  }
}
let downloadFolder = async (localFilePath, remoteFilePath, connectionOptions) => {
      
  let sftpServer = new sftpClient();
  return sftpServer.connect(connectionOptions).then(() => {
      return sftpServer.downloadDir(remoteFilePath, localFilePath)
    }).then(data => {
      console.log(data);
      sftpServer.end();
      return;
    }).catch(err => {
      console.log(err, 'catch error');
      sftpServer.end();
    });

 
}
let uploadFileSync = (localFilePath, remoteFilePath, connectionOptions) => {
    
  let sftpServer = new sftpClient();
  sftpServer.connect(connectionOptions).then(() => {
      return sftpServer.put(localFilePath,remoteFilePath)
    }).then(data => {
      console.log(data);
      sftpServer.end();
      return;
    }).catch(err => {
      console.log(err, 'catch error');
      sftpServer.end();
    });

}

let runCommandLocal = (command) => {
    exec(command, { pty: true },(err, stdout, stderr) => {
        if (err) {
          // node couldn't execute the command
          console.log("error running command locally")
          console.log(err);
          return;
        }
      
        // the *entire* stdout and stderr (buffered)
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
      });
}
let pullKeyValuesFromLogFile = (logFile) => {
  const LogText = fs.readFileSync(logFile, 'utf8')
  let sshKeyPassSearchResult = LogText.match(/SSH Key Passphrase\:.(.*)\n/gi)[0];
  sshKeyPassSearchResult = sshKeyPassSearchResult.replace("SSH Key Passphrase: ","").trim()

  let userNameSearchResult = LogText.match(/User Name\:.(.*)\n/gi)[0];
  userNameSearchResult = userNameSearchResult.replace("User Name: ","").trim()
  
  let userPassSearchResult = LogText.match(/User\'s Password\:.(.*)\n/gi)[0];
  userPassSearchResult = userPassSearchResult.replace("User\'s Password: ","").trim()
  
  let rootPassSearchResult = LogText.match(/New root Password\:.(.*)\n/gi)[0];
  rootPassSearchResult = rootPassSearchResult.replace("New root Password: ","").trim()
  
  let sshKeySearchResult = LogText.match(/-----BEGIN OPENSSH PRIVATE KEY-----\n(.*\n)*(-----END OPENSSH PRIVATE KEY-----)/gi)[0];
  
  let sshPublicKeySearchResult = LogText.match(/ssh-rsa(.*)\n/gi)[0];
  
  const responseObj = {
    user: userNameSearchResult,
    pass: userPassSearchResult,
    rootPass: rootPassSearchResult,
    sshKeyPass: sshKeyPassSearchResult,
    sshKey: sshKeySearchResult,
    publicKey: sshPublicKeySearchResult,
  };
  return responseObj;
}
let pullKeyValuesFromLogString = (LogText) => {
  let sshKeyPassSearchResult = LogText.match(/SSH Key Passphrase\:.(.*)\n/gi)[0];
  sshKeyPassSearchResult = sshKeyPassSearchResult.replace("SSH Key Passphrase: ","").trim()

  let userNameSearchResult = LogText.match(/User Name\:.(.*)\n/gi)[0];
  userNameSearchResult = userNameSearchResult.replace("User Name: ","").trim()
  
  let userPassSearchResult = LogText.match(/User\'s Password\:.(.*)\n/gi)[0];
  userPassSearchResult = userPassSearchResult.replace("User\'s Password: ","").trim()
  
  let rootPassSearchResult = LogText.match(/New root Password\:.(.*)\n/gi)[0];
  rootPassSearchResult = rootPassSearchResult.replace("New root Password: ","").trim()
  
  let sshKeySearchResult = LogText.match(/-----BEGIN OPENSSH PRIVATE KEY-----\n(.*\n)*(-----END OPENSSH PRIVATE KEY-----)/gi)[0];
  
  let sshPublicKeySearchResult = LogText.match(/ssh-rsa(.*)\n/gi)[0];
  
  const responseObj = {
    user: userNameSearchResult,
    pass: userPassSearchResult,
    rootPass: rootPassSearchResult,
    sshKeyPass: sshKeyPassSearchResult,
    sshKey: sshKeySearchResult,
    publicKey: sshPublicKeySearchResult,
  };
  return responseObj;
}

module.exports = {
    pullKeyValuesFromLogString,
    pullKeyValuesFromLogFile,
    uploadFile,
    runCommandRemote,
    runCommandLocal,
    spawnShellRemote,
    runInteractiveCommandRemote,
    uploadFileSync,
    downloadFile,
    downloadFolder,
    zipFolder,
    pullGitRepo,
    deleteIfExists,
    createIfNotExists
}

