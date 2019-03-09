const path = require("path");

const router = require("express").Router();
const MongoDB = require("../lib/database");
const mongojs = require("mongojs");

const config = require(path.join(process.cwd(), "config.js"));

exports = module.exports = router;

router.auth = true;
router.path = "/";

router.all("/:table/:mode", async (req, res, next) => {
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
	let input = req.data;

	/**
	 * 切换到 {req.params.key} 数据表
	 */
	let db = req.api.set(req.params.table),
		admin = false;

	switch (req.app) {
		case config.SECRET || "":
			let app = req.header("App") || req.header("app") || input.app;
			if (app && app !== "") {
				db.close();
				let mongodb_other = config.MONGODB_OTHER ? `?${config.MONGODB_OTHER}` : "";
				db = new MongoDB(`${config.MONGODB}/${app}${mongodb_other}`).set(req.params.table);
			}
			admin = true;
			break;

		default:
			db.close();
			let mongodb_other = config.MONGODB_OTHER ? `?${config.MONGODB_OTHER}` : "";
			db = new MongoDB(`${config.MONGODB}/${req.app}${mongodb_other}`).set(req.params.table);
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
	let data = JSON.stringify(input.data) === "[]" || !input.data ? {} : input.data;
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

	let result;

	/**
	 * 主体程序入口处
	 */
	try {
		switch (mode) {
			/**
			 * 自定义运行命令
			 */
			case "run":
				result = await db.run(input.run);
				break;

			/**
			 * 获取数据表列表
			 */
			case "listCollections":
				result = await db.listCollections();
				break;

			/**
			 * 获取数据表名称
			 */
			case "getCollectionNames":
				result = await db.getCollectionNames();
				break;

			/**
			 * 删除数据库
			 */
			case "dropDatabase":
				result = await db.dropDatabase();
				break;

			/**
			 * 执行插入命令
			 */
			case "insert":
				result = await db.insert(data);
				break;

			/**
			 * 执行查找命令
			 */
			case "find":
				sort = JSON.stringify(other.sort) === "[]" || !other.sort ? {} : other.sort;
				show = JSON.stringify(other.show) === "[]" || !other.show ? {} : other.show;
				skip = other.skip || 0;
				limit = other.limit || 20;

				result = await db.find(where, {
					sort,
					show,
					skip,
					limit
				});
				break;

			/**
			 * 执行查找一条数据命令
			 */
			case "once":
				show = JSON.stringify(other.show) === "[]" || !other.show ? {} : other.show;
				result = await db.findOne(where, show);
				break;

			/**
			 * 执行聚合查询命令
			 */
			case "distinct":
				dis = JSON.stringify(other.distinct) === "[]" || !other.distinct ? "" : other.distinct;
				result = await db.distinct(dis, where);
				break;

			/**
			 * 执行修改数据命令
			 */
			case "update":
				result = await db.update(
					where,
					{
						$set: data
					},
					other
				);
				break;

			/**
			 * 执行删除命令
			 */
			case "remove":
				result = await db.remove(where);
				break;

			/**
			 * 删除该数据库
			 */
			case "drop":
				result = await db.drop();
				break;

			/**
			 * 获取该表状态信息
			 */
			case "stats":
				result = await db.stats();
				break;

			/**
			 * 获取指定条件下数据量
			 */
			case "count":
				result = await db.count(where);
				break;

			/**
			 * 创建索引
			 */
			case "createIndex":
				result = await db.ensureIndex(where, other);
				break;

			/**
			 * 重建索引
			 */
			case "reIndex":
				result = await db.reIndex();
				break;

			/**
			 * 删除指定索引
			 */
			case "dropIndex":
				result = await db.dropIndex(where.index);
				break;

			/**
			 * 删除全部索引
			 */
			case "dropIndexes":
				result = await db.dropIndexes();
				break;

			/**
			 * 获取索引信息
			 */
			case "getIndexes":
				result = await db.getIndexes();
				break;

			/**
			 * 当不存在该指令时返回404
			 */
			default:
				result = {
					success: false,
					data: `MODE[${req.params.mode}] no found!`
				};
				break;
		}

		db.close();

		console.log("[output] -->", result);
		res.send({
			success: true,
			data: result
		});
	} catch (e) {
		db.close();

		console.log("[error]  -->", e.message);
		res.send({
			success: true,
			data: e.message
		});
	}
});
