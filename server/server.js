import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import todoRoutes from './Routes/todoRoutes.js';
import { connectDB } from './config/db.js';

dotenv.config();
// Handle ESM __dirname issue
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

connectDB();
const app = express();

// app.get('/',(req,res)=>{
//     res.send("get all todos")
// })
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/todos', todoRoutes)

// // Serve frontend
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, './client/build')));

// app.get(/.*/, (req, res) =>
//   res.sendFile(path.resolve(__dirname, './client/build', 'index.html'))
// );
// } else {
//   app.get('/', (req, res) => res.send('Please set to production'));
// }

// Serve frontend
if (process.env.NODE_ENV === "production") {
  app.use(
    express.static(path.join(__dirname, "..", "client", "build"))
  );

  app.get(/.*/, (req, res) =>
    res.sendFile(
      path.resolve(__dirname, "..", "client", "build", "index.html")
    )
  );
} else {
  app.get("/", (req, res) => res.send("API running"));
}
const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server is running in ${process.env.NODE_ENV} mode and in ${PORT}`)
})
