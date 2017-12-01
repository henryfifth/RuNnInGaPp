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
  routes: {
    created: Array,
    ran: Array,
    saved: Array,
  },
  info: Boolean,
  secretId: String,
  logs: Array,
});
module.exports = mongoose.model('User', UserSchema);