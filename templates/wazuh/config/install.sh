
sudo apt install curl apt-transport-https unzip wget libcap2-bin software-properties-common lsb-release gnupg -y
sudo curl -s https://packages.wazuh.com/key/GPG-KEY-WAZUH | apt-key add -
sudo echo "deb https://packages.wazuh.com/4.x/apt/ stable main" | tee -a /etc/apt/sources.list.d/wazuh.list
sudo apt-get update -y

# # # Wazuh Manager  # # #
sudo apt-get install wazuh-manager -y
sudo systemctl daemon-reload
sudo systemctl enable wazuh-manager
sudo systemctl start wazuh-manager

# # # Elastic Search   # # #
sudo apt install elasticsearch-oss opendistroforelasticsearch -y
# # Configure Elastic Search
sudo curl -so /etc/elasticsearch/elasticsearch.yml https://packages.wazuh.com/resources/4.2/open-distro/elasticsearch/7.x/elasticsearch_all_in_one.yml

# # Elasticsearch Users & Roles 
sudo curl -so /usr/share/elasticsearch/plugins/opendistro_security/securityconfig/roles.yml https://packages.wazuh.com/resources/4.2/open-distro/elasticsearch/roles/roles.yml
sudo curl -so /usr/share/elasticsearch/plugins/opendistro_security/securityconfig/roles_mapping.yml https://packages.wazuh.com/resources/4.2/open-distro/elasticsearch/roles/roles_mapping.yml
sudo curl -so /usr/share/elasticsearch/plugins/opendistro_security/securityconfig/internal_users.yml https://packages.wazuh.com/resources/4.2/open-distro/elasticsearch/roles/internal_users.yml

# # Certificates 
#Remove Old Certs
sudo rm /etc/elasticsearch/esnode-key.pem /etc/elasticsearch/esnode.pem /etc/elasticsearch/kirk-key.pem /etc/elasticsearch/kirk.pem /etc/elasticsearch/root-ca.pem -f

# # Install Cert Tool
sudo curl -so ~/wazuh-cert-tool.sh https://packages.wazuh.com/resources/4.2/open-distro/tools/certificate-utility/wazuh-cert-tool.sh
sudo curl -so ~/instances.yml https://packages.wazuh.com/resources/4.2/open-distro/tools/certificate-utility/instances_aio.yml
sudo bash ~/wazuh-cert-tool.sh

# # Move ElasticSearch to proper locations 
sudo mkdir /etc/elasticsearch/certs/
sudo mv ~/certs/elasticsearch* /etc/elasticsearch/certs/
sudo mv ~/certs/admin* /etc/elasticsearch/certs/
sudo cp ~/certs/root-ca* /etc/elasticsearch/certs/

# # To Mitigate Log4j Exploit 
sudo mkdir -p /etc/elasticsearch/jvm.options.d
sudo echo '-Dlog4j2.formatMsgNoLookups=true' > /etc/elasticsearch/jvm.options.d/disabledlog4j.options
sudo chmod 2750 /etc/elasticsearch/jvm.options.d/disabledlog4j.options
sudo chown root:elasticsearch /etc/elasticsearch/jvm.options.d/disabledlog4j.options

# # Start Elastic 
sudo systemctl daemon-reload
sudo systemctl enable elasticsearch
sudo systemctl start elasticsearch

# # Run script to export & use new certificates
export JAVA_HOME=/usr/share/elasticsearch/jdk/ && sudo /usr/share/elasticsearch/plugins/opendistro_security/tools/securityadmin.sh -cd /usr/share/elasticsearch/plugins/opendistro_security/securityconfig/ -nhnv -cacert /etc/elasticsearch/certs/root-ca.pem -cert /etc/elasticsearch/certs/admin.pem -key /etc/elasticsearch/certs/admin-key.pem

# # Confirm we are up and running
curl -XGET https://localhost:9200 -u admin:admin -k
# # Remove Elasticsearch Performance Analyzer 
/usr/share/elasticsearch/bin/elasticsearch-plugin remove opendistro-performance-analyzer

# # # Installing FileBeat  # # #
sudo apt-get install filebeat -y 

# # Prebuilt Filebeat configuration file used to forward the Wazuh alerts to Elasticsearch
sudo curl -so /etc/filebeat/filebeat.yml https://packages.wazuh.com/resources/4.2/open-distro/filebeat/7.x/filebeat_all_in_one.yml

# # Alert Template 
sudo curl -so /etc/filebeat/wazuh-template.json https://raw.githubusercontent.com/wazuh/wazuh/4.2/extensions/elasticsearch/7.x/wazuh-template.json
sudo chmod go+r /etc/filebeat/wazuh-template.json

# # Wazuh Module for FileBeat 
sudo curl -s https://packages.wazuh.com/4.x/filebeat/wazuh-filebeat-0.1.tar.gz | tar -xvz -C /usr/share/filebeat/module

# # # Copy certs to filebeat
sudo mkdir /etc/filebeat/certs
sudo cp ~/certs/root-ca.pem /etc/filebeat/certs/
sudo mv ~/certs/filebeat* /etc/filebeat/certs/

# # Enable & Start Filebeat Service
sudo systemctl daemon-reload
sudo systemctl enable filebeat
sudo systemctl start filebeat

# Test Filebeat 
filebeat test output

# # # Installing Kibana # # #
sudo apt-get install opendistroforelasticsearch-kibana
# # Kibana Configuration
sudo curl -so /etc/kibana/kibana.yml https://packages.wazuh.com/resources/4.2/open-distro/kibana/7.x/kibana_all_in_one.yml

# Create Kibana User Data Directory 
sudo mkdir /usr/share/kibana/data
sudo chown -R kibana:kibana /usr/share/kibana/data

# # Install Kibana Wazuh Plugin
cd /usr/share/kibana
sudo -u kibana /usr/share/kibana/bin/kibana-plugin install https://packages.wazuh.com/4.x/ui/kibana/wazuh_kibana-4.2.5_7.10.2-1.zip

# # Copy Elastic Certs into /etc/kibana/certs
sudo mkdir /etc/kibana/certs
sudo cp ~/certs/root-ca.pem /etc/kibana/certs/
sudo mv ~/certs/kibana* /etc/kibana/certs/
sudo chown kibana:kibana /etc/kibana/certs/*

# # Load Kibana socket to privileged port 443
sudo setcap 'cap_net_bind_service=+ep' /usr/share/kibana/node/bin/node

# Start Kibanba
sudo systemctl daemon-reload
sudo systemctl enable kibana
sudo systemctl start kibana

# # # Change Default Passwords 
# # Download wazuh passwords tool 
sudo curl -so wazuh-passwords-tool.sh https://packages.wazuh.com/resources/4.2/open-distro/tools/wazuh-passwords-tool.sh
sudo bash wazuh-passwords-tool.sh -a > ~/passwords.txt

sudo cat ~/passwords.txt

# Remove Performance Analyzer 
/usr/share/elasticsearch/bin/elasticsearch-plugin remove opendistro-performance-analyzer
