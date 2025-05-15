'use client';

import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

const thinkingMessages = [
 "Analyzing candidate resumes...",
 "Comparing skills with job requirements...",
 "Evaluating experience levels...",
 "Identifying the best matches...",
 "Generating candidate highlights...",
 "Compiling candidate rankings..."
];

interface ThinkingStateProps {
 showSpinner?: boolean;
}

export default function ThinkingState({ showSpinner = true }: ThinkingStateProps) {
 const [messageIndex, setMessageIndex] = useState(0);
 
 useEffect(() => {
   const interval = setInterval(() => {
     setMessageIndex((prev) => (prev + 1) % thinkingMessages.length);
   }, 3000);
   
   return () => clearInterval(interval);
 }, []);

 return (
   <div className="flex flex-col items-center justify-center py-8 px-4">
     {showSpinner && <LoadingSpinner message={thinkingMessages[messageIndex]} />}
     {!showSpinner && (
       <p className="text-gray-600 dark:text-gray-300 text-center">
         {thinkingMessages[messageIndex]}
       </p>
     )}
     <p className="text-gray-500 dark:text-gray-400 text-sm mt-6">
       This may take a moment as we process all candidate data...
     </p>
   </div>
 );
}


