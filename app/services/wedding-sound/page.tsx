"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, Music, Mic2, Clock, Users, Star, Bell, Sparkles, Check, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const features = [
  {
    icon: <Music className="h-6 w-6" />,
    title: "Ceremony Sound",
    description: "Crystal-clear audio for your vows, readings, and live music"
  },
  {
    icon: <Heart className="h-6 w-6" />,
    title: "Reception Entertainment",
    description: "Professional DJ services and dance floor sound"
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "Ambient Lighting",
    description: "Elegant lighting solutions to enhance your venue"
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Full Day Coverage",
    description: "Seamless audio from ceremony to last dance"
  }
]

const packages = [
  {
    name: "Ceremony Package",
    price: "R4,500",
    features: [
      "Up to 2 hours coverage",
      "Professional sound system",
      "2 wireless microphones",
      "Ceremony music playlist",
      "Backup equipment",
      "Early setup & sound check",
    ],
  },
  {
    name: "Reception Package",
    price: "R8,500",
    features: [
      "Up to 6 hours coverage",
      "Premium sound system",
      "Professional DJ",
      "Dance floor lighting",
      "Wireless microphones",
      "Custom playlist creation",
      "MC system",
      "Setup & teardown",
    ],
  },
  {
    name: "Complete Wedding Package",
    price: "R12,500",
    features: [
      "Full day coverage",
      "Premium sound for ceremony & reception",
      "Professional DJ services",
      "Comprehensive lighting package",
      "Multiple wireless microphones",
      "Custom music planning",
      "Dedicated sound engineer",
      "Backup equipment",
      "Early setup & sound check",
      "Late night finish option",
    ],
  },
]

const eventSpaces = [
  {
    title: "Ceremony",
    items: [
      "Outdoor garden ceremonies",
      "Indoor chapel services",
      "Beach weddings",
      "Large cathedral spaces",
    ]
  },
  {
    title: "Reception",
    items: [
      "Banquet halls",
      "Outdoor marquees",
      "Hotel ballrooms",
      "Restaurant venues",
    ]
  },
  {
    title: "Special Moments",
    items: [
      "First dance",
      "Parent dances",
      "Toasts & speeches",
      "Grand entrance",
    ]
  }
]

const gallery = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=2070",
]

export default function WeddingSoundPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full">
        <Image
          src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070"
          alt="Wedding Venue"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">
            Wedding Sound Services
          </h1>
          <p className="text-lg md:text-xl text-center max-w-2xl mx-4">
            Creating the perfect soundtrack for your special day
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8"
          >
            <Link href="/contact">Plan Your Wedding</Link>
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
          {/* Features Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="bg-card">
                <CardHeader>
                  <div className="rounded-lg bg-primary/10 p-2 w-fit">
                    {feature.icon}
                  </div>
                  <CardTitle className="mt-4">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Event Spaces */}
          <div>
            <h2 className="text-3xl font-bold text-center mb-8">Versatile Solutions for Every Venue</h2>
            <Tabs defaultValue="ceremony" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                {eventSpaces.map((space) => (
                  <TabsTrigger key={space.title} value={space.title.toLowerCase()}>
                    {space.title}
                  </TabsTrigger>
                ))}
              </TabsList>
              {eventSpaces.map((space) => (
                <TabsContent key={space.title} value={space.title.toLowerCase()}>
                  <Card>
                    <CardHeader>
                      <CardTitle>{space.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                      {space.items.map((item) => (
                        <div key={item} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Pricing Packages */}
          <div>
            <h2 className="text-3xl font-bold text-center mb-8">Wedding Packages</h2>
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
            <h2 className="text-3xl font-bold text-center mb-8">Wedding Gallery</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {gallery.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-video rounded-lg overflow-hidden group"
                >
                  <Image
                    src={image}
                    alt={`Wedding Event Gallery Image ${index + 1}`}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <section className="bg-primary text-primary-foreground rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Plan Your Wedding Sound?</h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Let us help you create the perfect atmosphere for your special day
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-primary hover:bg-white/90"
                asChild
              >
                <Link href="/contact">Schedule Consultation</Link>
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