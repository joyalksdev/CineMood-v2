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
    console.log(`Responded: with ${response}`)
    return response.data;
  } catch (err) {
    console.error("Error fetching user profile:", err);
    return null;
  }
};