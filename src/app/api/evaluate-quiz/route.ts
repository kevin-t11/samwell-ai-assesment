import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Question } from "@/app/types/quiz";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { questions, userAnswers } = await req.json();

    if (!questions || !userAnswers) {
      return NextResponse.json(
        { error: "Questions and user answers are required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `Evaluate the following quiz answers and provide feedback. For each question, determine if the answer is correct and provide a brief explanation if it's incorrect.

    Questions and Answers:
    ${questions
      .map(
        (q: Question, i: number) => `
    Question ${i + 1}: ${q.question}
    Correct Answer: ${q.correctAnswer}
    User's Answer: ${userAnswers[q.id]}
    `
      )
      .join("\n")}

    Format the response as a JSON object with the following structure:
    {
      "totalQuestions": number,
      "correctAnswers": number,
      "percentage": number,
      "feedback": "Overall feedback message",
      "questionFeedback": [
        {
          "question": "question text",
          "correct": boolean,
          "feedback": "explanation if incorrect"
        }
      ]
    }

    Return only valid JSON that can be parsed by JavaScript's JSON.parse() with no explanations or additional text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up the response by removing any markdown formatting
    text = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    try {
      const results = JSON.parse(text);
      return NextResponse.json(results);
    } catch {
      console.error("Failed to parse JSON response:", text);
      return NextResponse.json(
        { error: "Failed to parse evaluation results from the API response" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error evaluating quiz:", error);
    return NextResponse.json(
      { error: "Failed to evaluate quiz answers" },
      { status: 500 }
    );
  }
}
