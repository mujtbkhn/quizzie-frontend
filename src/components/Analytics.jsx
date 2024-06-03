import React, { useEffect, useState } from "react";
import { getQuizByUserId } from "../apis/quiz";
import { getPollByUserId } from "../apis/poll";
import TableComponent from "./TableComponent";

const Analytics = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [polls, setPolls] = useState([]);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const quizResponse = await getQuizByUserId();
        const pollResponse = await getPollByUserId();

        // Extracting the data and setting the state
        setQuizzes(quizResponse.quiz || []);
        setPolls(pollResponse.poll || []);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    };

    fetchData();
  }, []);

  // Merging the data for the table component
  const combinedData = [
    ...quizzes.map((quiz) => ({ ...quiz, type: "quiz" })),
    ...polls.map((poll) => ({ ...poll, type: "poll" })),
  ];

  return (
    <div>
      <h1 style={{display: "flex", justifyContent: "center", fontSize: "3.25rem", color: "#5076ff"}}>Quiz Analysis</h1>
      <TableComponent data={combinedData} />
    </div>
  );
};

export default Analytics;
