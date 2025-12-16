import Todo from "../models/todoModel.js";
import mongoose from "mongoose";
//@Desc Get all todos
//@Route GET /api/todos
//@Access Public
export const getAllTodos = async (req, res) => {
  // res.send("Get all todos from Controller")
  try {
    const todos = await Todo.find().sort({ date: 1 }); 
    return res.status(200).json({
      success: true,
      todos,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};
//@Desc Add a todo
//@Route POST /api/todos
//@Access Private
export const addTodo = async (req, res) => {
  // res.send("Add a todo Controller")
  console.log("Incoming POST /api/todos");
  console.log("📦 req.body →", req.body);
  try {
    const { todo, date, completed } = req.body;
    // 2. Request body empty?  {}
    if (!Object.keys(req.body).length) {
      return res.status(400).json({
        success: false,
        error: "No data provided to update",
      });
    }
    //data is missing
    if (!todo || !date) {
      return res.status(400).json({
        success: false,
        error: "Task and Date is required",
      });
    }

    const todos = await Todo.create({
      todo,
      date,
      completed: completed || false,
    });
    return res.status(200).json({
      success: true,
      message: "Todo added successfully",
      todos,
    });
  } catch (error) {
    console.error("ADD TODO ERROR →", error);
    // Validation error
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

//@Desc Update a todo
//@Route PUT /api/todos/:id
//@Access Private

export const UpdateTodo = async (req, res) => {
  // res.send("Update a todo");
  try {
    // 1. Validate ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid ID format",
      });
    }

    // 2. Request body empty?
    if (!Object.keys(req.body).length) {
      return res.status(400).json({
        success: false,
        error: "No data provided to update",
      });
    }

    const existtodo = await Todo.findById(req.params.id);
    if (!existtodo) {
      return res.status(400).json({
        success: false,
        error: "Todo not found",
      });
    }
      const { todo, date } = req.body;

    // ✅ ADD THIS
    if (!todo || !date) {
      return res.status(400).json({
        success: false,
        error: "Task and Date is required",
      });
    }
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    return res.status(200).json({
      message: "Updated Successfully",
      updatedTodo,
    });
  } catch (error) {
    console.error("ADD TODO ERROR →", error);

    // Validation error
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

//@Desc Delete a todo
//@Route DELETE /api/todos/:id
//@Access Private
export const deleteTodo = async (req, res) => {
  //   res.send("Delete a todo from Controller");
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(400).json({
        success: false,
        error: "Todo not found",
      });
    }
    await todo.deleteOne();
    return res.status(200).json({
      message: "Deleted Successfully",
      id: req.params.id,
    });
  } catch (error) {
    console.error("ADD TODO ERROR →", error);
    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};
