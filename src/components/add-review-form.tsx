"use client";

import type React from "react";

import { useState } from "react";
import { Star, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface AddReviewFormProps {
  restroomId: number;
}

type RatingCategory = "rating" | "cleanliness" | "privacy" | "accessibility";

export default function AddReviewForm({ restroomId }: AddReviewFormProps) {
  const [ratings, setRatings] = useState({
    rating: 0,
    cleanliness: 0,
    accessibility: 0,
    privacy: 0
  });
  const [hoverRatings, setHoverRatings] = useState({
    rating: 0,
    cleanliness: 0,
    accessibility: 0,
    privacy: 0
  });
  const [userName, setUserName] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingChange = (category: RatingCategory, value: number) => {
    setRatings(prev => ({ ...prev, [category]: value }));
  };

  const handleHoverRating = (category: RatingCategory, value: number) => {
    setHoverRatings(prev => ({ ...prev, [category]: value }));
  };

  const handleHoverRatingEnd = (category: RatingCategory) => {
    setHoverRatings(prev => ({ ...prev, [category]: 0 }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setIsSubmitting(true);
    e.preventDefault();
    // In a real app, you would submit this data to your backend
    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restroomId,
          userName,
          ...ratings,
          comment
        })
      });

      if (!response.ok) {
        throw new Error("Failed to add restroom");
      }

      console.log({
        restroomId,
        ...ratings,
        comment,
      });
  
      // Reset form
      setRatings({
        rating: 0,
        cleanliness: 0,
        privacy: 0,
        accessibility: 0
      });
      setComment("");
      alert("Review submitted!");
    } catch (error) {
      console.error(error);
      alert("An error occurred while adding the review.");
    } finally {
      setIsSubmitting(false);
    }

  };

  const RatingStars = ({ category }: { category: RatingCategory }) => (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-6 w-6 cursor-pointer ${
            (hoverRatings[category] || ratings[category]) >= star
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }`}
          onClick={() => handleRatingChange(category, star)}
          onMouseEnter={() => handleHoverRating(category, star)}
          onMouseLeave={() => handleHoverRatingEnd(category)}
        />
      ))}
    </div>
  );


  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Your Review</CardTitle>
      </CardHeader>
      <CardContent>
      <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="overall" className="block mb-2">
                Overall Rating
              </Label>
              <RatingStars category="rating" />
            </div>
            
            <div>
              <Label htmlFor="cleanliness" className="block mb-2">
                Cleanliness
              </Label>
              <RatingStars category="cleanliness" />
            </div>
            
            <div>
              <Label htmlFor="privacy" className="block mb-2">
                Privacy
              </Label>
              <RatingStars category="privacy" />
            </div>
            
            <div>
              <Label htmlFor="accessibility" className="block mb-2">
                Accessibility
              </Label>
              <RatingStars category="accessibility" />
            </div>
          </div>

          <div>
            <Label htmlFor="name" className="block mb-2">
              Your Name
            </Label>
            <Textarea
              id="name"
              placeholder="Type in your name..."
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <Label htmlFor="review" className="block mb-2">
              Your Review
            </Label>
            <Textarea
              id="review"
              placeholder="Share your experience with this restroom..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full"
            />
          </div>

          <div>
            <Button type="button" variant="outline" className="mr-2">
              <Camera className="h-4 w-4 mr-2" />
              Add Photos
            </Button>
            <Button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
