import { ReactNode } from "react";

/**
 * Interface for feature information used throughout the application
 */
export interface Feature {
  /** Icon component to visually represent the feature */
  icon: ReactNode;
  
  /** Title of the feature */
  title: string;
  
  /** Description explaining the feature */
  description: string;
}