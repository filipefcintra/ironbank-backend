const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const AccountSchema = new Schema({
  agency: { type: String, required: true, default: "001" },
  accountNumber: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ["Conta Corrente", "Conta Poupança"],
  },
  balance: { type: Number, required: true, default: 0 },
  cards: [
    new Schema({
      number: { type: String, required: true, minLength: 16, maxLength: 16 },
      validThru: { type: String, required: true, minLength: 5, maxLength: 5 },
      securityCode: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 3,
      },
      flag: { type: String, required: true, default: "Mastercard" },
    }),
  ],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = model("Account", AccountSchema);
