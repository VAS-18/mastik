import axios from "axios";

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

//

export const getDashboard = async () => {
  try {
    const response = await API.get("/user/get-all");
    console.log(response.data);
    return response.data;
  } catch (error : any) {
    console.error("Error fetching dashboard:", error);
  }
};
