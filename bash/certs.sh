#!/usr/bin/env bash
if [$1]; then
    SITE = $1;
else
    read -p "请输入绑定域名:" SITE;
fi

sudo apt update
sudo apt upgrade -y
sudo apt install letsencrypt nginx -y

sudo service nginx stop
sudo letsencrypt certonly --standalone --agree-tos --email s@ireoo.com -d $SITE
sudo service nginx start

echo "sed -i 's/api.qiyi.io/$SITE/g' ./nginx/api.conf" | sudo bash -
sudo cp ./nginx/api.conf /etc/nginx/conf.d/api.conf
sudo nginx -s reload

sudo echo '* 5 * * * root service nginx stop && letsencrypt renew && service nginx start' >> /etc/crontab
