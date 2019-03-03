import Vue from "vue";
const uuidv5 = require("uuid/v4");

Vue.prototype.$uuid = () => {
	return uuidv5();
};

export default Vue;
