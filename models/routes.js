var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var RouteSchema = new mongoose.Schema({
  start: Array,
  end: Array,
  waypoints: Array,
  popularity: Number,
  distance: Number,
  altitude: Number,
  created: Date,
  createdBy: {type: Array},
  private: {type: Boolean, required: true},
  name: String,
});
module.exports = mongoose.model('Route', RouteSchema);