import React, { useState } from 'react';
import DashboardNavbar from '@/components/layout/DashboardNavbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Award, Star, Target, Activity, AlarmClockCheck} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import SkillRadarChart from '@/components/dashboard/SkillRadarChart';

const Dashboard = () => {
  const [childName, setChildName] = useState('Emma');
  const [timeframe, setTimeframe] = useState('month');
  
  const progressData = {
    overallProgress: 78,
    completedExercises: 42,
    totalExercises: 55,
    level: 5,
    totalTimeSpent: 58
  };
  
  const progressMetrics = [
    { name: 'Doodle Accuracy', score: 45 },
    { name: 'Consistency', score: 40 },
    { name: 'Drawing speed (sec/doodle)', score: 55 },
    { name: 'Improvement Rate', score: 12}
  ];
  
  const skillProgressData = [
    { name: 'Week 1', accuracy: 45, speed: 40, consistency: 38 },
    { name: 'Week 2', accuracy: 52, speed: 45, consistency: 44 },
    { name: 'Week 3', accuracy: 60, speed: 58, consistency: 52 },
    { name: 'Week 4', accuracy: 75, speed: 68, consistency: 65 }
  ];
  
  const doodleData = [
    { name: 'Easy', correct: 85, incorrect: 72 },
    { name: 'Medium', correct: 92, incorrect: 85 },
    { name: 'Hard', correct: 68, incorrect: 55 }
  ];
  
  const personal = [
    { id: 1, date: '2023-07-10', activity: 'Best Quiz Score', score: 85 },
    { id: 2, date: '2023-07-09', activity: 'Fastest Correct Drawing', score: 9 },
    { id: 3, date: '2023-07-08', activity: 'Highest Streak', score: 15 }
  ];
  
  const speedData = [
    { week: "Week 1", time: 20 },
    { week: "Week 2", time: 19 },
    { week: "Week 3", time: 22 },
    { week: "Week 4", time: 14 },
  ];

  const radarData = [
    { subject: 'Easy', current: 75, previous: 60, fullMark: 100 },
    { subject: 'Medium', current: 68, previous: 55, fullMark: 100 },
    { subject: 'Hard', current: 65, previous: 52, fullMark: 100 }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <DashboardNavbar />
      
      <div className="container mx-auto px-4 py-8 flex-1">
      <div className="container mx-auto px-4 py-8 flex-1 pt-24">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Learning Progress Dashboard</h1>
          
          <div className="flex items-center gap-2">
            {/* <span className="text-sm">Child:</span>
            <select 
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              className="border rounded-md px-2 py-1 text-sm"
            >
              <option value="Emma">Emma</option>
              <option value="Noah">Noah</option>
              <option value="Olivia">Olivia</option>
            </select> */}
            
            {/* <span className="text-sm ml-4">Time period:</span>
            <select 
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="border rounded-md px-2 py-1 text-sm"
            >
              <option value="week">Last week</option>
              <option value="month">Last month</option>
              <option value="quarter">Last 3 months</option>
              <option value="year">Last year</option>
            </select> */}
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="mb-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="drawing">Drawing Skills</TabsTrigger>
            <TabsTrigger value="vocabulary">Vocabulary</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-500" />
                    Overall Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Drawing & Vocabulary Skills</span>
                        <span className="text-sm font-medium">{progressData.overallProgress}%</span>
                      </div>
                      <Progress value={progressData.overallProgress} className="h-2" />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Exercises</span>
                      </div>
                      <span className="text-sm">{progressData.completedExercises}/{progressData.totalExercises}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-amber-500" />
                        <span className="text-sm">Current Level</span>
                      </div>
                      <span className="text-sm">{progressData.level}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <AlarmClockCheck className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Total Time Spent (mins)</span>
                      </div>
                      <span className="text-sm">{progressData.totalTimeSpent}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5 text-amber-500" />
                    Progress Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {progressMetrics.map((area, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">{area.name}</span>
                          <span className="text-sm">{area.score}</span>
                        </div>
                        <Progress value={area.score} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-500" />
                    Personal Best
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {personal.map(activity => (
                      <li key={activity.id} className="text-sm">
                        <div className="flex justify-between">
                          <span>{activity.activity}</span>
                          <span className={activity.score >= 80 ? 'text-green-600' : 
                            activity.score >= 60 ? 'text-amber-600' : 'text-green-600'}>{activity.score}</span>
                        </div>
                        <div className="text-xs text-gray-500">{activity.date}</div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Skill Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={skillProgressData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="accuracy" stroke="#4f46e5" strokeWidth={2} />
                        <Line type="monotone" dataKey="speed" stroke="#059669" strokeWidth={2} />
                        <Line type="monotone" dataKey="consistency" stroke="#ea580c" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Doodle Accuracy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={doodleData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="incorrect" fill="#cbd5e1" />
                        <Bar dataKey="correct" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Average Time Taken</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={speedData}>
                 <CartesianGrid strokeDasharray="3 3" />
                 <XAxis dataKey="week" />
                 <YAxis domain={[0, 30]} />
                 <Tooltip />
                 <Legend />
                 <Line type="monotone" dataKey="time" stroke="#8884d8" strokeWidth={3} />
                 </LineChart>
                </ResponsiveContainer>
                </div>
                </CardContent>
              </Card>
              <SkillRadarChart skillData={radarData} />
            </div>
            
          </TabsContent>
          
          <TabsContent value="drawing">
            <div className="text-center p-8 text-muted-foreground">
              Detailed drawing skills content will be added here.
            </div>
          </TabsContent>
          
          <TabsContent value="vocabulary">
            <div className="text-center p-8 text-muted-foreground">
              Vocabulary learning progress will be added here.
            </div>
          </TabsContent>
        </Tabs>
      </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
