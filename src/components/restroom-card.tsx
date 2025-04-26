import Link from "next/link"
import Image from "next/image"
import { Star, MapPin, ThumbsUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface RestroomCardProps {
  id: number
}

export default function RestroomCard({ id }: RestroomCardProps) {
  // This would come from your database in a real app
  const restroom = {
    id,
    name: `${id === 1 ? "Central Park" : id === 2 ? "Mall Food Court" : id === 3 ? "City Library" : id === 4 ? "Train Station" : "Beach Pavilion"} Restroom`,
    address: `${100 + id} Main Street, New York, NY`,
    distance: `${(0.2 * id).toFixed(1)} mi`,
    rating: 4 + (id % 2) * 0.5,
    reviewCount: 10 * id,
    categories: {
      cleanliness: 4 + (id % 3) * 0.5,
      privacy: 3.5 + (id % 2) * 0.5,
      accessibility: id % 2 === 0 ? 5 : 4,
    },
    features: [
      "Gender Neutral",
      id % 2 === 0 ? "Baby Changing" : "Handicap Accessible",
      id % 3 === 0 ? "Menstrual Products" : "",
    ],
    image: `/placeholder.svg?height=150&width=250&text=Restroom+${id}`,
  }

  return (
    <Link href={`/restroom/${id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row">
          <div className="relative h-40 sm:h-auto sm:w-1/3">
            <Image src={restroom.image || "/placeholder.svg"} alt={restroom.name} fill className="object-cover" />
          </div>
          <CardContent className="flex-1 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
              <h3 className="font-semibold text-lg">{restroom.name}</h3>
              <div className="flex items-center mt-1 sm:mt-0">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="font-medium">{restroom.rating}</span>
                <span className="text-muted-foreground text-sm ml-1">({restroom.reviewCount})</span>
              </div>
            </div>

            <div className="flex items-center text-sm text-muted-foreground mt-1 mb-2">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              <span>{restroom.address}</span>
              <span className="mx-2">•</span>
              <span>{restroom.distance}</span>
            </div>

            <div className="flex flex-wrap gap-1 mt-2 mb-3">
              {restroom.features.filter(Boolean).map((feature) => (
                <Badge
                  key={feature}
                  variant="outline"
                  className={`${feature === "Menstrual Products" ? "bg-pink-50 text-pink-700 border-pink-200" : "bg-teal-50 text-teal-700 border-teal-200"}`}
                >
                  {feature}
                </Badge>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="flex flex-col">
                <span className="text-muted-foreground">Cleanliness</span>
                <div className="flex items-center">
                  <ThumbsUp
                    className={`h-3.5 w-3.5 mr-1 ${restroom.categories.cleanliness >= 4 ? "text-green-500" : "text-amber-500"}`}
                  />
                  <span>{restroom.categories.cleanliness}</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Privacy</span>
                <div className="flex items-center">
                  <ThumbsUp
                    className={`h-3.5 w-3.5 mr-1 ${restroom.categories.privacy >= 4 ? "text-green-500" : "text-amber-500"}`}
                  />
                  <span>{restroom.categories.privacy}</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Accessibility</span>
                <div className="flex items-center">
                  <ThumbsUp
                    className={`h-3.5 w-3.5 mr-1 ${restroom.categories.accessibility >= 4 ? "text-green-500" : "text-amber-500"}`}
                  />
                  <span>{restroom.categories.accessibility}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  )
}
