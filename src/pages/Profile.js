import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export function Profile() {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;
  //   console.log("User ID:", userId);

  const [userData, setUserData] = useState([]);
  const [quizHistory, setQuizHistory] = useState([]);
  const [error, setError] = useState(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/getquizData",
          {
            params: { user_id: userId },
          }
        );
        console.log("Data fetched successfully:", response.data);
        setUserData(response.data.user[0]);
        setQuizHistory(response.data.quizData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data");
      }
    };

    fetchData();
  }, [userId]);

  if (!userData) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const payload = {
      user_id: userId,
      currentPassword: currentPassword,
      newPassword: newPassword,
    };
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/changePassword",
        payload
      );
      console.log("Password change response:", response.data);
      alert("Password updated successfully.");
    } catch (error) {
      console.error("Error changing password:", error);
      setError("Failed to change password");
    }
  };

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-warning" onClick={handleGoToDashboard}>
          Dashboard
        </button>
      </div>

      <div className="card mb-4 card-custom text-start card-white-border">
        <div className="card-header">
          <h3 className="underline-white">User Details</h3>
        </div>
        <div className="card-body">
          <div className="d-flex flex-column flex-md-row align-items-center">
            <div>
              <p>
                <strong>Name:</strong> {userData.name}
              </p>
              <p>
                <strong>Email:</strong> {userData.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4 card-custom text-start card-white-border">
        <div className="card-header">
          <h3>Quiz History</h3>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Quiz Title</th>
                  <th>Date</th>
                  <th>Score</th>
                  <th>Questions</th>
                </tr>
              </thead>
              <tbody>
                {quizHistory.map((quiz) => (
                  <tr key={quiz.id}>
                    <td>{quiz.quizTitle}</td>
                    <td>{new Date(quiz.date).toLocaleDateString()}</td>
                    <td>{quiz.score}</td>
                    <td>{quiz.questions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

            <div className="card mb-4 card-custom text-start card-white-border">
        <div className="card-header">
          <h3>Edit Profile</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleUpdateProfile} className="w-50 mx-auto p-3">
            <div className="mb-3">
              <label htmlFor="currentPassword" className="form-label">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                className="form-control"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}
