import React, { useState } from "react";
import EDIT from "../images/edit.png";
import DELETE from "../images/delete.png";
import SHARE from "../images/share.png";
import { deleteQuiz, getQuizById } from "../apis/quiz";
import { deletePoll, getPollById } from "../apis/poll";
import { recordUserResponse } from "../apis/analytics";
import DeleteModal from "./DeleteModal";
import "./TableComponent.css";
import toast from "react-hot-toast";
import QuizForm from "./QuizForm";
import PollForm from "./PollForm";

const TableComponent = ({ data, setData }) => {
  // Pass setData to update table data
  const [details, setDetails] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [modalData, setModalData] = useState(null); // State to store modal data
  const [modalType, setModalType] = useState(null);

  const handleEdit = (item) => {
    // Set the data and type for the modal
    setModalData(item);
    setModalType(item.type === "quiz" ? "quiz" : "poll");
  };

  const handleQuizAnalysis = async (quizId) => {
    try {
      const response = await getQuizById(quizId);
      const quizzes = response.mainQuiz.quizzes;
      setDetails(quizzes[0]); // Assuming you want to analyze the first sub-quiz

      if (quizzes.length > 0) {
        const subQuizId = quizzes[0]._id;
        const selectedAnswer = quizzes[0].correct_answer;
        console.log(quizId, subQuizId, selectedAnswer);

        await recordUserResponse(quizId, subQuizId, selectedAnswer);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePollAnalysis = async (pollId) => {
    try {
      const response = await getPollById(pollId);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const formatImpressions = (impressions) => {
    return impressions >= 1000
      ? (impressions / 1000).toFixed(1) + "k"
      : impressions;
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "2-digit" };
    return new Intl.DateTimeFormat("en-GB", options).format(
      new Date(dateString)
    );
  };

  const openDeleteModal = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const confirmDelete = async () => {
    try {
      if (itemToDelete.type === "quiz") {
        await deleteQuiz(itemToDelete.id || itemToDelete._id);
      } else {
        await deletePoll(itemToDelete.id || itemToDelete._id);
      }
      setData((prevData) =>
        prevData.filter(
          (item) => item.id !== itemToDelete.id && item._id !== itemToDelete._id
        )
      );
      closeDeleteModal();
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete the item:", error);
    }
  };

  const handleView = async (itemId, itemType) => {
    try {
      const storyURL = `${window.location.origin}/view${itemType}/${itemId}`;
      await navigator.clipboard.writeText(storyURL);
      toast.success("Link copied to clipboard", {
        style: {
          position: "relative",
          right: "1rem",
          color: "green",
          fontSize: "1.5rem",
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <table border="1" className="table__main">
        <thead>
          <tr>
            <th>Sr No</th>
            <th>Name</th>
            <th>Created on</th>
            <th>Impressions</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id || item._id}>
              <td>{index + 1}</td>
              <td>{item.title}</td>
              <td>{formatDate(item.createdAt)}</td>
              <td>{formatImpressions(item.impressions)}</td>
              <td className="action-icons">
                <img src={EDIT} alt="edit" onClick={() => handleEdit(item)} />
                <img
                  src={SHARE}
                  alt="share"
                  onClick={() => handleView(item.id || item._id, item.type)}
                />{" "}
                <img
                  src={DELETE}
                  alt="delete"
                  onClick={() => openDeleteModal(item)}
                />
              </td>
              <td>
                {item.type === "quiz" ? (
                  <span
                    className="analysis-text"
                    onClick={() => handleQuizAnalysis(item.id || item._id)}
                  >
                    Question Wise Analysis
                  </span>
                ) : (
                  <span
                    className="analysis-text"
                    onClick={() => handlePollAnalysis(item.id || item._id)}
                  >
                    Question Wise Analysis
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
      />

      {modalType === "quiz" && (
        <div
          style={{
            padding: "1rem 3rem",
            backgroundColor: "white",
            position: "absolute",
            top: "5rem",
            left: "15rem",
            borderRadius: "1rem",
          }}
        >
          <QuizForm
            closeModal={() => setModalData(null)} // Close modal function
            modalTitle="Edit Quiz" // You may modify this title
            modalData={modalData} // Pass the data to the modal
          />
        </div>
      )}
      {modalType === "poll" && (
        <div
          style={{
            padding: "1rem 3rem",
            backgroundColor: "white",
            position: "absolute",
            top: "5rem",
            left: "15rem",
            borderRadius: "1rem",
          }}
        >
          <PollForm
            closeModal={() => setModalData(null)} // Close modal function
            modalTitle="Edit Poll" // You may modify this title
            modalData={modalData} // Pass the data to the modal
          />
        </div>
      )}
    </>
  );
};

export default TableComponent;
