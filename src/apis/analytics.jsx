import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { v4 as uuidv4 } from "uuid";

const URL = `http://localhost:3000/api/v1/analytics`;

export const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    const decodedToken = jwtDecode(token);
    return decodedToken.userId;
  }
  return null;
};

export const getAnalytics = async () => {
  try {
    const userId = getUserIdFromToken();
    if (!userId) {
      throw new Error("User ID not found in token.");
    }
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authorization token not found.");
    }
    const response = await axios.get(`${URL}/get`, {
      headers: {
        Authorization: `${token}`, // Include Bearer prefix
      },
      params: {
        userId: userId,
      },
    });
    // console.log(response.data)
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw error; // Rethrow the error to handle it in the component
  }
};

export const recordUserResponse = async (quizId, subQuizId, selectedAnswer) => {
  try {
    // Retrieve or generate a session ID
    let sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
      sessionId = uuidv4();
      localStorage.setItem("sessionId", sessionId);
    }

    const response = await axios.post(
      `${URL}/recordResponse`,
      {
        quizId,
        subQuizId,
        selectedAnswer,
        sessionId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response.data.message);
  } catch (error) {
    console.error("Error recording user response:", error);
  }
};
