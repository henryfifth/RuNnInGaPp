const passwordHash = require("password-hash");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var UserSchema = new mongoose.Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  email: { type: String, required: true, unique: true },
  password: {type: String, required: true, set: function(password){return passwordHash.generate(password)}},
  connections: {type: Array},
  stats: {type: Array },
  routes: {type: Array},
  info: Boolean,
  secretId: String,
});
module.exports = mongoose.model('User', UserSchema);