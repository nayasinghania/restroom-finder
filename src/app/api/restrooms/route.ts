import { NextResponse } from "next/server";
import { db } from "@/db";
import { restrooms } from "@/db/schema";

export async function GET() {
  try {
    // Fetch all restrooms from the database
    const res = await db.select().from(restrooms);

    // Return the restrooms as a JSON response
    return NextResponse.json(res);
  } catch (error) {
    console.error("Error fetching restrooms:", error);
    return NextResponse.json(
      { error: "Failed to fetch restrooms" },
      { status: 500 },
    );
  }
}
