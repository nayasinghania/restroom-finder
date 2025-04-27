"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  MapPin,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Camera,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AIAnalysisCard from "@/components/ai-analysis-card";
import AddReviewForm from "@/components/add-review-form";
import MenstrualProductsSection from "@/components/menstrual-products-section";
import { ReviewSelect } from "@/db/schema";

export default function RestroomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [restroom, setRestroom] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRestroomData() {
      try {
        const { id } = await params; // Unwrap the params Promise
        const response = await fetch(`/api/restroom?id=${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch restroom data");
        }
        const data = await response.json();
        console.log("Fetched restroom data:", data);
        setRestroom(data);
      } catch (err) {
        setError("Failed to load restroom data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchRestroomData();
  }, [params]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!restroom) {
    return <p>Restroom not found.</p>;
  }

  return (
    <main className="container mx-auto px-4 py-6">
      <Link
        href="/"
        className="flex items-center text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to search
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <h1 className="text-2xl font-bold mb-2 md:mb-0">{restroom.name}</h1>
            <div className="flex items-center">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="font-medium text-lg">
                {restroom.averageRating}
              </span>
              <span className="text-muted-foreground ml-1">
                ({restroom.reviewCount} reviews)
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center text-muted-foreground mb-4">
            <div className="flex items-center mr-4 mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{restroom.address}</span>
            </div>
            <div className="flex items-center mr-4 mb-2">
              <Clock className="h-4 w-4 mr-1" />
              <span>{restroom.hours}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {restroom.features.map((feature: string) => (
              <Badge
                key={feature}
                variant="outline"
                className={`${
                  feature === "Menstrual Products"
                    ? "bg-pink-50 text-pink-700 border-pink-200"
                    : "bg-teal-50 text-teal-700 border-teal-200"
                }`}
              >
                {feature}
              </Badge>
            ))}
            {restroom.menstrualProducts?.available && (
              <Badge
                variant="outline"
                className="bg-pink-50 text-pink-700 border-pink-200"
              >
                Menstrual Products
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {restroom.images && restroom.images.length > 0 ? (
              restroom.images.map((image: string, index: number) => (
                <div
                  key={index}
                  className="relative h-48 rounded-lg overflow-hidden border"
                >
                  <Image
                    src={image}
                    alt={`${restroom.name} image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="relative h-48 rounded-lg overflow-hidden border">
                <Image
                  src="/default-bathroom.png"
                  alt={`${restroom.name} default image`}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          {restroom.menstrualProducts && (
            <MenstrualProductsSection
              data={{
                ...restroom.menstrualProducts,
                status: restroom.menstrualProducts.status || "unknown",
                reportedIssues: restroom.menstrualProducts.reportedIssues || [],
              }}
              restroomId={restroom.id}
            />
          )}

          <Tabs defaultValue="reviews" className="mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="ratings">Ratings</TabsTrigger>
              <TabsTrigger value="ai-analysis">
                <div className="flex items-center">
                  <Sparkles className="h-4 w-4 mr-1 text-teal-500" />
                  AI Analysis
                </div>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reviews" className="space-y-4 mt-4">
              {restroom.reviews.map((review: ReviewSelect) => (
                <Card key={review.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                      <div>
                        <div className="font-medium">{review.userName}</div>
                        <div className="text-sm text-muted-foreground">
                          {review.createdAt.toString()}
                        </div>
                      </div>
                      <div className="flex items-center mt-2 sm:mt-0">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span>{review.rating}</span>
                      </div>
                    </div>
                    <p className="my-3">{review.comment}</p>
                    <div className="flex items-center text-sm">
                      <Button variant="ghost" size="sm" className="h-8">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Helpful ({review.helpful})
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8">
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        Not helpful ({review.unhelpful})
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <AddReviewForm restroomId={restroom.id} />
            </TabsContent>

            <TabsContent value="ratings" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">
                    Rating Categories
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(
                      restroom.features as Record<string, number>,
                    ).map(([category, rating]) => (
                      <div
                        key={category}
                        className="flex items-center justify-between"
                      >
                        <span className="capitalize">{category}</span>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < Math.floor(rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : i < rating
                                    ? "fill-yellow-400 text-yellow-400 opacity-50"
                                    : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="ml-2 font-medium">{rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ai-analysis" className="mt-4">
              <AIAnalysisCard />
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Location</h3>
              <div className="relative h-48 rounded-lg overflow-hidden border mb-4">
                <Image
                  src={`/placeholder.svg?height=200&width=300&text=Map+Location`}
                  alt="Map location"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex items-center text-sm text-muted-foreground mb-6">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{restroom.address}</span>
              </div>

              <div className="space-y-3">
                <Button className="w-full bg-teal-600 hover:bg-teal-700">
                  Get Directions
                </Button>
                <Button variant="outline" className="w-full">
                  <Camera className="h-4 w-4 mr-2" />
                  Add Photos
                </Button>
                <Link href="/add-review" className="w-full block">
                  <Button variant="outline" className="w-full">
                    <Star className="h-4 w-4 mr-2" />
                    Write a Review
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
