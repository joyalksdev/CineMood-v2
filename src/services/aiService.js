import api from './axios';

/**
 * AI LOGIC: Sends a user's mood/vibe to the Gemini engine.
 * Returns a list of movie recommendations.
 */
export const getAiRecommendations = async (moodQuery, modelName = "gemini-2.5-flash") => {
  try {
    // API CALL: Uses 'semantic_search' to tell the backend to process a movie query.
    const response = await api.post('/ai/process', { 
      task: "semantic_search", 
      data: moodQuery,
      model: modelName 
    });

    return response.data; 
  } catch (error) {
    // ERROR LOGIC: Log locally but 'throw' so the UI can show a toast/alert.
    console.error("AI Service Error:", error);
    throw error;
  }
};