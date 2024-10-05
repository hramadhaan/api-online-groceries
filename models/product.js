const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      default: null,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    image: {
      type: Schema.Types.Array,
      required: false,
    },
    stock: {
      type: Schema.Types.ObjectId,
      ref: "Stock",
      default: null,
    },
    sku: {
      type: String,
      required: true,
    },
    status: {
      enum: ["active", "inactive"],
      default: "inactive",
      type: Schema.Types.String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
