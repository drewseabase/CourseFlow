/**
 * StudyHoursChart Component
 * 
 * Displays a bar chart showing study hours with time period filtering:
 * - Week view: Shows daily hours (Mon-Sun)
 * - Month view: Shows weekly hours (Week 1-4)
 * - Semester view: Shows monthly hours (3 months)
 * 
 * Features:
 * - Filter buttons to switch between time periods
 * - Color-coded bars with gradients
 * - Hover effects on bars
 * - Value labels on top of bars
 * - Day/week/month labels below bars
 * - Pure CSS implementation (no chart library)
 */

'use client';

import { useState } from 'react';
import { StudyHoursData } from '@/lib/mock/analyticsdata';

interface StudyHoursChartProps {
  data: StudyHoursData;
}

export default function StudyHoursChart({ data }: StudyHoursChartProps) {
  // Consistent panel styling
  const panel = 'bg-white/90 backdrop-blur-md border border-zinc-200/70 rounded-3xl shadow-sm';
  
  /**
   * State: Selected time period for filtering
   */
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'semester'>('week');
  
  // Gradient classes for bars (cycle through 7 for week view)
  const gradients = [
    'from-[#667eea] to-[#764ba2]',  // Purple
    'from-[#4facfe] to-[#00f2fe]',  // Cyan
    'from-[#43e97b] to-[#38f9d7]',  // Green
    'from-[#fa709a] to-[#fee140]',  // Orange
    'from-[#f093fb] to-[#f5576c]',  // Pink
    'from-[#667eea] to-[#764ba2]',  // Purple (repeat)
    'from-[#4facfe] to-[#00f2fe]',  // Cyan (repeat)
  ];
  
  /**
   * Get current data based on selected period
   */
  const getCurrentData = () => {
    if (!data) return [];
    
    switch (selectedPeriod) {
      case 'week':
        return data.daily || [];
      case 'month':
        return data.weekly || [];
      case 'semester':
        return data.monthly || [];
      default:
        return data.daily || [];
    }
  };
  
  const currentData = getCurrentData();
  
  // Calculate max value for scaling bar heights (with fallback)
  const maxValue = currentData.length > 0 
    ? Math.max(...currentData.map(item => item.hours || 0))
    : 1;
  
  /**
   * Calculate bar height as percentage of max value
   * Ensures minimum height of 5% for visibility
   */
  const getBarHeight = (hours: number): number => {
    if (hours === 0) return 5; // Minimum height for empty bars
    return Math.max(5, (hours / maxValue) * 100);
  };
  
  return (
    <div className={`${panel} p-7`}>
      {/* Chart Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[20px] font-bold text-[#18181B]">
          Study Hours This {selectedPeriod === 'week' ? 'Week' : selectedPeriod === 'month' ? 'Month' : 'Semester'}
        </h2>
        
        {/* Filter Buttons */}
        <div className="flex gap-2 bg-[#FAFAFA] p-1 rounded-lg">
          <button
            onClick={() => setSelectedPeriod('week')}
            className={`px-3.5 py-1.5 rounded-md text-[12px] font-semibold transition-all duration-200 ${
              selectedPeriod === 'week'
                ? 'bg-white shadow-sm text-[#18181B]'
                : 'bg-transparent text-[#52525B] hover:text-[#18181B]'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`px-3.5 py-1.5 rounded-md text-[12px] font-semibold transition-all duration-200 ${
              selectedPeriod === 'month'
                ? 'bg-white shadow-sm text-[#18181B]'
                : 'bg-transparent text-[#52525B] hover:text-[#18181B]'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setSelectedPeriod('semester')}
            className={`px-3.5 py-1.5 rounded-md text-[12px] font-semibold transition-all duration-200 ${
              selectedPeriod === 'semester'
                ? 'bg-white shadow-sm text-[#18181B]'
                : 'bg-transparent text-[#52525B] hover:text-[#18181B]'
            }`}
          >
            Semester
          </button>
        </div>
      </div>
      
      {/* Bar Chart */}
      <div className="flex items-end gap-3 h-70 py-5">
        {currentData.length === 0 ? (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center text-[#A1A1AA]">
            <p>No data available</p>
          </div>
        ) : (
          /* Render Bars */
          currentData.map((item, index) => {
            const height = getBarHeight(item.hours || 0);
            const gradient = gradients[index % gradients.length];
            
            // Safely extract label based on which property exists
            const label = 'day' in item 
              ? item.day 
              : 'week' in item 
                ? item.week 
                : 'month' in item 
                  ? item.month 
                  : 'N/A';
            
            // Calculate pixel height based on 240px max (280px - 40px padding)
            const maxHeightPx = 240;
            const barHeightPx = (height / 100) * maxHeightPx;
            
            return (
              <div
                key={`${label}-${index}`}
                className="flex-1 relative flex flex-col justify-end"
                style={{ height: '240px' }}
              >
                {/* Value Label (on top) */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[12px] font-bold text-[#18181B] whitespace-nowrap z-10">
                  {item.hours || 0}h
                </div>
                
                {/* Bar - Using pixel height instead of percentage */}
                <div
                  className={`w-full bg-linear-to-br ${gradient} rounded-t-lg transition-all duration-300 hover:opacity-80 hover:-translate-y-1 cursor-pointer`}
                  style={{ height: `${barHeightPx}px` }}
                ></div>
                
                {/* Day/Week/Month Label (below) */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[11px] font-semibold text-[#A1A1AA] text-center whitespace-nowrap">
                  {label}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}