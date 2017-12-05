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
  createdBy: {
    name: String,
    email: String,
  },
  name: String,
});
module.exports = mongoose.model('Route', RouteSchema);