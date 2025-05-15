import { POST } from '../route';

const mockRequest = (body = {}) => ({
 json: async () => body
});

const mockResponse = () => {
 const res = {
   status: jest.fn().mockReturnThis(),
   json: jest.fn().mockReturnThis()
 };
 return res;
};

global.fetch = jest.fn();

describe('Score API Route', () => {
 beforeEach(() => {
   jest.clearAllMocks();
   jest.spyOn(global, 'Response');
 });

 it('should return 400 when job description is missing', async () => {
   const req = mockRequest({});
   const response = await POST(req as any);
   const data = await response.json();
   
   expect(response.status).toBe(400);
   expect(data.error).toBe('Job description is required');
 });

 it('should return 400 when job description is too long', async () => {
   const longJobDescription = 'a'.repeat(201);
   const req = mockRequest({ jobDescription: longJobDescription });
   
   const response = await POST(req as any);
   const data = await response.json();
   
   expect(response.status).toBe(400);
   expect(data.error).toBe('Job description must be 200 characters or less');
 });

 it('should return 500 when LLM API returns an error', async () => {
   (global.fetch as jest.Mock).mockResolvedValueOnce({
     ok: false,
     status: 500,
     json: async () => ({ detail: 'Internal server error' }),
   });

   const req = mockRequest({ jobDescription: 'Valid job description' });
   
   const response = await POST(req as any);
   const data = await response.json();
   
   expect(response.status).toBe(500);
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
   
   const response = await POST(req as any);
   const data = await response.json();
   
   expect(response.status).toBe(200);
   expect(data).toEqual(mockCandidates);
 });
});


