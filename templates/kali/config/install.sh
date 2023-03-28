sudo apt-get update
sudo apt-get -y install wget gnupg dirmngr
sudo wget -q -O - https://archive.kali.org/archive-key.asc | gpg --import

sudo gpg --keyserver hkps://keys.openpgp.org --recv-key 44C6513A8E4FB3D30875F758ED444FF07D8D0BF6
sudo gpg --export --armor 44C6513A8E4FB3D30875F758ED444FF07D8D0BF6 > kali-key.asc
echo 'deb https://http.kali.org/kali kali-rolling main non-free contrib' > /etc/apt/sources.list

sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys ED444FF07D8D0BF6
gpg -a --export ED444FF07D8D0BF6 | sudo apt-key add -

sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt-get install kali-linux-everything
cd ~/Documents
git clone https://github.com/BishopFox/sliver --recursive
cd ./sliver 
sudo apt-get install golang -y
go build .
go install .
