const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  numberOfSeats: { type: Number, required: true, min: 1 },
  totalAmount: { type: Number, required: true },
  registrationDate: { type: Date, default: Date.now },
  registrationStatus: {
    type: String,
    enum: ["Confirmed", "Cancelled"],
    default: "Confirmed",
  },
});

module.exports = mongoose.model("Registration", registrationSchema);
