sudo apt-get update -y 
sudo apt-get upgrade -y
sudo apt-get install python3 -y
sudo apt-get install python3-pip -y 
wget https://github.com/smicallef/spiderfoot/archive/v4.0.tar.gz
tar zxvf v4.0.tar.gz
cd spiderfoot-4.0
sudo python3 -m pip install -r requirements.txt



