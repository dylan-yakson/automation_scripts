
    let generateNginxConfig = (serverName) => {
        let nginxConfig = `upstream php-handler {
            #server 127.0.0.1:9000;
            server unix:/var/run/php/php7.4-fpm.sock;
        }
        
        server {
            listen 80;
            listen [::]:80;
            server_name ${serverName};
            root /var/www/nextcloud;
            # Enforce HTTPS
            return 301 https://$server_name$request_uri;
        }
        
        server {
            listen 443      ssl http2;
            listen [::]:443 ssl http2;
            server_name ${serverName};
        
            # Use Mozilla's guidelines for SSL/TLS settings
            # https://mozilla.github.io/server-side-tls/ssl-config-generator/
            #ssl_certificate     /etc/ssl/nginx/${serverName}.crt;
            #ssl_certificate_key /etc/ssl/nginx/${serverName}.key;
            ssl_certificate /etc/letsencrypt/live/www.${serverName}/fullchain.pem; # managed by Certbot
            ssl_certificate_key /etc/letsencrypt/live/www.${serverName}/privkey.pem; # managed by Certbot
            include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
            # HSTS settings
            # WARNING: Only add the preload option once you read about
            # the consequences in https://hstspreload.org/. This option
            # will add the domain to a hardcoded list that is shipped
            # in all major browsers and getting removed from this list
            # could take several months.
            #add_header Strict-Transport-Security "max-age=15768000; includeSubDomains; preload;" always;
        
            # set max upload size and increase upload timeout:
            client_max_body_size 512M;
            client_body_timeout 300s;
            fastcgi_buffers 64 4K;
        
            # Enable gzip but do not remove ETag headers
            gzip on;
            gzip_vary on;
            gzip_comp_level 4;
            gzip_min_length 256;
            gzip_proxied expired no-cache no-store private no_last_modified no_etag auth;
            gzip_types application/atom+xml application/javascript application/json application/ld+json application/manifest+json application/rss+xml application/vnd.geo+json application/vnd.ms-fontobject application/wasm application/x-font-ttf application/x-web-app-manifest+json application/xhtml+xml application/xml font/opentype image/bmp image/svg+xml image/x-icon text/cache-manifest text/css text/plain text/vcard text/vnd.rim.location.xloc text/vtt text/x-component text/x-cross-domain-policy;
        
            # Pagespeed is not supported by Nextcloud, so if your server is built
            # with the 'ngx_pagespeed' module, uncomment this line to disable it.
            #pagespeed off;
        
            # HTTP response headers borrowed from Nextcloud '.htaccess'
            add_header Referrer-Policy                      "no-referrer"   always;
            add_header X-Content-Type-Options               "nosniff"       always;
            add_header X-Download-Options                   "noopen"        always;
            add_header X-Frame-Options                      "SAMEORIGIN"    always;
            add_header X-Permitted-Cross-Domain-Policies    "none"          always;
            add_header X-Robots-Tag                         "none"          always;
            add_header X-XSS-Protection                     "1; mode=block" always;
        
            # Remove X-Powered-By, which is an information leak
            fastcgi_hide_header X-Powered-By;
        
            # Path to the root of your installation
            root /var/www/nextcloud;
        
            # Specify how to handle directories -- specifying '/index.php$request_uri'
            # here as the fallback means that Nginx always exhibits the desired behaviour
            # when a client requests a path that corresponds to a directory that exists
            # on the server. In particular, if that directory contains an index.php file,
            # that file is correctly served; if it doesn't, then the request is passed to
            # the front-end controller. This consistent behaviour means that we don't need
            # to specify custom rules for certain paths (e.g. images and other assets,
            # '/updater', '/ocm-provider', '/ocs-provider'), and thus
            # 'try_files $uri $uri/ /index.php$request_uri'
            # always provides the desired behaviour.
            index index.php index.html /index.php$request_uri;
        
            # Rule borrowed from '.htaccess' to handle Microsoft DAV clients
            location = / {
                if ( $http_user_agent ~ ^DavClnt ) {
                    return 302 /remote.php/webdav/$is_args$args;
                }
            }
        
            location = /robots.txt {
                allow all;
                log_not_found off;
                access_log off;
            }
        
            # Make a regex exception for '/.well-known' so that clients can still
            # access it despite the existence of the regex rule
            # 'location ~ /(\\.|autotest|...)' which would otherwise handle requests
            # for '/.well-known'.
            location ^~ /.well-known {
                # The rules in this block are an adaptation of the rules
                # in '.htaccess' that concern '/.well-known'.
        
                location = /.well-known/carddav { return 301 /remote.php/dav/; }
                location = /.well-known/caldav  { return 301 /remote.php/dav/; }
        
                location /.well-known/acme-challenge    { try_files $uri $uri/ =404; }
                location /.well-known/pki-validation    { try_files $uri $uri/ =404; }
        
                # Let Nextcloud's API for '/.well-known' URIs handle all other
                # requests by passing them to the front-end controller.
                return 301 /index.php$request_uri;
            }
        
            # Rules borrowed from '.htaccess' to hide certain paths from clients
            location ~ ^/(?:build|tests|config|lib|3rdparty|templates|data)(?:$|/)  { return 404; }
            location ~ ^/(?:\\.|autotest|occ|issue|indie|db_|console)                { return 404; }
        
            # Ensure this block, which passes PHP files to the PHP process, is above the blocks
            # which handle static assets (as seen below). If this block is not declared first,
            # then Nginx will encounter an infinite rewriting loop when it prepends '/index.php'
            # to the URI, resulting in a HTTP 500 error response.
            location ~ \\.php(?:$|/) {
                # Required for legacy support
                rewrite ^/(?!index|remote|public|cron|core\\/ajax\\/update|status|ocs\\/v[12]|updater\\/.+|oc[ms]-provider\\/.+|.+\\/richdocumentscode\\/proxy) /index.php$request_uri;
        
                fastcgi_split_path_info ^(.+?\\.php)(/.*)$;
                set $path_info $fastcgi_path_info;
        
                try_files $fastcgi_script_name =404;
        
                include fastcgi_params;
                fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
                fastcgi_param PATH_INFO $path_info;
                fastcgi_param HTTPS on;
        
                fastcgi_param modHeadersAvailable true;         # Avoid sending the security headers twice
                fastcgi_param front_controller_active true;     # Enable pretty urls
                fastcgi_pass php-handler;
        
                fastcgi_intercept_errors on;
                fastcgi_request_buffering off;
            }
        
            location ~ \\.(?:css|js|svg|gif|png|jpg|ico|wasm|tflite)$ {
                try_files $uri /index.php$request_uri;
                expires 6M;         # Cache-Control policy borrowed from '.htaccess'
                access_log off;     # Optional: Don't log access to assets
        
                location ~ \\.wasm$ {
                    default_type application/wasm;
                }
            }
        
            location ~ \\.woff2?$ {
                try_files $uri /index.php$request_uri;
                expires 7d;         # Cache-Control policy borrowed from '.htaccess'
                access_log off;     # Optional: Don't log access to assets
            }
        
            # Rule borrowed from '.htaccess'
            location /remote {
                return 301 /remote.php$request_uri;
            }
        
            location / {
                try_files $uri $uri/ /index.php$request_uri;
            }
        }`

return nginxConfig
}


