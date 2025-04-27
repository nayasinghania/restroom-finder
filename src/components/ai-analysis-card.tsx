import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, ThumbsUp, ThumbsDown, Camera } from "lucide-react";

// interface AIAnalysisProps {
//   analysis: {
//     pros: string[];
//     cons: string[];
//     imageFeatures: string[];
//   };
// }

export default function AIAnalysisCard() {
  const analysis = {
    pros: ["Clean", "Well-maintained", "Good lighting", "Accessible"],
    cons: ["Can be busy", "Occasional maintenance issues", "Limited stalls"],
    imageFeatures: [
      "Modern fixtures",
      "Touchless faucets",
      "ADA compliant",
      "Good lighting",
    ],
  };
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Sparkles className="h-5 w-5 text-teal-500 mr-2" />
          <h3 className="text-lg font-medium">AI-Powered Analysis</h3>
        </div>

        <div className="text-sm text-muted-foreground mb-4">
          Our AI has analyzed reviews and images to extract key insights about
          this restroom.
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <div className="font-medium flex items-center">
              <ThumbsUp className="h-4 w-4 text-green-500 mr-2" />
              Pros
            </div>
            <ul className="list-disc list-inside text-sm space-y-1 pl-1">
              {analysis.pros.map((pro, index) => (
                <li key={index}>{pro}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-medium flex items-center">
              <ThumbsDown className="h-4 w-4 text-red-500 mr-2" />
              Cons
            </div>
            <ul className="list-disc list-inside text-sm space-y-1 pl-1">
              {analysis.cons.map((con, index) => (
                <li key={index}>{con}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-2">
          <div className="font-medium flex items-center">
            <Camera className="h-4 w-4 text-blue-500 mr-2" />
            Features Detected in Images
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {analysis.imageFeatures.map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
