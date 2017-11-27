var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var RouteSchema = new mongoose.Schema({
  start: String,
  end: String,
  waypoints: Array,
  popularity: Number,
  created: Date,
  createdBy: {type: Array},
  private: {type: Boolean, required: true},
  name: String,
});
module.exports = mongoose.model('Route', RouteSchema);