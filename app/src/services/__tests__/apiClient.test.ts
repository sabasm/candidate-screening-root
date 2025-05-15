import { fetchCandidateScores } from '../apiClient';
global.fetch = jest.fn();

describe('API Client', () => {
 beforeEach(() => {
   jest.clearAllMocks();
 });

 it('should fetch candidate scores successfully', async () => {
   const mockCandidates = [
     { id: 1, name: 'John Doe', score: 85, highlights: ['Experience'] },
   ];

   (global.fetch as jest.Mock).mockResolvedValueOnce({
     ok: true,
     json: async () => mockCandidates,
   });

   const jobDescription = 'Looking for a developer';
   const result = await fetchCandidateScores(jobDescription);

   expect(global.fetch).toHaveBeenCalledWith('/api/score', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({ jobDescription }),
   });
   expect(result).toEqual(mockCandidates);
 });

 it('should handle API errors gracefully', async () => {
   const errorMessage = 'API error';
   (global.fetch as jest.Mock).mockResolvedValueOnce({
     ok: false,
     json: async () => ({ error: errorMessage }),
   });

   const jobDescription = 'Looking for a developer';
   
   await expect(fetchCandidateScores(jobDescription)).rejects.toThrow(errorMessage);
 });

 it('should handle network errors gracefully', async () => {
   (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

   const jobDescription = 'Looking for a developer';
   
   await expect(fetchCandidateScores(jobDescription)).rejects.toThrow('Network error');
 });
});


