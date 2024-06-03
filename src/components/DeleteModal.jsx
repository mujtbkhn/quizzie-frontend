import React from "react";
import Modal from "react-modal";
import "./Modal.css";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "3rem",
    borderRadius: "8px",
  },
};

Modal.setAppElement("#root");

const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel="Delete Confirmation"
    >
      <h1>Are you confirm you want to delete?</h1>
      <div className="modal__bottom">
        <button onClick={onConfirm} style={{ marginRight: "10px" , backgroundColor: "red", color: "white"}}>
          Confirm Delete
        </button>
        <button onClick={onClose} style={{backgroundColor: "white", color: "black"}}>Cancel</button>
      </div>
    </Modal>
  );
};

export default DeleteModal;
