'use client'
import MainLayout from "../components/mainLayout";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Check, X, Trophy, Zap, Plus, Calendar, TrendingUp, RefreshCw } from "lucide-react";
import { getAuth } from 'firebase/auth';
import { useToast } from "@/hooks/use-toast";

const HabitTracker = () => {
  const { toast } = useToast();``
  const [habits, setHabits] = useState([]);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedView, setSelectedView] = useState('all');
  const auth = getAuth();
  const date = new Date();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const day = days[date.getDay()];
  const today = date.getDate();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[date.getMonth()];


  useEffect(() => {
    // Only fetch habits if user is authenticated
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchHabits(user.uid);
      } else {
        setHabits([]);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchHabits = async (userId) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/habits?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await auth.currentUser.getIdToken()}`
        },
        mode: 'cors',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setHabits(data);
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Failed to connect to the server. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleHabit = async (_id) => {
    try {
      const habit = habits.find(h => h._id === _id);
      if (!habit) return;

      const updatedHabit = {
        ...habit,
        completed: !habit.completed,
        streak: !habit.completed ? Math.min(habit.streak + 1, 21) : Math.max(habit.streak - 1, 0),
      };
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/habits/${_id}`, {
        method: 'PUT',
        headers:{
          'Content-Type':'application/json',
          'Authorization' : `Bearer ${await auth.currentUser.getIdToken()}`
        },
        body: JSON.stringify(updatedHabit),
      });

      if (!response.ok) {
        throw new Error('Failed to update habit');
      }

      setHabits(prevHabits => 
        prevHabits.map(h => h._id === _id ? updatedHabit : h)
      );

      // Add toast notification for habit completion/unmarking
      toast({
        title: updatedHabit.completed ? "Habit Completed" : "Habit Unmarked",
        description: `${updatedHabit.name} - Streak: ${updatedHabit.streak} days`,
      });
    } catch (error) {
      console.error('Error updating habit:', error);
      setError('Failed to update habit. Please try again.');
      
      toast({
        title: "Error",
        description: "Failed to update habit. Please try again.",
      });
    }
  };

  const addNewHabit = async () => {
    if (!auth.currentUser) {
      setError('Please sign in to add habits');
      toast({
        title: "Authentication Required",
        description: "Please sign in to add habits",
      });
      return;
    }

    if (newHabitName.trim()) {
      try {
        const newHabit = {
          name: newHabitName,
          streak: 0,
          completed: false,
          userId: auth.currentUser.uid
        };
  
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/habits`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await auth.currentUser.getIdToken()}`
          },
          body: JSON.stringify(newHabit),
        });
  
        if (!response.ok) {
          throw new Error('Failed to add habit');
        }
  
        const createdHabit = await response.json();
        setHabits(prevHabits => [...prevHabits, createdHabit]);
        setNewHabitName('');
        setShowAddHabit(false);

        toast({
          title: "New Habit Created",
          description: `${newHabitName} has been added to your habits`,
        });
      } catch (error) {
        console.error('Error adding habit:', error);
        setError('Failed to add habit. Please try again.');
        
        toast({
          title: "Error",
          description: "Failed to add habit. Please try again.",
        });
      }
    }
  };
  
  const deleteHabit = async (_id) => {
    try {
      const habitToDelete = habits.find(h => h._id === _id);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/habits/${_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${await auth.currentUser.getIdToken()}`
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete habit');
      }

      setHabits(prevHabits => prevHabits.filter(h => h._id !== _id));
      
      toast({
        variant: "destructive",
        title: "Habit Deleted",
        description: `${habitToDelete.name} has been removed from your habits`,
      });
    } catch (error) {
      console.error('Error deleting habit:', error);
      setError('Failed to delete habit. Please try again.');
      
      toast({
        title: "Error",
        description: "Failed to delete habit. Please try again.",
      });
    }
  }
  const getProgressColor = (streak) => {
    if (streak >= 21) return "bg-gradient-to-r from-violet-500 to-fuchsia-500";
    if (streak >= 14) return "bg-gradient-to-r from-blue-500 to-cyan-500";
    if (streak >= 7) return "bg-gradient-to-r from-emerald-500 to-teal-500";
    return "bg-gradient-to-r from-rose-500 to-pink-500";
  };
  return (
    <MainLayout>
      <div className="min-h-[90vh] bg-gradient-to-b from-zinc-900 to-zinc-950">
        {/* Header Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 blur-3xl" />
          <div className="relative">
            <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
                  >
                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                      Habit Tracker
                    </h1>
                    <div className="flex items-center space-x-2 text-white/60">
                      <Calendar className="w-5 h-5" />
                      <span className="text-sm">
                        {day}, {month} {today}
                      </span>
                    </div>
                  </motion.div>

                  {/* Stats Overview */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 sm:mt-6"
                  >
                    {/* Stats Cards */}
                    <div className="bg-white/5 rounded-2xl p-4 sm:p-6 backdrop-blur-xl border border-white/10">
                      <div className="flex items-center space-x-2 text-white/60 mb-2">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm font-medium">Active Habits</span>
                      </div>
                      <p className="text-xl sm:text-2xl font-bold text-white">{habits.length}</p>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 sm:p-6 backdrop-blur-xl border border-white/10">
                      <div className="flex items-center space-x-2 text-white/60 mb-2">
                        <Trophy className="w-4 h-4" />
                        <span className="text-sm font-medium">Completed Today</span>
                      </div>
                      <p className="text-xl sm:text-2xl font-bold text-white">
                        {habits.filter(h => h.completed).length}
                      </p>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 sm:p-6 backdrop-blur-xl border border-white/10 sm:col-span-2 lg:col-span-1">
                      <div className="flex items-center space-x-2 text-white/60 mb-2">
                        <RefreshCw className="w-4 h-4" />
                        <span className="text-sm font-medium">Longest Streak</span>
                      </div>
                      <p className="text-xl sm:text-2xl font-bold text-white">
                        {Math.max(...habits.map(h => h.streak), 0)} days
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
          {/* Add New Habit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddHabit(true)}
            className="w-full bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 hover:from-violet-500/30 hover:to-fuchsia-500/30 
                       border border-white/10 rounded-2xl p-4 mb-6 sm:mb-8 text-white flex items-center justify-center space-x-2
                       transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Habit</span>
          </motion.button>

          {/* Add Habit Modal */}
          {showAddHabit && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <div className="bg-zinc-900 rounded-2xl p-4 sm:p-6 w-full max-w-md border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-4">Create New Habit</h2>
                <input
                  type="text"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  placeholder="Enter habit name..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40
                           focus:outline-none focus:ring-2 focus:ring-violet-500/50 mb-4"
                />
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={addNewHabit}
                    className="flex-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl py-2
                             hover:opacity-90 transition-opacity"
                  >
                    Create Habit
                  </button>
                  <button
                    onClick={() => setShowAddHabit(false)}
                    className="flex-1 bg-white/5 text-white rounded-xl py-2 hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-200">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          </div>
        ) : habits.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-white/40">No habits yet. Create one to get started!</div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 gap-4"
          >
            {habits.map((habit) => (
              <motion.div
                key={habit._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative bg-gradient-to-r from-white/5 to-white/[0.02] rounded-2xl p-4 sm:p-6 
                         hover:from-white/10 hover:to-white/[0.05] transition-all duration-300"
              >
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 opacity-0 
                                group-hover:opacity-100 transition-opacity rounded-2xl blur-xl" />
                  
                  <div className="relative flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                  <div className="flex items-center space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleHabit(habit._id)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
                               ${habit.completed ? getProgressColor(habit.streak) : 'bg-white/5 hover:bg-white/10'}`}
                    >
                      <Check className={`w-5 h-5 text-white ${habit.completed ? 'opacity-100' : 'opacity-40'}`} />
                    </motion.button>
                      
                      <div>
                        <h3 className="text-lg font-medium text-white">{habit.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <motion.div
                            animate={{
                              scale: [1, 1.2, 1],
                              rotate: [0, 10, -10, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            {habit.streak >= 21 ? (
                              <Trophy className="w-4 h-4 text-yellow-500" />
                            ) : (
                              <Zap className="w-4 h-4 text-violet-500" />
                            )}
                          </motion.div>
                          <span className="text-sm text-white/60">
                            {habit.streak} day streak
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 pl-14 sm:pl-0">
                      {/* Progress Bar */}
                      <div className="w-24 sm:w-32 h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(habit.streak / 21) * 100}%` }}
                          transition={{ duration: 0.5 }}
                          className={`h-full rounded-full ${getProgressColor(habit.streak)}`}
                        />
                      </div>
                      
                      <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteHabit(habit._id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 
                               hover:bg-rose-500/20 hover:text-rose-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default HabitTracker;