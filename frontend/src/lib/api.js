import axios from 'axios';

// base URL for local run
const API_BASE = 'http://localhost:8000'; 

/*
Use axios to make HTTP requests to interact with the backend server
*/
export const getRoles = async () => {
  const response = await axios.get(`${API_BASE}/roles`);
  return response.data;
};

export const createRole = async (role) => {
  const response = await axios.post(`${API_BASE}/roles`, role);
  return response.data;
};

export const updateRole = async (id, updatedRole) => {
  const response = await axios.put(`${API_BASE}/roles/${id}`, updatedRole);
  return response.data
}

export const deleteRole = async (id) => {
  const response = await axios.delete(`${API_BASE}/roles/${id}`);
  return response.data
}