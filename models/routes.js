var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var RouteSchema = new mongoose.Schema({
  coords: {type: Array, required: true},
  popularity: Number,
  created: Date,
  createdBy: {type: String},
  private: {type: Boolean, required: true},
  nick: String,
});
module.exports = mongoose.model('Route', RouteSchema);