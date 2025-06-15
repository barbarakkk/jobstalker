
import React from "react";
import Navbar from "../components/Navbar";

const JobMatcher = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50/30">
    <Navbar />
    <main className="container mx-auto py-8 px-6 pt-24 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-blue-900 mb-4 text-center">Job Matcher</h1>
      <p className="text-gray-600 text-center max-w-xl">
        Welcome to the Job Matcher! Here you will soon be able to match your resume to jobs and get AI-powered suggestions.
      </p>
    </main>
  </div>
);

export default JobMatcher;
