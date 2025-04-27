import { NextResponse } from "next/server";
import { ImageAnnotatorClient } from "@google-cloud/vision";

interface IEntityAnnotation {
  description?: string | null;
  score?: number | null;
}

interface ImageAnalysisResult {
  features: Record<string, boolean>;
  confidence: Record<string, number>;
  rawLabels: Array<{
    description: string | null | undefined;
    confidence: number | null | undefined;
  }>;
}

// Initialize the client with individual environment variables
let vision: ImageAnnotatorClient | null = null;

try {
  // Check if all required credential fields are present
  const requiredFields = [
    "GOOGLE_CLOUD_PROJECT_ID",
    "GOOGLE_CLOUD_PRIVATE_KEY_ID",
    "GOOGLE_CLOUD_PRIVATE_KEY",
    "GOOGLE_CLOUD_CLIENT_EMAIL",
    "GOOGLE_CLOUD_CLIENT_ID",
  ];

  const missingFields = requiredFields.filter((field) => !process.env[field]);

  if (missingFields.length > 0) {
    console.error(
      `Missing required Google Cloud credential fields: ${missingFields.join(", ")}`,
    );
  } else {
    // Construct credentials object from individual environment variables
    const credentials = {
      type: "service_account",
      project_id: process.env.GOOGLE_CLOUD_PROJECT_ID,
      private_key_id: process.env.GOOGLE_CLOUD_PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLOUD_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: process.env.GOOGLE_CLOUD_CLIENT_X509_CERT_URL || "",
    };

    console.log("Initializing Google Cloud Vision client with credentials:", {
      project_id: credentials.project_id,
      client_email: credentials.client_email,
      private_key_length: credentials.private_key?.length || 0,
    });

    vision = new ImageAnnotatorClient({
      credentials,
    });
    console.log("Google Cloud Vision client initialized successfully");
  }
} catch (error) {
  console.error("Error initializing Google Cloud Vision client:", error);
}

