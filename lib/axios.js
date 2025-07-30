import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000' || 'http://localhost:3001', // ganti ke URL backend kamu
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
