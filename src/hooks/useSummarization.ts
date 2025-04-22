"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { summarizeBulk, summarizeNote } from "@/services/ai/actions";

export function useSummarization() {
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Summarize a single note
  const summarizeMutation = useMutation({
    mutationFn: (content: string) => summarizeNote(content),
  });
  
  // Summarize multiple notes
  const bulkSummarizeMutation = useMutation({
    mutationFn: (content: string) => summarizeBulk(content),
  });
  
  // Generate summary for a single note
  const generateSummary = async (content: string) => {
    try {
      setIsGenerating(true);
      const summary = await summarizeMutation.mutateAsync(content);
      return summary;
    } catch (error) {
      console.error("Error generating summary:", error);
      return "";
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Generate summary for multiple notes
  const generateBulkSummary = async (content: string) => {
    try {
      setIsGenerating(true);
      const summary = await bulkSummarizeMutation.mutateAsync(content);
      return summary;
    } catch (error) {
      console.error("Error generating bulk summary:", error);
      return "";
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateSummary,
    generateBulkSummary,
    isGenerating,
  };
}