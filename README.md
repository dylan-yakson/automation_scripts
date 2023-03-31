# automation_scripts
sample scripts I use to automate server deployment and react projects. Super messy and bleh. Will update if I have time maybe idk. Enjoy ;)

They way it works is it generates an rsa key encrypted with AES (shouldn't use rsa LOL.. or aes really... - follow nist) , and sets up a whole bunch of stuff on remote servers via ssh, 

while encrypting the ssh information and keys to the newly setup server (whatever service it may be) with the originally generated key so everything is encrypted at rest. Idea is to store the OG key on a thumb drive so even if someone gets access to your machine they dont have the server information. Useful for setting up numerous servers. 
How to use:

setup


# Setup initial keys to encrypt sensitive server information
node ./generate_initial_config

# Harden a debian server with best practices
node ./setupServer

# Setup service of choice - Remember to uncomment what you use lol.. I'll make a better cli later
node ./index
