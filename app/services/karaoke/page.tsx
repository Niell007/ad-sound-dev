"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Mic2, Music2, Tv2, Users2, Speaker, Star, Check, ArrowLeft, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const features = [
  {
    icon: <Music2 className="h-6 w-6" />,
    title: "Extensive Song Library",
    description: "Over 10,000 songs across multiple genres and languages."
  },
  {
    icon: <Mic2 className="h-6 w-6" />,
    title: "Professional Equipment",
    description: "High-quality wireless microphones and sound system."
  },
  {
    icon: <Tv2 className="h-6 w-6" />,
    title: "HD Displays",
    description: "Crystal clear lyric display on large HD screens."
  },
  {
    icon: <Users2 className="h-6 w-6" />,
    title: "Professional Host",
    description: "Experienced MC to keep the energy high and manage the queue."
  },
  {
    icon: <Speaker className="h-6 w-6" />,
    title: "Premium Sound",
    description: "Studio-quality audio processing for the perfect karaoke experience."
  },
  {
    icon: <Check className="h-5 w-5 text-primary" />,
    title: "Song Request System",
    description: "Request your favorite songs and add them to the playlist."
  },
  {
    icon: <Check className="h-5 w-5 text-primary" />,
    title: "Voice Effects",
    description: "Enhance your performance with a variety of voice effects."
  },
  {
    icon: <Check className="h-5 w-5 text-primary" />,
    title: "Recording Options",
    description: "Capture your performance and share it with friends and family."
  }
]

const songCategories = [
  {
    name: "Popular Hits",
    description: "Latest chart-toppers and current hits",
    examples: ["Shape of You - Ed Sheeran", "Blinding Lights - The Weeknd", "As It Was - Harry Styles"]
  },
  {
    name: "Classic Rock",
    description: "Timeless rock anthems",
    examples: ["Sweet Home Alabama - Lynyrd Skynyrd", "Bohemian Rhapsody - Queen", "Hotel California - Eagles"]
  },
  {
    name: "R&B/Soul",
    description: "Smooth R&B and soul classics",
    examples: ["I Will Always Love You - Whitney Houston", "All of Me - John Legend", "Killing Me Softly - Fugees"]
  },
  {
    name: "Pop Classics",
    description: "Beloved pop songs from every era",
    examples: ["Dancing Queen - ABBA", "I Want It That Way - Backstreet Boys", "Billie Jean - Michael Jackson"]
  },
  {
    name: "Local Favorites",
    description: "Popular South African hits",
    examples: ["Stimela - Hugh Masekela", "Paradise Road - Joy", "Special Star - Mango Groove"]
  }
]

const packages = [
  {
    name: "Basic Package",
    price: "R1500",
    features: [
      "Up to 3 hours",
      "2 wireless microphones",
      "Standard song library",
      "Basic sound system",
    ],
  },
  {
    name: "Premium Package",
    price: "R2500",
    features: [
      "Up to 5 hours",
      "4 wireless microphones",
      "Extended song library",
      "Premium sound system",
      "Professional host",
      "Voice effects",
      "Recording service",
    ],
  },
  {
    name: "Party Package",
    price: "R3500",
    features: [
      "Up to 6 hours",
      "6 wireless microphones",
      "Complete song library",
      "Premium sound system",
      "Professional host",
      "Voice effects",
      "Recording service",
      "Party lighting",
      "Music videos",
    ],
  },
]

const gallery = [
  "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=2070",
  "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=2070",
  "https://images.unsplash.com/photo-1551710029-607e06bd45ff?q=80&w=2069",
]

export default function KaraokePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full">
        <Image
          src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=2070"
          alt="Karaoke Setup"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">
            Karaoke Services
          </h1>
          <p className="text-lg md:text-xl text-center max-w-2xl mx-4">
            Professional karaoke equipment and entertainment for your event
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
                <Mic className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">Premium Karaoke Experience</h2>
              <p className="text-xl text-muted-foreground">
                Create unforgettable memories with our professional karaoke setup and extensive song library.
              </p>
              <div className="space-y-2">
                {features.slice(0, 4).map((feature) => (
                  <div key={feature.title} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>{feature.title}</span>
                  </div>
                ))}
              </div>
              <Button asChild>
                <Link href="/contact">Book Now</Link>
              </Button>
            </div>
            <div className="relative aspect-video rounded-xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=2070"
                alt="Karaoke Setup"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Pricing Packages */}
          <div>
            <h2 className="text-3xl font-bold text-center mb-8">Karaoke Packages</h2>
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
                    alt={`Karaoke Event Gallery Image ${index + 1}`}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <section className="bg-primary text-primary-foreground rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Host a Karaoke Party?</h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Let us help you create an entertaining and memorable karaoke experience
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