#!/usr/bin/env bash
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.0.list

sudo apt-get update
sudo apt-get install -y mongodb-org

sudo mkdir /home/MongoDB
sudo mkdir /home/MongoDB/log
sudo chown mongodb:mongodb -R /home/MongoDB

sudo sed -i 's/\/var\/lib\/mongodb/\/home\/MongoDB/g' /etc/mongod.conf
sudo sed -i 's/\/var\/log\/mongodb/\/home\/MongoDB\/log/g' /etc/mongod.conf

sudo service mongod start
sudo systemctl enable mongod

# MONGODB = "mongo"
mongo << EOF
use admin;
db.createUser({user: "root", pwd: "meiyoumeima", roles: [{role: "root", db: "admin"}]});
exit;
EOF

sudo sed -i 's/127.0.0.1/0.0.0.0/g' /etc/mongod.conf
sudo sed -i 's/#security:/security:\r\n  authorization: enabled/g' /etc/mongod.conf

sudo service mongod restart
