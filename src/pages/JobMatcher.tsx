
import React, { useState } from 'react';
import DashboardNavbar from '@/components/DashboardNavbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, Target, Zap, MapPin, DollarSign, Clock, Star } from 'lucide-react';

const JobMatcher = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const popularSkills = [
    'React', 'TypeScript', 'Node.js', 'Python', 'JavaScript', 'SQL',
    'AWS', 'Docker', 'Git', 'MongoDB', 'Express', 'Next.js'
  ];

  const mockJobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      salary: '$120k - $150k',
      type: 'Full-time',
      matchScore: 95,
      skills: ['React', 'TypeScript', 'Node.js']
    },
    {
      id: 2,
      title: 'Full Stack Engineer',
      company: 'StartupXYZ',
      location: 'Remote',
      salary: '$100k - $130k',
      type: 'Full-time',
      matchScore: 88,
      skills: ['JavaScript', 'Python', 'AWS']
    },
    {
      id: 3,
      title: 'React Developer',
      company: 'Digital Agency',
      location: 'New York, NY',
      salary: '$90k - $110k',
      type: 'Contract',
      matchScore: 82,
      skills: ['React', 'JavaScript', 'CSS']
    }
  ];

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50/30">
      <DashboardNavbar />
      
      <main className="container mx-auto py-6 px-6 pt-24">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/25 mb-4">
                <Target className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Job Matcher</h1>
            <p className="text-gray-600 text-lg">Find jobs that perfectly match your skills and preferences</p>
          </div>

          {/* Search and Filter Section */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-lg shadow-gray-900/5 border border-gray-200/60">
            <CardHeader>
              <CardTitle className="text-xl">Search & Filter Jobs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search Bar */}
              <div className="space-y-2">
                <Label htmlFor="search">Job Title or Keywords</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="search"
                    placeholder="e.g. Frontend Developer, React, Remote..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Skills Selection */}
              <div className="space-y-3">
                <Label>Select Your Skills</Label>
                <div className="flex flex-wrap gap-2">
                  {popularSkills.map((skill) => (
                    <Badge
                      key={skill}
                      variant={selectedSkills.includes(skill) ? "default" : "outline"}
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedSkills.includes(skill)
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'hover:bg-blue-50 hover:border-blue-300'
                      }`}
                      onClick={() => toggleSkill(skill)}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Find Matching Jobs
              </Button>
            </CardContent>
          </Card>

          {/* Job Results */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Recommended Jobs</h2>
              <Badge variant="secondary" className="text-sm">
                {mockJobs.length} matches found
              </Badge>
            </div>

            <div className="grid gap-4">
              {mockJobs.map((job) => (
                <Card key={job.id} className="bg-white/90 backdrop-blur-sm shadow-lg shadow-gray-900/5 border border-gray-200/60 hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                          <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-lg text-sm font-medium">
                            <Star className="h-3 w-3 fill-current" />
                            {job.matchScore}% match
                          </div>
                        </div>
                        
                        <p className="text-gray-600 font-medium mb-3">{job.company}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {job.salary}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {job.type}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button size="sm" className="whitespace-nowrap">
                          Apply Now
                        </Button>
                        <Button size="sm" variant="outline" className="whitespace-nowrap">
                          Save Job
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg shadow-gray-900/5 border border-gray-200/60">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/25 mb-3">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">Smart Search</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center text-sm">AI-powered job search that understands your skills and career goals</p>
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
                <p className="text-gray-600 text-center text-sm">Get personalized job recommendations with match scores</p>
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
                <p className="text-gray-600 text-center text-sm">Apply to multiple jobs with just one click using your profile</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobMatcher;
