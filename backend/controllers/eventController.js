const Event = require("../models/Event");
const logger = require("../utils/logger");
const cloudinary = require("../config/cloudinary");

// Create Event with Image Upload
exports.createEvent = async (req, res) => {
  try {
    let image = { public_id: "", url: "" };

    // Check if file exists before uploading
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "events",
      });
      image = { public_id: result.public_id, url: result.secure_url };
    }

    const event = await Event.create({
      ...req.body,
      owner: req.user.id,
      image,
    });

    req.io.emit("eventUpdate", await Event.find().populate("owner attendees"));
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    logger.error(`Event creation failed: ${error.message}`);
    res.status(400).json({
      success: false,
      error: error.message || "Something went wrong",
    });
  }
};

// Get Events with Filtering
exports.getEvents = async (req, res) => {
  try {
    const { category, date } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (date) filter.date = { $gte: new Date(date) };

    const events = await Event.find(filter)
      .populate("owner attendees")
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    logger.error(`Get events failed: ${error.message}`);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// Update Event
exports.updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: "Event not found",
      });
    }

    // Check ownership
    if (event.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to update this event",
      });
    }

    let updatedData = { ...req.body };

    // Handle image update if new file is uploaded
    if (req.file) {
      if (event.image.public_id) {
        await cloudinary.uploader.destroy(event.image.public_id);
      }
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "events",
      });
      updatedData.image = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    event = await Event.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });

    req.io.emit("eventUpdate", await Event.find().populate("owner attendees"));
    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    logger.error(`Event update failed: ${error.message}`);
    res.status(400).json({
      success: false,
      error: error.message || "Something went wrong",
    });
  }
};
