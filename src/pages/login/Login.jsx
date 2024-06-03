import React, { useState } from "react";
import { loginUser } from "../../apis/auth";
import "./login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [activeButton, setActiveButton] = useState("login");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await loginUser(email, password);
      navigate("/");
    } catch (error) {
      const loginErrors = {};
      if (error.errors) {
        for (const key in error.errors) {
          loginErrors[key] = error.errors[key];
        }
      } else if (error.message) {
        loginErrors.apiError = error.message;
      }
      setErrors(loginErrors);
    }
  };

  return (
    <div className="login__main">
      <div className="login-container">
        <h1>QUIZZIE</h1>
        <div className="auth__buttons">
          <button
            className={activeButton === "register" ? "active" : ""}
            onClick={() => {
              setActiveButton("register");
              navigate("/register");
            }}
          >
            Sign-Up
          </button>
          <button
            className={activeButton === "login" ? "active" : ""}
            onClick={() => setActiveButton("login")}
          >
            Login
          </button>
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <span className="error">{errors.email}</span>}
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
          {errors.password && <span className="error">{errors.password}</span>}
        </div>
        {errors.apiError && <span className="error">{errors.apiError}</span>}
        <button className="btn__main" onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default Login;
