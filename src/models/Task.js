import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  priority:    { type: String, enum: ["low", "medium", "high"], default: "medium" },
  status:      { type: String, enum: ["todo", "in_progress", "done"], default: "todo" },
  dueDate:     { type: Date },
  assignedTo:  { type: String, trim: true },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

const Task = mongoose.model("Task", taskSchema);
export default Task;
