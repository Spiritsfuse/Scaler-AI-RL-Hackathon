import mongoose from "mongoose";

const listItemSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  dueDate: {
    type: Date,
    default: null
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const listSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ""
  },
  channelId: {
    type: String,
    required: true
  },
  channelName: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [listItemSchema],
  sharedWith: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  isArchived: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: "#1264a3"
  }
}, { timestamps: true });

// Index for faster queries
listSchema.index({ channelId: 1, createdBy: 1 });
listSchema.index({ createdBy: 1 });
listSchema.index({ sharedWith: 1 });

export const List = mongoose.model("List", listSchema);
