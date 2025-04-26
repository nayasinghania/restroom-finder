import Image from "next/image"
import Link from "next/link"
import { Star, MapPin, Clock, ThumbsUp, ThumbsDown, Camera, ArrowLeft, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AIAnalysisCard from "@/components/ai-analysis-card"
import AddReviewForm from "@/components/add-review-form"
import MenstrualProductsSection from "@/components/menstrual-products-section"

interface RestroomPageProps {
  params: {
    id: string
  }
}

export default function RestroomPage({ params }: RestroomPageProps) {
  const id = Number.parseInt(params.id)

  // This would come from your database in a real app
  const restroom = {
    id,
    name: id === 1 ? "Central Park Restroom" : id === 2 ? "Mall Food Court Restroom" : "City Library Restroom",
    address: `${100 + id} Main Street, New York, NY`,
    distance: `${(0.2 * id).toFixed(1)} mi`,
    rating: 4 + (id % 2) * 0.5,
    reviewCount: 10 * id,
    categories: {
      cleanliness: 4 + (id % 3) * 0.5,
      privacy: 3.5 + (id % 2) * 0.5,
      accessibility: id % 2 === 0 ? 5 : 4,
    },
    features: ["Gender Neutral", id % 2 === 0 ? "Baby Changing" : "Handicap Accessible", "Free"],
    menstrualProducts: {
      available: id % 2 === 0,
      type: id % 2 === 0 ? "Free dispensers" : "Coin-operated",
      lastRestocked: id % 2 === 0 ? "2 days ago" : "1 week ago",
      images:
        id % 2 === 0
          ? [
              `/placeholder.svg?height=200&width=300&text=Menstrual+Product+Dispenser+1`,
              `/placeholder.svg?height=200&width=300&text=Menstrual+Product+Dispenser+2`,
            ]
          : [],
    },
    hours: "7:00 AM - 10:00 PM",
    images: [
      `/placeholder.svg?height=300&width=400&text=Restroom+${id}+Image+1`,
      `/placeholder.svg?height=300&width=400&text=Restroom+${id}+Image+2`,
      `/placeholder.svg?height=300&width=400&text=Restroom+${id}+Image+3`,
    ],
    reviews: [
      {
        id: 1,
        user: "Alex Johnson",
        date: "2 days ago",
        rating: 4.5,
        text: "Very clean restroom with good privacy. The soap dispensers were full and everything worked well. Only downside was a slight wait during peak hours.",
        helpful: 12,
        unhelpful: 2,
      },
      {
        id: 2,
        user: "Sam Taylor",
        date: "1 week ago",
        rating: 3.5,
        text: "Decent restroom but could be cleaner. The hand dryer was broken when I visited. On the plus side, it was very accessible and had good baby changing facilities.",
        helpful: 8,
        unhelpful: 1,
      },
    ],
    aiAnalysis: {
      pros: ["Clean", "Well-maintained", "Good lighting", "Accessible"],
      cons: ["Can be busy", "Occasional maintenance issues", "Limited stalls"],
      imageFeatures: ["Modern fixtures", "Touchless faucets", "ADA compliant", "Good lighting"],
    },
  }

  return (
    <main className="container mx-auto px-4 py-6">
      <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to search
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <h1 className="text-2xl font-bold mb-2 md:mb-0">{restroom.name}</h1>
            <div className="flex items-center">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="font-medium text-lg">{restroom.rating}</span>
              <span className="text-muted-foreground ml-1">({restroom.reviewCount} reviews)</span>
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
            {restroom.features.map((feature) => (
              <Badge
                key={feature}
                variant="outline"
                className={`${feature === "Menstrual Products" ? "bg-pink-50 text-pink-700 border-pink-200" : "bg-teal-50 text-teal-700 border-teal-200"}`}
              >
                {feature}
              </Badge>
            ))}
            {restroom.menstrualProducts?.available && (
              <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200">
                Menstrual Products
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {restroom.images.map((image, index) => (
              <div key={index} className="relative h-48 rounded-lg overflow-hidden border">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${restroom.name} image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          {restroom.menstrualProducts && (
            <MenstrualProductsSection
              data={{
                ...restroom.menstrualProducts,
                status: id % 3 === 0 ? "well-stocked" : id % 3 === 1 ? "low" : "empty",
                reportedIssues: id % 2 === 0 ? ["Dispenser jammed", "Needs refill"] : [],
              }}
              restroomId={id}
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
              {restroom.reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                      <div>
                        <div className="font-medium">{review.user}</div>
                        <div className="text-sm text-muted-foreground">{review.date}</div>
                      </div>
                      <div className="flex items-center mt-2 sm:mt-0">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span>{review.rating}</span>
                      </div>
                    </div>
                    <p className="my-3">{review.text}</p>
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

              <AddReviewForm restroomId={id} />
            </TabsContent>

            <TabsContent value="ratings" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Rating Categories</h3>
                  <div className="space-y-4">
                    {Object.entries(restroom.categories).map(([category, rating]) => (
                      <div key={category} className="flex items-center justify-between">
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
              <AIAnalysisCard analysis={restroom.aiAnalysis} />
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
                <Button className="w-full bg-teal-600 hover:bg-teal-700">Get Directions</Button>
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
  )
}
