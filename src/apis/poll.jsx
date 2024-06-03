import axios from "axios";
import { getUserIdFromToken } from "./analytics";

const token = localStorage.getItem("token");

const BACKEND_URL = "http://localhost:3000/api/v1/poll";

export const createPoll = async (title, polls) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/create`,
      { title, polls },
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

export const getAllPolls = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/get`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw error;
  }
};

export const getPollByUserId = async () => {
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

export const getPollById = async (pollId) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/get/${pollId}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw error;
  }
};

export const editPoll = async (pollId, title, polls) => {
  try {
    const response = await axios.put(
      `${BACKEND_URL}/update/${pollId}`,
      { title, polls },
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

export const deletePoll = async (pollId) => {
  try {
    const response = await axios.delete(`${BACKEND_URL}/delete/${pollId}`, {
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
