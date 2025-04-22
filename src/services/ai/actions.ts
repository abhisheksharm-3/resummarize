"use server";

import { SummarizationPrompts } from "@/lib/constants/prompts";
import { getGeminiModel, isConfigured } from "./geminiClient";

/**
 * Summarize a single note using Gemini AI
 */
export async function summarizeNote(content: string): Promise<string> {
  try {
    if (!isConfigured()) {
      console.error("Gemini API not configured");
      return "";
    }
    
    if (!content || content.trim().length < 50) {
      return "";
    }
    
    const model = getGeminiModel();
    const prompt = SummarizationPrompts.singleNote(content);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Error summarizing note:", error);
    return "";
  }
}

/**
 * Generate a comprehensive summary from multiple notes
 */
export async function summarizeBulk(content: string): Promise<string> {
  try {
    if (!isConfigured()) {
      console.error("Gemini API not configured");
      return "";
    }
    
    if (!content || content.trim().length < 100) {
      return "";
    }
    
    const model = getGeminiModel();
    const prompt = SummarizationPrompts.multipleNotes(content);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Error generating bulk summary:", error);
    return "";
  }
}