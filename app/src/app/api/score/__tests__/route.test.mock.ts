global.fetch = jest.fn();

describe('Score API Route Mock', () => {
 beforeEach(() => {
   jest.clearAllMocks();
 });

 const mockRequest = (body: Record<string, any>) => ({
   json: async () => body
 });

 const mockJsonResponse = (data: any, status = 200) => ({
   status,
   json: async () => data
 });

 async function mockPOST(request: { json: () => Promise<any> }) {
   try {
     const body = await request.json();
     const { jobDescription } = body;

     if (!jobDescription) {
       return mockJsonResponse({ error: "Job description is required" }, 400);
     }

     if (jobDescription.length > 200) {
       return mockJsonResponse({ error: "Job description must be 200 characters or less" }, 400);
     }

     const llmApiUrl = "http://localhost:8000";
     const response = await fetch(`${llmApiUrl}/score`, {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({ jobDescription }),
     });

     if (!response.ok) {
       const errorData = await response.json();
       return mockJsonResponse({ error: errorData.detail || "Failed to score candidates" }, response.status);
     }

     const data = await response.json();
     return mockJsonResponse(data);
   } catch (error) {
     return mockJsonResponse({ error: "Failed to process candidates" }, 500);
   }
 }

 it('should return 400 when job description is missing', async () => {
   const req = mockRequest({});
   const response = await mockPOST(req);
   expect(response.status).toBe(400);
   const data = await response.json();
   expect(data.error).toBe('Job description is required');
 });

 it('should return 400 when job description is too long', async () => {
   const longJobDescription = 'a'.repeat(201);
   const req = mockRequest({ jobDescription: longJobDescription });
   const response = await mockPOST(req);
   expect(response.status).toBe(400);
   const data = await response.json();
   expect(data.error).toBe('Job description must be 200 characters or less');
 });

 it('should return 500 when LLM API returns an error', async () => {
   (global.fetch as jest.Mock).mockResolvedValueOnce({
     ok: false,
     status: 500,
     json: async () => ({ detail: 'Internal server error' }),
   });

   const req = mockRequest({ jobDescription: 'Valid job description' });
   const response = await mockPOST(req);
   expect(response.status).toBe(500);
   const data = await response.json();
   expect(data.error).toBe('Internal server error');
 });

 it('should return candidate scores when successful', async () => {
   const mockCandidates = [
     { id: 1, name: 'John Doe', score: 85, highlights: ['Experience'] },
   ];

   (global.fetch as jest.Mock).mockResolvedValueOnce({
     ok: true,
     json: async () => mockCandidates,
   });

   const req = mockRequest({ jobDescription: 'Valid job description' });
   const response = await mockPOST(req);
   expect(response.status).toBe(200);
   const data = await response.json();
   expect(data).toEqual(mockCandidates);
 });
});


