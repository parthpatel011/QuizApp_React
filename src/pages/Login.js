import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export function Login() {
  const [userRegistration, setUserRegistration] = useState({
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { login: updateAuthState } = useContext(AuthContext);

  function handleInput(e) {
    const { name, value } = e.target;
    setUserRegistration({ ...userRegistration, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login",
        userRegistration
      );
      const { token, user } = response.data; 
      updateAuthState(token, user);
      localStorage.setItem("authToken", token);
      navigate("/dashboard");
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMsg(error.response.data.message || "Login failed");
      } else {
        setErrorMsg("An unexpected error occurred");
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Email Field */}
      <div className="d-flex align-items-center mb-4">
        <label
          htmlFor="email"
          className="form-label me-3"
          style={{ minWidth: "190px" }}
        >
          Email address
        </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter Email"
          className="form-control"
          value={userRegistration.email}
          onChange={handleInput}
        />
      </div>

      {/* Password Field */}
      <div className="d-flex align-items-center mb-4">
          <label
            htmlFor="password"
            className="form-label me-3"
            style={{ minWidth: "190px" }}
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            className="form-control"
            value={userRegistration.password}
            onChange={handleInput}
          />
      </div>

      {/* Display Error Message */}
      {errorMsg && (
        <div className="alert alert-danger" role="alert">
          {errorMsg}
        </div>
      )}

      {/* Forgot Password Link
      <div className="row mb-4">
        <div className="col">
          <a href="#!">Forgot password?</a>
        </div>
      </div> */}

      {/* Sign In Button */}
      <button
        type="submit"
        data-mdb-button-init
        data-mdb-ripple-init
        className="btn btn-primary btn-block mb-4"
      >
        Sign in
      </button>

      {/* Registration Link */}
      <div className="text-center">
        <p>
          Not a member? <Link to="/register">Register</Link>
        </p>
      </div>
    </form>
  );
}
