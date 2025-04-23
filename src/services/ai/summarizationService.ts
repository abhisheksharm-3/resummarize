"use server";

import { Note } from "@/types/supabase";
import { getGeminiModel, isConfigured } from "./geminiClient";
import { SummarizationOptions } from "@/types/ai";
import { INSIGHT_PROMPTS, SUMMARY_PROMPTS } from "@/lib/constants/prompts";

/**
 * Validates Gemini API configuration
 * @throws {Error} If Gemini API key is not configured
 */
const validateGeminiConfig = () => {
  if (!isConfigured()) {
    throw new Error("Gemini API key not configured");
  }
};

/**
 * Summarizes a single note using Gemini AI
 * @param note - The note to summarize
 * @param options - Options for summarization including the type of summary
 * @returns Object containing the summary and its type
 * @throws {Error} If summarization fails
 */
export async function summarizeNote(note: Note, options: SummarizationOptions) {
  try {
    validateGeminiConfig();
    
    const model = getGeminiModel();
    const prompt = `${SUMMARY_PROMPTS[options.type]}\n\nTitle: ${note.title}\nContent: ${note.content}`;
    
    const result = await model.generateContent(prompt);
    
    return {
      summary: result.response.text(),
      type: options.type
    };
  } catch (error) {
    console.error("Error summarizing note:", error);
    throw error;
  }
}

/**
 * Summarizes multiple notes using Gemini AI
 * @param notes - Array of notes to summarize
 * @param options - Options for summarization including the type of summary
 * @returns Object containing the combined summary and its type
 * @throws {Error} If summarization fails
 */
export async function summarizeMultipleNotes(notes: Note[], options: SummarizationOptions) {
  try {
    validateGeminiConfig();
    
    const model = getGeminiModel();
    const notesContent = notes.map(note => 
      `Title: ${note.title}\nContent: ${note.content}`
    ).join("\n\n---\n\n");
    
    const prompt = `${SUMMARY_PROMPTS[options.type]}\n\nMultiple notes content:\n${notesContent}`;
    
    const result = await model.generateContent(prompt);
    
    return {
      summary: result.response.text(),
      type: options.type
    };
  } catch (error) {
    console.error("Error summarizing multiple notes:", error);
    throw error;
  }
}

/**
 * Generates insights from multiple notes using Gemini AI
 * @param notes - Array of notes to analyze for insights
 * @returns Object containing the generated insights
 * @throws {Error} If insight generation fails
 */
export async function generateInsights(notes: Note[]) {
  try {
    validateGeminiConfig();
    
    const model = getGeminiModel();
    const notesContent = notes.map(note => 
      `Title: ${note.title}\nContent: ${note.content}`
    ).join("\n\n---\n\n");
    
    const prompt = `${INSIGHT_PROMPTS.default}\n\nNotes content:\n${notesContent}`;
    
    const result = await model.generateContent(prompt);
    
    return {
      insights: result.response.text()
    };
  } catch (error) {
    console.error("Error generating insights:", error);
    throw error;
  }
}