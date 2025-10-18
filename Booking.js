
const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema({
  passengerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  source: { type: String, required: true },
  destination: { type: String, required: true },
  travelDate: { type: Date, required: true },
  travelClass: { type: String, enum: ["Economy", "Business", "Luxury"], required: true },
  distance: { type: Number, required: true },
  baseFare: { type: Number },
  finalFare: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", bookingSchema);
