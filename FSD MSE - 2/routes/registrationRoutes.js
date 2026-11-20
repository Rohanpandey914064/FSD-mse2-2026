const express = require("express");
const router = express.Router();
const {
  registerForEvent,
  getMyRegistrations,
  getEventRegistrations,
  cancelRegistration,
} = require("../controllers/registrationController");
const { protect, adminOnly } = require("../middleware/auth");
const { registrationLimiter } = require("../middleware/rateLimiter");

router.post("/", protect, registrationLimiter, registerForEvent);
router.get("/my", protect, getMyRegistrations);
router.get("/event/:eventId", protect, adminOnly, getEventRegistrations);
router.put("/:id/cancel", protect, cancelRegistration);

module.exports = router;
