import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

export function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center">
            <h1>Quiz Dashboard</h1>
            <div>
              <span className="me-3">Welcome, {user?.name || "User"}</span>
              <button className="btn btn-outline-danger" onClick={handleLogout}>
                Logout
              </button>
              <Link to="/profile" state={{ userId: user?.id }}>
                <button className="btn btn-primary ms-3">Profile</button>
              </Link>
            </div>
          </div>
          <hr />
        </div>
      </div>

      <div className="row mb-4">
        <div className="col">
          <div className="p-4 shadow-sm text-start">
            <h2 className="mb-5 fw-bold">Quiz Instructions</h2>
            <p>
              Please read the instructions carefully before starting the quiz.
              You have only one attempt to complete the quiz.
            </p>
            <ul className="text-start">
              <li>The quiz consists of multiple-choice questions.</li>
              <li>Each question has one correct answer.</li>
              <li>You must answer all questions within the given time.</li>
              <li>Once you start, you cannot pause or retake the quiz.</li>
              <li>
                Your final score and performance will be displayed at the end.
              </li>
            </ul>
            <p>Good luck and do your best!</p>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body text-center">
              <h5 className="card-title">Sample Quiz</h5>
              <p className="card-text">Try this quiz to test your skills.</p>
              <Link to="/quiz" state={{ userId: user?.id }}>
                <button className="btn btn-primary">Start Quiz</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
