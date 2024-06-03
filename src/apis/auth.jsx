import axios from "axios";

const BACKEND_URL = "http://localhost:3000/api/v1/auth";

export const registerUser = async (name, email, password) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/register`, {
      name,
      email,
      password,
    });
    const { token } = response.data;
    localStorage.setItem("token", token);
    console.log(response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data; // Throw the error response to handle it in the caller
    } else {
      throw error;
    }
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/login`, { email, password });
    const { token } = response.data;
    localStorage.setItem("token", token);
    console.log(response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data; // Throw the error response to handle it in the caller
    } else {
      throw error;
    }
  }
};