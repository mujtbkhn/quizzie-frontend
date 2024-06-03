import React, { useState } from "react";
import HomeLeft from "../../components/HomeLeft/HomeLeft";
import Modal from "../../components/Modal";
import QuizModal from "../../components/QuizModal";
import PollModal from "../../components/PollModal";
import { QuizContext } from "../../components/context";
import "./Homepage.css";
import Analytics from "../../components/Analytics";
import DashBoard from "../../components/DashBoard/DashBoard";

const Homepage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDashboard, setShowDashboard] = useState(true);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const toggleDashboard = () => {
    setShowDashboard(true);
  };

  const toggleAnalytics = () => {
    setShowDashboard(false);
  };

  return (
    <div className="home__main">
      <QuizContext>
        <div>
          <HomeLeft onCreateQuizClick={openModal} onDashboardClick={toggleDashboard} onAnalyticsClick={toggleAnalytics} />
          <Modal isOpen={isModalOpen} onClose={closeModal} />
          {/* <QuizModal /> */}
          {/* <PollModal /> */}
        </div>
        <div style={{backgroundColor: "#EDEDED", width: "100%"}}>
          {showDashboard ? <DashBoard /> : <Analytics />}
        </div>
      </QuizContext>
    </div>
  );
};

export default Homepage;
