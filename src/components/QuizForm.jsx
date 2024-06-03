import React, { useContext, useEffect, useState } from "react";
import { createQuiz, editQuiz } from "../apis/quiz";
import { useEditableContext } from "./context";
import "./QuizForm.css";
import DELETE from "../images/delete.png";
import toast from "react-hot-toast";
import ReactModal from "react-modal";

const QuizForm = ({ closeModal, modalTitle, modalData }) => {
  const [quizzes, setQuizzes] = useState([
    { question: "", option: "text", input: ["", ""], correct_answer: "" },
  ]);
  const [createdQuiz, setCreatedQuiz] = useState("");

  const [activeQuizIndex, setActiveQuizIndex] = useState(0);

  const { setSuccessModal, successModal } = useEditableContext();

  useEffect(() => {
    if (modalData) {
      // Prefill form fields with modalData if available
      setQuizzes(modalData.quizzes);
    }
  }, [modalData]);

  useEffect(() => {
    console.log("title in quizform: ", modalTitle);
  }, [modalTitle]);

  useEffect(() => {
    console.log("successModal state changed:", successModal);
  }, [successModal]);

  const handleAddInput = (quizIndex) => {
    const newQuizzes = [...quizzes];
    if (newQuizzes[quizIndex].input.length < 4) {
      newQuizzes[quizIndex].input.push("");
      setQuizzes(newQuizzes);
    }
  };

  const handleRemoveInput = (quizIndex, inputIndex) => {
    const newQuizzes = [...quizzes];
    newQuizzes[quizIndex].input.splice(inputIndex, 1);
    setQuizzes(newQuizzes);
  };

  const handleAddQuiz = () => {
    if (quizzes.length < 5) {
      setQuizzes([
        ...quizzes,
        {
          question: "",
          option: "text",
          input: ["", ""],
          correct_answer: "",
        },
      ]);
      setActiveQuizIndex(quizzes.length);
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

  const handleCorrectAnswerChange = (quizIndex, value) => {
    const newQuizzes = [...quizzes];
    newQuizzes[quizIndex].correct_answer = value;
    setQuizzes(newQuizzes);
  };

  const handleTimerChange = (quizIndex, value) => {
    const newQuizzes = [...quizzes];
    newQuizzes[quizIndex].timer = value;
    setQuizzes(newQuizzes);
  };

  const handleView = async (quizId) => {
    try {
      console.log(quizId);
      const storyURL = `${window.location.origin}/viewQuiz/${quizId}`;
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
    try {
      if (
        quizzes.some(
          (quiz) =>
            !quiz.question.trim() ||
            quiz.input.some((input) => !input.trim()) ||
            !quiz.correct_answer.trim()
        )
      ) {
        console.error(
          "Please fill in all quiz questions, input fields, and correct answers."
        );
        return;
      }

      const createdQuiz = await createQuiz(modalTitle, quizzes);
      setCreatedQuiz(createdQuiz.mainQuiz);
      handleView(createdQuiz.mainQuiz._id);
      console.log("Quiz created successfully.");
      closeModal();
      setQuizzes([
        { question: "", option: "text", input: ["", ""], correct_answer: "" },
      ]);
      setActiveQuizIndex(0);
      setSuccessModal(true); // Set successModal to true after successful quiz creation
      window.location.reload();
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
  const handleSave = async () => {
    try {
      if (!modalData || !modalData._id) {
        console.error("No quiz data or ID available.");
        return;
      }
      await editQuiz(modalData.id, { quizzes });
      closeModal();
    } catch (error) {
      console.error("Failed to save quiz:", error);
    }
  };
  
  return (
    <div className="quiz__main">
      <div className="quiz__numbers">
        <div style={{ display: "flex" }}>
          {quizzes.map((_, index) => (
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
          {quizzes.length < 5 && (
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
      {quizzes.map(
        (quiz, quizIndex) =>
          quizIndex === activeQuizIndex && (
            <div key={quizIndex} style={{ marginBottom: "20px" }}>
              <input
                type="text"
                placeholder="Quiz Question"
                value={quiz.question}
                onChange={(e) =>
                  handleQuestionChange(quizIndex, e.target.value)
                }
                className="question__input"
              />
              <div style={{ display: "flex", alignItems: "center" }}>
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
                  <label htmlFor="text">Text</label>
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
                  <label htmlFor="imageURL">Image URL</label>
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
                  <label htmlFor="text&imageURL">Text and Image URL</label>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div className="input">
                  {quiz.input.map((input, inputIndex) => (
                    <div key={inputIndex} className="input-container">
                      <input
                        type="rad"
                        value={input}
                        placeholder="Text"
                        onChange={(e) =>
                          handleInputChange(
                            quizIndex,
                            inputIndex,
                            e.target.value
                          )
                        }
                      />
                      {quiz.input.length > 2 && inputIndex > 1 && (
                        <img
                          src={DELETE}
                          alt="delete"
                          className="delete-icon"
                          onClick={() =>
                            handleRemoveInput(quizIndex, inputIndex)
                          }
                        />
                      )}
                    </div>
                  ))}
                  {quiz.input.length < 4 && (
                    <button
                      onClick={() => handleAddInput(quizIndex)}
                      style={{ marginTop: "10px" }}
                    >
                      Add Option
                    </button>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Correct Answer"
                    value={quiz.correct_answer}
                    onChange={(e) =>
                      handleCorrectAnswerChange(quizIndex, e.target.value)
                    }
                  />
                </div>
                <div className="timer">
                  <h3>Timer</h3>
                  <button onClick={() => handleTimerChange(quizIndex, "off")}>
                    OFF
                  </button>
                  <button onClick={() => handleTimerChange(quizIndex, "5 sec")}>
                    5 sec
                  </button>
                  <button
                    onClick={() => handleTimerChange(quizIndex, "10 sec")}
                  >
                    10 sec
                  </button>
                </div>
              </div>
            </div>
          )
      )}
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <button onClick={handleSave}>Save</button>

        <button onClick={closeModal}>Cancel</button>
        <button onClick={handleCreateQuiz}>Create Quiz</button>
      </div>
    </div>
  );
};

export default QuizForm;

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

ReactModal.setAppElement("#root");

export function SuccessModal() {
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function afterOpenModal() {}

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h1>Congrats your Quiz is Published</h1>
        <input type="text" />
      </Modal>
    </div>
  );
}
