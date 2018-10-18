const mongojs = require("mongojs");

class DB {
	/**
	 * 初始化数据连接
	 */
	constructor(connect, options = {}) {
		this.mongo = mongojs(connect);
		this.debug = options.debug || false;
		return this;
	}

	/**
	 * 设置数据表
	 */
	set(table) {
		this.table = table;
		this.db = this.mongo[table];
		return this;
	}

	/**
	 * 关闭数据库连接
	 */
	close() {
		this.mongo.close();
	}

	/**
	 * 自定义运行命令
	 */
	run(command) {
		return new Promise((resolve, reject) => {
			this.db.runCommand(command, (error, result) => {
				if (this.debug) console.log("[ output ] ->", error ? error : JSON.stringify(result));
				error ? reject(error) : resolve(result);
			});
		});
	}

	/**
	 * 执行查找一条数据命令
	 */
	findOne(where, show = {}) {
		return new Promise((resolve, reject) => {
			this.db.findOne(where, show, (error, result) => {
				if (this.debug) console.log("[ output ] ->", error ? error : JSON.stringify(result));
				error ? reject(error) : resolve(result);
			});
		});
	}

	/**
	 * 执行查找命令
	 */
	find(where, other = { skip: 0, limit: 20, show: {}, sort: {} }) {
		return new Promise((resolve, reject) => {
			this.db
				.find(where, other.show)
				.skip(other.skip)
				.limit(other.limit)
				.sort(other.sort, (error, result) => {
					if (this.debug) console.log("[ output ] ->", error ? error : JSON.stringify(result));
					error ? reject(error) : resolve(result);
				});
		});
	}

	/**
	 * 执行插入命令
	 */
	insert(data) {
		return new Promise((resolve, reject) => {
			this.db.insert(data, (error, result) => {
				if (this.debug) console.log("[ output ] ->", error ? error : JSON.stringify(result));
				error ? reject(error) : resolve(result);
			});
		});
	}

	/**
	 * 执行修改数据命令
	 */
	update(where, data, other = {}) {
		return new Promise((resolve, reject) => {
			this.db.update(where, data, other, (error, result) => {
				if (this.debug) console.log("[ output ] ->", error ? error : JSON.stringify(result));
				error ? reject(error) : resolve(result);
			});
		});
	}

	/**
	 * 执行聚合查询命令
	 */
	distinct(dis, where) {
		return new Promise((resolve, reject) => {
			this.db.distinct(dis, where, (error, result) => {
				if (this.debug) console.log("[ output ] ->", error ? error : JSON.stringify(result));
				error ? reject(error) : resolve(result);
			});
		});
	}

	/**
	 * 执行删除命令
	 */
	remove(where) {
		return new Promise((resolve, reject) => {
			this.db.remove(where, (error, result) => {
				if (this.debug) console.log("[ output ] ->", error ? error : JSON.stringify(result));
				error ? reject(error) : resolve(result);
			});
		});
	}

	/**
	 * 删除该数据库
	 */
	drop() {
		return new Promise((resolve, reject) => {
			this.db.drop((error, result) => {
				if (this.debug) console.log("[ output ] ->", error ? error : JSON.stringify(result));
				error ? reject(error) : resolve(result);
			});
		});
	}

	/**
	 * 获取该表状态信息
	 */
	stats() {
		return new Promise((resolve, reject) => {
			this.db.stats((error, result) => {
				if (this.debug) console.log("[ output ] ->", error ? error : JSON.stringify(result));
				error ? reject(error) : resolve(result);
			});
		});
	}

	/**
	 * 获取指定条件下数据量
	 */
	count(where) {
		return new Promise((resolve, reject) => {
			this.db.count(where, (error, result) => {
				if (this.debug) console.log("[ output ] ->", error ? error : JSON.stringify(result));
				error ? reject(error) : resolve(result);
			});
		});
	}

	/**
	 * 创建索引
	 */
	ensureIndex(where, other = {}) {
		return new Promise((resolve, reject) => {
			this.db.ensureIndex(where, other, (error, result) => {
				if (this.debug) console.log("[ output ] ->", error ? error : JSON.stringify(result));
				error ? reject(error) : resolve(result);
			});
		});
	}

	/**
	 * 重建索引
	 */
	reIndex() {
		return new Promise((resolve, reject) => {
			this.db.reIndex((error, result) => {
				if (this.debug) console.log("[ output ] ->", error ? error : JSON.stringify(result));
				error ? reject(error) : resolve(result);
			});
		});
	}

	/**
	 * 删除指定索引
	 */
	dropIndex(index) {
		return new Promise((resolve, reject) => {
			this.db.dropIndex(index, (error, result) => {
				if (this.debug) console.log("[ output ] ->", error ? error : JSON.stringify(result));
				error ? reject(error) : resolve(result);
			});
		});
	}

	/**
	 * 删除全部索引
	 */
	dropIndexes() {
		return new Promise((resolve, reject) => {
			this.db.dropIndexes((error, result) => {
				if (this.debug) console.log("[ output ] ->", error ? error : JSON.stringify(result));
				error ? reject(error) : resolve(result);
			});
		});
	}

	/**
	 * 获取索引信息
	 */
	getIndexes() {
		return new Promise((resolve, reject) => {
			this.db.getIndexes((error, result) => {
				if (this.debug) console.log("[ output ] ->", error ? error : JSON.stringify(result));
				error ? reject(error) : resolve(result);
			});
		});
	}

	/**
	 * 获取数据库列表
	 */
	listCollections() {
		return new Promise((resolve, reject) => {
			this.db.listCollections((error, result) => {
				if (this.debug) console.log("[ output ] ->", error ? error : JSON.stringify(result));
				error ? reject(error) : resolve(result);
			});
		});
	}

	/**
	 * 获取数据库名字
	 */
	getCollectionNames() {
		return new Promise((resolve, reject) => {
			this.db.getCollectionNames((error, result) => {
				if (this.debug) console.log("[ output ] ->", error ? error : JSON.stringify(result));
				error ? reject(error) : resolve(result);
			});
		});
	}

	/**
	 * 删除数据库
	 */
	dropDatabase() {
		return new Promise((resolve, reject) => {
			this.db.dropDatabase((error, result) => {
				if (this.debug) console.log("[ output ] ->", error ? error : JSON.stringify(result));
				error ? reject(error) : resolve(result);
			});
		});
	}

	addUser(usr) {
		return new Promise((resolve, reject) => {
			this.db.addUser(usr, (error, result) => {
				if (this.debug) console.log("[ output ] ->", error ? error : JSON.stringify(result));
				error ? reject(error) : resolve(result);
			});
		});
	}

	removeUser(username) {
		return new Promise((resolve, reject) => {
			this.db.removeUser(username, (error, result) => {
				if (this.debug) console.log("[ output ] ->", error ? error : JSON.stringify(result));
				error ? reject(error) : resolve(result);
			});
		});
	}
}

module.exports.default = module.exports = DB;
