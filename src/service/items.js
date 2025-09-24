import axios from "axios";
import { BASE_URL } from "../constants";

export const fetchAllItems = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/items`);
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

export const createItem = async (itemData) => {
  try {
    const response = await axios.post(`${BASE_URL}/items`, itemData);
    return response.data;
  } catch (error) {
    console.error("Error creating item:", error);
    throw error;
  }
};

export const updateItem = async (itemId, updatedData) => {
  try {
    const response = await axios.put(`${BASE_URL}/items/${itemId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating item:", error);
    throw error;
  }
};
