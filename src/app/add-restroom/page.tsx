"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

export default function AddRestroomPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    hours: "",
    type: "",
    description: "",
    features: [] as string[],
    menstrualProducts: {
      available: false,
      dispenserType: "",
      status: "",
      notes: "",
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/restroom", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add restroom");
      }

      alert("Restroom added successfully!");
      // Reset form or redirect as needed
    } catch (error) {
      console.error(error);
      alert("An error occurred while adding the restroom.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFeatureChange = (feature: string) => {
    setFormData((prev) => {
      const features = prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature];
      return { ...prev, features };
    });
  };

  return (
    <main className="container mx-auto px-4 py-6">
      <Link
        href="/"
        className="flex items-center text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to search
      </Link>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Add a New Restroom</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Provide details about the restroom location
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Restroom Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Central Park Public Restroom"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <div className="flex">
                  <Input
                    id="address"
                    placeholder="Full address"
                    required
                    className="flex-1"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                  <Button type="button" variant="outline" className="ml-2">
                    <MapPin className="h-4 w-4 mr-2" />
                    Use Current
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hours">Opening Hours</Label>
                  <Input
                    id="hours"
                    placeholder="e.g. 7:00 AM - 10:00 PM"
                    value={formData.hours}
                    onChange={(e) =>
                      setFormData({ ...formData, hours: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="type">Restroom Type</Label>
                  <select
                    id="type"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                  >
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
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
              <CardDescription>
                Select all features that apply to this restroom
              </CardDescription>
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
                    <Checkbox
                      id={feature.replace(/\s+/g, "-").toLowerCase()}
                      checked={formData.features.includes(feature)}
                      onCheckedChange={() => handleFeatureChange(feature)}
                    />
                    <Label
                      htmlFor={feature.replace(/\s+/g, "-").toLowerCase()}
                      className="text-sm font-normal"
                    >
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
              <CardDescription>
                Provide details about menstrual product availability
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="menstrual-products"
                  checked={formData.menstrualProducts.available}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      menstrualProducts: {
                        ...formData.menstrualProducts,
                        available: (e.target as HTMLInputElement).checked,
                      },
                    })
                  }
                />
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
                    value={formData.menstrualProducts.dispenserType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        menstrualProducts: {
                          ...formData.menstrualProducts,
                          dispenserType: e.target.value,
                        },
                      })
                    }
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
                    value={formData.menstrualProducts.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        menstrualProducts: {
                          ...formData.menstrualProducts,
                          status: e.target.value,
                        },
                      })
                    }
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
                <Label htmlFor="product-notes">Additional Notes</Label>
                <Textarea
                  id="product-notes"
                  placeholder="Any additional information about the menstrual products (location in the restroom, condition, etc.)"
                  rows={2}
                  value={formData.menstrualProducts.notes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      menstrualProducts: {
                        ...formData.menstrualProducts,
                        notes: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Add Restroom"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
