// utils/documentProcessor.ts
import { PDFDocument } from "pdf-lib";
import mammoth from "mammoth";

export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.type;
  const arrayBuffer = await file.arrayBuffer();

  // Handle PDF files
  if (fileType === "application/pdf") {
    return extractTextFromPdf(arrayBuffer);
  }
  // Handle Word documents
  else if (
    fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    fileType === "application/msword"
  ) {
    return extractTextFromWord(arrayBuffer);
  }
  // Handle plain text files
  else if (fileType === "text/plain") {
    return extractTextFromTxt(arrayBuffer);
  }
  throw new Error(`Unsupported file type: ${fileType}`);
}

async function extractTextFromPdf(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pageCount = pdfDoc.getPageCount();

    // This is a simplified example - actual PDF text extraction requires more complex libraries
    // In a real implementation, you would use a library like pdf.js or a server-side PDF parser

    return `[PDF content with ${pageCount} pages]`;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error("Failed to extract text from PDF");
  }
}

async function extractTextFromWord(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    console.error("Error extracting text from Word document:", error);
    throw new Error("Failed to extract text from Word document");
  }
}

async function extractTextFromTxt(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    const decoder = new TextDecoder("utf-8");
    return decoder.decode(arrayBuffer);
  } catch (error) {
    console.error("Error extracting text from text file:", error);
    throw new Error("Failed to extract text from text file");
  }
}

export async function extractTextFromUrl(url: string): Promise<string> {
  try {
    const response = await fetch("/api/fetch-url-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch content from URL");
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error("Error extracting text from URL:", error);
    throw new Error("Failed to extract text from URL");
  }
}
