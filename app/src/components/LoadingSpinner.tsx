'use client';

import React from 'react';

interface LoadingSpinnerProps {
 size?: 'small' | 'medium' | 'large';
 color?: string;
 message?: string;
}

export default function LoadingSpinner({ 
 size = 'medium', 
 color = 'blue',
 message
}: LoadingSpinnerProps) {
 const dimensions = {
   small: { height: 'h-8', width: 'w-8', text: 'text-sm' },
   medium: { height: 'h-12', width: 'w-12', text: 'text-base' },
   large: { height: 'h-16', width: 'w-16', text: 'text-lg' },
 };

 const { height, width, text } = dimensions[size];
 
 return (
   <div className="flex flex-col items-center justify-center py-4">
     <div className={`${height} ${width} relative`}>
       <div className={`animate-spin rounded-full ${height} ${width} border-4 border-gray-200 dark:border-gray-700 border-t-${color}-600 dark:border-t-${color}-500`}></div>
     </div>
     {message && (
       <div className={`mt-6 ${text} text-gray-800 dark:text-gray-200 text-center max-w-xs font-medium`}>
         {message}
       </div>
     )}
   </div>
 );
}


