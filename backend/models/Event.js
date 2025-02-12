const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Event name is required"],
    trim: true,
    maxlength: [100, "Event name cannot exceed 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Event description is required"],
    minlength: [50, "Description should be at least 50 characters"],
  },
  date: {
    type: Date,
    required: [true, "Event date is required"],
    validate: {
      validator: function (value) {
        return value > Date.now();
      },
      message: "Event date must be in the future",
    },
  },
  location: {
    type: String,
    required: [true, "Location is required"],
  },
  capacity: {
    type: Number,
    default: 100,
    min: [1, "Capacity must be at least 1"],
  },
  category: {
    type: String,
    enum: {
      values: ["tech", "music", "business", "sports"],
      message: "Invalid event category",
    },
    required: [true, "Category is required"],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  attendees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  image: {
    public_id: String,
    url: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Event", eventSchema);
