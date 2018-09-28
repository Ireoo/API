const express = require("express");
const router = express.Router();
const md5 = require("md5");

exports = module.exports = router;

/**
 * 首页内容
 */
router.post("/", (req, res, next) => {
	console.log(req.body, req.params, req.query, req.data);
	if (!req.header("Authorization") || req.header("Authorization") === "")
		return res.status(503).send("No Authorization.");

	let code = req.header("Authorization");

	next();
});
