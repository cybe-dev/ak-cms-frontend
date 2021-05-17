import axios from "axios";

export const baseURL = "https://ak-cms.akbaraditama.com";

const service = axios.create({
  baseURL: baseURL + "/api",
});
export default service;
