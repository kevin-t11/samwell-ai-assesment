import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as cheerio from "cheerio";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || url.trim() === "") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Fetch the URL content
    const fetchResponse = await fetch(url);

    if (!fetchResponse.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${fetchResponse.statusText}` },
        { status: fetchResponse.status }
      );
    }

    const html = await fetchResponse.text();

    // Extract the main content using cheerio
    const $ = cheerio.load(html);

    // Remove script and style tags
    $("script, style, iframe, nav, footer, header, aside").remove();

    // Extract the text from the body
    const bodyText = $("body").text().replace(/\s+/g, " ").trim();

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `Clean and structure the following web content, removing any irrelevant information and formatting it in a clear, readable way. Focus on the main content and remove any navigation, headers, footers, or other UI elements.

    Content: ${bodyText}`;

    const result = await model.generateContent(prompt);
    const geminiResponse = await result.response;
    const cleanedContent = geminiResponse.text().trim();

    return NextResponse.json({ content: cleanedContent });
  } catch (error) {
    console.error("Error fetching URL content:", error);
    return NextResponse.json(
      {
        error:
          "Failed to fetch URL content: " +
          (error instanceof Error ? error.message : "Unknown error"),
      },
      { status: 500 }
    );
  }
}
