'use client';

import { useState } from "react";

interface ScoredCandidate {
id: number;
name: string;
score: number;
highlights: string[];
}

export default function Home() {
const [jobDescription, setJobDescription] = useState("");
const [results, setResults] = useState<ScoredCandidate[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
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

    const data = await response.json();
    setResults(data);
  } catch (err) {
    setError((err as Error).message);
  } finally {
    setLoading(false);
  }
};

return (
  <main className="container mx-auto p-4 max-w-4xl">
    <h1 className="text-3xl font-bold mb-6">Candidate Screening Tool</h1>

    <form onSubmit={handleSubmit} className="mb-8">
      <div className="mb-4">
        <label htmlFor="jobDescription" className="block text-sm font-medium mb-2">
          Job Description (max 200 characters)
        </label>
        <textarea
          id="jobDescription"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          maxLength={200}
          placeholder="Enter job description here..."
          className="w-full p-2 border border-gray-300 rounded min-h-24"
          required
        />
        <div className="text-sm text-gray-500 mt-1">
          {jobDescription.length}/200 characters
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? "Generating Ranking..." : "Generate Ranking"}
      </button>
    </form>

    {loading && (
      <div className="flex justify-center my-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )}

    {error && (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
        Error: {error}
      </div>
    )}

    {results.length > 0 && (
      <div>
        <h2 className="text-2xl font-bold mb-4">Candidate Rankings</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 dark:border-gray-700">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="py-2 px-4 border-b text-left">Rank</th>
                <th className="py-2 px-4 border-b text-left">Name</th>
                <th className="py-2 px-4 border-b text-left">Score</th>
                <th className="py-2 px-4 border-b text-left">Highlights</th>
              </tr>
            </thead>
            <tbody>
              {results.map((candidate, index) => (
                <tr key={candidate.id} className={index % 2 === 0 ? "bg-gray-50 dark:bg-gray-900" : ""}>
                  <td className="py-2 px-4 border-b">{index + 1}</td>
                  <td className="py-2 px-4 border-b">{candidate.name}</td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex items-center">
                      <span className="mr-2">{candidate.score}</span>
                      <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${candidate.score}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <ul className="list-disc pl-5">
                      {candidate.highlights.map((highlight, i) => (
                        <li key={i}>{highlight}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </main>
);
}


