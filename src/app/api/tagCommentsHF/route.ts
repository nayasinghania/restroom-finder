import axios from "axios";
import { NextResponse } from "next/server";

interface HuggingFaceResponse {
  labels: string[];
  scores: number[];
}

interface LabelScore {
  label: string;
  score: number;
}

// Comprehensive lists of Pros and Cons (reduced to 30 each)
const prosLabels = [
  "clean",
  "neat",
  "well-maintained",
  "fresh smell",
  "no odor",
  "spotless",
  "hygienic",
  "well-sanitized",
  "sparkling",
  "well-lit",
  "bright",
  "good lighting",
  "properly lit",
  "sufficient lighting",
  "natural light",
  "accessible",
  "wheelchair accessible",
  "disability-friendly",
  "easy access",
  "spacious",
  "user-friendly",
  "fully stocked",
  "enough toilet paper",
  "soap available",
  "paper towels available",
  "sanitizer available",
  "fully stocked dispensers",
  "sufficient toilet paper",
  "fresh towels",
  "regularly maintained",
];

const consLabels = [
  "dirty",
  "trash on the floor",
  "unclean",
  "stinky",
  "bad odor",
  "messy",
  "unhygienic",
  "soiled floor",
  "spills",
  "overflowing trash bins",
  "poorly lit",
  "dark",
  "too dim",
  "bad lighting",
  "no light in some areas",
  "flickering lights",
  "inadequate lighting",
  "not wheelchair accessible",
  "hard to reach",
  "narrow aisles",
  "difficult for the disabled",
  "no ramps",
  "not user-friendly",
  "no soap",
  "out of toilet paper",
  "empty dispensers",
  "no hand towels",
  "no sanitizer",
  "out of pads",
  "no sanitary products",
];

// Function to split array into chunks
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// Function to make a single classification request
async function classifyBatch(
  text: string,
  labels: string[],
  apiKey: string,
): Promise<HuggingFaceResponse> {
  const response = await axios.post<HuggingFaceResponse>(
    "https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
    {
      inputs: text,
      parameters: {
        candidate_labels: labels,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    },
  );
  return response.data;
}

export async function POST(req: Request) {
  try {
    const { comments } = await req.json();
    const apiKey = process.env.HUGGINGFACE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "HuggingFace API key not configured" },
        { status: 500 },
      );
    }

    if (!Array.isArray(comments) || comments.length === 0) {
      return NextResponse.json(
        { error: "Comments must be a non-empty array" },
        { status: 400 },
      );
    }

    // Combine all comments into a single text
    const combinedText = comments.join(". ");

    // Split labels into batches of 10
    const prosBatches = chunkArray(prosLabels, 10);
    const consBatches = chunkArray(consLabels, 10);

    // Process pros batches
    const prosResults = await Promise.all(
      prosBatches.map((batch) => classifyBatch(combinedText, batch, apiKey)),
    );

    // Process cons batches
    const consResults = await Promise.all(
      consBatches.map((batch) => classifyBatch(combinedText, batch, apiKey)),
    );

    // Combine and process results with scores
    const prosWithScores: LabelScore[] = [];
    const consWithScores: LabelScore[] = [];

    // Process pros results
    prosResults.forEach((result) => {
      result.labels.forEach((label, index) => {
        if (prosLabels.includes(label)) {
          prosWithScores.push({
            label,
            score: result.scores[index],
          });
        }
      });
    });

    // Process cons results
    consResults.forEach((result) => {
      result.labels.forEach((label, index) => {
        if (consLabels.includes(label)) {
          consWithScores.push({
            label,
            score: result.scores[index],
          });
        }
      });
    });

    // Sort by score and get top 5, but only include scores >= 0.4
    const topPros = prosWithScores
      .filter((item: LabelScore) => item.score >= 0.4)
      .sort((a: LabelScore, b: LabelScore) => b.score - a.score)
      .slice(0, 5);

    const topCons = consWithScores
      .filter((item: LabelScore) => item.score >= 0.4)
      .sort((a: LabelScore, b: LabelScore) => b.score - a.score)
      .slice(0, 5);

    // Send the categorized result back to the client
    return NextResponse.json({
      pros: topPros,
      cons: topCons,
    });
  } catch (error) {
    console.error("Error calling HuggingFace API:", error);
    return NextResponse.json(
      { error: "Failed to process the request" },
      { status: 500 },
    );
  }
}
