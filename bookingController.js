function calculateFare(travelClass, distance) {
  let rate;
  if (travelClass === "Economy") rate = 5;
  else if (travelClass === "Business") rate = 8;
  else rate = 12;

  const baseFare = distance * rate;
  return { baseFare, finalFare: baseFare }; 
}




const Booking = require("../models/Booking");

function calculateFare(travelClass, distance) {
  let rate;
  if (travelClass === "Economy") rate = 5;
  else if (travelClass === "Business") rate = 8;
  else rate = 12;
  const baseFare = distance * rate;
  return { baseFare, finalFare: baseFare };
}


exports.createBooking = async (req, res) => {

    const { source, destination, travelDate, travelClass, distance } = req.body;
    const { baseFare, finalFare } = calculateFare(travelClass, distance);

    const booking = await Booking.create({
      passengerId: req.user.id,
      source,
      destination,
      travelDate,
      travelClass,
      distance,
      baseFare,
      finalFare,
    });

    res.status(201).json(booking);
  
};

exports.getBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const bookings = await Booking.find()
      .populate("passengerId", "name email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Booking.countDocuments();

    res.json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: bookings,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("passengerId", "name email");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const { source, destination, travelDate, travelClass, distance } = req.body;
    if (travelClass && distance) {
      const { baseFare, finalFare } = calculateFare(travelClass, distance);
      booking.baseFare = baseFare;
      booking.finalFare = finalFare;
    }

    if (source) booking.source = source;
    if (destination) booking.destination = destination;
    if (travelDate) booking.travelDate = travelDate;
    if (travelClass) booking.travelClass = travelClass;
    if (distance) booking.distance = distance;

    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};






