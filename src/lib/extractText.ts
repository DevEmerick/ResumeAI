
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Tesseract = require("tesseract.js");

type FileInput = { buffer: Buffer; mime: string };


export async function extractTextFromFile({ buffer, mime }: FileInput): Promise<string> {
  if (mime === "application/pdf") {
    const parser = new PDFParse({ data: buffer });
    const textResult = await parser.getText();
    return textResult.text;
  }
  if (
    mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mime === "application/msword"
  ) {
    const { value } = await mammoth.extractRawText({ buffer });
    return value;
  }
  if (
    mime === "image/png" ||
    mime === "image/jpeg" ||
    mime === "image/jpg"
  ) {
    // Tesseract.js espera um path, URL ou base64. Vamos converter o buffer para base64.
    const base64 = buffer.toString("base64");
    const image = `data:${mime};base64,${base64}`;
    const result = await Tesseract.recognize(image, "por");
    return result.data.text;
  }
  throw new Error("Unsupported file type");
}
