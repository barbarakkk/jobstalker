
import React from 'react';
import { Button } from '@/components/ui/button';
import DashboardNavbar from '@/components/DashboardNavbar';
import { Plus, Search, Menu, FileText } from 'lucide-react';

const ResumeBuilder: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50/30">
      <DashboardNavbar />
      
      <main className="container mx-auto py-6 px-6 pt-24">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900">AI Resume Builder</h1>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search Resumes"
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
              />
            </div>
            <Button variant="ghost" size="icon" className="text-gray-600">
              <Menu className="h-5 w-5" />
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-6 py-2 rounded-xl shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 transition-all duration-300 flex items-center gap-2">
              <Plus size={18} />
              Create New Resume
            </Button>
          </div>
        </div>

        {/* Table Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-gray-900/5 overflow-hidden border border-gray-200/60">
          <div className="grid grid-cols-12 py-4 px-6 bg-gray-50/80 backdrop-blur-sm border-b border-gray-200/60 text-sm font-bold text-gray-700">
            <div className="col-span-3">Resume</div>
            <div className="col-span-1">Score</div>
            <div className="col-span-3">Matched Job</div>
            <div className="col-span-1">Match</div>
            <div className="col-span-2">Created</div>
            <div className="col-span-1">Last Edited</div>
            <div className="col-span-1">Actions</div>
          </div>

          {/* Empty State */}
          <div className="p-16 text-center">
            <div className="mb-6">
              <div className="mx-auto w-24 h-24 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/10 mb-6">
                <FileText className="h-12 w-12 text-blue-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">No Resumes</h3>
            <p className="text-gray-600 mb-6 font-medium">Create your first AI-powered resume to get started with your job applications.</p>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 transition-all duration-300 flex items-center gap-2 mx-auto">
              <Plus size={18} />
              Create Your First Resume
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResumeBuilder;
