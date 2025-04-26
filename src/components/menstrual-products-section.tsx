import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, AlertCircle } from "lucide-react"

interface MenstrualProductsProps {
  data: {
    available: boolean
    type?: string
    lastRestocked?: string
    images?: string[]
    status?: "well-stocked" | "low" | "empty"
    reportedIssues?: string[]
  }
  restroomId: number
}

export default function MenstrualProductsSection({ data, restroomId }: MenstrualProductsProps) {
  if (!data) return null

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium">Menstrual Products</h3>
          <Badge
            variant={data.available ? "default" : "outline"}
            className={
              data.available
                ? data.status === "well-stocked"
                  ? "bg-green-500"
                  : data.status === "low"
                    ? "bg-amber-500"
                    : "bg-red-500"
                : "bg-gray-200 text-gray-500"
            }
          >
            {data.available
              ? data.status === "well-stocked"
                ? "Well Stocked"
                : data.status === "low"
                  ? "Running Low"
                  : "Empty"
              : "Not Available"}
          </Badge>
        </div>

        {data.available ? (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <span className="text-muted-foreground">Type:</span> {data.type}
              </div>
              <div>
                <span className="text-muted-foreground">Last Restocked:</span> {data.lastRestocked}
              </div>
            </div>

            {data.reportedIssues && data.reportedIssues.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center text-amber-600 mb-1">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">Reported Issues:</span>
                </div>
                <ul className="text-sm list-disc list-inside pl-1">
                  {data.reportedIssues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}

            {data.images && data.images.length > 0 ? (
              <div>
                <h4 className="text-sm font-medium mb-2">Dispenser Images:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {data.images.map((image, index) => (
                    <div key={index} className="relative h-32 rounded-lg overflow-hidden border">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Menstrual product dispenser image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-3 border border-dashed rounded-md">
                <Camera className="h-6 w-6 mx-auto text-muted-foreground mb-1" />
                <p className="text-sm text-muted-foreground">No dispenser images yet</p>
              </div>
            )}

            <div className="flex justify-between mt-4">
              <Button variant="outline" size="sm">
                Report Issue
              </Button>
              <Button variant="outline" size="sm">
                <Camera className="h-4 w-4 mr-2" />
                Add Photos
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-3">This restroom does not have menstrual products available.</p>
            <Button variant="outline" size="sm">
              Suggest Adding Dispensers
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
