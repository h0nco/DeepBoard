import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

export const getBoards = async () => {
  const res = await api.get('/boards/');
  return res.data;
};

export const createBoard = async (name: string) => {
  const res = await api.post('/boards/', { name });
  return res.data;
};

export const loadBoard = async (id: number) => {
  const res = await api.get(`/boards/${id}`);
  return res.data.data; // { nodes, edges }
};

export const saveBoard = async (id: number, data: any) => {
  const res = await api.put(`/boards/${id}`, { data });
  return res.data;
};

export const deleteBoard = async (id: number) => {
  await api.delete(`/boards/${id}`);
};

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await api.post('/boards/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.url;
};