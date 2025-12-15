import React from "react";

import { Card, Badge } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { deleteTodo } from "../features/todos/todoSlice";
import { useNavigate } from "react-router-dom";

function TodoCard({ todo, onEdit, onDelete }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const today = new Date();
  const todoDate = new Date(todo.date);

  // difference in days
  const diffDays = Math.ceil((todoDate - today) / (1000 * 60 * 60 * 24));

  const isOverdue = diffDays < 0 && !todo.completed;
  const cardStyle = todo.completed
    ? { borderLeft: "5px solid #198754", backgroundColor: "#f0fff4" } // green
    : isOverdue
    ? { borderLeft: "5px solid #dc3545", backgroundColor: "#fff5f5" } // red
    : { borderLeft: "5px solid #ffc107", backgroundColor: "#fffbea" }; // yellow

  return (
    <Card className="mb-3 shadow-sm" style={cardStyle}>
      <Card.Body>
        <Card.Title>{todo.todo}</Card.Title>

        <Card.Text>
          <strong>Date:</strong> {new Date(todo.date).toDateString()}
        </Card.Text>

        {todo.completed ? (
          <Badge bg="success">Completed</Badge>
        ) : isOverdue ? (
          <Badge bg="danger">Overdue</Badge> // 🔴 RED badge
        ) : (
          <Badge bg="warning">Pending</Badge>
        )}

        {/* ICONS SECTION */}
        <div
          className="d-flex justify-content-end gap-3 mt-3"
          style={{ fontSize: "1.2rem", cursor: "pointer" }}
        >
          <FaEdit
            color="#0d6efd"
            title="Update Todo"
            onClick={() => navigate(`/updatetodo/${todo._id}`, { state: todo })} //entire todo object is passed here
          />
          <FaTrash
            color="#dc3545"
            title="Delete Todo"
            onClick={() => onDelete(todo._id)}
            style={{ cursor: "pointer" }}
          />
        </div>
      </Card.Body>
    </Card>
  );
}

export default TodoCard;
