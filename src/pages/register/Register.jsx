import React, { useState } from "react";
import "./register.css";
import { registerUser } from "../../apis/auth";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [activeButton, setActiveButton] = useState("register");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    let validationErrors = {};

    if (!name) validationErrors.name = "Name is required";
    if (!email) validationErrors.email = "Email is required";
    if (!password) validationErrors.password = "Password is required";
    if (password !== confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    } else {
      try {
        await registerUser(name, email, password);
        navigate("/");
      } catch (error) {
        const apiErrors = {};
        if (error.errors) {
          for (const key in error.errors) {
            apiErrors[key] = error.errors[key];
          }
        } else if (error.message) {
          apiErrors.apiError = error.message;
        }
        setErrors(apiErrors);
      }
    }
  };

  return (
    <div className="register__main">
      <div className="register-container">
        <h1>QUIZZIE</h1>
        <div className="auth__buttons">
          <button
            className={activeButton === "register" ? "active" : ""}
            onClick={() => setActiveButton("register")}
          >
            Sign-Up
          </button>
          <button
            className={activeButton === "login" ? "active" : ""}
            onClick={() => {
              setActiveButton("login");
              navigate("/login");
            }}
          >
            Login
          </button>
        </div>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {errors.name && <div className="error">{errors.name}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <div className="error">{errors.email}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <div className="error">{errors.password}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="confirm_password">Confirm Password</label>
          <input
            type="password"
            name="confirm_password"
            id="confirm_password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && (
            <div className="error">{errors.confirmPassword}</div>
          )}
        </div>

        {errors.apiError && <div className="error">{errors.apiError}</div>}

        <button className="btn__main" onClick={handleSubmit}>Sign-Up</button>
      </div>
    </div>
  );
};

export default Register;
