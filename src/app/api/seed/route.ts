import {
  restrooms,
  reviews,
  analytics,
  menstrualProducts,
} from "../../../db/schema";
import { db } from "../../../db"; // Adjust the path to your database instance
import { v4 as uuidv4 } from "uuid";

async function seedDatabase() {
  // Seed restrooms
  const restroomEntries = [
    {
      id: uuidv4(),
      name: "Central Park Restroom",
      address: "123 Park Ave, New York, NY",
      hours: "6 AM - 10 PM",
      images: ["image1.jpg", "image2.jpg"],
      features: ["Accessible", "Clean"],
    },
    {
      id: uuidv4(),
      name: "Downtown Plaza Restroom",
      address: "456 Main St, Los Angeles, CA",
      hours: "24/7",
      images: ["image3.jpg", "image4.jpg"],
      features: ["Family Friendly", "Well Lit"],
    },
  ];
  await db.insert(restrooms).values(restroomEntries);

  // Seed reviews
  const reviewEntries = [
    {
      id: uuidv4(),
      restroomId: restroomEntries[0].id,
      userName: "John Doe",
      rating: 5,
      comment: "Very clean and accessible!",
      helpful: 10,
      unhelpful: 0,
      cleanliness: 5,
      accessibility: 5,
      privacy: 4,
    },
    {
      id: uuidv4(),
      restroomId: restroomEntries[1].id,
      userName: "Jane Smith",
      rating: 4,
      comment: "Good, but could use more privacy.",
      helpful: 5,
      unhelpful: 1,
      cleanliness: 4,
      accessibility: 5,
      privacy: 3,
    },
  ];
  await db.insert(reviews).values(reviewEntries);

  // Seed analytics
  const analyticsEntries = [
    {
      id: uuidv4(),
      restroomId: restroomEntries[0].id,
      pros: ["Clean", "Accessible"],
      cons: ["Crowded"],
      features: ["Handicap Accessible", "Baby Changing Station"],
    },
    {
      id: uuidv4(),
      restroomId: restroomEntries[1].id,
      pros: ["Open 24/7", "Well Lit"],
      cons: ["Noisy"],
      features: ["Family Friendly", "Security Cameras"],
    },
  ];
  await db.insert(analytics).values(analyticsEntries);

  // Seed menstrual products
  const menstrualProductEntries = [
    {
      id: uuidv4(),
      restroomId: restroomEntries[0].id,
      available: true,
      dispenserType: "Free",
      images: ["dispenser1.jpg"],
      restockDate: new Date(),
    },
    {
      id: uuidv4(),
      restroomId: restroomEntries[1].id,
      available: false,
      dispenserType: "Paid",
      images: ["dispenser2.jpg"],
      restockDate: new Date(),
    },
  ];
  await db.insert(menstrualProducts).values(menstrualProductEntries);

  console.log("Database seeded successfully!");
}

// Call the function when the route is accessed
export async function GET() {
  try {
    await seedDatabase();
    return new Response("Database seeded successfully!", { status: 200 });
  } catch (error) {
    console.error("Error seeding database:", error);
    return new Response("Error seeding database", { status: 500 });
  }
}
