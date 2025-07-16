// utils/gemini.js
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

export async function getScheduleSuggestions(prompt) {
  const response = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      `Create a daily schedule based on the following input. Return ONLY a JSON array of schedule items.\nEach item should have exactly these fields:\n- time (string in HH:MM format)\n- activity (string with brief description)\n- duration (string like '30m' or '1h')\n\nExample format:\n[\n  {"time": "09:00", "activity": "Team meeting", "duration": "1h"},\n  {"time": "10:00", "activity": "Project work", "duration": "2h"}\n]\n\nUser Input: ${prompt}\n\nImportant: Respond with ONLY the JSON array, no markdown formatting, no explanations, no code blocks.`
    ],
  });

  let text = response.text;

  // Clean up the response
  text = text.trim();
  text = text.replace(/```json\s*/g, '');
  text = text.replace(/```\s*/g, '');
  text = text.trim().replace(/^\s*\[/, '[').replace(/\]\s*$/, ']');

  try {
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) {
      throw new Error('Response is not an array');
    }
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
    throw new Error('Failed to generate schedule');
  }
}

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