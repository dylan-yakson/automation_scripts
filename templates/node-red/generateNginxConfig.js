/**
 * This is the default settings file provided by Node-RED.
 *
 * It can contain any valid JavaScript code that will get run when Node-RED
 * is started.
 *
 * Lines that start with // are commented out.
 * Each entry should be separated from the entries above and below by a comma ','
 *
 * For more information about individual settings, refer to the documentation:
 *    https://nodered.org/docs/user-guide/runtime/configuration
 * 
 **/

let generateNginxConfig = (siteIpAddress,site,  port) => {
    let config = `server {
    listen 80;
    listen 443 ssl http2;
    server_name ${site} www.${site};
    ssl_certificate /etc/letsencrypt/live/www.${site}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/www.${site}/privkey.pem;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5;
    ssl_prefer_server_ciphers On;
    ssl_session_cache shared:SSL:128m;
    ssl_stapling on;
    ssl_stapling_verify on;
    resolver 8.8.8.8;
    location / {
        if ($scheme = http) {
            return 301 https://$server_name$request_uri;
        }
        proxy_pass http://localhost:${port};
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location '/.well-known/acme-challenge' {
        root /var/www/html;
    }
}`
return config;
//     let config = `#proxy for node-red @ port :1880
//     # Redirect all http to https
//     server {
//             listen 80 default_server;
//             listen [::]:80;
    
//             server_name _;
    
//             return 301 https://$host$request_uri;
//     }
    
//     # Proxy Node-RED
//     server {
//             # Ports to listen on.
//             listen 443 ssl http2;
//             listen [::]:443 ssl http2 ipv6only=on;
    
//             # If you want to limit this config to specific (sub)domain names:
//             server_name ${site} www.${site} nr.${site};
    
//             # Specify the public cert and private key
//             ssl_certificate /etc/letsencrypt/live/www.${site}/fullchain.pem;
//             ssl_certificate_key /etc/letsencrypt/live/www.${site}/privkey.pem;
//             # Require safe TLS protocols only
//             ssl_protocols TLSv1.1 TLSv1.2;
//             # Only use secure encryption ciphers
//             ssl_ciphers EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5;
//             # Configure for Strict Transport Security (HSTS)
//             add_header Strict-Transport-Security "max-age=15768000; includeSubDomains" always;
    
//             #location = /robots.txt {
//             #       add_header  Content-Type  text/plain;
//             #       return 200 "User-agent: *\\nDisallow: /\\n";
//             #}
    
//             # Specify the actual URL path to proxy
//             # NOTE: To change this to something other than '/', you have to add a rewrite rule:
//             #           # Assuming you want to use 'location /red/'
//             #           rewrite ^/red/(.*)$ /$1 break;
//             location / {
//                     # Change the IP address and port to match your instance of Node-RED
//                     # Note that you don't need to make Node-RED serve https if it is on the same
//                     #      server as NGINX
//                     proxy_pass http://${siteIpAddress}:${port};
    
//                     # If using a location other than just  '/', we need to rewrite all of the /red/ URLS to remove the 'red' part
//             # If we don't, the node.js server won't understand the requests
//                     #rewrite ^/red/(.*)$ /$1 break;
    
//             # If you only want to expose the Node-RED Dashboard instead of the whole of Node-RED ...
//             # of course, you can do this for any Node-RED path, such as a specific uibuiler URL.
//             #rewrite ^/(.*)$ /ui/$1 break;
    
//                     #Defines the HTTP protocol version for proxying by default it it set to 1.0.
//                     #For Websockets and keepalive connections you need to use the version 1.1
//                     proxy_http_version  1.1;
    
//                     #Sets conditions under which the response will not be taken from a cache.
//                     proxy_cache_bypass  $http_upgrade;
    
//                     #These header fields are required if your application is using Websockets
//                     proxy_set_header Upgrade $http_upgrade;
//                     proxy_set_header Connection "upgrade";
    
//                     #The $host variable in the following order of precedence contains:
//                     #hostname from the request line, or hostname from the Host request header field
//                     #or the server name matching a request.
//                     proxy_set_header Host $host;
    
//                     #Forwards the real visitor remote IP address to the proxied server
//                     proxy_set_header X-Real-IP $remote_addr;
    
//                     #A list containing the IP addresses of every server the client has been proxied through
//                     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    
//                     #When used inside an HTTPS server block, each HTTP response from the proxied server is rewritten to HTTPS.
//                     proxy_set_header X-Forwarded-Proto $scheme;
    
//                     #Defines the original host requested by the client.
//                     proxy_set_header X-Forwarded-Host $host;
    
//                     #Defines the original port requested by the client.
//                     proxy_set_header X-Forwarded-Port $server_port;
    
//             }
    
//             # You can create multiple locations with different paths.
//             # You will need to do this if you are running uibuilder on its own webserver (and so with a different port).
//     }`
// return config;

// let newconfig = `server {
//     listen 80;
//     listen [::]:80;

//     server_name ${site} www.${site};

//     location = /robots.txt {
//         add_header  Content-Type  text/plain;
//         return 200 "User-agent: *\nDisallow: /\n";
//     }
//     location / {
//             proxy_pass http://127.0.0.1:${port};

//             #Defines the HTTP protocol version for proxying
//             #by default it it set to 1.0.
//             #For Websockets and keepalive connections you need to use the version 1.1    
//             proxy_http_version  1.1;

//             #Sets conditions under which the response will not be taken from a cache.
//             proxy_cache_bypass  $http_upgrade;

//             #These header fields are required if your application is using Websockets
//             proxy_set_header Upgrade $http_upgrade;

//             #These header fields are required if your application is using Websockets    
//             proxy_set_header Connection "upgrade";

//             #The $host variable in the following order of precedence contains:
//             #hostname from the request line, or hostname from the Host request header field
//             #or the server name matching a request.    
//             proxy_set_header Host $host;

//             #Forwards the real visitor remote IP address to the proxied server
//             proxy_set_header X-Real-IP $remote_addr;

//             #A list containing the IP addresses of every server the client has been proxied through    
//             proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

//             #When used inside an HTTPS server block, each HTTP response from the proxied server is rewritten to HTTPS.    
//             proxy_set_header X-Forwarded-Proto $scheme;

//             #Defines the original host requested by the client.    
//             proxy_set_header X-Forwarded-Host $host;

//             #Defines the original port requested by the client.    
//             proxy_set_header X-Forwarded-Port $server_port;

//     }
// }`
// return newconfig;
//     let config = `server {
//     listen 80;
//     listen 443 ssl http2;
//     server_name ${site};
//     ssl_certificate /etc/letsencrypt/live/www.${site}/fullchain.pem;
//     ssl_certificate_key /etc/letsencrypt/live/www.${site}/privkey.pem;
//     ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
//     ssl_ciphers EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5;
//     ssl_prefer_server_ciphers On;
//     ssl_session_cache shared:SSL:128m;
//     ssl_stapling on;
//     ssl_stapling_verify on;
//     resolver 8.8.8.8;
//     location / {
//         if ($scheme = http) {
//             return 301 https://$server_name$request_uri;
//         }
//         proxy_pass http://localhost:${port};
//         proxy_set_header Host $host;
//         proxy_set_header X-Real-IP $remote_addr;
//         proxy_http_version 1.1;
//         proxy_set_header Upgrade $http_upgrade;
//         proxy_set_header Connection "upgrade";
//     }

//     location '/.well-known/acme-challenge' {
//         root /var/www/html;
//     }
// }`
// return config;
}
module.exports = { generateNginxConfig }