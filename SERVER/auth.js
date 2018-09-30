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

	if (!code || code === "")
		return res.status(200).send({
			success: false,
			data: "没有设置应用验证密钥!"
		});

	req.mongodb["app"].findOne(
		{
			secret
		},
		{},
		(error, data) => {
			if (error)
				return res.status(503).send({
					success: false,
					data: error
				});
			req.app = data;
			next();
		}
	);

	// next();
});
