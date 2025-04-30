import api from '../lib/api';

export async function loginUser(username, password) {
  const response = await api.post('/auth/login', {
    username,
    password,
  });
  return response.data;
}

export async function registerUser({ username, email, firstName, lastName, phone, password }) {
  const response = await api.post('/auth/register', {
    username,
    email,
    firstName,
    lastName,
    phone,
    password,
  });
  return response.data;
}
