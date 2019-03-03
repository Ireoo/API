import { decrypt, encrypt } from "../libs/crypto";

const state = {
	info: null
};

if (localStorage.getItem("account")) state.info = JSON.parse(decrypt(localStorage.getItem("account"), "admio"));

const mutations = {
	["account.UPDATE"](state, user) {
		user.updateTime = new Date().getTime();
		state.info = user;
		localStorage.setItem("account", encrypt(JSON.stringify(user), "admio"));
	},
	["account.REMOVE"](state) {
		state.info = null;
		localStorage.removeItem("account");
	}
};

const actions = {};

export default {
	state,
	mutations,
	actions
};
