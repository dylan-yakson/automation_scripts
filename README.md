# automation_scripts
sample scripts I use to automate server deployment and react projects. Super messy and bleh. Will update if I have time maybe idk. Enjoy ;)

They way it works is it generates an rsa key encrypted with AES (shouldn't use rsa LOL.. or aes really... - follow nist) , and sets up a whole bunch of stuff on remote servers, 

while encrypting the ssh information and keys to the newly setup server (whatever service it may be) with the originally generated key so everything is encrypted at rest. Idea is to store the OG key on a thumb drive so even if someone gets access to your machine they dont have the server information. Useful for setting up numerous servers. 


Kind of stupid not going to lie. But it COULD be sweet if I took like 2 days to clean things up.


I don't really care to do that. But it shows my competency in automation with nodejs. kinda. 

I will say.... Ansible is so much cooler/better than this.

I can do better, don't judge. 

