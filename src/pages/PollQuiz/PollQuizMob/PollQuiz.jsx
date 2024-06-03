import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./PollQuizMob.css";
import { getPollById } from "../../../apis/poll";

const PollQuiz = () => {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOptionDisabled, setIsOptionDisabled] = useState(false);

  useEffect(() => {
    const getQuiz = async () => {
      try {
        const response = await getPollById(pollId);
        const polls = response?.mainPoll?.polls;
        if (polls) {
          setDetails(polls);
        } else {
          console.error("Unexpected API response structure", response);
        }
      } catch (error) {
        console.log("Error fetching poll:", error.message);
      }
    };

    getQuiz();
  }, [pollId]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsOptionDisabled(false);
    if (currentQuizIndex < details.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
    } else {
      navigate("/successPoll");
    }
  };

  const currentQuiz = details[currentQuizIndex];
  console.log(currentQuiz);

  if (details.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="poll__top">
        <div>
          <h1>
            {currentQuizIndex + 1} / {details.length}
          </h1>
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
              <h2>{option}</h2>
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

export default PollQuiz;

export const SuccessPollMob = () => {
  return (
    <div className="success">
      <h1>Thank you for participating in the poll</h1>
    </div>
  );
};
