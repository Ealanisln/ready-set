import React from "react";
import JobApplicationForm from "@/components/Apply/ApplyForm";

interface TalentPoolFormProps {
  onFormSubmitted?: () => void;
}

const TalentPoolForm: React.FC<TalentPoolFormProps> = ({ onFormSubmitted }) => {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">Join Our Talent Pool</h2>
        <p className="text-gray-600">
          We're always on the lookout for great talent. Let us know how you can contribute to our team by
          submitting your application below.
        </p>
      </div>
      
      <JobApplicationForm />
    </div>
  );
};

export default TalentPoolForm; 