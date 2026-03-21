import api from './axios'; // Assuming your interceptors are here

// /**
//  * Calls CineMood AI to get movie recommendations based on a vibe/mood.
//  * @param {string} moodQuery - The user's input (e.g., "Jackie Chan" or "Oscar winners")
//  * @param {string} modelName - The Gemini model to use (default: gemini-2.5-flash)
//  */

export const getAiRecommendations = async (moodQuery, modelName = "gemini-2.5-flash") => {
  try {
    const response = await api.post('/ai/process', { 
      task: "semantic_search", 
      data: moodQuery,
      model: modelName 
    });
    return response.data; 
  } catch (error) {
    console.error("AI Service Error:", error);
    throw error;
  }
};