module.exports = {
    generateNginxConfig
}

// let nginxConfig = `upstream php-handler {
//     #server 127.0.0.1:9000;
//     server unix:/var/run/php/php7.4-fpm.sock;
// }

// server {
//     listen 80;
//     listen [::]:80;
//     server_name ${serverName};
//     root /var/www/nextcloud;
//     # Enforce HTTPS
//     return 301 https://$server_name$request_uri;
// }

// server {
//     listen 443      ssl http2;
//     listen [::]:443 ssl http2;
//     server_name ${serverName};

//     # Use Mozilla's guidelines for SSL/TLS settings
//     # https://mozilla.github.io/server-side-tls/ssl-config-generator/
//     #ssl_certificate     /etc/ssl/nginx/${serverName}.crt;
//     #ssl_certificate_key /etc/ssl/nginx/${serverName}.key;
//     ssl_certificate /etc/letsencrypt/live/www.${serverName}/fullchain.pem; # managed by Certbot
//     ssl_certificate_key /etc/letsencrypt/live/www.${serverName}/privkey.pem; # managed by Certbot
//     include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
//     # HSTS settings
//     # WARNING: Only add the preload option once you read about
//     # the consequences in https://hstspreload.org/. This option
//     # will add the domain to a hardcoded list that is shipped
//     # in all major browsers and getting removed from this list
//     # could take several months.
//     #add_header Strict-Transport-Security "max-age=15768000; includeSubDomains; preload;" always;

//     # set max upload size and increase upload timeout:
//     client_max_body_size 512M;
//     client_body_timeout 300s;
//     fastcgi_buffers 64 4K;

//     # Enable gzip but do not remove ETag headers
//     gzip on;
//     gzip_vary on;
//     gzip_comp_level 4;
//     gzip_min_length 256;
//     gzip_proxied expired no-cache no-store private no_last_modified no_etag auth;
//     gzip_types application/atom+xml application/javascript application/json application/ld+json application/manifest+json application/rss+xml application/vnd.geo+json application/vnd.ms-fontobject application/wasm application/x-font-ttf application/x-web-app-manifest+json application/xhtml+xml application/xml font/opentype image/bmp image/svg+xml image/x-icon text/cache-manifest text/css text/plain text/vcard text/vnd.rim.location.xloc text/vtt text/x-component text/x-cross-domain-policy;

//     # Pagespeed is not supported by Nextcloud, so if your server is built
//     # with the 'ngx_pagespeed' module, uncomment this line to disable it.
//     #pagespeed off;

