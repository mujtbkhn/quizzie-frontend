import React, { useContext, useEffect, useState } from "react";
import { useEditableContext } from "./context";
import { createPoll } from "../apis/poll";
import DELETE from "../images/delete.png";
import "./PollForm.css";

const PollForm = ({ closeModal, modalTitle, modalData }) => {
  // const [title, setTitle] = useState("");
  const [quizzes, setQuizzes] = useState([
    { question: "", option: "text", input: ["", "", "", ""] },
  ]);
  const [activeQuizIndex, setActiveQuizIndex] = useState(0);
  const [createdPoll, setCreatedPoll] = useState("");

  const { setSuccessModal, successModal } = useEditableContext();

  useEffect(() => {
    if (modalData) {
      // Prefill form fields with modalData if available
      setQuizzes(modalData.quizzes);
    }
  }, [modalData]);
  useEffect(() => {
    console.log("successModal state changed:", successModal);
  }, [successModal]);

  const handleAddQuiz = () => {
    if (quizzes.length < 5) {
      setQuizzes([
        ...quizzes,
        { question: "", option: "text", input: ["", "", "", ""] },
      ]);
      setActiveQuizIndex(quizzes.length);
    }
  };

  const handleAddInput = (quizIndex) => {
    const newQuizzes = [...quizzes];
    if (newQuizzes[quizIndex].input.length < 4) {
      newQuizzes[quizIndex].input.push("");
      setQuizzes(newQuizzes);
    }
  };

  const handleInputChange = (quizIndex, inputIndex, value) => {
    const newQuizzes = [...quizzes];
    newQuizzes[quizIndex].input[inputIndex] = value;
    setQuizzes(newQuizzes);
  };

  const handleOptionChange = (quizIndex, value) => {
    const newQuizzes = [...quizzes];
    newQuizzes[quizIndex].option = value;
    setQuizzes(newQuizzes);
  };

  const handleQuestionChange = (quizIndex, value) => {
    const newQuizzes = [...quizzes];
    newQuizzes[quizIndex].question = value;
    setQuizzes(newQuizzes);
  };

  const handleRemoveInput = (quizIndex, inputIndex) => {
    const newQuizzes = [...quizzes];
    newQuizzes[quizIndex].input.splice(inputIndex, 1);
    setQuizzes(newQuizzes);
  };

  const handleView = async (pollId) => {
    try {
      console.log(pollId);
      const storyURL = `${window.location.origin}/viewPoll/${pollId}`;
      await navigator.clipboard.writeText(storyURL);
      toast.success("Link copied to clipboard", {
        style: {
          position: "relative",
          top: "10rem",
          color: "red",
          fontSize: "1.5rem",
        },
      });
    } catch (error) {
      console.error(error);
    }
  };
  const handleCreateQuiz = async () => {
    console.log(modalTitle, quizzes);
    try {
      if (!modalTitle.trim()) {
        console.error("Please fill in the title.");
        return;
      }

      if (
        quizzes.some(
          (quiz) =>
            !quiz.question.trim() || quiz.input.some((input) => !input.trim())
        )
      ) {
        console.error("Please fill in all quiz questions and input fields.");
        return;
      }

      const createdPoll = await createPoll(modalTitle, quizzes);
      setCreatedPoll(createdPoll.mainPoll);
      handleView(createdPoll.mainPoll._id);
      console.log("Quiz created successfully.");
      closeModal();
      modalTitle(""); // Reset title
      setQuizzes([{ question: "", option: "text", input: ["", "", "", ""] }]); // Reset quizzes state
      setActiveQuizIndex(0); // Reset active quiz index
      setSuccessModal(true);
      console.log(successModal);
    } catch (error) {
      console.error("Failed to create quiz:", error);
    }
  };

  const handleRemoveQuiz = (index) => {
    const newQuizzes = quizzes.filter((_, i) => i !== index);
    setQuizzes(newQuizzes);
    if (activeQuizIndex >= index) {
      setActiveQuizIndex(activeQuizIndex === 0 ? 0 : activeQuizIndex - 1);
    }
  };

  return (
    <div className="poll-form">
      <div className="quiz__numbers">
        <div style={{ display: "flex" }}>
          {quizzes?.map((_, index) => (
            <div className="quiz__number__container" key={index}>
              <button
                className="number"
                onClick={() => setActiveQuizIndex(index)}
              >
                {index + 1}
              </button>
              {index > 0 && (
                <img
                  width="15"
                  height="15"
                  src="https://img.icons8.com/ios/50/multiply.png"
                  alt="multiply"
                  className="cross"
                  onClick={() => handleRemoveQuiz(index)}
                />
              )}
            </div>
          ))}
          {quizzes?.length < 5 && (
            <button onClick={handleAddQuiz} className="plus">
              <img
                width="24"
                height="24"
                src="https://img.icons8.com/android/24/1A1A1A/plus.png"
                alt="plus"
              />
            </button>
          )}
        </div>
        <div>
          <p>Max 5 Questions</p>
        </div>
      </div>
      {quizzes?.map(
        (quiz, quizIndex) =>
          quizIndex === activeQuizIndex && (
            <div key={quizIndex} className="quiz">
              <input
                type="text"
                className="poll-question"
                placeholder="Poll Question"
                value={quiz.question}
                onChange={(e) =>
                  handleQuestionChange(quizIndex, e.target.value)
                }
              />
              <div className="option-type">
                <p>Option Type</p>
                <div>
                  <input
                    type="radio"
                    name={`option-${quizIndex}`}
                    value="text"
                    checked={quiz.option === "text"}
                    onChange={(e) =>
                      handleOptionChange(quizIndex, e.target.value)
                    }
                  />
                  <label>Text</label>
                </div>
                <div>
                  <input
                    type="radio"
                    name={`option-${quizIndex}`}
                    value="imageURL"
                    checked={quiz.option === "imageURL"}
                    onChange={(e) =>
                      handleOptionChange(quizIndex, e.target.value)
                    }
                  />
                  <label>Image URL</label>
                </div>
                <div>
                  <input
                    type="radio"
                    name={`option-${quizIndex}`}
                    value="text&imageURL"
                    checked={quiz.option === "text&imageURL"}
                    onChange={(e) =>
                      handleOptionChange(quizIndex, e.target.value)
                    }
                  />
                  <label>Text and Image URL</label>
                </div>
              </div>
              <div className="input">
                {quiz?.input?.map((input, inputIndex) => (
                  <div key={inputIndex} className="input-container">
                    <input
                      type="text"
                      value={input}
                      placeholder="Text"
                      onChange={(e) =>
                        handleInputChange(quizIndex, inputIndex, e.target.value)
                      }
                    />
                    {quiz?.input?.length > 2 && inputIndex > 1 && (
                      <img
                        src={DELETE}
                        alt="delete"
                        className="delete-icon"
                        onClick={() => handleRemoveInput(quizIndex, inputIndex)}
                      />
                    )}
                  </div>
                ))}
                {quiz?.input?.length < 4 && (
                  <button
                    onClick={() => handleAddInput(quizIndex)}
                    style={{ marginTop: "10px" }}
                  >
                    Add Option
                  </button>
                )}
              </div>
            </div>
          )
      )}
      <div className="form-buttons">
        <button className="cancel-button" onClick={closeModal}>
          Cancel
        </button>
        <button className="create-button" onClick={handleCreateQuiz}>
          Create Poll
        </button>
      </div>
    </div>
  );
};

export default PollForm;
