const fs = require("fs");
const path = require("path");

const express = require("express");
const router = express.Router();
const md5 = require("md5");
const config = require("../config");

exports = module.exports = router;

/**
 * 首页内容
 */
router.use((req, res, next) => {
	let secret = req.header("Authorization") || req.header("authorization");

	if (!secret || secret === "")
		return res.status(200).send({
			success: false,
			data: "没有设置应用验证密钥!"
		});

	if (secret === config.SECRET) {
		req.app = secret;
		next();
	} else {
		req.api
			.set("apps")
			.findOne(
				{
					secret
				},
				{}
			)
			.then(data => {
				console.log("[ app ] ->", data);
				if (!data) throw "没有相关应用信息,请确认密钥是否正确!";
				req.app = data._id;
				next();
			})
			.catch(data => {
				req.api.close();
				res.send({
					success: false,
					data
				});
			});
	}
});
