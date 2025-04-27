import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { restrooms, reviews, analytics, menstrualProducts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Invalid restroom ID" }, { status: 400 });
  }

  try {
    // Fetch restroom details
    const restroom = await db
      .select()
      .from(restrooms)
      .where(eq(restrooms.id, id))
      .limit(1);

    if (!restroom.length) {
      return NextResponse.json(
        { error: "Restroom not found" },
        { status: 404 },
      );
    }

    // Fetch all reviews for the restroom
    const reviewsData = await db
      .select()
      .from(reviews)
      .where(eq(reviews.restroomId, id));

    // Calculate averages and counts manually
    const reviewCount = reviewsData.length;
    console.log(reviewCount);
    const averageRating =
      reviewCount > 0
        ? reviewsData.reduce((sum, review) => sum + review.rating, 0) /
          reviewCount
        : 0;
    const cleanliness =
      reviewCount > 0
        ? reviewsData.reduce((sum, review) => sum + review.cleanliness, 0) /
          reviewCount
        : 0;
    const privacy =
      reviewCount > 0
        ? reviewsData.reduce((sum, review) => sum + review.privacy, 0) /
          reviewCount
        : 0;
    const accessibility =
      reviewCount > 0
        ? reviewsData.reduce((sum, review) => sum + review.accessibility, 0) /
          reviewCount
        : 0;

    // Fetch analytics data
    const analyticsData = await db
      .select()
      .from(analytics)
      .where(eq(analytics.restroomId, id))
      .limit(1);

    const analyticsInfo = analyticsData.length ? analyticsData[0] : null;

    // Fetch menstrual product data
    const menstrualProductData = await db
      .select()
      .from(menstrualProducts)
      .where(eq(menstrualProducts.restroomId, id))
      .limit(1);

    const menstrualProductInfo = menstrualProductData.length
      ? menstrualProductData[0]
      : null;

    // Combine all data into a single response
    const responseData = {
      ...restroom[0],
      averageRating,
      reviewCount,
      cleanliness,
      privacy,
      accessibility,
      analytics: analyticsInfo,
      menstrualProducts: menstrualProductInfo,
      reviews: reviewsData,
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("Error fetching restroom data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    // Kind of a Schema I guess
    const newRestroom = {
      id: uuidv4(), // Generate a UUID
      name: data.name,
      address: data.address,
      hours: data.hours || "Not specified",
      images: data.images || [],
      features: data.features || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert new restroom into the database
    await db.insert(restrooms).values(newRestroom);

    return NextResponse.json({ success: true, id: newRestroom.id }, { status: 201 });
  } catch (error) {
    console.error("Error creating restroom:", error);
    return NextResponse.json(
      { error: "Failed to create restroom" },
      { status: 500 }
    );
  }
}
