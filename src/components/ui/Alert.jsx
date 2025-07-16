'use client';

import React from 'react';
import { motion } from 'framer-motion';

const AlertBox = ({ message, type = 'info', onClose }) => {
  const getAlertStyles = () => {
    switch (type) {
      case 'success' :
        return 'bg-green-100 border-green-500 text-green-700';
        case 'error' :
            return 'bg-red-100 border-red-500 text-red-700';
            case 'warning' :
                return 'bg-yellow-100 border-yellow-500 text-yellow-700';
                default:
                    return 'bg-blue-100 border-blue-500 text-blue-700';
  };
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[90%] md:w-[400px] border-l-4 rounded-md shadow-md p-4 ${getAlertStyles()}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="text-lg font-bold text-gray-700 hover:text-gray-900"
          >
            &times;
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default AlertBox;
