if [$1]; then
    SITE = $1;
else
    read -p "请输入绑定域名:" SITE;
fi

apt update
apt upgrade -y
apt install letsencrypt nginx -y

service nginx stop
letsencrypt certonly --standalone --agree-tos --email s@ireoo.com -d $SITE
service nginx start

sed -i 's/api.qiyi.io/$SITE/g' ./nginx/api.conf
cp ./nginx/api.conf /etc/nginx/conf.d/api.conf
nginx -s reload

echo '* 5 * * * root service nginx stop && letsencrypt renew && service nginx start' >> /etc/crontab