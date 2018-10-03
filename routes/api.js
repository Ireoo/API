const router = require("express").Router();
const MongoDB = require("../lib/database");

exports = module.exports = router;

router.auth = true;
router.path = "/";

router.all("/:table/:mode", (req, res, next) => {
	// console.log(req.params, req.query, req.data);
	// return res.send({
	//     params: req.params,
	//     body: req.body,
	//     query: req.query,
	//     data: req
	// });

	/**
	 * 格式化数据流数据为JSON格式
	 * @type {{}}
	 */
	let input = req;

	/**
	 * 切换到 {req.params.key} 数据表
	 */
	let db = req.api.set(req.params.table),
		admin = false;

	switch (req.app) {
		case process.env.SECRET || "":
			let app = req.header("App") || req.header("app") || input.app;
			if (app && app !== "")
				db = new MongoDB(`${process.env.MONGODB_URI}/${app}?${process.env.MONGODB_OTHER}`).set(
					req.params.table
				);
			admin = true;
			break;

		default:
			db = new MongoDB(`${process.env.MONGODB_URI}/${req.app}?${process.env.MONGODB_OTHER}`).set(
				req.params.table
			);
			admin = false;
			break;
	}

	/**
	 * 调试输出获取的数据流信息
	 */
	console.log("[input]  -->", input);

	/**
	 * 格式化数据流里各项参数where, data, other为JSON格式
	 * @type {{}}
	 */
	let where = JSON.stringify(input.where) === "[]" || !input.where ? {} : input.where;
	let data = JSON.stringify(input) === "[]" || !input ? {} : input;
	let other = JSON.stringify(input.other) === "[]" || !input.other ? {} : input.other;

	if (where.hasOwnProperty("_id") && where._id !== "") {
		where._id = mongojs.ObjectId(where._id);
	}

	// 定义变量
	let sort, show, skip, limit, dis;

	/**
	 * 定义是否可以使用
	 */
	let mode = req.params.mode;
	if (!admin && mode === "run") mode = "none";

	/**
	 * 主体程序入口处
	 */
	switch (mode) {
		/**
		 * 自定义运行命令
		 */
		case "run":
			db.run(input.run)
				.then(data => {
					console.log("[output] --> " + JSON.stringify(data));
					res.send({
						success: true,
						data
					});
				})
				.catch(data => {
					console.log("[output] --> " + JSON.stringify(data));
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
					console.log("[output] --> " + JSON.stringify(data));
					res.send({
						success: true,
						data
					});
				})
				.catch(data => {
					console.log("[output] --> " + JSON.stringify(data));
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
					console.log("[output] --> " + JSON.stringify(data));
					res.send({
						success: true,
						data
					});
				})
				.catch(data => {
					console.log("[output] --> " + JSON.stringify(data));
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
					console.log("[output] --> " + JSON.stringify(data));
					res.send({
						success: true,
						data
					});
				})
				.catch(data => {
					console.log("[output] --> " + JSON.stringify(data));
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
					console.log("[output] --> " + JSON.stringify(data));
					res.send({
						success: true,
						data
					});
				})
				.catch(data => {
					console.log("[output] --> " + JSON.stringify(data));
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
					console.log("[output] --> " + JSON.stringify(data));
					res.send({
						success: true,
						data
					});
				})
				.catch(data => {
					console.log("[output] --> " + JSON.stringify(data));
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
					console.log("[output] --> " + JSON.stringify(data));
					res.send({
						success: true,
						data
					});
				})
				.catch(data => {
					console.log("[output] --> " + JSON.stringify(data));
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
					console.log("[output] --> " + JSON.stringify(data));
					res.send({
						success: true,
						data
					});
				})
				.catch(data => {
					console.log("[output] --> " + JSON.stringify(data));
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
					console.log("[output] --> " + JSON.stringify(data));
					res.send({
						success: true,
						data
					});
				})
				.catch(data => {
					console.log("[output] --> " + JSON.stringify(data));
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
					console.log("[output] --> " + JSON.stringify(data));
					res.send({
						success: true,
						data
					});
				})
				.catch(data => {
					console.log("[output] --> " + JSON.stringify(data));
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
					console.log("[output] --> " + JSON.stringify(data));
					res.send({
						success: true,
						data
					});
				})
				.catch(data => {
					console.log("[output] --> " + JSON.stringify(data));
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
					console.log("[output] --> " + JSON.stringify(data));
					res.send({
						success: true,
						data
					});
				})
				.catch(data => {
					console.log("[output] --> " + JSON.stringify(data));
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
					console.log("[output] --> " + JSON.stringify(data));
					res.send({
						success: true,
						data
					});
				})
				.catch(data => {
					console.log("[output] --> " + JSON.stringify(data));
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
					console.log("[output] --> " + JSON.stringify(data));
					res.send({
						success: true,
						data
					});
				})
				.catch(data => {
					console.log("[output] --> " + JSON.stringify(data));
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
					console.log("[output] --> " + JSON.stringify(data));
					res.send({
						success: true,
						data
					});
				})
				.catch(data => {
					console.log("[output] --> " + JSON.stringify(data));
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
					console.log("[output] --> " + JSON.stringify(data));
					res.send({
						success: true,
						data
					});
				})
				.catch(data => {
					console.log("[output] --> " + JSON.stringify(data));
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
					console.log("[output] --> " + JSON.stringify(data));
					res.send({
						success: true,
						data
					});
				})
				.catch(data => {
					console.log("[output] --> " + JSON.stringify(data));
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
					console.log("[output] --> " + JSON.stringify(data));
					res.send({
						success: true,
						data
					});
				})
				.catch(data => {
					console.log("[output] --> " + JSON.stringify(data));
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
			console.log("[output] --> " + ("MODE[" + req.params.mode + "] no find!"));
			res.send({
				success: false,
				data: `MODE[${req.params.mode}] no found!`
			});
			break;
	}
});
