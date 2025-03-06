"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Music, Check, Volume2, Lightbulb, Clock, Users, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const features = [
  "High-quality sound systems",
  "Customized playlists",
  "Professional DJ services",
  "Lighting equipment",
  "Setup and teardown included",
  "Backup equipment",
  "Technical support throughout the event",
  "Sound level monitoring",
]

const packages = [
  {
    name: "Basic Package",
    price: "R2000",
    features: [
      "Up to 4 hours",
      "Basic sound system",
      "1 wireless microphone",
      "Standard lighting",
    ],
  },
  {
    name: "Premium Package",
    price: "R3500",
    features: [
      "Up to 6 hours",
      "Premium sound system",
      "2 wireless microphones",
      "Professional lighting",
      "DJ services",
    ],
  },
  {
    name: "Ultimate Package",
    price: "R5000",
    features: [
      "Up to 8 hours",
      "Premium sound system",
      "4 wireless microphones",
      "Professional lighting",
      "DJ services",
      "Fog machine",
      "LED dance floor",
    ],
  },
]

const gallery = [
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070",
  "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070",
]

export default function PartySoundPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full">
        <Image
          src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070"
          alt="Party Sound System"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">
            Party Sound Services
          </h1>
          <p className="text-lg md:text-xl text-center max-w-2xl mx-4">
            Professional sound solutions for parties and events of all sizes
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8"
          >
            <Link href="/contact">Get Started</Link>
          </Button>
        </div>
      </section>

      <div className="container py-12 space-y-16">
        <Button variant="ghost" className="mb-8" asChild>
          <Link href="/services" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Services
          </Link>
        </Button>

        {/* Main Content */}
        <div className="grid gap-12">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-primary/10 p-2">
                <Music className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">Premium Sound Solutions</h2>
              <p className="text-xl text-muted-foreground">
                Create the perfect atmosphere for your party with our professional sound equipment and services.
              </p>
              <div className="space-y-2">
                {features.slice(0, 4).map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <Button asChild>
                <Link href="/contact">Book Now</Link>
              </Button>
            </div>
            <div className="relative aspect-video rounded-xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070"
                alt="Sound Equipment Setup"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Pricing Packages */}
          <div>
            <h2 className="text-3xl font-bold text-center mb-8">Sound Packages</h2>
            <div className="grid gap-8 lg:grid-cols-3">
              {packages.map((package_, index) => (
                <Card key={index} className="relative overflow-hidden">
                  <CardHeader>
                    <CardTitle>{package_.name}</CardTitle>
                    <p className="text-3xl font-bold text-primary">
                      {package_.price}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {package_.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Gallery */}
          <div>
            <h2 className="text-3xl font-bold text-center mb-8">Event Gallery</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {gallery.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-video rounded-lg overflow-hidden group"
                >
                  <Image
                    src={image}
                    alt={`Party Sound Gallery Image ${index + 1}`}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <section className="bg-primary text-primary-foreground rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Make Your Party Unforgettable?</h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Let our professional team handle the sound and create the perfect atmosphere for your event
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-primary hover:bg-white/90"
                asChild
              >
                <Link href="/contact">Get in Touch</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
                asChild
              >
                <Link href="/services">View All Services</Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
} 