import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { QuizContext } from "./components/context";
import Homepage from "./pages/Homepage/Homepage";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import LinkQuizMob, { SuccessQuizMob } from "./pages/LinkQuiz/LinkQuizMob/LinkQuiz";
import LinkQuizDesk, { SuccessQuizDesk } from "./pages/LinkQuiz/LinkQuizDesk/LinkQuiz";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import PollQuizDesk, { SuccessPollDesk } from "./pages/PollQuiz/PollQuizDesk/PollQuiz";
import PollQuizMob, { SuccessPollMob } from "./pages/PollQuiz/PollQuizMob/PollQuiz";

function App() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <QuizContext>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Homepage />
              </ProtectedRoute>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* Conditionally render LinkQuiz based on window width */}
          <Route
            path="/viewQuiz/:quizId"
            element={
              windowWidth < 768 ? <LinkQuizMob /> : <LinkQuizDesk />
            }
          />
          <Route
            path="/successQuiz"
            element={
              windowWidth < 768 ? <SuccessQuizMob /> : <SuccessQuizDesk />
            }
          />
          <Route
            path="/viewPoll/:pollId"
            element={
              windowWidth < 768 ? <PollQuizMob /> : <PollQuizDesk />
            }
          />
          <Route path="/successPoll" element={
              windowWidth < 768 ? <SuccessPollMob /> : <SuccessPollDesk />
            } />
        </Routes>
      </BrowserRouter>
    </QuizContext>
  );
}

export default App;
