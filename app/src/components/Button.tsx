'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
 variant?: 'primary' | 'secondary' | 'outline' | 'danger';
 size?: 'small' | 'medium' | 'large';
 isLoading?: boolean;
 loadingText?: string;
 fullWidth?: boolean;
}

export default function Button({
 children,
 variant = 'primary',
 size = 'medium',
 isLoading = false,
 loadingText,
 fullWidth = false,
 className = '',
 ...props
}: ButtonProps) {
 const baseClasses = "font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 whitespace-nowrap";
 
 const variantClasses = {
   primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-sm dark:bg-blue-700 dark:hover:bg-blue-800",
   secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white focus:ring-gray-500 shadow-sm",
   outline: "bg-white dark:bg-gray-800 border border-gray-300 hover:bg-gray-50 text-gray-700 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-200 focus:ring-gray-500",
   danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-sm dark:bg-red-700 dark:hover:bg-red-800"
 };
 
 const sizeClasses = {
   small: "py-1 px-3 text-xs",
   medium: "py-2 px-4 text-sm",
   large: "py-2.5 px-5 text-base"
 };
 
 const widthClass = fullWidth ? "w-full" : "";
 const disabledClass = props.disabled ? "opacity-60 cursor-not-allowed" : "";
 const loadingClass = isLoading ? "relative !opacity-90" : "";
 
 return (
   <button
     className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${disabledClass} ${loadingClass} ${className}`}
     {...props}
   >
     {isLoading && (
       <>
         <span className="absolute inset-0 flex items-center justify-center">
           <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
           </svg>
         </span>
         <span className="opacity-0">{loadingText || children}</span>
       </>
     )}
     {!isLoading && children}
   </button>
 );
}


