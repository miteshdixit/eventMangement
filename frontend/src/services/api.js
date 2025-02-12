import axios from "axios";

const API_URL = "http://localhost:5000/api/v1";

export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response;
};

export const createEvent = async (eventData, token) => {
  const response = await axios.post(`${API_URL}/events/create`, eventData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const getEvents = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_URL}/events`, {
      params: filters, // Pass filters as query parameters
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    return { success: false, events: [] };
  }
};

export const getEventById = async (id) => {
  const response = await axios.get(`${API_URL}/events/${id}`);
  return response.data;
};

export const getUserProfile = async (token) => {
  const response = await axios.get(`${API_URL}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateUserProfile = async (token, data) => {
  const response = await axios.put(`${API_URL}/auth/profile`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
