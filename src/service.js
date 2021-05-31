import axios from "axios";

export const baseURL = "";

const service = axios.create({
  baseURL: baseURL + "/api",
});
export default service;
