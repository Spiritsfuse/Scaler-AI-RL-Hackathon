import { axiosInstance } from "./axios";

export async function getStreamToken() {
  const response = await axiosInstance.get("/chat/token");
  return response.data;
}

// List API functions
export const listAPI = {
  // Create a new list
  createList: async (data) => {
    const response = await axiosInstance.post("/lists", data);
    return response.data;
  },

  // Get all lists for user
  getLists: async (filter = 'all', channelId = null) => {
    const params = { filter };
    if (channelId) params.channelId = channelId;
    const response = await axiosInstance.get("/lists", { params });
    return response.data;
  },

  // Get a single list
  getList: async (listId) => {
    const response = await axiosInstance.get(`/lists/${listId}`);
    return response.data;
  },

  // Update list
  updateList: async (listId, data) => {
    const response = await axiosInstance.put(`/lists/${listId}`, data);
    return response.data;
  },

  // Delete list
  deleteList: async (listId) => {
    const response = await axiosInstance.delete(`/lists/${listId}`);
    return response.data;
  },

  // Add item to list
  addItem: async (listId, data) => {
    const response = await axiosInstance.post(`/lists/${listId}/items`, data);
    return response.data;
  },

  // Update list item
  updateItem: async (listId, itemId, data) => {
    const response = await axiosInstance.put(`/lists/${listId}/items/${itemId}`, data);
    return response.data;
  },

  // Delete list item
  deleteItem: async (listId, itemId) => {
    const response = await axiosInstance.delete(`/lists/${listId}/items/${itemId}`);
    return response.data;
  },

  // Share list
  shareList: async (listId, userIds) => {
    const response = await axiosInstance.post(`/lists/${listId}/share`, { userIds });
    return response.data;
  }
};
