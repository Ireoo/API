const fs = require("fs");
const path = require("path");

const express = require("express");
const router = express.Router();
const md5 = require("md5");

exports = module.exports = router;

/**
 * 首页内容
 */
router.post("/", (req, res, next) => {
	let code = req.header("Authorization") || req.header("authorization");

	if (!code || code === "") return res.status(200).send("没有设置用户验证密钥,此项功能需要用户验证信息!");

	let file = path.join(process.cwd(), `sessions/${code}.json`);
	if (fs.existsSync(file)) {
		let session = JSON.parse(fs.readFileSync(file));
		if (new Date().getTime() - session.timer < 24 * 60 * 60 * 1000) {
			req.session = session;
			next();
		} else {
			res.status(200).send(`用户信息已经过期,请重新登陆授权!`);
		}
	} else {
		res.status(200).send(`请确认是否已经登陆,并获取正确的验证密钥!`);
	}

	// next();
});
