// src/api/auth.js
import axios from 'axios';

const BASE_URL = 'http://localhost:3000'; 

export async function loginUser(username, password) {
  const response = await axios.post(`${BASE_URL}/api/auth/login`, {
    username,
    password,
  });
  return response.data; 
}

export async function registerUser({ username, email, firstName, lastName, phone, password }) {
  const response = await axios.post(`${BASE_URL}/api/auth/register`, {
    username,
    email,
    firstName,
    lastName,
    phone,
    password,
  });
  return response.data;
}
