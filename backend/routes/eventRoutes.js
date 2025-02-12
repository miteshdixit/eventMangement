const express = require("express");
const { protect, ownership } = require("../middleware/auth");
const {
  createEvent,
  getEvents,
  //   toggleAttendance,
} = require("../controllers/eventController");

const router = express.Router();

router.post("/create", protect, createEvent);
router.get("/", getEvents);

// router.post("/:id/attend", protect, toggleAttendance);
// router.delete("/:id", protect, ownership(Event), deleteEvent);

module.exports = router;
