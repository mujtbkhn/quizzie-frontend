import React from "react";
import "./HomeLeft.css";

const HomeLeft = ({ onCreateQuizClick, onDashboardClick, onAnalyticsClick }) => {
  return (
    <div className="left__main">
      <div>
        <h1>QUIZZIE</h1>
      </div>
      <div className="btn">
        <button onClick={onDashboardClick}>Dashboard</button>
        <button onClick={onAnalyticsClick}>Analytics</button>
        <button onClick={onCreateQuizClick}>Create Quiz</button>
      </div>
      <div>
        <h1>LOGOUT</h1>
      </div>
    </div>
  );
};

export default HomeLeft;