// Define restroom-specific features we want to detect
const RESTROOM_FEATURES = {
  "Modern Fixtures": [
    "toilet",
    "sink",
    "faucet",
    "shower",
    "bathtub",
    "fixture",
    "plumbing",
    "bathroom fixture",
    "restroom fixture",
    "modern bathroom",
    "contemporary",
  ],
  "Touchless Technology": [
    "automatic faucet",
    "motion sensor",
    "touchless",
    "sensor",
    "automatic",
    "hands-free",
    "no touch",
    "motion activated",
    "automatic flush",
  ],
  "ADA Compliant": [
    "wheelchair accessible",
    "grab bar",
    "handrail",
    "ada",
    "accessible",
    "disability",
    "handicap",
    "wheelchair",
    "barrier-free",
    "universal design",
  ],
  "Good Lighting": [
    "light fixture",
    "window",
    "natural light",
    "bright",
    "well lit",
    "lighting",
    "illumination",
    "light",
    "brightly lit",
    "good visibility",
    "adequate lighting",
  ],
  "Poor Lighting": [
    "dim",
    "dark",
    "poor lighting",
    "low light",
    "gloomy",
    "shadowy",
    "dimly lit",
    "insufficient lighting",
    "poor visibility",
    "darkness",
    "shadows",
  ],
  Clean: [
    "clean",
    "maintained",
    "spotless",
    "sanitary",
    "hygienic",
    "fresh",
    "tidy",
    "well-maintained",
    "neat",
    "orderly",
    "immaculate",
  ],
  Dirty: [
    "dirty",
    "filthy",
    "unsanitary",
    "stained",
    "grimy",
    "messy",
    "unclean",
    "soiled",
    "contaminated",
    "unhygienic",
    "disheveled",
  ],
  "Hand Dryers": [
    "hand dryer",
    "air dryer",
    "blow dryer",
    "drying",
    "air hand dryer",
    "electric dryer",
    "hot air",
    "drying station",
    "air blower",
  ],
  "Baby Changing Station": [
    "baby changing",
    "diaper changing",
    "infant care",
    "nursing",
    "changing table",
    "baby station",
    "diaper station",
    "infant station",
    "changing area",
    "baby care",
  ],
  "Menstrual Products": [
    "menstrual",
    "tampon",
    "pad",
    "sanitary",
    "feminine",
    "period",
    "dispenser",
    "feminine hygiene",
    "menstrual care",
    "sanitary products",
    "feminine products",
  ],
  Spacious: [
    "spacious",
    "roomy",
    "large",
    "wide",
    "open area",
    "ample space",
    "generous",
    "expansive",
    "open",
    "uncrowded",
    "comfortable space",
  ],
  Stylish: [
    "stylish",
    "design",
    "aesthetic",
    "decorative",
    "modern design",
    "elegant",
    "fashionable",
    "trendy",
    "sophisticated",
    "well-designed",
    "attractive",
  ],
  "Multiple Stalls": [
    "multiple stalls",
    "several stalls",
    "many stalls",
    "multiple toilets",
    "stall",
    "toilet stall",
    "bathroom stall",
    "restroom stall",
    "multiple bathrooms",
  ],
  "Family-Friendly": [
    "family",
    "baby changing",
    "diaper",
    "child",
    "infant",
    "family restroom",
    "family bathroom",
    "children",
    "kid-friendly",
    "family-friendly",
  ],
  "Gender-Neutral": [
    "gender neutral",
    "all gender",
    "unisex",
    "inclusive",
    "gender inclusive",
    "all-gender",
    "gender-free",
    "universal",
    "neutral",
    "non-gendered",
  ],
  "Eco-Friendly": [
    "eco",
    "sustainable",
    "green",
    "water saving",
    "low flow",
    "environmentally friendly",
    "conservation",
    "energy efficient",
    "recycled",
    "biodegradable",
    "eco-conscious",
  ],
};