//     # HTTP response headers borrowed from Nextcloud '.htaccess'
//     add_header Referrer-Policy                      "no-referrer"   always;
//     add_header X-Content-Type-Options               "nosniff"       always;
//     add_header X-Download-Options                   "noopen"        always;
//     add_header X-Frame-Options                      "SAMEORIGIN"    always;
//     add_header X-Permitted-Cross-Domain-Policies    "none"          always;
//     add_header X-Robots-Tag                         "none"          always;
//     add_header X-XSS-Protection                     "1; mode=block" always;

//     # Remove X-Powered-By, which is an information leak
//     fastcgi_hide_header X-Powered-By;

//     # Path to the root of your installation
//     root /var/www/nextcloud;

//     # Specify how to handle directories -- specifying '/index.php$request_uri'
//     # here as the fallback means that Nginx always exhibits the desired behaviour
//     # when a client requests a path that corresponds to a directory that exists
//     # on the server. In particular, if that directory contains an index.php file,
//     # that file is correctly served; if it doesn't, then the request is passed to
//     # the front-end controller. This consistent behaviour means that we don't need
//     # to specify custom rules for certain paths (e.g. images and other assets,
//     # '/updater', '/ocm-provider', '/ocs-provider'), and thus
//     # 'try_files $uri $uri/ /index.php$request_uri'
//     # always provides the desired behaviour.
//     index index.php index.html /index.php$request_uri;

//     # Rule borrowed from '.htaccess' to handle Microsoft DAV clients
//     location = / {
//         if ( $http_user_agent ~ ^DavClnt ) {
//             return 302 /remote.php/webdav/$is_args$args;
//         }
//     }

//     location = /robots.txt {
//         allow all;
//         log_not_found off;
//         access_log off;
//     }

//     # Make a regex exception for '/.well-known' so that clients can still
//     # access it despite the existence of the regex rule
//     # 'location ~ /(\\.|autotest|...)' which would otherwise handle requests
//     # for '/.well-known'.
//     location ^~ /.well-known {
//         # The rules in this block are an adaptation of the rules
//         # in '.htaccess' that concern '/.well-known'.

//         location = /.well-known/carddav { return 301 /remote.php/dav/; }
//         location = /.well-known/caldav  { return 301 /remote.php/dav/; }

//         location /.well-known/acme-challenge    { try_files $uri $uri/ =404; }
//         location /.well-known/pki-validation    { try_files $uri $uri/ =404; }

//         # Let Nextcloud's API for '/.well-known' URIs handle all other
//         # requests by passing them to the front-end controller.
//         return 301 /index.php$request_uri;
//     }

//     # Rules borrowed from '.htaccess' to hide certain paths from clients
//     location ~ ^/(?:build|tests|config|lib|3rdparty|templates|data)(?:$|/)  { return 404; }
//     location ~ ^/(?:\\.|autotest|occ|issue|indie|db_|console)                { return 404; }

//     # Ensure this block, which passes PHP files to the PHP process, is above the blocks
//     # which handle static assets (as seen below). If this block is not declared first,
//     # then Nginx will encounter an infinite rewriting loop when it prepends '/index.php'
//     # to the URI, resulting in a HTTP 500 error response.
//     location ~ \\.php(?:$|/) {
//         # Required for legacy support
//         rewrite ^/(?!index|remote|public|cron|core\\/ajax\\/update|status|ocs\\/v[12]|updater\\/.+|oc[ms]-provider\/.+|.+\\/richdocumentscode\\/proxy) /index.php$request_uri;

//         fastcgi_split_path_info ^(.+?\.php)(/.*)$;
//         set $path_info $fastcgi_path_info;

//         try_files $fastcgi_script_name =404;

//         include fastcgi_params;
//         fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
//         fastcgi_param PATH_INFO $path_info;
//         fastcgi_param HTTPS on;

//         fastcgi_param modHeadersAvailable true;         # Avoid sending the security headers twice
//         fastcgi_param front_controller_active true;     # Enable pretty urls
//         fastcgi_pass php-handler;

//         fastcgi_intercept_errors on;
//         fastcgi_request_buffering off;
//     }

//     location ~ \\.(?:css|js|svg|gif|png|jpg|ico|wasm|tflite)$ {
//         try_files $uri /index.php$request_uri;
//         expires 6M;         # Cache-Control policy borrowed from '.htaccess'
//         access_log off;     # Optional: Don't log access to assets

//         location ~ \.wasm$ {
//             default_type application/wasm;
//         }
//     }

//     location ~ \\.woff2?$ {
//         try_files $uri /index.php$request_uri;
//         expires 7d;         # Cache-Control policy borrowed from '.htaccess'
//         access_log off;     # Optional: Don't log access to assets
//     }

//     # Rule borrowed from '.htaccess'
//     location /remote {
//         return 301 /remote.php$request_uri;
//     }

//     location / {
//         try_files $uri $uri/ /index.php$request_uri;
//     }
// }`