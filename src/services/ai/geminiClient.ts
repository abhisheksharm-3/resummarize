import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

export const genAI = new GoogleGenerativeAI(API_KEY);

export const getGeminiModel = () => genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export const isConfigured = () => !!API_KEY;