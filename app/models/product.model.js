const mongoose = require("mongoose");

//Define schema
const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Le titre est obligatoire"],
    },
    stocks: {
      type: Number,
      default: 0,
    },
    sells: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ProductSchema.virtual("stock_available").get(function () {
  return this.stocks - this.sells;
});
const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
