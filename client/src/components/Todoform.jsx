import React from "react";
import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addTodo, updateTodo } from "../features/todos/todoSlice.jsx";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { reset } from "../features/todos/todoSlice.jsx";

function Todoform() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams(); // grabs /edit/:id
  const { state } = useLocation(); // contains todo data if editing
  const [submitted, setSubmitted] = useState(false);

  const isEditMode = Boolean(id);
  const { isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.todos
  );
  const [formData, setFormData] = useState({
    todo: "",
    date: "",
    completed: false,
  });

  // Prefill form when editing
  useEffect(() => {
    if (isEditMode && state) {
      setFormData({
        todo: state.todo,
        date: state.date.split("T")[0],
        completed: state.completed,
      });
    }
  }, [isEditMode, state]);

  useEffect(() => {
    if (submitted && isSuccess) {
      toast.success(
        isEditMode
          ? "Todo updated successfully ✅"
          : "Todo added successfully 🎉"
      );

      navigate("/", {
        state: { skipReminderToast: true },
      });
      dispatch(reset());
      setSubmitted(false);
    }

    if (submitted && isError) {
      toast.error(message);
      dispatch(reset());
      setSubmitted(false);
    }
  }, [submitted, isSuccess, isError, message, dispatch, navigate, isEditMode]);

  const onSubmit = (e) => {
    e.preventDefault();

    // Reset old flags
    dispatch(reset());

    //  Check if date is in the past
    const today = new Date();
    const selectedDate = new Date(formData.date);

    // Remove time for comparison
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      toast.error("⚠️ Todo date cannot be in the past!");
      return; // Stop submission
    }

    //  Dispatch appropriate thunk
    if (isEditMode) {
      dispatch(updateTodo({ id, todoData: formData }));
    } else {
      dispatch(addTodo(formData));
    }

    // Set submitted flag
    setSubmitted(true);
  };

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });
  };
  const { todo, date, completed } = formData;
  return (
    <>
      <Container>
        <h1 className="heading-text">
          {isEditMode ? "Let's keep track of todo" : "Schedule your next todo"}
        </h1>

        <h3>{isEditMode ? "Update Todo" : "Add Todo"}</h3>
        <section className="form">
          <div
            className="p-4 rounded shadow-sm"
            style={{ backgroundColor: "#fde2e4" }}
          >
            <form onSubmit={onSubmit}>
              <div className="form-group">
                <label htmlFor="todo">Enter your next task</label>
                <input
                  type="text"
                  id="todo"
                  name="todo"
                  value={todo}
                  onChange={onChange}
                ></input>
              </div>
              <div className="form-group">
                <label htmlFor="date">Enter the Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={date}
                  onChange={onChange}
                ></input>
              </div>
              <div className="form-group d-flex align-items-center gap-2">
                <label htmlFor="completed">Completed</label>
                <input
                  type="checkbox"
                  id="completed"
                  name="completed"
                  checked={completed}
                  onChange={onChange}
                  className="todo-checkbox"
                ></input>
              </div>
              <div className="form-group">
                <button className="btn btn-block">
                  {" "}
                  {isEditMode ? "Update Todo" : "Add Todo"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </Container>
    </>
  );
}

export default Todoform;
