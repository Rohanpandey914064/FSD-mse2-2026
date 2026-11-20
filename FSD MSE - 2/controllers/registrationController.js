const Registration = require("../models/Registration");
const Event = require("../models/Event");

const registerForEvent = async (req, res, next) => {
  try {
    const { eventId, numberOfSeats } = req.body;
    const seats = Number(numberOfSeats);

    if (!eventId || !Number.isInteger(seats) || seats < 1) {
      return res.status(400).json({ success: false, message: "eventId and a valid numberOfSeats are required" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    if (event.eventDate < new Date()) {
      return res.status(400).json({ success: false, message: "Cannot register for a past event" });
    }

    const alreadyRegistered = await Registration.findOne({
      userId: req.user._id,
      eventId: eventId,
      registrationStatus: "Confirmed",
    });
    if (alreadyRegistered) {
      return res.status(409).json({ success: false, message: "You already registered for this event" });
    }

    if (seats > event.availableSeats) {
      return res.status(400).json({
        success: false,
        message: "Not enough seats. Only " + event.availableSeats + " seats available",
      });
    }

    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventId, availableSeats: { $gte: seats } },
      { $inc: { availableSeats: -seats } },
      { new: true }
    );
    if (!updatedEvent) {
      return res.status(400).json({ success: false, message: "Seats are no longer available" });
    }

    const registration = await Registration.create({
      userId: req.user._id,
      eventId: eventId,
      numberOfSeats: seats,
      totalAmount: seats * event.registrationFee,
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      registration,
      availableSeatsNow: updatedEvent.availableSeats,
    });
  } catch (error) {
    next(error);
  }
};

const getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({ userId: req.user._id })
      .populate("eventId", "eventName eventDate venue")
      .sort({ registrationDate: -1 });

    res.status(200).json({ success: true, count: registrations.length, registrations });
  } catch (error) {
    next(error);
  }
};

const getEventRegistrations = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    const registrations = await Registration.find({ eventId: req.params.eventId })
      .populate("userId", "name email");

    res.status(200).json({ success: true, count: registrations.length, registrations });
  } catch (error) {
    next(error);
  }
};

const cancelRegistration = async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ success: false, message: "Registration not found" });
    }

    if (registration.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "You can cancel only your own registration" });
    }

    if (registration.registrationStatus === "Cancelled") {
      return res.status(400).json({ success: false, message: "Registration is already cancelled" });
    }

    registration.registrationStatus = "Cancelled";
    await registration.save();

    const event = await Event.findByIdAndUpdate(
      registration.eventId,
      { $inc: { availableSeats: registration.numberOfSeats } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Registration cancelled",
      registration,
      availableSeatsNow: event ? event.availableSeats : null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerForEvent, getMyRegistrations, getEventRegistrations, cancelRegistration };
