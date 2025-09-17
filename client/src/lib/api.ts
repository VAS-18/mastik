import axios from "axios";

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getDashboard = async () => {
  try {
    const response = await API.get("/user/get-all");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching dashboard:", error);
  }
};

export const search = async (query: string) => {
  try {
    const response = await API.post("/user/search", { query: query });
    return response.data;
  } catch (error) {
    console.error("Error fetching search results");
  }
};
