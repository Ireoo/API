"use strict";

const crypto = require("crypto");

// use secret to encrypt string
function encrypt(str, secret) {
  let cipher = crypto.createCipher("aes192", secret);
  let enc = cipher.update(str, "utf8", "hex");
  enc += cipher.final("hex");
  return enc;
}

//use secret to decrypt string
function decrypt(str, secret) {
  let decipher = crypto.createDecipher("aes192", secret);
  let dec = decipher.update(str, "hex", "utf8");
  dec += decipher.final("utf8");
  return dec;
}

//use secret to decrypt string
function md5(str) {
  let md5sum = crypto.createHash("md5");
  md5sum.update(str);
  str = md5sum.digest("hex");
  return str;
}

exports = module.exports = {
  encrypt,
  decrypt,
  md5
};
