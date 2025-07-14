
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import DashboardNavbar from "@/components/DashboardNavbar";
import { FileText, FilePlus, Loader2 } from "lucide-react";
import ResumeInputSection from "@/components/resume/ResumeInputSection";
import GeneratedResumeSection from "@/components/resume/GeneratedResumeSection";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const ResumeBuilder: React.FC = () => {
  const [resumeText, setResumeText] = useState<string>("");
  const [jobText, setJobText] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResume, setGeneratedResume] = useState<string>("");
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!resumeText.trim() || !jobText.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both your resume and the job description.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedResume("");

    try {
      console.log("Calling generateResume edge function...");
      
      const { data, error } = await supabase.functions.invoke('generateResume', {
        body: {
          resume: resumeText,
          jobDescription: jobText,
        },
      });

      if (error) {
        console.error("Edge function error:", error);
        throw error;
      }

      console.log("Edge function response:", data);

      if (data?.generatedResume) {
        setGeneratedResume(data.generatedResume);
        toast({
          title: "Resume Generated Successfully",
          description: "Your ATS-optimized resume has been generated!",
        });
      } else {
        throw new Error("No generated resume received from the API");
      }
    } catch (error: any) {
      console.error("Error generating resume:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const canGenerate = !!resumeText && !!jobText && !isGenerating;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50/30">
      <DashboardNavbar />
      <main className="container mx-auto py-8 px-6 pt-24">
        <div className="max-w-3xl mx-auto bg-white/90 rounded-2xl shadow-lg shadow-gray-900/10 border border-gray-200/60 p-8 flex flex-col gap-10">
          <h1 className="text-3xl font-bold text-blue-900 mb-2 text-center">AI Resume Builder</h1>
          <p className="text-gray-600 mb-6 font-medium text-center">
            Paste your resume and job description below to generate an ATS-optimized resume tailored for your application!
          </p>
          <ResumeInputSection
            label="Job Description / Requirements"
            icon={<FileText className="w-5 h-5 text-blue-600" />}
            value={jobText}
            onChange={setJobText}
            placeholder="Paste the job description or requirements here..."
            description="Only text is supported. Please copy and paste the job description here."
          />
          <ResumeInputSection
            label="Your Current Resume"
            icon={<FilePlus className="w-5 h-5 text-blue-600" />}
            value={resumeText}
            onChange={setResumeText}
            placeholder="Paste your current resume here..."
            description="Only text is supported. Please copy and paste your resume here."
          />
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
          <GeneratedResumeSection generatedResume={generatedResume} />
        </div>
      </main>
    </div>
  );
};

export default ResumeBuilder;
