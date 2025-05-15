export async function fetchCandidateScores(jobDescription: string) {
 try {
   const response = await fetch('/api/score', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({ jobDescription }),
   });

   if (!response.ok) {
     const errorData = await response.json();
     throw new Error(errorData.error || 'Failed to score candidates');
   }

   return await response.json();
 } catch (error) {
   if (error instanceof Error) {
     throw error;
   }
   throw new Error('An unknown error occurred');
 }
}


