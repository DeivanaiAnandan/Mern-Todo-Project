import { configureStore } from "@reduxjs/toolkit";
import todoReducer from '../features/todos/todoSlice.jsx'

export const store = configureStore({
    reducer:{
        todos: todoReducer,   //the state.todos
    }
})

