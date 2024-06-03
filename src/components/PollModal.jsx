import React from "react";
import Modal from "react-modal";
import PollForm from "./PollForm";
import { useEditableContext } from "./context"; // import the context

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

function PollModal() {
  const { pollModal, setPollModal } = useEditableContext(); // use the context

  function closeModal() {
    setPollModal(false);
  }

  return (
    <Modal
      isOpen={pollModal}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Poll Modal"
    >
      <PollForm />
    </Modal>
  );
}

export default PollModal;
