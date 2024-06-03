import React from "react";
import Modal from "react-modal";
import QuizForm from "./QuizForm";
import { useEditableContext } from "./context"; // import the context
// import SuccessModal from "./SuccessModal";

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

Modal.setAppElement("#root");

function QuizModal() {
  const { quizModal, setQuizModal } = useEditableContext(); // use the context

  function closeModal() {
    setQuizModal(false);
  }

  return (
    <Modal
      isOpen={quizModal}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Quiz Modal"
    >
      <QuizForm closeModal={closeModal}/>
      {/* <SuccessModal /> */}
    </Modal>
  );
}

export default QuizModal;
