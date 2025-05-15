/** @type {import('tailwindcss').Config} */
module.exports = {
 content: [
   "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
   "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
   "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
 ],
 darkMode: 'media',
 theme: {
   extend: {
     colors: {
       background: 'var(--background)',
       foreground: 'var(--foreground)',
     },
     minWidth: {
       '8': '2rem',
       '24': '6rem',
       '28': '7rem',
     },
   },
 },
 plugins: [],
 safelist: [
   'bg-green-500',
   'bg-blue-500',
   'bg-blue-600',
   'bg-blue-700',
   'dark:bg-blue-700',
   'dark:bg-blue-800',
   'bg-yellow-500',
   'bg-red-500',
   'bg-red-600',
   'bg-red-700',
   'dark:bg-red-700',
   'dark:bg-red-800',
   'border-blue-600',
   'border-t-blue-600',
   'dark:border-t-blue-500',
   'focus:ring-red-500',
   'focus:ring-blue-500',
   'focus:ring-gray-500'
 ],
};


