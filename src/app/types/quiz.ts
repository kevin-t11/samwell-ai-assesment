export interface Question {
  id: string;
  question: string;
  type: "multiple-choice" | "checkbox" | "text";
  options?: string[];
  correctAnswer: string | string[];
}

export interface Result {
  percentage: number;
  correctAnswers: number;
  totalQuestions: number;
  feedback?: string;
  questionFeedback?: {
    question: string;
    correct: boolean;
    feedback?: string;
  }[];
  timeCompleted?: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  avgTimePerQuestion?: number;
  longestQuestions?: number[]; // Question numbers that took the longest time
  timePerQuestion?: number; // Time limit per question in seconds
}
