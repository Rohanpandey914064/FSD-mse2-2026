const Event = require("../models/Event");

const createEvent = async (req, res, next) => {
  try {
    const { eventName, description, category, eventDate, venue, totalSeats, registrationFee } = req.body;

    if (!eventName || !description || !category || !eventDate || !venue || !totalSeats) {
      return res.status(400).json({ success: false, message: "Please fill all required fields" });
    }

    if (isNaN(new Date(eventDate).getTime())) {
      return res.status(400).json({ success: false, message: "Invalid event date" });
    }

    if (new Date(eventDate) <= new Date()) {
      return res.status(400).json({ success: false, message: "Event date must be in the future" });
    }

    if (!Number.isInteger(Number(totalSeats)) || Number(totalSeats) < 1) {
      return res.status(400).json({ success: false, message: "Total seats must be at least 1" });
    }

    if (registrationFee !== undefined && Number(registrationFee) < 0) {
      return res.status(400).json({ success: false, message: "Fee cannot be negative" });
    }

    const event = await Event.create({
      eventName,
      description,
      category,
      eventDate,
      venue,
      totalSeats: Number(totalSeats),
      availableSeats: Number(totalSeats),
      registrationFee: registrationFee === undefined ? 0 : Number(registrationFee),
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, message: "Event created", event });
  } catch (error) {
    next(error);
  }
};

const getAllEvents = async (req, res, next) => {
  try {
    const page = Number(req.query.page) > 0 ? Number(req.query.page) : 1;
    const limit = Number(req.query.limit) > 0 ? Number(req.query.limit) : 10;
    const skip = (page - 1) * limit;

    const filter = { eventDate: { $gte: new Date() } };

    if (req.query.search) {
      const text = req.query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.eventName = { $regex: text, $options: "i" };
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }

    const total = await Event.countDocuments(filter);
    const events = await Event.find(filter).sort({ eventDate: 1 }).skip(skip).limit(limit);

    res.status(200).json({
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      events,
    });
  } catch (error) {
    next(error);
  }
};

const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    res.status(200).json({ success: true, event });
  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    const { eventName, description, category, eventDate, venue, totalSeats, registrationFee } = req.body;

    if (eventDate !== undefined) {
      if (isNaN(new Date(eventDate).getTime()) || new Date(eventDate) <= new Date()) {
        return res.status(400).json({ success: false, message: "Event date must be a valid future date" });
      }
      event.eventDate = eventDate;
    }

    if (totalSeats !== undefined) {
      const newTotalSeats = Number(totalSeats);
      if (!Number.isInteger(newTotalSeats) || newTotalSeats < 1) {
        return res.status(400).json({ success: false, message: "Total seats must be at least 1" });
      }

      const bookedSeats = event.totalSeats - event.availableSeats;
      if (newTotalSeats < bookedSeats) {
        return res.status(400).json({
          success: false,
          message: "Total seats cannot be less than already booked seats (" + bookedSeats + ")",
        });
      }
      event.totalSeats = newTotalSeats;
      event.availableSeats = newTotalSeats - bookedSeats;
    }

    if (eventName !== undefined) event.eventName = eventName;
    if (description !== undefined) event.description = description;
    if (category !== undefined) event.category = category;
    if (venue !== undefined) event.venue = venue;
    if (registrationFee !== undefined) {
      if (Number(registrationFee) < 0) {
        return res.status(400).json({ success: false, message: "Fee cannot be negative" });
      }
      event.registrationFee = Number(registrationFee);
    }

    await event.save();
    res.status(200).json({ success: true, message: "Event updated", event });
  } catch (error) {
    next(error);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    res.status(200).json({ success: true, message: "Event deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent };
