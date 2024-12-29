import React, { forwardRef } from 'react';
import { BarChart, Calendar, CheckSquare } from 'lucide-react';

export const FeatureCard = forwardRef((props, ref) => {
  const { title, description, icon } = props;

  // Map string keys to icon components
  const IconComponent = {
    chart: BarChart,
    calendar: Calendar,
    'check-square': CheckSquare,
  }[icon];

  return (
    <div
      ref={ref}
      className="bg-zinc-900 bg-opacity-20 backdrop-blur-lg rounded-2xl p-8 border border-gray-800 hover:border-gray-700 transition-all duration-300 group"
    >
      <div className="bg-white p-3 rounded-full inline-block mb-4 group-hover:bg-gray-200 transition-all duration-300">
        {IconComponent ? (
          <IconComponent className="w-6 h-6 text-black" />
        ) : (
          <span className="text-red-500">Invalid Icon</span>
        )}
      </div>
      <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-gray-200 transition-all duration-300">
        {title}
      </h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
});

FeatureCard.displayName = 'FeatureCard';
