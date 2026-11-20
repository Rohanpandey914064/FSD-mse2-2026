const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    eventName: { type: String, required: [true, "Event name is required"], trim: true },
    description: { type: String, required: [true, "Description is required"], trim: true },
    category: { type: String, required: [true, "Category is required"], trim: true },
    eventDate: { type: Date, required: [true, "Event date is required"] },
    venue: { type: String, required: [true, "Venue is required"], trim: true },
    totalSeats: { type: Number, required: [true, "Total seats is required"], min: 1 },
    availableSeats: { type: Number, required: true, min: 0 },
    registrationFee: { type: Number, required: true, min: 0, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
