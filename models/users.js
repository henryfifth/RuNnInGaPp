var passwordHash = require("password-hash");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var UserSchema = new mongoose.Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  email: { type: String, required: true, unique: true },
  password: {type: String, required: true, set: function(password){return passwordHash.generate(password)}},
  connections: {type: Array},
  stats: {type: Array },
  routes: {type: Array},
  info: {type: Array},
  secretId: String,
});
module.exports = mongoose.model('User', UserSchema);