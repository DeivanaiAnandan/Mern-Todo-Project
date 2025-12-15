import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import todoService from "./todoService.jsx";

const initialState = {
  todos: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

// CREATE TODO
export const addTodo = createAsyncThunk(
  "todos/create",
  async (todoData, thunkAPI) => {
    try {
      // return await todoService.createTodo(todoData);
      const res = await todoService.createTodo(todoData);
      console.log("⛔ Backend returned →", res);
      return res.todos;
    } catch (error) {

        const message =
        error.response?.data?.error ||   // 🔥 FIXED
        error.message ||
        error.toString()

      return thunkAPI.rejectWithValue(message)
    }
  }
);
// PUBLIC: Get all todos
export const getTodos = createAsyncThunk(
  "todos/getAll",
  async (_, thunkAPI) => {
    try {
      return await todoService.getAllTodos();
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);
// UPDATE A TODO
export const updateTodo = createAsyncThunk(
  "todos/update",
  async ({ id, todoData }, thunkAPI) => {
    try {
      return await todoService.updateTodo(id, todoData);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// DELETE TODO
export const deleteTodo = createAsyncThunk(
  "todos/delete",
  async (id, thunkAPI) => {
    try {
      return await todoService.deleteTodo(id);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    reset: (state) => {
      state.todos = [];
      // state.post = null;
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addTodo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.todos.push(action.payload);
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        // console.log("CreateTodo error:", action.payload);
      })
      .addCase(getTodos.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTodos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.todos = action.payload.todos; //backend returns object
      })
      .addCase(getTodos.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateTodo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        //  Update the post inside posts[] list
        state.todos = state.todos.map((todo) =>
          todo._id === action.payload._id ? action.payload : todo
        );
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteTodo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // 🔥 Update the post inside posts[] list
        state.todos = state.todos.filter((p) => p._id !== action.payload.id);
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = todoSlice.actions;
export default todoSlice.reducer;
