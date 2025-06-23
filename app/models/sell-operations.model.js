const mongoose = require("mongoose");
const articleSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});
//Define schema
const SellOperationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom est obligatoire"],
    },
    date: {
      type: Date,
      default: new Date(),
    },
    articles: {
      type: [articleSchema],
      required:  [true, "Il faut spécifier les articles"],
    },
  },
  { timestamps: true }
);
const SellOperation = mongoose.model("SellOperation", SellOperationSchema);
module.exports = SellOperation;