async function analyzeImage(imageBuffer: Buffer): Promise<ImageAnalysisResult> {
  if (!vision) {
    throw new Error("Google Cloud Vision client is not initialized");
  }

  const base64Image = imageBuffer.toString("base64");
  console.log(`Analyzing image of size: ${imageBuffer.length} bytes`);

  try {
    // Perform image analysis
    console.log("Sending request to Google Cloud Vision API...");
    const [result] = await vision.labelDetection({
      image: {
        content: base64Image,
      },
    });
    console.log("Received response from Google Cloud Vision API");

    const labels = result.labelAnnotations || [];
    console.log(`Detected ${labels.length} labels in the image`);

    if (labels.length > 0) {
      console.log(
        "Top 5 labels:",
        labels.slice(0, 5).map((l) => `${l.description} (${l.score})`),
      );
    } else {
      console.log("No labels detected in the image");
    }

    // Process the results
    const features: Record<string, boolean> = {};
    const confidence: Record<string, number> = {};

    // Initialize all features as false
    Object.keys(RESTROOM_FEATURES).forEach((feature) => {
      features[feature] = false;
      confidence[feature] = 0;
    });

    // Check each label against our feature definitions
    labels.forEach((label: IEntityAnnotation) => {
      const description = label.description?.toLowerCase() || "";
      const labelConfidence = label.score || 0;

      Object.entries(RESTROOM_FEATURES).forEach(([feature, keywords]) => {
        if (keywords.some((keyword) => description.includes(keyword))) {
          features[feature] = true;
          // Keep the highest confidence score for each feature
          confidence[feature] = Math.max(confidence[feature], labelConfidence);
        }
      });
    });

    // Handle mutually exclusive features (Clean and Dirty)
    if (features["Clean"] && features["Dirty"]) {
      // If both are detected, keep the one with higher confidence
      if (confidence["Clean"] >= confidence["Dirty"]) {
        features["Dirty"] = false;
        confidence["Dirty"] = 0;
      } else {
        features["Clean"] = false;
        confidence["Clean"] = 0;
      }
    }

    // Handle mutually exclusive features (Good Lighting and Poor Lighting)
    if (features["Good Lighting"] && features["Poor Lighting"]) {
      // If both are detected, keep the one with higher confidence
      if (confidence["Good Lighting"] >= confidence["Poor Lighting"]) {
        features["Poor Lighting"] = false;
        confidence["Poor Lighting"] = 0;
      } else {
        features["Good Lighting"] = false;
        confidence["Good Lighting"] = 0;
      }
    }

    // Log which features were detected
    const detectedFeatures = Object.entries(features)
      .filter(([_, value]) => value)
      .map(([key]) => key);

    console.log(
      `Detected features: ${detectedFeatures.length > 0 ? detectedFeatures.join(", ") : "None"}`,
    );

    return {
      features,
      confidence,
      rawLabels: labels.map((label: IEntityAnnotation) => ({
        description: label.description,
        confidence: label.score,
      })),
    };
  } catch (error) {
    console.error("Error analyzing image with Google Cloud Vision API:", error);
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    // Check if Google Cloud Vision client is initialized
    if (!vision) {
      return NextResponse.json(
        {
          error:
            "Google Cloud Vision service is not configured. Please set up the required environment variables.",
          details:
            "Missing required Google Cloud credential fields. See documentation for required variables.",
          requiredVariables: [
            "GOOGLE_CLOUD_PROJECT_ID",
            "GOOGLE_CLOUD_PRIVATE_KEY_ID",
            "GOOGLE_CLOUD_PRIVATE_KEY",
            "GOOGLE_CLOUD_CLIENT_EMAIL",
            "GOOGLE_CLOUD_CLIENT_ID",
          ],
        },
        { status: 503 },
      );
    }

    const formData = await req.formData();
    const images = formData.getAll("images") as File[];

    if (!images || images.length === 0) {
      return NextResponse.json(
        { error: "No images provided" },
        { status: 400 },
      );
    }

    console.log(`Processing ${images.length} images`);

    // Process all images in parallel
    const analysisPromises = images.map(async (image, index) => {
      console.log(
        `Processing image ${index + 1}: ${image.name}, size: ${image.size} bytes`,
      );
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      return analyzeImage(buffer);
    });

    const results = await Promise.all(analysisPromises);

    // Combine results if multiple images were provided
    const combinedFeatures: Record<string, boolean> = {};
    const combinedConfidence: Record<string, number> = {};

    // Initialize combined features
    Object.keys(RESTROOM_FEATURES).forEach((feature) => {
      combinedFeatures[feature] = false;
      combinedConfidence[feature] = 0;
    });

    // Combine results from all images
    results.forEach((result) => {
      // Combine features (if any image has a feature, it's considered present)
      Object.entries(result.features).forEach(([feature, value]) => {
        combinedFeatures[feature] = combinedFeatures[feature] || value;
        // Keep the highest confidence score
        combinedConfidence[feature] = Math.max(
          combinedConfidence[feature],
          result.confidence[feature],
        );
      });
    });

    console.log(
      `Analysis complete. Combined features: ${
        Object.entries(combinedFeatures)
          .filter(([_, value]) => value)
          .map(([key]) => key)
          .join(", ") || "None"
      }`,
    );

    // Create a list of detected features (features that are true)
    const detectedFeatures = Object.entries(combinedFeatures)
      .filter(([_, value]) => value)
      .map(([key]) => key);

    // Return the detected features and their confidence scores
    return NextResponse.json({
      features: combinedFeatures,
      confidence: combinedConfidence,
      detectedFeatures: detectedFeatures,
    });
  } catch (error) {
    console.error("Error analyzing images:", error);
    return NextResponse.json(
      {
        error: "Failed to analyze images",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
