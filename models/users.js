var passwordHash = require("password-hash");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: {type: String, required: true},
  email: { type: String, required: true, unique: true },
  password: {type: String, required: true, set: function(password){return passwordHash.generate(password)}},
  connections: {type: Array},
  stats: {type: Array },
  routes: {type: Array},
});
module.exports = mongoose.model('User', UserSchema);