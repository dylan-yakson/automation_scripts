let generateNginxConfig = (siteName="app",serverIPAddress, port="80") => {
    let template = `
##
# Default server configuration
#
server {
    listen ${port} default_server;
    root /var/www/html;
    index index.html index.html ;
    server_name ${serverIPAddress};
    access_log /var/log/reactapp.access.log;
    error_log /var/log/reactapp.error.log;
    location / {
        try_files $uri $uri/ =404;
      }
    }
    `

    return template
}


module.exports = generateNginxConfig