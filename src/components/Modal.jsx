import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useEditableContext } from "./context";
import "./Modal.css";
import QuizForm from "./QuizForm";
import PollForm from "./PollForm";

const quizStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "2.5rem 7rem",
    borderRadius: "8px",
  },
};

const pollStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "2.5rem 3rem",
    margin: "0.5rem",
    borderRadius: "8px",
  },
};

Modal.setAppElement("#root");

function CustomModal({ isOpen, onClose }) {
  const [title, setTitle] = useState("");
  const [formType, setFormType] = useState(null); // null for no form, 'quiz' for QuizForm, 'poll' for PollForm
  const { setQuizModal, setPollModal } = useEditableContext();

  useEffect(() => {
    console.log("title changed: ", title);
  }, [title]);

  function handleContinue(type) {
    if (type === 'quiz') {
      setQuizModal(true);
      setPollModal(false);
      setFormType('quiz');
    } else {
      setQuizModal(false);
      setPollModal(true);
      setFormType('poll');
    }
  }

  const customStyles = formType === 'quiz' ? quizStyles : pollStyles;


  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel="Select Modal Type"
    >
      {formType === null ? (
        <>
          <input
            className="modal__input"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="modal__center">
            <h3>Select Type</h3>
            <button onClick={() => handleContinue('quiz')}>Quiz</button>
            <button onClick={() => handleContinue('poll')}>Poll</button>
          </div>
          <div className="modal__bottom">
            <button onClick={onClose}>Cancel</button>
            <button onClick={() => handleContinue(true)}>Continue</button>
          </div>
        </>
      ) : formType === 'quiz' ? (
        <QuizForm closeModal={onClose} modalTitle={title} />
      ) : (
        <PollForm closeModal={onClose} modalTitle={title} />
      )}
    </Modal>
  );
}

export default CustomModal;
