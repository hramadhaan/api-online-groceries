const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stockSchema = new Schema({
  currentStock: {
    type: Number,
    required: true,
  },
  minimumStock: {
    type: Number,
    required: false,
    default: 0,
  },
});

module.exports = mongoose.model("Stock", stockSchema);
