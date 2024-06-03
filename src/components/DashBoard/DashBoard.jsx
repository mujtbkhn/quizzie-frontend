import React, { useState, useEffect } from "react";
import "./DashBoard.css";
import { getAnalytics } from "../../apis/analytics";

// Utility function to format impressions
const formatImpressions = (impressions) => {
  return impressions >= 1000 ? (impressions / 1000).toFixed(1) + 'k' : impressions;
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: '2-digit' };
  return new Intl.DateTimeFormat('en-GB', options).format(new Date(dateString));
};

const DashBoard = () => {
  const [data, setData] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAnalytics();
        setData(response);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard__main">
      <div className="main">
        <div className="box">
          <div> {data?.totalQuizzes} Quiz</div> <div> Created</div>
        </div>
        <div className="box">
          <div>{data?.totalQuestions} questions</div> <div> Created</div>
        </div>
        <div className="box">
          <div>{formatImpressions(data?.totalImpressions)} Total</div> <div> Impressions</div>
        </div>
      </div>

      <h1>Trending Quizs</h1>
      <div className="trending__main">
        {data?.trendingQuizzes?.map((quiz, i) => (  
          <div className="trending__quizzes" key={i}>
            <h2>{quiz.title}</h2>
            {/* {console.log(quiz)} */}
            <img
              width="24"
              height="24"
              src="https://img.icons8.com/pastel-glyph/64/surprise--v2.png"
              alt="surprise--v2"
              />
              <p>{formatImpressions(quiz.impressions)}</p>
              <div className="date">Created on: {formatDate(quiz.createdAt)}</div>
          </div>
        ))}
        {data?.trendingPolls?.map((poll, i) => (
          <div className="trending__quizzes" key={i}>
            <h2>{poll.title}</h2>
            <img
              width="24"
              height="24"
              src="https://img.icons8.com/pastel-glyph/64/surprise--v2.png"
              alt="surprise--v2"
              />
              <p>{formatImpressions(poll.impressions)}</p>
              <div className="date">Created on: {formatDate(poll.createdAt)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashBoard;
