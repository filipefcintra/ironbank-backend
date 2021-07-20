const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  passwordHash: { type: String, required: true },
  profilePictureUrl: { type: String, trin: true },
  address: new Schema({
    street: String,
    neighbourhood: String,
    city: String,
    state: String,
    postalCode: String,
    numbers: String,
  }),
  profession: { type: String, trin: true, required: true },
  maritalStatus: {
    type: String,
    required: true,
    enum: [
      "Casado(a)",
      "Separado(a)",
      "Solteiro(a)",
      "Divorciado(a)",
      "Viuvo(a)",
    ],
  },
  birthDate: { type: Date, required: true },
  phoneNumber: { type: String, trim: true },
  document: { type: String, required: true, trim: true },
  transactions: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
});

const UserModel = model("User", UserSchema);

module.exports = UserModel;
