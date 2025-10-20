import axios from "axios";

const baseUrl = "http://localhost:8000/api"

export const axiosConfig = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  timeout: 15000,
});