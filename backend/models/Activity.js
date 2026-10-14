const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
   user : {
    type : 
    mongoose.Schema.Types.ObjectId,
    ref:"user",
    required: true, 
   },

   
    type: {
      type: String,
      required: true,
      enum: [
        "transport",
        "electricity",
        "food",
        "travel",
        "shopping",
        "waste",
      ],
    },

    activity: {
      type: String,
      required: true,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    unit: {
      type: String,
      required: true,
      trim: true,
    },

    carbonEmission: {
      type: Number,
      required: true,
      min: 0,
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;