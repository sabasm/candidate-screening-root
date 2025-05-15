class MockResponse {
 status(statusCode) {
   this.statusCode = statusCode;
   return this;
 }
 
 json(data) {
   this.data = data;
   return this;
 }
}

global.Response = MockResponse;

process.env.NEXT_PUBLIC_LLM_API_URL = 'http://localhost:8000';


