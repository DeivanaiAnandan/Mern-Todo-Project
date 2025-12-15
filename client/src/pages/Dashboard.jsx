import React, { useRef, useEffect } from "react";
import Todoform from "../components/Todoform.jsx";
import { getTodos, deleteTodo } from "../features/todos/todoSlice.jsx";
import { useDispatch, useSelector } from "react-redux";
import TodoCard from "../components/TodoCard.jsx";
import { Container, Row, Col } from "react-bootstrap";
import { FaPlusCircle } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const remindersShownRef = useRef(false);
  const { todos, isLoading, isError, message } = useSelector(
    (state) => state.todos
  );

  const handleDeleteTodo = (id) => {
    dispatch(deleteTodo(id));
    toast.success("Todo deleted successfully 🗑️");
  };

  const handleEditTodo = (todo) => {
    navigate(`/updatetodo/${todo._id}`, {
      state: { ...todo, skipReminderToast: true },
    });
  };

  const shownTodos = useRef(new Set());

  const checkUpcomingTodos = (todos) => {
    const today = new Date();
    const todayKey = today.toISOString().split("T")[0]; // YYYY-MM-DD

    // get all stored days
    const allShown = JSON.parse(localStorage.getItem("shownTodos")) || {};

    // get today's shown data
    const shown = allShown[todayKey] || {};

    // 🔴 Overdue (only if not completed)
    todos.forEach((todo) => {
      if (todo.completed) return;

      const todoDate = new Date(todo.date);
      const diffDays = Math.ceil((todoDate - today) / (1000 * 60 * 60 * 24));

      const overdueKey = `overdue-${todo._id}`;

      if (diffDays < 0 && !shown[overdueKey]) {
        toast.error(`Todo "${todo.todo}" is overdue!`);
        shown[overdueKey] = true;
      }
    });

    // 🟡 Due in 3 days (grouped)
    const upcomingTodos = todos.filter((todo) => {
      if (todo.completed) return false;

      const todoDate = new Date(todo.date);
      const diffDays = Math.ceil((todoDate - today) / (1000 * 60 * 60 * 24));

      return diffDays === 3 && !shown[`soon-${todo._id}`];
    });

    if (upcomingTodos.length > 0) {
      const titles = upcomingTodos.map((todo) => todo.todo).join(", ");
      toast.info(`You have just 3 more days to complete: ${titles}`);

      upcomingTodos.forEach((todo) => {
        shown[`soon-${todo._id}`] = true;
      });
    }

    // save only today's data
    allShown[todayKey] = shown;
    localStorage.setItem("shownTodos", JSON.stringify(allShown));
  };

  // Fetch todos on mount
  useEffect(() => {
    dispatch(getTodos());
  }, [dispatch]);

  useEffect(() => {
    if (todos && todos.length > 0 && !remindersShownRef.current) {
      // Skip toast if navigated from edit page
      if (location.state?.skipReminderToast) {
        navigate(location.pathname, { replace: true }); // clear state
        return;
      }
      checkUpcomingTodos(todos);
      remindersShownRef.current = true;
    }
  }, [todos, location, navigate]);

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <p style={{ color: "red" }}>{message}</p>;
  }

  return (
    <>
      <Container>
        <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
          <h2 className="mt-4 mb-3">My Todos</h2>
          <div
            className="d-flex align-items-center"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/addtodo")}
          >
            <span className="me-2">
              <strong>Add Todo</strong>
            </span>
            <FaPlusCircle size={25} color="#0d6efd" />
          </div>
        </div>

        <Row>
          {todos?.map((todo) => (
            <Col key={todo._id} md={4}>
              <TodoCard
                todo={todo}
                onDelete={handleDeleteTodo}
                onEdit={handleEditTodo}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}

export default Dashboard;
