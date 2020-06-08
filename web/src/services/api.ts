import axios from 'axios';
import {config} from 'dotenv';

const api = axios.create({
  baseURL: 'http://localhost:3333' //process.env.API_URL
});

export default api;

