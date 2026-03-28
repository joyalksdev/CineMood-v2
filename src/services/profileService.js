import api from "./axios";

// Updates the user profile in MongoDB
export const saveUserProfile = async (profileData) => {
  const response = await api.put("/profile/update", profileData);
  return response.data;
};

// Fetches the user profile from MongoDB
export const getUserProfile = async () => {
  try {
    const response = await api.get("/profile/me");
    return response.data;
  } catch (err) {
    console.error("Error fetching user profile:", err);
    return null;
  }
};

// Permanently deletes the account from MongoDB
export const deleteUserAccount = async (password) => {
  // We use the 'data' property in Axios delete requests to send a body
  const response = await api.delete("/profile/delete", { data: { password } });
  return response.data;
};