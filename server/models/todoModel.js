import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema(
  {
    todo: {
      type: String,
       required: [true, "Todo task is required"],
      minlength: [3, "Todo must be at least 3 characters long"],
    },
    date: {
      type: Date,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Todo", TodoSchema);
