import express from "express";
const router = express.Router();
import {
  addTodo,
  deleteTodo,
  getAllTodos,
  UpdateTodo,
} from "../controllers/todoController.js";

// router.get('/',(req,res)=>{
//     res.send("Get all todo from router")
// })
router.route("/").get(getAllTodos).post(addTodo);
router.route("/:id").put(UpdateTodo).delete(deleteTodo);

export default router;
