import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const routes = [{
    name: "Index",
    path: "/",
    redirect: "/home",
    meta: {
        title: "首页重定向",
        file: `To /home`
    }
}];
const files = require.context("./views", true, /\.vue$/);

files.keys().forEach(key => {
    let file = key.replace(/(\.\/|\.vue)/g, "");
    let _path = file.replace("#", ":");

    let fileArray = file.split("/");
    let filename = fileArray
        .pop()
        .replace(/\b([a-zA-Z#])(\w*)/g, function($0, $1, $2) {
            return $1.replace("#", "").toUpperCase() + $2.toLowerCase();
        })
        .replace("#", "");
    let dir = fileArray.join("/");
    let dirname = fileArray
        .map(d => {
            return d.replace(/\b([a-zA-Z#])(\w*)/g, function($0, $1, $2) {
                return $1.toUpperCase() + $2.toLowerCase();
            });
        })
        .join("");

    let component = require(`@/views/${file}`).default;

    let route = {
        path: filename.toLowerCase() === "index" ?
            `/${dir}` : `/${_path.toLowerCase()}`,
        name: filename.toLowerCase() === "index" && dirname !== "" ? dirname : filename,
        component: component,

        meta: {
            title: component.title,
            index: component.index | 0,
            icon: component.icon || ""
        }
    };

    routes.push(route);

    if (process.env.NODE_ENV !== "production")
    // eslint-disable-next-line
        console.log(
        `加载文件: ${key} \r\n名称: ${route.name} \r\n挂载点: ${
        route.path
      } \r\n完成!`
    );
});

// routes.push({
//     path: "/",
//     name: "Index",
//     redirect: "/home",
//     file: `To /home`
// });

routes.push({
    path: "*",
    redirect: "/"
});

const router = {
    routes
};
// if (process.env.NODE_ENV === "production") router.mode = "history";
export default new Router(router);