const router = require("express").Router();

exports = module.exports = router;

router.auth = false;
// router.path = "/";

router.all("/", (req, res, next) => {
	let username = req.data.username,
		password = req.data.password;

	if (username && username !== "" && password && password !== "") {
		res.send({
			success: true,
			access_token: code,
			timer: new Date().getTime()
		});
	} else {
		res.send({
			success: false,
			data: "请确认你的账号和密码是否正确填写!"
		});
	}
});
