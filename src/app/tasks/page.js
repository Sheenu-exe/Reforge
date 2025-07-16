'use client'
import MainLayout from "../components/mainLayout";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Check, X, Clock, Plus, Calendar, ListTodo, AlertCircle } from "lucide-react";
import { format } from 'date-fns';
import { auth } from "@/lib/firebase.config";

const TodoManager = () => {
  const [todos, setTodos] = useState([]);
  const [showAddTodo, setShowAddTodo] = useState(false);
  const [newTodoName, setNewTodoName] = useState("");
  const [newTodoDueDate, setNewTodoDueDate] = useState("");
  const [newTodoPriority, setNewTodoPriority] = useState("medium");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const getAuthToken = async () => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    return await user.getIdToken();
  };
  useEffect(() => {
    console.log("Backend URL:", process.env.NEXT_PUBLIC_BACKEND_URL);
  }, []);
  const fetchTodos = async (user) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const token = await user.getIdToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/todos`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        mode: 'cors',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Failed to load todos. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
      if (user) {
        fetchTodos(user);
      } else {
        setTodos([]);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const addNewTodo = async () => {
    if (!isAuthenticated) {
      setError('Please sign in to add todos');
      return;
    }

    if (newTodoName.trim()) {
      try {
        const token = await getAuthToken();
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/todos`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name: newTodoName,
            dueDate: newTodoDueDate || new Date(),
            priority: newTodoPriority,
          }),
        });

        if (!response.ok) throw new Error('Failed to add todo');
        
        const createdTodo = await response.json();
        setTodos(prevTodos => [...prevTodos, createdTodo]);
        setNewTodoName('');
        setNewTodoDueDate('');
        setShowAddTodo(false);
      } catch (error) {
        console.error('Error adding todo:', error);
        setError('Failed to add todo. Please try again.');
      }
    }
  };

  const toggleTodo = async (_id) => {
    if (!isAuthenticated) {
      setError('Please sign in to update todos');
      return;
    }

    try {
      const token = await getAuthToken();
      const todo = todos.find(t => t._id === _id);
      if (!todo) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/todos/${_id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...todo, completed: !todo.completed }),
      });

      if (!response.ok) throw new Error('Failed to update todo');

      const updatedTodo = await response.json();
      setTodos(prevTodos => 
        prevTodos.map(t => t._id === _id ? updatedTodo : t)
      );
    } catch (error) {
      console.error('Error updating todo:', error);
      setError('Failed to update todo. Please try again.');
    }
  };

  const deleteTodo = async (_id) => {
    if (!isAuthenticated) {
      setError('Please sign in to delete todos');
      return;
    }

    try {
      const token = await getAuthToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/todos/${_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) throw new Error('Failed to delete todo');

      setTodos(prevTodos => prevTodos.filter(t => t._id !== _id));
    } catch (error) {
      console.error('Error deleting todo:', error);
      setError('Failed to delete todo. Please try again.');
    }
  };


  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return "text-rose-500";
      case 'medium':
        return "text-amber-500";
      case 'low':
        return "text-emerald-500";
      default:
        return "text-slate-500";
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'active') return !todo.completed;
    return true;
  });

  // useEffect(() => {
  //   fetchTodos();
  // }, []);


  return (
    <MainLayout>
      <div className="min-h-[100vh] bg-gradient-to-b from-zinc-900 to-zinc-950">
        {/* Header Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 blur-3xl" />
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
                      Todo Manager
                    </h1>
                    <div className="flex items-center space-x-2 text-white/60">
                      <Calendar className="w-5 h-5" />
                      <span className="text-sm">
                        {format(new Date(), 'EEE, MMM d')}
                      </span>
                    </div>
                  </motion.div>

                  {/* Stats Overview */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"
                  >
                    <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-xl border border-white/10">
                      <div className="flex items-center space-x-2 text-white/60 mb-2">
                        <ListTodo className="w-4 h-4" />
                        <span className="text-sm font-medium">Total Todos</span>
                      </div>
                      <p className="text-2xl font-bold text-white">{todos.length}</p>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-xl border border-white/10">
                      <div className="flex items-center space-x-2 text-white/60 mb-2">
                        <Check className="w-4 h-4" />
                        <span className="text-sm font-medium">Completed</span>
                      </div>
                      <p className="text-2xl font-bold text-white">
                        {todos.filter(t => t.completed).length}
                      </p>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-xl border border-white/10">
                      <div className="flex items-center space-x-2 text-white/60 mb-2">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">High Priority</span>
                      </div>
                      <p className="text-2xl font-bold text-white">
                        {todos.filter(t => t.priority === 'high' && !t.completed).length}
                      </p>
                    </div>
                  </motion.div>

                  {/* Filter Buttons */}
                  <div className="flex space-x-2 mt-6">
                    <button
                      onClick={() => setFilter('all')}
                      className={`px-4 py-2 rounded-xl ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-white/5 text-white/60'}`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilter('active')}
                      className={`px-4 py-2 rounded-xl ${filter === 'active' ? 'bg-blue-500 text-white' : 'bg-white/5 text-white/60'}`}
                    >
                      Active
                    </button>
                    <button
                      onClick={() => setFilter('completed')}
                      className={`px-4 py-2 rounded-xl ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-white/5 text-white/60'}`}
                    >
                      Completed
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {/* Add New Todo Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddTodo(true)}
            className="w-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 
                       border border-white/10 rounded-2xl p-4 mb-6 text-white flex items-center justify-center space-x-2
                       transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Todo</span>
          </motion.button>

          {/* Add Todo Modal */}
          {showAddTodo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <div className="bg-zinc-900 rounded-2xl p-6 w-full max-w-md border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-4">Create New Todo</h2>
                <input
                  type="text"
                  value={newTodoName}
                  onChange={(e) => setNewTodoName(e.target.value)}
                  placeholder="Todo name..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40
                           focus:outline-none focus:ring-2 focus:ring-blue-500/50 mb-4"
                />
                <input
                  type="date"
                  value={newTodoDueDate}
                  onChange={(e) => setNewTodoDueDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white mb-4
                           focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <select
                  value={newTodoPriority}
                  onChange={(e) => setNewTodoPriority(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white mb-4
                           focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                <div className="flex space-x-3">
                  <button
                    onClick={addNewTodo}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl py-2
                             hover:opacity-90 transition-opacity"
                  >
                    Create Todo
                  </button>
                  <button
                    onClick={() => setShowAddTodo(false)}
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

          {/* Todos List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            </div>
          ) : todos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-white/40">No todos found. Create one to get started!</div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 gap-4"
            >
              {filteredTodos.map((todo) => (
                <motion.div
                  key={todo._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`group relative bg-gradient-to-r from-white/5 to-white/[0.02] rounded-2xl p-6 
                           hover:from-white/10 hover:to-white/[0.05] transition-all duration-300
                           ${todo.completed ? 'opacity-60' : ''}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 
                                group-hover:opacity-100 transition-opacity rounded-2xl blur-xl" />
                  
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleTodo(todo._id)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
                                 ${todo.completed ? 'bg-blue-500' : 'bg-white/5 hover:bg-white/10'}`}
                      >
                        <Check className={`w-5 h-5 ${todo.completed ? 'text-white' : 'text-white/40'}`} />
                      </motion.button>
                      
                      <div>
                        <h3 className={`text-lg font-medium text-white ${todo.completed ? 'line-through' : ''}`}>
                          {todo.name}
                        </h3>
                        <div className="flex items-center space-x-3 mt-1">
                          <div className="flex items-center space-x-1">
                            <Clock className={`w-4 h-4 ${getPriorityColor(todo.priority)}`} />
                            <span className="text-sm text-white/60">
                              {format(new Date(todo.dueDate), 'MMM d')}
                            </span>
                          </div>
                          <span className={`text-sm capitalize ${getPriorityColor(todo.priority)}`}>
                            {todo.priority} priority
                          </span>
                        </div>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteTodo(todo._id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 
                               hover:bg-rose-500/20 hover:text-rose-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
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

export default TodoManager;