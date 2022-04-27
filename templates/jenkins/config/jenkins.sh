echo "*************************************"
echo "Installing Java JRE/JDK"
echo "*************************************"
sudo apt update -y 
sudo apt upgrade -y 
sudo apt-get install net-tools ca-certificates -y 

# sudo apt install openjdk-11-jre -y
sudo apt-get install openjdk-11-jdk -y

curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo tee \
  /usr/share/keyrings/jenkins-keyring.asc > /dev/null
echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
  https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null
sudo apt-get update -y
sudo apt-get install jenkins -y
sudo service jenkins start 

# sudo apt install default-jre -y
# sudo apt install default-jdk -y

# wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo apt-key add -
# sudo sh -c 'echo deb http://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
# sudo apt update -y
# sudo apt install jenkins  -y
# sudo systemctl start jenkins
# sudo ufw allow 8080
# sudo ufw allow OpenSSH
# sudo ufw enable
