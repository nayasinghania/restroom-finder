import { NextResponse } from "next/server";
import axios from "axios";

const openaiApiKey = process.env.OPENAI_API_KEY;

export async function POST(req: Request) {
  try {
    const { comments } = await req.json(); // Get the list of comments from the request body

    if (!Array.isArray(comments) || comments.length === 0) {
      return NextResponse.json(
        { error: "Comments must be a non-empty array" },
        { status: 400 },
      );
    }

    // Combine all comments into a single text
    const combinedText = comments.join(". ");

    // Determine if we're dealing with a single comment
    const isSingleComment = comments.length === 1;

    // Construct the prompt for ChatGPT to classify pros and cons
    const prompt = `You are a restroom feature analyzer. Your task is to extract permanent/structural pros and cons from restroom comments.

IMPORTANT: Focus ONLY on permanent/structural features like cleanliness, accessibility, size, lighting, ventilation, temperature control, etc. Ignore temporary conditions like "no soap available" or "toilet paper was out" - these should be converted to general maintenance patterns.

For temperature-related comments:
- "uncomfortably cold" or "too hot" should be categorized as "poor temperature control" (a con)
- "comfortable temperature" should be categorized as "good temperature control" (a pro)

When you see similar issues, condense them into general categories:
- Supply issues (soap, paper, towels) → "inadequate supply management"
- Equipment issues (dispensers) → "poor equipment maintenance"
- Cleaning issues (floor, sink) → "poor cleanliness maintenance"

IMPORTANT: Each issue should only appear ONCE in either pros or cons. DO NOT list both the specific issue and its general category. For example, if you see "no soap" and "toilet paper out", list only "inadequate supply management" as a con, not both "inadequate supply management" and "poor equipment maintenance".

Use varied vocabulary and avoid repeating words like "good" or "poor" across multiple items.

${
  isSingleComment
    ? "This is a single comment. Extract both permanent features and maintenance issues, even if there's only one issue mentioned. Always output both pros and cons sections, even if one is empty."
    : "These are multiple comments. Extract both permanent features and maintenance issues, condensing similar issues into general categories."
}

Format your response as:
Pros:
- [permanent feature 1]
- [permanent feature 2]
...

Cons:
- [permanent feature 1]
- [permanent feature 2]
...

Example:
Input: "The restroom was clean and well-maintained, but there was no soap available."
Output:
Pros:
- Clean
- Well-maintained

Cons:
- Insufficient supplies

Input: "The restroom was dirty, the floor was wet, and the sink area was messy."
Output:
Pros:
- None

Cons:
- Poor cleanliness maintenance

Input: "The restroom was clean, but the soap dispenser was broken and the paper towel dispenser wasn't working."
Output:
Pros:
- Clean

Cons:
- Poor equipment maintenance

Input: "The restroom was uncomfortably cold."
Output:
Pros:
- None

Cons:
- Poor temperature control

Input: "The restroom was clean, but there was no soap available and the toilet paper was out."
Output:
Pros:
- Clean

Cons:
- Inadequate supply management

Comments to analyze:
${comments.join("\n")}`;

    // Request to ChatGPT via OpenAI API for classification
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4", // Use GPT-4 model
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that analyzes restroom reviews. Convert temporary conditions into general maintenance patterns and condense similar issues into general categories. Use varied vocabulary - avoid repeating words like 'good' or 'poor' across multiple items. Keep responses concise - use single words or short phrases (2-3 words maximum). Format your response as a bulleted list with each item on a new line starting with a hyphen.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 300,
        temperature: 0.7,
        top_p: 1,
        n: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${openaiApiKey}`,
          "Content-Type": "application/json",
        },
      },
    );

    const responseText = response.data.choices[0].message.content.trim();

    // Parse the response to extract pros and cons
    const prosAndCons = parseProsAndCons(responseText);

    // Send the categorized result back to the client
    return NextResponse.json({
      pros: prosAndCons.pros,
      cons: prosAndCons.cons,
      rawResponse: responseText,
    });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return NextResponse.json(
      { error: "Failed to process the request" },
      { status: 500 },
    );
  }
}

// Function to parse the pros and cons from ChatGPT's response with sections
function parseProsAndConsWithSections(responseText: string) {
  const allFeatures = { pros: [] as string[], cons: [] as string[] };
  const permanentFeatures = { pros: [] as string[], cons: [] as string[] };

  // Split the response into lines and classify each line
  const lines = responseText.split("\n");
  let currentSection = "";
  let isInPros = false;
  let isInCons = false;

  for (let line of lines) {
    line = line.trim();

    // Detect which section we're in
    if (line.startsWith("All Features:")) {
      currentSection = "all";
      isInPros = false;
      isInCons = false;
    } else if (line.startsWith("Permanent Features:")) {
      currentSection = "permanent";
      isInPros = false;
      isInCons = false;
    } else if (line.startsWith("Pros:")) {
      isInPros = true;
      isInCons = false;
    } else if (line.startsWith("Cons:")) {
      isInCons = true;
      isInPros = false;
    } else {
      // Add the line to the respective list, removing bullet points and numbers
      if (line.length > 0) {
        // Remove bullet points, numbers, and leading/trailing spaces
        const cleanLine = line
          .replace(/^[-•*]\s*/, "") // Remove bullet points
          .replace(/^\d+\.\s*/, "") // Remove numbers like "1.", "2.", etc.
          .replace(/^\(\d+\)\s*/, "") // Remove numbers like "(1)", "(2)", etc.
          .trim();

        if (cleanLine.length > 0) {
          if (currentSection === "all") {
            if (isInPros) {
              allFeatures.pros.push(cleanLine);
            } else if (isInCons) {
              allFeatures.cons.push(cleanLine);
            }
          } else if (currentSection === "permanent") {
            if (isInPros) {
              permanentFeatures.pros.push(cleanLine);
            } else if (isInCons) {
              permanentFeatures.cons.push(cleanLine);
            }
          }
        }
      }
    }
  }

  return { allFeatures, permanentFeatures };
}

// Function to parse the pros and cons from ChatGPT's response
function parseProsAndCons(responseText: string) {
  const prosAndCons = { pros: [] as string[], cons: [] as string[] };

  // Split the response into lines and classify each line
  const lines = responseText.split("\n");
  let isInPros = false;
  let isInCons = false;

  for (let line of lines) {
    line = line.trim();

    // Detect which section we're in
    if (line.startsWith("Pros:")) {
      isInPros = true;
      isInCons = false;
    } else if (line.startsWith("Cons:")) {
      isInCons = true;
      isInPros = false;
    } else {
      // Add the line to the respective list, removing bullet points and numbers
      if (line.length > 0) {
        // Remove bullet points, numbers, and leading/trailing spaces
        const cleanLine = line
          .replace(/^[-•*]\s*/, "") // Remove bullet points
          .replace(/^\d+\.\s*/, "") // Remove numbers like "1.", "2.", etc.
          .replace(/^\(\d+\)\s*/, "") // Remove numbers like "(1)", "(2)", etc.
          .trim();

        if (cleanLine.length > 0) {
          // If we haven't seen "Pros:" or "Cons:" yet, assume the first section is pros
          if (!isInPros && !isInCons && prosAndCons.pros.length === 0) {
            isInPros = true;
          }

          if (isInPros) {
            prosAndCons.pros.push(cleanLine);
          } else if (isInCons) {
            prosAndCons.cons.push(cleanLine);
          }
        }
      }
    }
  }

  return prosAndCons;
}
