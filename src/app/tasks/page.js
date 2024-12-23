'use client'
import { useState, useEffect } from "react";
import { Plus, Search, Calendar, CheckCircle2, Circle, Trash2, ListTodo, Clock } from "lucide-react";
import { motion } from "framer-motion";
import MainLayout from "../components/mainLayout";

export default function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [showAddTask, setShowAddTask] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskDescription, setNewTaskDescription] = useState("");
    const [newTaskDate, setNewTaskDate] = useState("");
    const [newTaskTime, setNewTaskTime] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
  
    // Get current date info
    const date = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const day = days[date.getDay()];
    const month = months[date.getMonth()];
    const today = date.getDate();
  
    useEffect(() => {
      // Set default date to today
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      setNewTaskDate(formattedDate);
      
      // Set default time to current time rounded to nearest 30 minutes
      const hours = today.getHours();
      const minutes = Math.ceil(today.getMinutes() / 30) * 30;
      const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      setNewTaskTime(formattedTime);
    }, [showAddTask]);
  
    const addTask = () => {
      if (newTaskTitle.trim()) {
        const newTask = {
          id: Date.now(),
          title: newTaskTitle,
          description: newTaskDescription,
          date: newTaskDate,
          time: newTaskTime,
          completed: false,
          createdAt: new Date().toISOString()
        };
        setTasks([...tasks, newTask]);
        setNewTaskTitle("");
        setNewTaskDescription("");
        setNewTaskDate("");
        setNewTaskTime("");
        setShowAddTask(false);
      }
    };
  

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const format12Hour = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };
  
  // Update the formatDateTime function inside the task mapping:
  const formatDateTime = (date, time) => {
    if (!date) return "";
    const taskDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    let dateText = "";
    if (taskDate.toDateString() === today.toDateString()) {
      dateText = "Today";
    } else if (taskDate.toDateString() === tomorrow.toDateString()) {
      dateText = "Tomorrow";
    } else {
      dateText = taskDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
    
    return `${dateText}${time ? ` at ${format12Hour(time)}` : ''}`;
  };

  return (
    <MainLayout>
      <div className="min-h-[90vh] bg-gradient-to-b from-zinc-900 to-zinc-950">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 blur-3xl" />
          <div className="relative px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col space-y-4 mb-8"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                    Tasks
                  </h1>
                  <div className="flex items-center space-x-2 text-white/60">
                    <Calendar className="w-5 h-5" />
                    <span className="text-sm">
                      {day}, {month} {today}
                    </span>
                  </div>
                </div>

                {/* Search and Add Task */}
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="text"
                      placeholder="Search tasks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white placeholder:text-white/40
                               focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddTask(true)}
                    className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl px-4 py-2
                             flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Task</span>
                  </motion.button>
                </div>
              </motion.div>

              {/* Task List */}
              {tasks.length === 0 ? (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center py-12"
  >
    <ListTodo className="w-12 h-12 text-white/20 mx-auto mb-4" />
    <p className="text-white/40">No tasks yet. Add one to get started!</p>
  </motion.div>
) : (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="grid gap-4"
  >
    {filteredTasks.map((task) => {
      // Format date to show Today/Tomorrow
      const formatDateTime = (date, time) => {
        if (!date) return "";
        const taskDate = new Date(date);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        let dateText = "";
        if (taskDate.toDateString() === today.toDateString()) {
          dateText = "Today";
        } else if (taskDate.toDateString() === tomorrow.toDateString()) {
          dateText = "Tomorrow";
        } else {
          dateText = taskDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          });
        }
        
        return `${dateText}${time ? ` at ${time}` : ''}`;
      };

      return (
        <motion.div
          key={task.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="group bg-white/5 rounded-xl p-4 hover:bg-white/[0.07] transition-all duration-200 border border-white/5"
        >
          <div className="flex items-start space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => toggleTask(task.id)}
              className="mt-1 transition-colors"
            >
              {task.completed ? (
                <CheckCircle2 className="w-5 h-5 text-violet-500" />
              ) : (
                <Circle className="w-5 h-5 text-white/40 hover:text-violet-500/50" />
              )}
            </motion.button>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className={`text-lg font-medium ${
                    task.completed ? 'text-white/40 line-through' : 'text-white'
                  }`}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className={`mt-1 text-sm ${
                      task.completed ? 'text-white/20 line-through' : 'text-white/60'
                    }`}>
                      {task.description}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-4 mt-2">
  <div className="flex items-center space-x-2 text-white/60">
    <Calendar className="w-4 h-4 text-violet-500" />
    <span className="text-sm">
      {formatDateTime(task.date, task.time)}
    </span>
  </div>
  {task.time && (
    <div className="flex items-center space-x-2 text-white/60">
      <Clock className="w-4 h-4 text-violet-500" />
      <span className="text-sm">{format12Hour(task.time)}</span>
    </div>
  )}
</div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => deleteTask(task.id)}
              className="opacity-0 group-hover:opacity-100 transition-all duration-200 hover:text-rose-500"
            >
              <Trash2 className="w-5 h-5 text-rose-500 hover:text-rose-400" />
            </motion.button>
          </div>
        </motion.div>
      );
    })}
  </motion.div>
)}

            </div>
          </div>
        </div>

        {/* Add Task Modal */}
        {showAddTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-zinc-900 rounded-xl p-6 w-full max-w-md border border-white/10"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Add New Task</h2>
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Task title..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder:text-white/40
                         focus:outline-none focus:ring-2 focus:ring-violet-500/50 mb-4"
              />
              <textarea
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Task description (optional)..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder:text-white/40
                         focus:outline-none focus:ring-2 focus:ring-violet-500/50 mb-4 resize-none h-24"
              />
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1">Due Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type="date"
                      value={newTaskDate}
                      onChange={(e) => setNewTaskDate(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white
                               focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1">Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type="time"
                      value={newTaskTime}
                      onChange={(e) => setNewTaskTime(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white
                               focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                    />
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={addTask}
                  className="flex-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl py-2
                           hover:opacity-90 transition-opacity"
                >
                  Add Task
                </button>
                <button
                  onClick={() => setShowAddTask(false)}
                  className="flex-1 bg-white/5 text-white rounded-xl py-2 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
}