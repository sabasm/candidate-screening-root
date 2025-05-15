import { NextResponse } from "next/server";

export async function POST(request: Request) {
 try {
   const body = await request.json();
   const { jobDescription } = body;

   if (!jobDescription) {
     return NextResponse.json({ error: "Job description is required" }, { status: 400 });
   }

   if (jobDescription.length > 200) {
     return NextResponse.json({ error: "Job description must be 200 characters or less" }, { status: 400 });
   }

   const llmApiUrl = process.env.NEXT_PUBLIC_LLM_API_URL || "http://localhost:8000";
   const response = await fetch(`${llmApiUrl}/score`, {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify({ jobDescription }),
   });

   if (!response.ok) {
     const errorData = await response.json();
     return NextResponse.json({ error: errorData.detail || "Failed to score candidates" }, { status: response.status });
   }

   const data = await response.json();
   return NextResponse.json(data);
 } catch (error) {
   console.error("Error processing request:", error);
   return NextResponse.json({ error: "Failed to process candidates" }, { status: 500 });
 }
}


