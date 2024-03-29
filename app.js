/**
 * Created by S2 on 15/7/7.
 */
const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const morgan = require("morgan");
const compression = require("compression");
// const mongojs = require("./lib/mongojs");
const MongoDB = require("./lib/database");

if (!fs.existsSync(path.join(process.cwd(), "config.js"))) {
    // fs.copyFileSync(path.join(__dirname, "config.bak.js"), path.join(process.cwd(), "config.js"));
    let c = fs.readFileSync(path.join(__dirname, "config.bak.js"), 'utf8')
    fs.writeFileSync(path.join(process.cwd(), "config.js"), c)
}
const config = require(path.join(process.cwd(), "config.js"));

/**
 * 显示访问信息
 */
app.use(
    morgan(
        '[:date[web]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms'
    )
);

/**
 * 添加gzip
 */
app.use(compression());

/**
 * 静态文件目录
 */
app.use(express.static(path.join(__dirname, 'dist')))

/**
 * 允许跨域访问
 */
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        res.status(200).send(null);
    } else {
        next();
    }
});

/**
 * 设置数据库
 */
app.use((req, res, next) => {
    /**
     * 获取mongodb数据库参数
     */
    let mongodb_other = config.MONGODB_OTHER ? `?${config.MONGODB_OTHER}` : "";
    let connect = config.MONGODB_URI || `${config.MONGODB}/api${mongodb_other}` || "127.0.0.1/api";

    /**
     * 设置mongodb数据库连接
     */
    // req.mongodb = mongojs(connect);
    req.api = new MongoDB(connect);
    next();
});

/**
 * 获取数据流并保存在 req.data 里面
 */
app.use((req, res, next) => {
    let reqData = [];
    let size = 0;
    req.on("data", data => {
        reqData.push(data);
        size += data.length;
    });
    req.on("end", () => {
        try {
            req.data = JSON.parse(
                Buffer.concat(reqData, size).toString() === "" ? "{}" : Buffer.concat(reqData, size).toString()
            );
            next();
        } catch (error) {
            res.send({
                success: false,
                message: `提交的数据格式错误,请提交json格式的文本`,
                data: Buffer.concat(reqData, size).toString
            });
            // req.data = {};
            // next();
        }
    });
});

// app.use((req, res, next) => {
// 	console.log(req.params, req.query, req.data);
// 	next();
// });

/**
 * 路由规则
 */
app.use("/", require("./SERVER/routes"));

/**
 * 设置服务器端口默认为80
 */
const server = app.listen(config.PORT || 2018, () => {
    console.log(
        "Listening on port %s:%d[%s]",
        server.address().address,
        server.address().port,
        server.address().family
    );
    console.log(
        "Contented MONGODB:",
        config.MONGODB,
        config.MONGODB_OTHER
    );
});

/**
 * 处理错误
 */
process.on("uncaughtException", error => {
    console.log("Caught exception: ", error);
});
