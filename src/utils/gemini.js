// utils/gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function getScheduleSuggestions(prompt) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const structuredPrompt = `
    Create a daily schedule based on the following input. Return ONLY a JSON array of schedule items.
    Each item should have exactly these fields:
    - time (string in HH:MM format)
    - activity (string with brief description)
    - duration (string like '30m' or '1h')
    
    Example format:
    [
      {"time": "09:00", "activity": "Team meeting", "duration": "1h"},
      {"time": "10:00", "activity": "Project work", "duration": "2h"}
    ]

    User Input: ${prompt}

    Important: Respond with ONLY the JSON array, no markdown formatting, no explanations, no code blocks.
  `;

  try {
    const result = await model.generateContent(structuredPrompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean up the response
    text = text.trim();
    
    // Remove any markdown code block indicators
    text = text.replace(/```json\s*/g, '');
    text = text.replace(/```\s*/g, '');
    
    // Ensure the text starts and ends with square brackets
    text = text.trim().replace(/^\s*\[/, '[').replace(/\]\s*$/, ']');
    
    // Validate that it's a proper array
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) {
      throw new Error('Response is not an array');
    }

    // Validate each item in the array
    const validatedSchedule = parsed.map(item => {
      if (!item.time || !item.activity || !item.duration) {
        throw new Error('Invalid schedule item format');
      }
      return {
        time: item.time,
        activity: item.activity,
        duration: item.duration
      };
    });

    return validatedSchedule;
  } catch (error) {
    console.error('Gemini API Error:', error);
    if (error.message.includes('JSON')) {
      console.log('Raw response:', response.text());
    }
    throw new Error('Failed to generate schedule');
  }
}

// Optional: Add a function to validate schedule times are in correct order
function validateScheduleTimes(schedule) {
  let prevTime = '00:00';
  return schedule.every(item => {
    const currentTime = item.time;
    if (currentTime < prevTime) {
      return false;
    }
    prevTime = currentTime;
    return true;
  });
}