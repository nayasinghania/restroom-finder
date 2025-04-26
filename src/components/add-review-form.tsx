"use client"

import type React from "react"

import { useState } from "react"
import { Star, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

interface AddReviewFormProps {
  restroomId: number
}

export default function AddReviewForm({ restroomId }: AddReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewText, setReviewText] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would submit this data to your backend
    console.log({
      restroomId,
      rating,
      reviewText,
    })

    // Reset form
    setRating(0)
    setReviewText("")
    alert("Review submitted! (This is a demo)")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Your Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="rating" className="block mb-2">
              Rating
            </Label>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-8 w-8 cursor-pointer ${
                    (hoverRating || rating) >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="review" className="block mb-2">
              Your Review
            </Label>
            <Textarea
              id="review"
              placeholder="Share your experience with this restroom..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
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
              disabled={rating === 0 || !reviewText.trim()}
            >
              Submit Review
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
