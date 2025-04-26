"use client"

import type React from "react"
import Image from "next/image"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, MapPin, Upload, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

export default function AddRestroomPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<string[]>([])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // In a real app, you would upload these to your server/cloud storage
      // For demo purposes, we'll just create object URLs
      const newImages = Array.from(e.target.files).map((file) => URL.createObjectURL(file))
      setImages([...images, ...newImages])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      alert("Restroom added successfully! (This is a demo)")
      // In a real app, you would redirect to the new restroom page
    }, 1500)
  }
  

  return (
    <main className="container mx-auto px-4 py-6">
      <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to search
      </Link>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Add a New Restroom</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Provide details about the restroom location</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Restroom Name</Label>
                <Input id="name" placeholder="e.g. Central Park Public Restroom" required />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <div className="flex">
                  <Input id="address" placeholder="Full address" required className="flex-1" />
                  <Button type="button" variant="outline" className="ml-2">
                    <MapPin className="h-4 w-4 mr-2" />
                    Use Current
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hours">Opening Hours</Label>
                  <Input id="hours" placeholder="e.g. 7:00 AM - 10:00 PM" />
                </div>
                <div>
                  <Label htmlFor="type">Restroom Type</Label>
                  <select id="type" className="w-full h-10 rounded-md border border-input bg-background px-3 py-2">
                    <option value="">Select type</option>
                    <option value="public">Public</option>
                    <option value="business">Business</option>
                    <option value="park">Park</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide any additional details about this restroom..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
              <CardDescription>Select all features that apply to this restroom</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  "Handicap Accessible",
                  "Gender Neutral",
                  "Baby Changing",
                  "Free",
                  "Key Required",
                  "Family Friendly",
                  "Touchless Fixtures",
                  "Air Dryer",
                  "Paper Towels",
                  "Shower",
                  "Diaper Disposal",
                  "Feminine Products",
                  "Menstrual Products",
                ].map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox id={feature.replace(/\s+/g, "-").toLowerCase()} />
                    <Label htmlFor={feature.replace(/\s+/g, "-").toLowerCase()} className="text-sm font-normal">
                      {feature}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Menstrual Products Information</CardTitle>
              <CardDescription>Provide details about menstrual product availability</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox id="menstrual-products" />
                <div>
                  <Label htmlFor="menstrual-products" className="font-medium">
                    This restroom has menstrual products
                  </Label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="product-type">Product Type</Label>
                  <select
                    id="product-type"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="">Select type</option>
                    <option value="free">Free dispensers</option>
                    <option value="coin">Coin-operated</option>
                    <option value="token">Token-operated</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="product-status">Current Status</Label>
                  <select
                    id="product-status"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="">Select status</option>
                    <option value="well-stocked">Well stocked</option>
                    <option value="low">Running low</option>
                    <option value="empty">Empty</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>
              </div>

              <div>
                <Label className="block mb-2">Dispenser Photos</Label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                  <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload photos of the menstrual product dispensers
                  </p>
                  <Input type="file" accept="image/*" multiple className="hidden" id="dispenser-image-upload" />
                  <Label htmlFor="dispenser-image-upload">
                    <Button type="button" variant="outline" size="sm">
                      Select Images
                    </Button>
                  </Label>
                </div>
              </div>

              <div>
                <Label htmlFor="product-notes">Additional Notes</Label>
                <Textarea
                  id="product-notes"
                  placeholder="Any additional information about the menstrual products (location in the restroom, condition, etc.)"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Photos</CardTitle>
              <CardDescription>Upload photos of the restroom to help others</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">Drag and drop images here or click to browse</p>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    id="image-upload"
                    onChange={handleImageUpload}
                  />
                  <Label htmlFor="image-upload">
                    <Button type="button" variant="outline" className="mt-2">
                      Select Images
                    </Button>
                  </Label>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {images.map((image, index) => (
                      <div key={index} className="relative h-24 rounded-md overflow-hidden">
                        
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`Uploaded image ${index + 1}`}
                          className="w-full h-full object-cover"
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center">
                <Sparkles className="h-5 w-5 text-teal-500 mr-2" />
                <CardTitle>AI-Enhanced Features</CardTitle>
              </div>
              <CardDescription>Our AI will analyze your photos and reviews to extract features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox id="ai-image-analysis" defaultChecked />
                  <div>
                    <Label htmlFor="ai-image-analysis" className="font-medium">
                      Enable AI Image Analysis
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Our computer vision system will detect features like cleanliness, accessibility features, and
                      amenities from your photos.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox id="ai-review-analysis" defaultChecked />
                  <div>
                    <Label htmlFor="ai-review-analysis" className="font-medium">
                      Enable AI Review Analysis
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Our NLP system will analyze reviews to extract pros, cons, and key features mentioned by users.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Add Restroom"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  )
}
