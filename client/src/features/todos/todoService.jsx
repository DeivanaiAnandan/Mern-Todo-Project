import axios from "axios";

const API_URL = "/api/todos/";

const getAllTodos = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching todos:",
      error.response?.data || error.message
    );
    throw error;
  }
};
const createTodo = async (todoData) => {
  try {
    const response = await axios.post(API_URL, todoData);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating todo:",
      error.response?.data || error.message
    );
    throw error;
  }
};
const updateTodo = async (id, todoData) => {
  const response = await axios.put(`${API_URL}${id}`, todoData);
  return response.data;
};
const deleteTodo = async (id) => {
  const response = await axios.delete(API_URL + id);
  return response.data;
};

const todoService = {
  getAllTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};
export default todoService;
