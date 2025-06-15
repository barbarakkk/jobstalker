
import React from "react";
import { FileText } from "lucide-react";

interface GeneratedResumeSectionProps {
  generatedResume: string;
}

const GeneratedResumeSection: React.FC<GeneratedResumeSectionProps> = ({
  generatedResume
}) => (
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
);

export default GeneratedResumeSection;
