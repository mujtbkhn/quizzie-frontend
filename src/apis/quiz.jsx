import axios from "axios";
import { getUserIdFromToken } from "./analytics";

const token = localStorage.getItem("token");

const BACKEND_URL = "http://localhost:3000/api/v1/quiz";

export const createQuiz = async (title, quizzes) => {
  try { 
    const response = await axios.post(
      `${BACKEND_URL}/create`,
      { title, quizzes },
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw error;
  }
};

export const getQuizByUserId = async () => {
  try {
    const userId = getUserIdFromToken();
    // console.log(userId)
    if (!userId) {
      throw new Error("User ID not found in token.");
    }
    const response = await axios.get(`${BACKEND_URL}/getByUserId/${userId}`, {
      headers: {
        Authorization: `${token}`,
      },
      params: {
        userId: userId,
      },
    });
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw error;
  }
};

export const getAllQuizzes = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/get`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw error;
  }
};

export const getQuizById = async (quizId) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/get/${quizId}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw error;
  }
};

export const editQuiz = async (quizId, title, quizzes) => {
  try {
    const response = await axios.put(
      `${BACKEND_URL}/update/${quizId}`,
      { title, quizzes },
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw error;
  }
};

export const deleteQuiz = async (quizId) => {
  try {
    const response = await axios.delete(`${BACKEND_URL}/delete/${quizId}`, {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
};
