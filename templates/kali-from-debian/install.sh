sudo gpg --keyserver hkps://keys.openpgp.org --recv-key 44C6513A8E4FB3D30875F758ED444FF07D8D0BF6

sudo gpg --export --armor 44C6513A8E4FB3D30875F758ED444FF07D8D0BF6 > kali-key.asc
sed -i 's/bullseye/bookworm/g' /etc/apt/sources.list.d/qubes-r4.list
sudo echo 'deb https://http.kali.org/kali kali-rolling main non-free contrib' > /etc/apt/sources.list

sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys ED444FF07D8D0BF6
