import React, { useEffect, useState } from "react";
import TROPHY from "../../../images/trophy.png";
import { useParams, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { getQuizById } from "../../../apis/quiz";
import "./LinkQuizMob.css";

const TIMER_OFF = 0;
const TIMER_5_SEC = 5;
const TIMER_10_SEC = 10;

const LinkQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [timer, setTimer] = useState(TIMER_OFF);
  const [timeLeft, setTimeLeft] = useState(TIMER_OFF);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOptionDisabled, setIsOptionDisabled] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const getQuiz = async () => {
      try {
        const response = await getQuizById(quizId);
        const quizzes = response?.mainQuiz?.quizzes;
        if (quizzes) {
          setDetails(quizzes);
        } else {
          console.error("Unexpected API response structure", response);
        }
      } catch (error) {
        console.log("Error fetching quiz:", error.message);
      }
    };

    getQuiz();
  }, [quizId]);

  useEffect(() => {
    console.log("link mobile called");
  }, []);

  useEffect(() => {
    if (details.length > 0) {
      const quizTimer = details[currentQuizIndex]?.timer;
      let timerValue;

      switch (quizTimer) {
        case "5 sec":
          timerValue = TIMER_5_SEC;
          break;
        case "10 sec":
          timerValue = TIMER_10_SEC;
          break;
        default:
          timerValue = TIMER_OFF;
      }

      console.log(`Setting timer for quiz ${currentQuizIndex}: ${timerValue}`);
      setTimer(timerValue);
      setTimeLeft(timerValue);
    }
  }, [currentQuizIndex, details]);

  useEffect(() => {
    console.log(`Timer: ${timer}, Time Left: ${timeLeft}`);
    if (timer > 0 && timeLeft > 0) {
      const countdown = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(countdown);
    } else if (timeLeft === 0 && timer > 0) {
      handleNext();
    }
  }, [timeLeft, timer]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (selectedOption === currentQuiz.correct_answer) {
      setScore(score + 1);
    }
    setSelectedOption(null);
    setIsOptionDisabled(false);
    if (currentQuizIndex < details.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
    } else {
      console.log("Final Score:", score);
      navigate("/successQuiz", {
        state: { score, totalScore: details.length },
      });
    }
  };

  const currentQuiz = details[currentQuizIndex];
  console.log(currentQuiz);

  if (details.length === 0) {
    return <div>Loading...</div>;
  }

  const renderOptionContent = (option, index) => {
    if (typeof option === "string" && option.startsWith("http")) {
      return <img src={option} alt="option" className="option-image-full" />;
    }
    if (typeof option === "string") {
      return <h2>{option}</h2>;
    }
    if (typeof option === "object" && option.text && option.imageUrl) {
      return (
        <div className="option-content">
          <div className="input-container">
            <input
              type="text"
              placeholder="Text"
              className="option-text-input"
              value={option.text}
              readOnly
            />
          </div>
          <div className="input-container">
            <input
              type="text"
              placeholder="Image URL"
              className="option-image-input"
              value={option.imageUrl}
              readOnly
            />
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="link__top">
        <div>
          <h1>
            {currentQuizIndex + 1} / {details.length}
          </h1>
        </div>
        <div className="timer">
          <h1>{timer > 0 ? `${timeLeft} sec` : "No Timer"}</h1>
        </div>
      </div>
      <div style={{ padding: "0 2rem" }}>
        <div className="question">
          <h1>{currentQuiz?.question}</h1>
        </div>
        <div className="options">
          {currentQuiz?.input?.map((option, index) => (
            <button
              key={index}
              className={`option ${
                selectedOption === option ? "selected" : ""
              }`}
              onClick={() => handleOptionClick(option)}
              disabled={isOptionDisabled}
            >
              {renderOptionContent(option, index)}
            </button>
          ))}
        </div>
        <div className="next-button">
          {currentQuizIndex === details.length - 1 ? (
            <button onClick={handleNext}>SUBMIT</button>
          ) : (
            <button onClick={handleNext}>NEXT</button>
          )}{" "}
        </div>
      </div>
    </div>
  );
};

export default LinkQuiz;

export const SuccessQuizMob = () => {
  const location = useLocation();
  const { state } = location || {};
  const { score, totalScore } = state || {};

  return (
    <div className="success">
      <h1>Congrats Quiz is completed.</h1>
      <img src={TROPHY} alt="" />
      <h1>
        Your Score is{" "}
        <span style={{ color: "green" }}>
          {" "}
          {score} / {totalScore}{" "}
        </span>
      </h1>
    </div>
  );
};
