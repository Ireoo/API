import Vue from "vue";

Vue.prototype.DEBUG = process.env.NODE_ENV !== "production";

export default Vue;
