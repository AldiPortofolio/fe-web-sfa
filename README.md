invision: https://invis.io/ZQN0XNXG5RF#/309376343_login_Email
zeplin: https://app.zeplin.io/project/5b505a5c7cbb564b7da0f698/dashboard
firebase: https://sfa-otto.firebaseapp.com/
apiary: https://ottosfaadmin.docs.apiary.io/

==== HOW TO DEPLOY TO PRODUCTION (https://websfa.ottopay.id/) ====

- Connect to VPN (Forticlient) use one among these IP
    IP: 103.36.34.126
    PORT: 9998

- SSH to server
    1. ssh ca.elvack@10.10.43.19 
    2. insert: Anggr3k#! (first factor is password for ssh account)
    3. insert second factor is otp of ssh account

- Go to App Folder
    1. sudo su - clappingape
    2. cd /ottosfa-frontend/sfaotto/

- Pull from repository and restart app
    1. git pull origin master

- How to run
    1. npm run build
    2. pm2 restart all

