'use client';

import { useState } from "react";
import { useLoading } from "../hooks/useLoading";
import { useLocalStorage } from "../hooks/useLocalStorage";
import Button from "../components/Button";
import ThinkingState from "../components/ThinkingState";

interface ScoredCandidate {
 id: number;
 name: string;
 score: number;
 highlights: string[];
}

export default function Home() {
 const [jobDescription, setJobDescription] = useState("");
 const [results, setResults] = useState<ScoredCandidate[]>([]);
 const [error, setError] = useState<string | null>(null);
 const [consideredCandidates, setConsideredCandidates] = useLocalStorage<number[]>("consideredCandidates", []);
 const [rejectedCandidates, setRejectedCandidates] = useLocalStorage<number[]>("rejectedCandidates", []);
 const [filterMode, setFilterMode] = useState<'all' | 'considered' | 'rejected'>('all');
 const { isLoading, withLoading } = useLoading(false);

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
   setError(null);

   try {
     const data = await withLoading(fetchCandidates());
     setResults(data);
   } catch (err) {
     setError((err as Error).message);
   }
 };

 const fetchCandidates = async () => {
   const response = await fetch("/api/score", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify({ jobDescription }),
   });

   if (!response.ok) {
     const errorData = await response.json();
     throw new Error(errorData.error || "Failed to score candidates");
   }

   return await response.json();
 };

 const toggleConsiderCandidate = (id: number) => {
   if (consideredCandidates.includes(id)) {
     setConsideredCandidates(consideredCandidates.filter(cid => cid !== id));
   } else {
     setConsideredCandidates([...consideredCandidates, id]);
     setRejectedCandidates(rejectedCandidates.filter(cid => cid !== id));
   }
 };

 const toggleRejectCandidate = (id: number) => {
   if (rejectedCandidates.includes(id)) {
     setRejectedCandidates(rejectedCandidates.filter(cid => cid !== id));
   } else {
     setRejectedCandidates([...rejectedCandidates, id]);
     setConsideredCandidates(consideredCandidates.filter(cid => cid !== id));
   }
 };

 const filteredResults = results.filter(candidate => {
   if (filterMode === 'considered') return consideredCandidates.includes(candidate.id);
   if (filterMode === 'rejected') return rejectedCandidates.includes(candidate.id);
   if (filterMode === 'all') return !rejectedCandidates.includes(candidate.id);
   return true;
 });

 return (
   <main className="container mx-auto p-6 max-w-5xl">
     <h1 className="text-3xl font-bold mb-8 text-center md:text-left">Candidate Screening Tool</h1>

     <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
       <h2 className="text-xl font-semibold mb-4">Enter Job Description</h2>
       <form onSubmit={handleSubmit}>
         <div className="mb-5">
           <textarea
             id="jobDescription"
             value={jobDescription}
             onChange={(e) => setJobDescription(e.target.value)}
             maxLength={200}
             placeholder="Enter job description here... (max 200 characters)"
             className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                       dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       transition-all duration-200 min-h-28 text-base"
             required
             disabled={isLoading}
           />
           <div className="text-sm mt-2 flex justify-between items-center">
             <span className={`${jobDescription.length > 150 ? 'text-amber-500 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400'}`}>
               {jobDescription.length}/200 characters
             </span>
             {jobDescription.length > 180 && (
               <span className="text-red-500 dark:text-red-400 font-medium animate-pulse">
                 Almost at limit!
               </span>
             )}
           </div>
         </div>

         <div className="flex justify-end">
           <Button
             type="submit"
             variant="primary"
             size="large"
             disabled={isLoading || jobDescription.trim().length === 0}
             isLoading={isLoading}
             loadingText="Generating Ranking..."
             className="px-6 font-medium tracking-wide"
           >
             Generate Ranking
           </Button>
         </div>
       </form>
     </div>

     {isLoading && (
       <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
         <ThinkingState />
       </div>
     )}

     {error && (
       <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 px-6 py-4 rounded-lg mb-8 shadow-sm">
         <p className="font-semibold text-lg mb-1">Error</p> 
         <p>{error}</p>
       </div>
     )}

     {results.length > 0 && (
       <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
         <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           <h2 className="text-2xl font-bold">Candidate Rankings</h2>
           <div className="flex gap-2 flex-wrap">
             <Button 
               variant={filterMode === 'all' ? 'primary' : 'outline'} 
               size="small" 
               onClick={() => setFilterMode('all')}
               className="min-w-24"
             >
               All
             </Button>
             <Button 
               variant={filterMode === 'considered' ? 'primary' : 'outline'} 
               size="small" 
               onClick={() => setFilterMode('considered')}
               className="min-w-24"
             >
               Considered ({consideredCandidates.length})
             </Button>
             <Button 
               variant={filterMode === 'rejected' ? 'primary' : 'outline'} 
               size="small" 
               onClick={() => setFilterMode('rejected')}
               className="min-w-24"
             >
               Rejected ({rejectedCandidates.length})
             </Button>
           </div>
         </div>
         
         <div className="overflow-x-auto">
           <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
             <thead>
               <tr className="bg-gray-50 dark:bg-gray-750">
                 <th className="py-3.5 px-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-16 md:w-20">
                   Rank
                 </th>
                 <th className="py-3.5 px-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                   Name
                 </th>
                 <th className="py-3.5 px-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-32 md:w-40">
                   Score
                 </th>
                 <th className="py-3.5 px-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                   Highlights
                 </th>
                 <th className="py-3.5 px-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-36 md:w-64">
                   Actions
                 </th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
               {filteredResults.length === 0 ? (
                 <tr>
                   <td colSpan={5} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                     No candidates match the current filter.
                   </td>
                 </tr>
               ) : (
                 filteredResults.map((candidate, index) => (
                   <tr key={candidate.id} className={`
                     ${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-750'}
                     ${consideredCandidates.includes(candidate.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                     ${rejectedCandidates.includes(candidate.id) ? 'bg-gray-100 dark:bg-gray-800/80' : ''}
                     hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150
                   `}>
                     <td className="py-4 px-4 text-sm font-medium text-gray-900 dark:text-gray-200">
                       {index + 1}
                     </td>
                     <td className="py-4 px-4">
                       <div className="flex items-center">
                         <div>
                           <div className="text-sm font-medium text-gray-900 dark:text-white">
                             {candidate.name}
                           </div>
                           {consideredCandidates.includes(candidate.id) && (
                             <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                               Under consideration
                             </span>
                           )}
                           {rejectedCandidates.includes(candidate.id) && (
                             <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                               Rejected
                             </span>
                           )}
                         </div>
                       </div>
                     </td>
                     <td className="py-4 px-4">
                       <div className="flex items-center gap-2">
                         <span className="text-sm font-medium text-gray-900 dark:text-white min-w-8">
                           {candidate.score}
                         </span>
                         <div className="w-full max-w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                           <div
                             className={`h-2 rounded-full ${
                               candidate.score >= 80 ? 'bg-green-500' : 
                               candidate.score >= 60 ? 'bg-blue-500' : 
                               candidate.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                             }`}
                             style={{ width: `${candidate.score}%` }}
                           ></div>
                         </div>
                       </div>
                     </td>
                     <td className="py-4 px-4">
                       <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                         {candidate.highlights.map((highlight, i) => (
                           <li key={i}>{highlight}</li>
                         ))}
                       </ul>
                     </td>
                     <td className="py-4 px-4">
                       <div className="flex flex-col sm:flex-row gap-2">
                         {!rejectedCandidates.includes(candidate.id) && (
                           <Button 
                             size="small" 
                             variant={consideredCandidates.includes(candidate.id) ? "secondary" : "primary"}
                             onClick={() => toggleConsiderCandidate(candidate.id)}
                             className="min-w-28"
                           >
                             {consideredCandidates.includes(candidate.id) ? "Remove" : "Consider"}
                           </Button>
                         )}
                         {!consideredCandidates.includes(candidate.id) && (
                           <Button 
                             size="small" 
                             variant={rejectedCandidates.includes(candidate.id) ? "secondary" : "danger"}
                             onClick={() => toggleRejectCandidate(candidate.id)}
                             className="min-w-28"
                           >
                             {rejectedCandidates.includes(candidate.id) ? "Undo Reject" : "Reject"}
                           </Button>
                         )}
                       </div>
                     </td>
                   </tr>
                 ))
               )}
             </tbody>
           </table>
         </div>
       </div>
     )}
   </main>
 );
}


