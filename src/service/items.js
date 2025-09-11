import axios from "axios";
import { BASE_URL } from "../constants";

export const fetchAllItems = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/items`);
    return response.data;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};
