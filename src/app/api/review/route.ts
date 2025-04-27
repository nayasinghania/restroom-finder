import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { restrooms, reviews } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";


// Get all the Reviews
export async function GET(req: NextRequest) {
    try {
      const searchParams = req.nextUrl.searchParams;
      const restroomId = searchParams.get("restroomId");
  
      if (!restroomId) {
        return NextResponse.json({ error: "Restroom ID is required" }, { status: 400 });
      }
  
      const restroomReviews = await db.query.reviews.findMany({
        where: eq(reviews.restroomId, restroomId),
        orderBy: [desc(reviews.createdAt)]
      });
  
      return NextResponse.json(restroomReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
    }
  }

//Get add a review
export async function POST(req: NextRequest) {
    try {
      const data = await req.json();
      const { restroomId, userName, rating, cleanliness, accessibility, privacy, comment } = data;
      
      if (!restroomId || !userName || !rating || !comment) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }
  
      const reviewId = uuidv4();
      
      // Insert the review
      await db.insert(reviews).values({
        id: reviewId,
        restroomId,
        userName,
        rating: Number(rating),
        comment,
        helpful: 0,
        unhelpful: 0,
        cleanliness: Number(cleanliness || 0),
        accessibility: Number(accessibility || 0),
        privacy: Number(privacy || 0),
        createdAt: new Date(),
      });
  
      // Get all reviews for this restroom to recalculate averages
    //   const allReviews = await db.query.reviews.findMany({
    //     where: eq(reviews.restroomId, restroomId),
    //   });
  
      // Calculate averages
    //   const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    //   const avgCleanliness = allReviews.reduce((sum, r) => sum + r.cleanliness, 0) / allReviews.length;
    //   const avgAccessibility = allReviews.reduce((sum, r) => sum + r.accessibility, 0) / allReviews.length;
    //   const avgPrivacy = allReviews.reduce((sum, r) => sum + r.privacy, 0) / allReviews.length;
  
      // Update the restroom with new average ratings
    //   await db
    //     .update(restrooms)
    //     .set({
    //       updatedAt: new Date(),
    //       // You'll need to add these fields to your restroom schema if they don't exist
    //       // averageRating: avgRating,
    //       // avgCleanliness,
    //       // avgAccessibility,
    //       // avgPrivacy
    //     })
    //     .where(eq(restrooms.id, restroomId));
  
      // Return the newly created review
      return NextResponse.json({
        id: reviewId,
        restroomId,
        userName,
        rating: Number(rating),
        comment,
        helpful: 0,
        unhelpful: 0,
        cleanliness: Number(cleanliness || 0),
        accessibility: Number(accessibility || 0),
        privacy: Number(privacy || 0),
        createdAt: new Date(),
      }, { status: 201 });
    } catch (error) {
      console.error("Error creating review:", error);
      return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
    }
  }