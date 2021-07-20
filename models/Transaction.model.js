const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const TransactionSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["Transferência", "Pagamentos"],
    },
    amount: { type: Number, required: true },
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    category: { type: String, default: "Outros" },
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
  },
  { timestamps: true }
);

module.exports = model("Transaction", TransactionSchema);
