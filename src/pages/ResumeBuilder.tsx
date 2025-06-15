
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DashboardNavbar from "@/components/DashboardNavbar";
import { FilePlus, FileText, Upload, Loader2 } from "lucide-react";

const parseTextFromFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      resolve(event.target.result as string);
    };
    reader.onerror = () => {
      reject("Failed to read file");
    };

    if (file.type === "application/pdf" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      // For pdf/docx, placeholder: real extraction should be backend-side
      resolve("[File uploaded: text extraction will happen after upload]");
      // Optionally, you may want to hit an API here in real use
    } else {
      reader.readAsText(file);
    }
  });
};

const ResumeBuilder: React.FC = () => {
  // State for resume (text or file)
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>("");
  // State for job description (text or file)
  const [jobFile, setJobFile] = useState<File | null>(null);
  const [jobText, setJobText] = useState<string>("");

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResume, setGeneratedResume] = useState<string>("");

  // Handlers for dropping or uploading files
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const jobInputRef = useRef<HTMLInputElement>(null);

  const handleResumeFile = async (file: File) => {
    setResumeFile(file);
    const text = await parseTextFromFile(file);
    setResumeText(text);
  };

  const handleJobFile = async (file: File) => {
    setJobFile(file);
    const text = await parseTextFromFile(file);
    setJobText(text);
  };

  const handleResumeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      handleResumeFile(e.target.files[0]);
    }
  };

  const handleJobFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      handleJobFile(e.target.files[0]);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedResume(""); // clear last result

    // Placeholder: In a real app, send (resumeText, jobText) to backend/AI
    setTimeout(() => {
      setGeneratedResume(
        "✨ [Mock] Your new ATS-friendly resume, tailored to this job description, will appear here. (AI integration coming soon!)"
      );
      setIsGenerating(false);
    }, 1800);
  };

  // Are both fields filled?
  const canGenerate = !!resumeText && !!jobText && !isGenerating;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50/30">
      <DashboardNavbar />
      <main className="container mx-auto py-8 px-6 pt-24">
        <div className="max-w-3xl mx-auto bg-white/90 rounded-2xl shadow-lg shadow-gray-900/10 border border-gray-200/60 p-8 flex flex-col gap-10">
          <h1 className="text-3xl font-bold text-blue-900 mb-2 text-center">AI Resume Builder</h1>
          <p className="text-gray-600 mb-6 font-medium text-center">
            Upload your existing resume and your target job description to generate an ATS-optimized resume tailored for your application!
          </p>

          {/* 1. Upload or paste Job Description */}
          <section>
            <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" /> Job Description / Requirements
            </h2>
            <div className="flex flex-col md:flex-row gap-5">
              <div className="flex-1">
                <Textarea
                  value={jobText}
                  onChange={e => setJobText(e.target.value)}
                  placeholder="Paste the job description or requirements here..."
                  rows={6}
                  className="mb-3"
                />
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    or upload file (.pdf, .docx, .txt)
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    type="button"
                    className="flex gap-2 items-center"
                    onClick={() => jobInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4" />
                    Upload
                  </Button>
                  <input
                    type="file"
                    ref={jobInputRef}
                    accept=".pdf,.docx,.txt"
                    className="hidden"
                    onChange={handleJobFileChange}
                  />
                </div>
                {jobFile && (
                  <div className="mt-1 text-xs text-gray-500">
                    Uploaded: <span className="font-medium text-gray-700">{jobFile.name}</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* 2. Upload or paste Resume */}
          <section>
            <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FilePlus className="w-5 h-5 text-blue-600" /> Your Current Resume
            </h2>
            <div className="flex flex-col md:flex-row gap-5">
              <div className="flex-1">
                <Textarea
                  value={resumeText}
                  onChange={e => setResumeText(e.target.value)}
                  placeholder="Paste your current resume here..."
                  rows={6}
                  className="mb-3"
                />
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    or upload file (.pdf, .docx, .txt)
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    type="button"
                    className="flex gap-2 items-center"
                    onClick={() => resumeInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4" />
                    Upload
                  </Button>
                  <input
                    type="file"
                    ref={resumeInputRef}
                    accept=".pdf,.docx,.txt"
                    className="hidden"
                    onChange={handleResumeFileChange}
                  />
                </div>
                {resumeFile && (
                  <div className="mt-1 text-xs text-gray-500">
                    Uploaded: <span className="font-medium text-gray-700">{resumeFile.name}</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Generate Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="w-full max-w-xs flex items-center font-bold text-lg gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" /> Generate Resume
                </>
              )}
            </Button>
          </div>

          {/* Show Output */}
          <section className="mt-2">
            <h2 className="text-lg font-semibold text-gray-700 flex gap-2 items-center mb-3">
              <FileText className="w-5 h-5 text-blue-600" /> Generated Resume
            </h2>
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 min-h-[150px] whitespace-pre-line text-gray-800 font-mono text-sm">
              {generatedResume
                ? generatedResume
                : <span className="text-gray-400 italic">No resume generated yet. Enter your data and click "Generate Resume".</span>
              }
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ResumeBuilder;

