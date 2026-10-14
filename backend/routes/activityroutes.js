const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Activity = require("../models/Activity");
const { calculateCarbon } = require("../services/carbonCalculator");

const router = express.Router();

// CREATE ACTIVITY
router.post("/",authMiddleware, async (req, res) => {
  try {
    const { type, activity, quantity, unit } = req.body;
    if (!type || !activity || quantity === undefined || !unit) {
  return res.status(400).json({
    success: false,
    message: "type, activity, quantity and unit are required",
  });
}

if (quantity <= 0) {
  return res.status(400).json({
    success: false,
    message: "Quantity must be greater than 0",
  });
}

const carbonEmission = calculateCarbon(
  type,
  activity,
  quantity
);

const newActivity = await Activity.create({
  user:req.user.id,
  type,
  activity,
  quantity,
  unit,
  carbonEmission,
});

    res.status(201).json({
      success: true,
      message: "Activity created successfully 🌱",
      data: newActivity,
    });
  } catch (error) {
    console.error("Create Activity Error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// GET ALL ACTIVITIES
router.get("/",authMiddleware, async (req, res) => {
  try {
    const activities = await Activity.find({user:req.user.id,}).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (error) {
    console.error("Get Activities Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
// DELETE ACTIVITY
router.delete("/:id",authMiddleware, async (req, res) => {
  try {
    const deletedActivity = await Activity.findByIdAndDelete({_id: req.params.id,user:req.user.id,});

    if (!deletedActivity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Activity deleted successfully",
    });
  } catch (error) {
    console.error("Delete Activity Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;