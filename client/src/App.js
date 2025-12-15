import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./pages/Dashboard";
import Todoform from "./components/Todoform";
function App() {
  return (
    <div className="App">
      <Router>
        <ToastContainer position="top-right" autoClose={5000} />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/addtodo" element={<Todoform />} />
          <Route path="/updatetodo/:id" element={<Todoform />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
