sudo apt-get install -y openjdk-8-jre-headless
echo JAVA_HOME="/usr/lib/jvm/java-8-openjdk-amd64" >> /etc/environment
export JAVA_HOME="/usr/lib/jvm/java-8-openjdk-amd64"

curl -fsSL https://www.apache.org/dist/cassandra/KEYS | sudo apt-key add -
echo "deb http://www.apache.org/dist/cassandra/debian 311x main" | sudo tee -a /etc/apt/sources.list.d/cassandra.sources.list

sudo apt update
sudo apt install cassandra

cqlsh -e "UPDATE system.local SET cluster_name = 'thp' where key='local';"
nodetool flush
sudo cp /etc/cassandra/cassandra.yaml /etc/cassandra/cassandra.yaml_DIST
sudo sed -i "s|cluster_name: 'Test Cluster'|cluster_name: 'thp'|g" /etc/cassandra/cassandra.yaml
service cassandra restart

# Local Lucene Engine (Use Elasticsearch if on cluster)
sudo mkdir /opt/thp/thehive/index
chown thehive:thehive -R /opt/thp/thehive/index
#Use Local Filesystem
sudo mkdir -p /opt/thp/thehive/files
sudo chown -R thehive:thehive /opt/thp/thehive/files

#install The hive
curl https://raw.githubusercontent.com/TheHive-Project/TheHive/master/PGP-PUBLIC-KEY | sudo apt-key add -

echo 'deb https://deb.thehive-project.org release main' | sudo tee -a /etc/apt/sources.list.d/thehive-project.list
sudo apt-get update
sudo apt-get install thehive4

sudo cat >/etc/thehive/application.conf <<EOL
db {
  provider: janusgraph
  janusgraph {
    storage {
      backend: cql
      hostname: ["165.227.150.100"] # seed node ip addresses
      #username: "<cassandra_username>"       # login to connect to database (if configured in Cassandra)
      #password: "<cassandra_passowrd"
      cql {
        cluster-name: thp       # cluster name
        keyspace: thehive           # name of the keyspace
        local-datacenter: datacenter1   # name of the datacenter where TheHive runs (relevant only on multi datacenter setup)
        # replication-factor: 2 # number of replica
        read-consistency-level: ONE
        write-consistency-level: ONE
      }
    }
	index.search {
      backend : lucene
      directory:  /opt/thp/thehive/index
    }
  }
}
EOL

sudo chown -R thehive:thehive /opt/thp/thehive/files
sudo tee -a /etc/thehive/application.conf <<EOF
storage {
	provider = localfs
	localfs.location = /opt/thp/thehive/files
}
EOF
sudo service thehive start