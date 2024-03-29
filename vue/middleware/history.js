/**
 * Created by chenjiajun on 2017/8/18.
 */
const history = require("connect-history-api-fallback");

module.exports = options => {
	const middleware = history(options);
	const noop = () => {};

	return async (ctx, next) => {
		middleware(ctx, null, noop);
		await next();
	};
};
