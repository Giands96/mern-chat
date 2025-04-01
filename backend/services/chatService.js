import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Replace with your actual backend URL

export const fetchChats = async () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`${API_URL}/api/chat`, config);
    return data;
  } catch (error) {
    console.error('Error fetching chats:', error);
    throw error;
  }
};

export const createChat = async (userId) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(`${API_URL}/api/chat`, { userId }, config);
    return data;
  } catch (error) {
    console.error('Error creating chat:', error);
    throw error;
  }
};

export const searchUsers = async (search) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`${API_URL}/api/user?search=${search}`, config);
    return data;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};