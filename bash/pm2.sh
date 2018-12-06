sudo npm i -g pm2

pm2 start app.js -n API --watch --max-memory-restart 400M -i max
pm2 startup && pm2 save