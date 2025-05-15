module.exports = {
 app: {
   name: "Candidate Screening Tool",
   port: 3000
 },
 llm: {
   batchSize: 10,
   maxRetries: 3
 },
 cache: {
   ttl: 600 // 10 minutes in seconds
 }
};


