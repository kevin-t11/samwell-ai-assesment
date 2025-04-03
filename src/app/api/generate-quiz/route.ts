import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `Generate 5-10 quiz questions based on the following content. Each question should have 4 multiple-choice options.

    IMPORTANT: Return ONLY a JSON array with the following structure, with no markdown formatting, no code blocks, and no additional text:
    [
      {
        "id": "unique-id",
        "question": "question text",
        "type": "multiple-choice",
        "options": ["option1", "option2", "option3", "option4"],
        "correctAnswer": "correct option"
      }
    ]
    
    Content: ${content}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    text = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    try {
      const questions = JSON.parse(text);
      return NextResponse.json({ questions });
    } catch {
      console.error("Failed to parse JSON response:", text);
      return NextResponse.json(
        { error: "Failed to generate valid quiz questions" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error generating quiz:", error);
    return NextResponse.json(
      { error: "Failed to generate quiz questions" },
      { status: 500 }
    );
  }
}
