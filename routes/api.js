const router = require("express").Router();

/**
 * 初始化颜色主题
 */
const colors = require("colors");
colors.setTheme({
	silly: "rainbow",
	input: "grey",
	verbose: "cyan",
	prompt: "grey",
	info: "green",
	data: "blue",
	help: "cyan",
	warn: "yellow",
	debug: "blue",
	error: "red"
});

exports = module.exports = router;

router.auth = true;
router.path = "/";

router.all("/:table/:mode", (req, res, next) => {
	console.log(req.params, req.query, req.data);
	// return res.send({
	//     params: req.params,
	//     body: req.body,
	//     query: req.query,
	//     data: req.data
	// });

	/**
	 * 切换到 {req.params.key} 数据表
	 */
	// let db = eval("req.mongodb." + req.params.table);
	let db = req.mongodb.set(req.params.table);

	/**
	 * 格式化数据流数据为JSON格式
	 * @type {{}}
	 */
	let input = req.data;

	/**
	 * 调试输出获取的数据流信息
	 */
	console.log("[input]  --> ".info + JSON.stringify(input).input);

	/**
	 * 格式化数据流里各项参数where, data, other为JSON格式
	 * @type {{}}
	 */
	let where = JSON.stringify(input.where) === "[]" || !input.where ? {} : input.where;
	let data = JSON.stringify(input.data) === "[]" || !input.data ? {} : input.data;
	let other = JSON.stringify(input.other) === "[]" || !input.other ? {} : input.other;

	if (where.hasOwnProperty("_id") && where._id !== "") {
		where._id = mongojs.ObjectId(where._id);
	}

	// 定义变量
	let sort, show, skip, limit, dis;

	/**
	 * 主体程序入口处
	 */
	switch (req.params.mode) {
		/**
		 * 自定义运行命令
		 */
		case "run":
			db.run(input.run)
				.then(data => {
					console.log("[output] --> ".info + JSON.stringify(data).data);
					res.send({
						success: true,
						data
					});
				})
				.catch(data => {
					console.log("[output] --> ".info + JSON.stringify(data).error);
					res.send({
						success: false,
						data
					});
				});
			break;

		/**
		 * 获取数据表列表
		 */
		case "listCollections":
			db.listCollections()
				.then(data => {
					console.log("[output] --> ".info + JSON.stringify(data).data);
					res.send({
						success: true,
						data
					});
				})
				.catch(data => {
					console.log("[output] --> ".info + JSON.stringify(data).error);
					res.send({
						success: false,
						data
					});
				});
			break;

		/**
		 * 获取数据表名称
		 */
		case "getCollectionNames":
			db.getCollectionNames()
				.then(data => {
					console.log("[output] --> ".info + JSON.stringify(data).data);
					res.send({
						success: true,
						data
					});
				})
				.catch(data => {
					console.log("[output] --> ".info + JSON.stringify(data).error);
					res.send({
						success: false,
						data
					});
				});
			break;

		/**
		 * 删除数据库
		 */
		case "dropDatabase":
			db.dropDatabase()
				.then(data => {
					console.log("[output] --> ".info + JSON.stringify(data).data);
					res.send({
						success: true,
						data
					});
				})
				.catch(data => {
					console.log("[output] --> ".info + JSON.stringify(data).error);
					res.send({
						success: false,
						data
					});
				});
			break;

		/**
		 * 执行插入命令
		 */
		case "insert":
			db.insert(data)
				.then(data => {
					console.log("[output] --> ".info + JSON.stringify(data).data);
					res.send({
						success: true,
						data
					});
				})
				.catch(data => {
					console.log("[output] --> ".info + JSON.stringify(data).error);
					res.send({
						success: false,
						data
					});
				});
			break;

		/**
		 * 执行查找命令
		 */
		case "find":
			sort = JSON.stringify(other.sort) === "[]" || !other.sort ? {} : other.sort;
			show = JSON.stringify(other.show) === "[]" || !other.show ? {} : other.show;
			skip = other.skip || 0;
			limit = other.limit || 20;

			db.find(where, { sort, show, skip, limit })
				.then(data => {
					console.log("[output] --> ".info + JSON.stringify(data).data);
					res.send({
						success: true,
						data
					});
				})
				.catch(data => {
					console.log("[output] --> ".info + JSON.stringify(data).error);
					res.send({
						success: false,
						data
					});
				});
			break;

		/**
		 * 执行查找一条数据命令
		 */
		case "findone":
			show = JSON.stringify(other.show) === "[]" || !other.show ? {} : other.show;
			db.findOne(where, show)
				.then(data => {
					console.log("[output] --> ".info + JSON.stringify(data).data);
					res.send({
						success: true,
						data
					});
				})
				.catch(data => {
					console.log("[output] --> ".info + JSON.stringify(data).error);
					res.send({
						success: false,
						data
					});
				});
			break;

		/**
		 * 执行聚合查询命令
		 */
		case "distinct":
			dis = JSON.stringify(other.distinct) === "[]" || !other.distinct ? "" : other.distinct;
			db.distinct(dis, where)
				.then(data => {
					console.log("[output] --> ".info + JSON.stringify(data).data);
					res.send({
						success: true,
						data
					});
				})
				.catch(data => {
					console.log("[output] --> ".info + JSON.stringify(data).error);
					res.send({
						success: false,
						data
					});
				});
			break;

		/**
		 * 执行修改数据命令
		 */
		case "update":
			db.update(where, data, other)
				.then(data => {
					console.log("[output] --> ".info + JSON.stringify(data).data);
					res.send({
						success: true,
						data
					});
				})
				.catch(data => {
					console.log("[output] --> ".info + JSON.stringify(data).error);
					res.send({
						success: false,
						data
					});
				});
			break;

		/**
		 * 执行删除命令
		 */
		case "remove":
			db.remove(where)
				.then(data => {
					console.log("[output] --> ".info + JSON.stringify(data).data);
					res.send({
						success: true,
						data
					});
				})
				.catch(data => {
					console.log("[output] --> ".info + JSON.stringify(data).error);
					res.send({
						success: false,
						data
					});
				});
			break;

		/**
		 * 删除该数据库
		 */
		case "drop":
			db.drop()
				.then(data => {
					console.log("[output] --> ".info + JSON.stringify(data).data);
					res.send({
						success: true,
						data
					});
				})
				.catch(data => {
					console.log("[output] --> ".info + JSON.stringify(data).error);
					res.send({
						success: false,
						data
					});
				});
			break;

		/**
		 * 获取该表状态信息
		 */
		case "stats":
			db.stats()
				.then(data => {
					console.log("[output] --> ".info + JSON.stringify(data).data);
					res.send({
						success: true,
						data
					});
				})
				.catch(data => {
					console.log("[output] --> ".info + JSON.stringify(data).error);
					res.send({
						success: false,
						data
					});
				});
			break;

		/**
		 * 获取指定条件下数据量
		 */
		case "count":
			db.count(where)
				.then(data => {
					console.log("[output] --> ".info + JSON.stringify(data).data);
					res.send({
						success: true,
						data
					});
				})
				.catch(data => {
					console.log("[output] --> ".info + JSON.stringify(data).error);
					res.send({
						success: false,
						data
					});
				});
			break;

		/**
		 * 创建索引
		 */
		case "createIndex":
			db.ensureIndex(where, other)
				.then(data => {
					console.log("[output] --> ".info + JSON.stringify(data).data);
					res.send({
						success: true,
						data
					});
				})
				.catch(data => {
					console.log("[output] --> ".info + JSON.stringify(data).error);
					res.send({
						success: false,
						data
					});
				});
			break;

		/**
		 * 重建索引
		 */
		case "reIndex":
			db.reIndex()
				.then(data => {
					console.log("[output] --> ".info + JSON.stringify(data).data);
					res.send({
						success: true,
						data
					});
				})
				.catch(data => {
					console.log("[output] --> ".info + JSON.stringify(data).error);
					res.send({
						success: false,
						data
					});
				});
			break;

		/**
		 * 删除指定索引
		 */
		case "dropIndex":
			db.dropIndex(where.index)
				.then(data => {
					console.log("[output] --> ".info + JSON.stringify(data).data);
					res.send({
						success: true,
						data
					});
				})
				.catch(data => {
					console.log("[output] --> ".info + JSON.stringify(data).error);
					res.send({
						success: false,
						data
					});
				});
			break;

		/**
		 * 删除全部索引
		 */
		case "dropIndexes":
			db.dropIndexes()
				.then(data => {
					console.log("[output] --> ".info + JSON.stringify(data).data);
					res.send({
						success: true,
						data
					});
				})
				.catch(data => {
					console.log("[output] --> ".info + JSON.stringify(data).error);
					res.send({
						success: false,
						data
					});
				});
			break;

		/**
		 * 获取索引信息
		 */
		case "getIndexes":
			db.getIndexes()
				.then(data => {
					console.log("[output] --> ".info + JSON.stringify(data).data);
					res.send({
						success: true,
						data
					});
				})
				.catch(data => {
					console.log("[output] --> ".info + JSON.stringify(data).error);
					res.send({
						success: false,
						data
					});
				});
			break;

		/**
		 * 当不存在该指令时返回404
		 */
		default:
			console.log("[output] --> ".info + ("MODE[" + req.params.mode + "] no find!").error);
			res.send({
				success: false,
				data: `MODE[${req.params.mode}] no found!`
			});
			break;
	}
});
