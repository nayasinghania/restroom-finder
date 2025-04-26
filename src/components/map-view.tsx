"use client"

import { useEffect, useRef } from "react"
import { MapPin } from "lucide-react"

export default function MapView() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Mock data for restroom locations
  const locations = [
    { x: 150, y: 100, rating: 4.5, name: "Central Park Restroom" },
    { x: 300, y: 200, rating: 4.0, name: "Mall Food Court Restroom" },
    { x: 450, y: 150, rating: 3.5, name: "City Library Restroom" },
    { x: 200, y: 300, rating: 5.0, name: "Train Station Restroom" },
    { x: 400, y: 350, rating: 4.2, name: "Beach Pavilion Restroom" },
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions to match container
    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.clientWidth
        canvas.height = parent.clientHeight
        drawMap()
      }
    }

    // Draw the map
    const drawMap = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background
      ctx.fillStyle = "#f0f4f8"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw some roads
      ctx.strokeStyle = "#d1d5db"
      ctx.lineWidth = 8

      // Horizontal roads
      for (let y = 100; y < canvas.height; y += 200) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Vertical roads
      for (let x = 100; x < canvas.width; x += 200) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      // Draw blocks
      ctx.fillStyle = "#e5e7eb"
      for (let x = 0; x < canvas.width; x += 200) {
        for (let y = 0; y < canvas.height; y += 200) {
          ctx.fillRect(x + 10, y + 10, 180, 180)
        }
      }

      // Draw location pins
      locations.forEach((loc) => {
        const x = (loc.x / 500) * canvas.width
        const y = (loc.y / 400) * canvas.height

        // Pin shadow
        ctx.beginPath()
        ctx.arc(x, y, 12, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
        ctx.fill()

        // Pin background
        ctx.beginPath()
        ctx.arc(x, y, 10, 0, Math.PI * 2)
        ctx.fillStyle = "#14b8a6"
        ctx.fill()

        // Rating text
        ctx.fillStyle = "white"
        ctx.font = "bold 10px Arial"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(loc.rating.toString(), x, y)
      })
    }

    // Initial setup
    resizeCanvas()

    // Handle window resize
    window.addEventListener("resize", resizeCanvas)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <div className="relative h-full w-full">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-md">
        <div className="flex items-center mb-2">
          <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center mr-2">
            <MapPin className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-medium">Your Location</span>
        </div>
        <div className="text-xs text-muted-foreground">Click on a pin to view restroom details</div>
      </div>
    </div>
  )
}
