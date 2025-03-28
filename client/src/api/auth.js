import axios from 'axios';

export async function loginUser(username) {
  const response = await axios.post('http://localhost:3000/api/auth/login', {
    username: username,
  });
  return response.data;
}
