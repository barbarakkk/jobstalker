
import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface ResumeInputSectionProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  description: string;
}

const ResumeInputSection: React.FC<ResumeInputSectionProps> = ({
  label,
  icon,
  value,
  onChange,
  placeholder,
  description
}) => (
  <section>
    <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
      {icon} {label}
    </h2>
    <div className="flex flex-col md:flex-row gap-5">
      <div className="flex-1">
        <Textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          rows={6}
          className="mb-1"
        />
        <div className="text-xs text-gray-500">
          {description}
        </div>
      </div>
    </div>
  </section>
);

export default ResumeInputSection;
