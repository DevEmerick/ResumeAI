// Rota migrada para src/pages/api/analyze.ts

// O código abaixo foi removido para evitar conflitos.
// import { NextRequest, NextResponse } from "next/server";
// import { analyzeResume } from "@/services/ai/resumeAnalyzer";
// import { extractTextFromFile } from "@/lib/extractText";
// 
// // Força execução em ambiente Node.js (não Edge)
// export const dynamic = 'force-dynamic';
// export const runtime = 'nodejs';
// 
// export async function POST(req: NextRequest) {
//   try {
//     const formData = await req.formData();
//     const file = formData.get("file");
//     if (!file || typeof file === "string") {
//       return NextResponse.json({ error: "Arquivo não enviado." }, { status: 400 });
//     }
//     // Converte para Buffer (Node.js)
//     const arrayBuffer = await file.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);
//     const mime = file.type;
//     let text = "";
//     try {
//       text = await extractTextFromFile({ buffer, mime });
//     } catch (e: any) {
//       console.error("Erro ao extrair texto:", e);
//       return NextResponse.json({ error: e.message || "Falha ao extrair texto do arquivo." }, { status: 400 });
//     }
//     try {
//       const analysis = await analyzeResume(text);
//       return NextResponse.json({ analysis });
//     } catch (e: any) {
//       console.error("Erro IA:", e);
//       return NextResponse.json({ error: e.message || "Erro ao analisar currículo com IA local." }, { status: 500 });
//     }
//   } catch (e: any) {
//     console.error("Erro inesperado:", e);
//     return NextResponse.json({ error: e.message || "Erro inesperado." }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { analyzeResume } from "@/services/ai/resumeAnalyzer";
import { extractTextFromFile } from "@/lib/extractText";

// Força execução em ambiente Node.js (não Edge)
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Arquivo não enviado." }, { status: 400 });
    }
    // Validação de tipo e tamanho
    const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Tipo de arquivo não permitido. Apenas PDF ou DOCX." }, { status: 400 });
    }
    if (file.size && file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Arquivo excede o limite de 5MB." }, { status: 400 });
    }
    // Converte para Buffer (Node.js)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mime = file.type;
    let text = "";
    try {
      text = await extractTextFromFile({ buffer, mime });
      text = text.replace(/[<>]/g, ""); // Sanitização básica
    } catch (e: any) {
      console.error("Erro ao extrair texto:", e);
      return NextResponse.json({ error: e.message || "Falha ao extrair texto do arquivo." }, { status: 400 });
    }
    try {
      const analysis = await analyzeResume(text);
      // Sanitiza resposta da IA
      if (typeof analysis === "string") {
        return NextResponse.json({ analysis: analysis.replace(/[<>]/g, "") });
      }
      return NextResponse.json({ analysis });
    } catch (e: any) {
      console.error("Erro IA:", e);
      return NextResponse.json({ error: e.message || "Erro ao analisar currículo com IA local." }, { status: 500 });
    }
  } catch (e: any) {
    console.error("Erro inesperado:", e);
    return NextResponse.json({ error: e.message || "Erro inesperado." }, { status: 500 });
  }
}
