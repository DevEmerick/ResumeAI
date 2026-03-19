"use client";
import React, { useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/I18nContext";

interface UploadCardProps {
  onAnalyze: (file: File) => void;
  loading: boolean;
}

const UploadCard: React.FC<UploadCardProps> = ({ onAnalyze, loading }) => {
    const [isDragActive, setIsDragActive] = useState(false);
    const [fileName, setFileName] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [alert, setAlert] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null);
    const { t } = useTranslation();

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        setFileName(e.dataTransfer.files[0].name);
        setFile(e.dataTransfer.files[0]);
        setAlert(t("upload.ready", "Upload pronto"));
      }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragActive(true);
    };

    const handleDragLeave = () => {
      setIsDragActive(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"];
        if (!allowedTypes.includes(file.type)) {
          setAlert(t("upload.invalidType", "Tipo de arquivo não permitido. Apenas PDF ou DOCX."));
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          setAlert(t("upload.tooLarge", "Arquivo excede o limite de 5MB."));
          return;
        }
        setFileName(file.name);
        setFile(file);
        setAlert(t("upload.ready", "Upload pronto"));
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        inputRef.current?.click();
      }
    };

  return (
    <div
      className={`bg-slate-800/50 rounded-2xl shadow-xl border border-slate-700 p-5 sm:p-8 max-w-md w-full mx-auto flex flex-col gap-5 text-center transition ${isDragActive ? 'border-blue-500 bg-slate-800/80' : 'hover:border-slate-600'}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      tabIndex={0}
      aria-label="Área de upload de currículo"
      style={{ cursor: 'pointer' }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={handleFileChange}
        aria-label="Selecionar arquivo para upload"
      />
      <div
        className="flex flex-col items-center gap-2 mb-2 cursor-pointer"
        onClick={() => inputRef.current?.click()}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label="Clique ou pressione Enter para selecionar um arquivo"
      >
        <div className="bg-blue-900/30 rounded-full p-3 mb-2 animate-bounce-smooth">
          <svg width="32" height="32" fill="none" stroke="#60A5FA" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 16v-8m0 0l-4 4m4-4l4 4" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="3" y="3" width="18" height="18" rx="4" stroke="#60A5FA" />
          </svg>
        </div>
        <span className="text-2xl sm:text-3xl font-semibold text-white">{t("upload.title", "Envie seu currículo")}</span>
        <span className="text-sm sm:text-base text-slate-400 px-2">{t("upload.dragDrop", "Arraste e solte ou clique para selecionar um arquivo PDF ou DOCX")}</span>
          <span
            className="text-sm sm:text-base font-medium text-blue-400 bg-blue-900/20 rounded-lg px-4 py-2 mt-4 flex items-center justify-center gap-2 border border-blue-900/30 hover:bg-blue-900/40 transition-colors cursor-pointer w-full"
          >
            <svg width="18" height="18" fill="none" stroke="#60A5FA" strokeWidth="2" viewBox="0 0 24 24" className="inline-block">
              <path d="M12 16v-8m0 0l-4 4m4-4l4 4" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="3" y="3" width="18" height="18" rx="4" stroke="#60A5FA" />
            </svg>
            {t("upload.clickArea", "Clique ou arraste seu currículo aqui")}
          </span>
      </div>
      <div className="flex flex-col gap-2 mt-2 w-full overflow-hidden">
        <span className="text-xs sm:text-sm text-slate-500">{t("upload.formats", "Formatos aceitos: PDF, DOCX (máx. 5MB)")}</span>
        {fileName && <span className="text-sm font-medium text-slate-300 truncate px-2" title={fileName}>{t("upload.selected", "Arquivo selecionado:")} {fileName}</span>}
      </div>
      {alert && (
        <div className={`text-sm font-medium rounded-lg px-3 py-2 mt-2 ${alert.includes('ready') || alert.includes('pronto') ? 'bg-green-900/30 text-green-400 border border-green-900/50' : 'bg-red-900/30 text-red-400 border border-red-900/50'}`}>{alert}</div>
      )}
      <button
        className="bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg px-4 py-2 transition shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => file && onAnalyze(file)}
        disabled={!file || loading}
        aria-label="Enviar para análise"
      >
        {loading ? t("upload.analyzing", "Analisando...") : t("upload.analyzeBtn", "Analisar currículo")}
      </button>
    </div>
  );
};

export default UploadCard;
