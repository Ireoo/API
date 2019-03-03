import Vue from "vue";

const c = (...txt) => {
	// eslint-disable-next-line
	if (process.env.NODE_ENV !== "production") console.log(...txt);
};

Vue.prototype.console = c;

export default c;
