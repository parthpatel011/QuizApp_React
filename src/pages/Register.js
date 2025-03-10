import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export function Register() {
    const [userRegistration, setUserRegistration] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
      });
      const [errorMsg, setErrorMsg] = useState("");
      const navigate = useNavigate();
    
      function handleInput(e) {
        const name = e.target.name;
        const value = e.target.value;
        setUserRegistration({ ...userRegistration, [name]: value });
      }
    //   console.log(userRegistration);     
      async function handleSubmit(e) {
        e.preventDefault();
        setErrorMsg("");
        try {
          const response = await axios.post(
            "http://127.0.0.1:8000/api/register",
            userRegistration
          );
        //   const { token } = response.data;
          // Store token in local storage
        //   localStorage.setItem("authToken", token);
          // Navigate to the quiz page (or dashboard)
          navigate("/login");
        } catch (error) {
          // Handle errors - display error message
          if (error.response && error.response.data) {
            setErrorMsg(error.response.data.message || "Registration failed");
          } else {
            setErrorMsg("An unexpected error occurred");
          }
        }
      }
    return (
  <form onSubmit={handleSubmit}>
    <div className="row mb-4">
      <div className="col-md-3">
        <label className="form-label" htmlFor="name">
          Name
        </label>
      </div>
      <div className="col-md-9">
        <input
          type="text"
          name="name"
          id="name"
        //   placeholder=""
          className="form-control"
          value={userRegistration.name}
          onChange={handleInput}
        />
      </div>
    </div>
    {/* Email Field */}
    <div className="row mb-4">
      <div className="col-md-3">
        <label className="form-label" htmlFor="email">
          Email address
        </label>
      </div>
      <div className="col-md-9">
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email address"
          className="form-control"
          value={userRegistration.email}
          onChange={handleInput}
        />
      </div>
    </div>

    {/* Password Field */}
    <div className="row mb-4">
      <div className="col-md-3">
        <label className="form-label" htmlFor="password">
          Password
        </label>
      </div>
      <div className="col-md-9">
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
    </div>


    <div className="row mb-4">
      <div className="col-md-3">
        <label className="form-label" htmlFor="password_confirmation">
          Confirm Password
        </label>
      </div>
      <div className="col-md-9">
        <input
          type="password"
          name="password_confirmation"
          id="password_confirmation"
          placeholder="Password"
          className="form-control"
          value={userRegistration.password_confirmation}
          onChange={handleInput}
        />
      </div>
    </div>

    {/* Display Error Message */}
    {errorMsg && (
      <div className="alert alert-danger" role="alert">
        {errorMsg}
      </div>
    )}

    {/* Sign In Button */}
    <button
      type="submit"
      data-mdb-button-init
      data-mdb-ripple-init
      className="btn btn-primary btn-block mb-4"
    >
      Register
    </button>

    {/* Registration Link */}
    <div className="text-center">
      <p>
        already registered? <Link to="/login">Login</Link>
      </p>
    </div>
  </form>
  );
}
