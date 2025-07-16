'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Trash2, CalendarDays } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import MainLayout from '../components/mainLayout';
import { getAuth } from 'firebase/auth';

const TodaysSchedulePage = () => {
  const [schedule, setSchedule] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = getAuth();

  const fetchTodaysSchedule = async () => {
    try {
      // First check if we have a current user
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setError('Please sign in to view your schedule');
        setIsLoading(false);
        return;
      }

      // Get the token
      const token = await currentUser.getIdToken();
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch schedule');
      }
      
      const schedules = await response.json();
      
      // Filter for today's schedule
      const today = new Date().toISOString().split('T')[0];
      const todaysSchedule = schedules.find(s => 
        new Date(s.createdAt).toISOString().split('T')[0] === today
      );
      
      setSchedule(todaysSchedule);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      setError('Failed to fetch today\'s schedule');
      toast({
        title: "Error",
        description: "Failed to fetch today's schedule",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSchedule = async (id) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const token = await currentUser.getIdToken();
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete schedule');
      }
      
      setSchedule(null);
      toast({
        title: "Success",
        description: "Schedule deleted successfully",
        variant: "default",
      });
    } catch (error) {
      console.error('Error deleting schedule:', error);
      toast({
        title: "Error",
        description: "Failed to delete schedule",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchTodaysSchedule();
      } else {
        setSchedule(null);
        setIsLoading(false);
        setError('Please sign in to view your schedule');
      }
    });

    return () => unsubscribe();
  }, []);

  const checkNightTime = () => {
    const now = new Date();
    const hours = now.getHours();
    
    if (hours === 23 && schedule) {
      deleteSchedule(schedule._id);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      checkNightTime();
    }, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, [schedule]);

  return (
    <MainLayout>
      <div className="min-h-[100vh] bg-gradient-to-b from-zinc-900 to-zinc-950">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 blur-3xl" />
          <div className="relative">
            {/* Header */}
            <div className="px-4 sm:px-6 lg:px-8 py-6">
              <div className="max-w-4xl mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CalendarDays className="w-8 h-8 text-violet-500" />
                  <h1 className="text-2xl font-bold text-white">Today's Schedule</h1>
                </div>
                <div className="flex items-center space-x-2 text-white/60">
                  <Clock className="w-5 h-5" />
                  <span className="text-sm">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
              <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
                <CardContent className="p-6">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin w-8 h-8 border-2 border-violet-500 rounded-full border-t-transparent" />
                    </div>
                  ) : error ? (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4">
                      <CalendarDays className="w-16 h-16 text-gray-500/50" />
                      <p className="text-gray-500 text-lg">{error}</p>
                      <Button 
                        onClick={() => window.location.href = '/login'}
                        className="bg-violet-500 hover:bg-violet-600 text-white"
                      >
                        Sign In
                      </Button>
                    </div>
                  ) : !schedule ? (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4">
                      <CalendarDays className="w-16 h-16 text-gray-500/50" />
                      <p className="text-gray-500 text-lg">No schedule set for today</p>
                      <Button 
                        onClick={() => window.location.href = '/chatbot'}
                        className="bg-violet-500 hover:bg-violet-600 text-white"
                      >
                        Create Schedule
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-white">{schedule.title}</h2>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteSchedule(schedule._id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-100/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        {schedule.scheduleItems.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                          >
                            <Clock className="w-5 h-5 text-violet-500" />
                            <div className="flex-shrink-0 w-24 font-medium text-violet-300">
                              {item.time}
                            </div>
                            <div className="flex-grow text-white">{item.activity}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TodaysSchedulePage;