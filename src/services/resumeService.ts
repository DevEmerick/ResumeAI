export const analyzeResume = async (file: File, locale?: string) => {
  const formData = new FormData();
  formData.append("file", file);
  if (locale) {
    formData.append("locale", locale);
  }

  const res = await fetch("/api/analyze", {
    method: "POST",
    body: formData,
    credentials: "same-origin",
  });

  if (!res.ok) {
    let errorMessage = "Failed to analyze resume.";
    try {
      const errorData = await res.json();
      if (errorData.error) errorMessage = errorData.error;
    } catch {}
    throw new Error(errorMessage);
  }

  const data = await res.json();
  let analysisObj;

  if (typeof data.analysis === "object") {
    analysisObj = data.analysis;
  } else {
    try {
      analysisObj = JSON.parse(data.analysis);
    } catch {
      analysisObj = { result: data.analysis };
    }
  }

  return analysisObj;
};
