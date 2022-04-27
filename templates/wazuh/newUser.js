const fs = require('fs');
const path = require('path');
const {runCommandRemote,uploadFile,runCommandLocal,spawnShellRemote,runInteractiveCommandRemote, downloadFile} = require('../../helpers')
const {Client} = require('ssh2')
// ***********************************************************************************
// Meant to be ran on Ubuntu 20.04 LTS Arm64
// https://github.com/nextcloud-snap/nextcloud-snap
// ***********************************************************************************


//   let sshConfig = {
//     host: '192.168.1.81',
//     port: 22,
//     username: 'ubuntu',
//     password: 'Smile0759'
//   }

//"**************************"
// Custom Install Script
// Installs the services all at once with minimal user interaction
//"**************************"

const addVpnUser = (sshConfig, username) => {
    let completeFlag = false;
    const conn = new Client();
    let commands = `
new_client () {
    # Generates the custom client.ovpn
    {
    cat /etc/openvpn/server/client-common.txt
    echo "<ca>"
    cat /etc/openvpn/server/easy-rsa/pki/ca.crt
    echo "</ca>"
    echo "<cert>"
    sed -ne '/BEGIN CERTIFICATE/,$ p' /etc/openvpn/server/easy-rsa/pki/issued/"$client".crt
    echo "</cert>"
    echo "<key>"
    cat /etc/openvpn/server/easy-rsa/pki/private/"$client".key
    echo "</key>"
    echo "<tls-crypt>"
    sed -ne '/BEGIN OpenVPN Static key/,$ p' /etc/openvpn/server/tc.key
    echo "</tls-crypt>"
    } > ~/"$client".ovpn
}
echo "Provide a name for the client:"
unsanitized_client=${username}
client=$(sed 's/[^0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-]/_/g' <<< "$unsanitized_client")
while [[ -z "$client" || -e /etc/openvpn/server/easy-rsa/pki/issued/"$client".crt ]]; do
    echo "$client: invalid name."
    read -p "Name: " unsanitized_client
    client=$(sed 's/[^0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-]/_/g' <<< "$unsanitized_client")
done
cd /etc/openvpn/server/easy-rsa/
EASYRSA_CERT_EXPIRE=3650 ./easyrsa build-client-full "$client" nopass
# Generates the custom client.ovpn
new_client
echo
echo "$client added. Configuration available in:" ~/"$client.ovpn"
exit
`
    conn.on('ready', async () => {
        console.log("**************************")
        console.log("Creating a new user")
        console.log("**************************")
        await uploadFile(path.join(__dirname,'config','install.sh'),`./install.sh`,sshConfig)
    
    
        // await uploadFile(path.join(__dirname,'nc_install_custom.sh'),`./nc_install_custom.sh`,sshConfig)
        try{
            await runCommandRemote(commands,conn, async () => {
                console.log("**************************")
                console.log("Restart initiated, waiting before complete before spawning a shell")
                console.log("**************************")
                await downloadFile(`./${username}.ovpn`,`/root/${username}.ovpn`,sshConfig)
                await conn.end()
                await setTimeout(() => {
                    const conn2 = new Client();
                    conn2.on('ready', () => {
                        spawnShellRemote(conn2);
                    }).connect(sshConfig)
                },5000) // Wait for 5 seconds then remote in
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
let sshConfig = {
    host: '159.89.126.71',
    port: 22,
    username: 'root',
    privateKey: fs.readFileSync('C:\\Users\\DylanJackson\\Desktop\\DigitalOcean\\Key2\\Key2_rsa', 'utf8'),
    passphrase: 'Smile0759' // Password for key - replace with prompt
  }
  addVpnUser(sshConfig, "TestMob2");
// remoteIntoServer(sshConfig);
