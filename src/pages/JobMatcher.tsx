
import React from 'react';
import DashboardNavbar from '@/components/DashboardNavbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Target, Zap } from 'lucide-react';

const JobMatcher = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50/30">
      <DashboardNavbar />
      
      <main className="container mx-auto py-6 px-6 pt-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-600/25 mb-4">
                <Target className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Job Matcher</h1>
            <p className="text-gray-600 text-lg font-medium">Find jobs that perfectly match your skills and preferences</p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg shadow-gray-900/5 border border-gray-200/60">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/25 mb-3">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">Smart Search</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">AI-powered job search that understands your skills and career goals</p>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm shadow-lg shadow-gray-900/5 border border-gray-200/60">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg shadow-green-600/25 mb-3">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">Perfect Matches</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">Get personalized job recommendations based on your profile</p>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm shadow-lg shadow-gray-900/5 border border-gray-200/60">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg shadow-purple-600/25 mb-3">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">Quick Apply</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">Apply to multiple jobs with just one click using your profile</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-lg shadow-gray-900/5 border border-gray-200/60">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Coming Soon</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-8">
              <p className="text-gray-600 mb-6 text-lg">
                We're working hard to bring you the most advanced job matching experience. 
                Our AI will analyze your skills, experience, and preferences to find the perfect job opportunities for you.
              </p>
              <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-purple-600/25 hover:shadow-xl hover:shadow-purple-600/30">
                Get Notified When Ready
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default JobMatcher;
