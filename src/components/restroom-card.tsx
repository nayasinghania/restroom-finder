"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Star, MapPin, ThumbsUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface RestroomCardProps {
  id: string; // UUID as per schema
}

export interface RestroomData {
  id: string;
  name: string;
  address: string;
  images: string[];
  features: string[];
  averageRating: number;
  reviewCount: number;
  cleanliness: number;
  privacy: number;
  accessibility: number;
}

export default function RestroomCard({ id }: RestroomCardProps) {
  const [restroom, setRestroom] = useState<RestroomData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRestroom() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/restroom?id=${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch restroom data");
        }
        const data: RestroomData = await response.json();
        setRestroom(data);
      } catch (error) {
        console.error("Error fetching restroom:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRestroom();
  }, [id]);

  if (isLoading) {
    return <RestroomCardSkeleton />;
  }

  if (!restroom) {
    return null;
  }

  return (
    <Link
      href={`/restroom/${restroom.id}`}
      className="block no-underline w-full"
    >
      <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 h-full">
        <div className="flex flex-col md:flex-row">
          {/* Image container with fixed aspect ratio */}
          <div className="relative w-full md:w-1/3 aspect-[4/3] md:aspect-auto">
            <Image
              src={"/placeholder.svg"}
              alt={restroom.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          </div>

          <CardContent className="flex-1 p-4 md:p-5">
            <div className="flex flex-col space-y-1 md:space-y-0 md:flex-row md:items-start md:justify-between">
              <h3 className="font-semibold text-lg md:text-xl line-clamp-1">
                {restroom.name}
              </h3>

              <div className="flex items-center mt-1 md:mt-0 md:ml-4 shrink-0">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="font-medium">
                  {restroom.averageRating.toFixed(1)}
                </span>
                <span className="text-muted-foreground text-sm ml-1">
                  ({restroom.reviewCount})
                </span>
              </div>
            </div>

            <div className="flex items-center text-sm text-muted-foreground mt-2">
              <MapPin className="h-3.5 w-3.5 mr-1 shrink-0" />
              <span className="line-clamp-1">{restroom.address}</span>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-3">
              {restroom.features.slice(0, 3).map((feature) => (
                <Badge
                  key={feature}
                  variant="outline"
                  className={`text-xs px-2 py-0.5 ${
                    feature === "Menstrual Products"
                      ? "bg-pink-50 text-pink-700 border-pink-200"
                      : "bg-teal-50 text-teal-700 border-teal-200"
                  }`}
                >
                  {feature}
                </Badge>
              ))}
              {restroom.features.length > 3 && (
                <Badge variant="outline" className="text-xs px-2 py-0.5">
                  +{restroom.features.length - 3} more
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 text-sm">
              <RatingMetric label="Cleanliness" value={restroom.cleanliness} />
              <RatingMetric label="Privacy" value={restroom.privacy} />
              <RatingMetric
                label="Accessibility"
                value={restroom.accessibility}
              />
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
}

function RatingMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col">
      <span className="text-muted-foreground text-xs md:text-sm truncate">
        {label}
      </span>
      <div className="flex items-center mt-0.5">
        <ThumbsUp
          className={`h-3.5 w-3.5 mr-1 ${value >= 4 ? "text-green-500" : "text-amber-500"}`}
        />
        <span className="font-medium">{value.toFixed(1)}</span>
      </div>
    </div>
  );
}

function RestroomCardSkeleton() {
  return (
    <Card className="overflow-hidden mb-4 h-full">
      <div className="flex flex-col md:flex-row">
        <div className="relative w-full md:w-1/3 aspect-[4/3] md:aspect-auto">
          <Skeleton className="h-full w-full" />
        </div>
        <CardContent className="flex-1 p-4 md:p-5">
          <div className="flex flex-col space-y-1 md:space-y-0 md:flex-row md:items-start md:justify-between">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-5 w-16 mt-1 md:mt-0" />
          </div>
          <Skeleton className="h-4 w-full mt-3" />
          <div className="flex gap-1.5 mt-3">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-16" />
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div>
              <Skeleton className="h-3 w-16 mb-1" />
              <Skeleton className="h-4 w-10" />
            </div>
            <div>
              <Skeleton className="h-3 w-16 mb-1" />
              <Skeleton className="h-4 w-10" />
            </div>
            <div>
              <Skeleton className="h-3 w-16 mb-1" />
              <Skeleton className="h-4 w-10" />
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
