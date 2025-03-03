"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Mic2, Music2, Tv2, Users2, Speaker, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
    price: "R1200",
    duration: "3 hours",
    features: [
      "2x Wireless Microphones",
      "HD Lyric Display",
      "Basic Sound System",
      "Standard Song Library",
      "Setup & Teardown",
    ]
  },
  {
    name: "Premium Package",
    price: "R2000",
    duration: "4 hours",
    features: [
      "4x Wireless Microphones",
      "Dual HD Displays",
      "Premium Sound System",
      "Full Song Library",
      "Professional Host/MC",
      "Basic Lighting Effects",
      "Setup & Teardown",
    ]
  },
  {
    name: "Party Package",
    price: "R2800",
    duration: "6 hours",
    features: [
      "6x Wireless Microphones",
      "Multiple HD Displays",
      "Premium Sound System",
      "Full Song Library",
      "Professional Host/MC",
      "Full Lighting Production",
      "Backup Equipment",
      "Setup & Teardown",
    ]
  }
]

export default function KaraokePage() {
  return (
    <div className="container py-12 space-y-16">
      {/* Hero Section */}
      <section className="relative h-[500px] rounded-3xl overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=1000"
          alt="Karaoke Setup"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/50 flex items-center">
          <div className="container">
            <motion.div
              className="max-w-2xl space-y-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold gradient-text">Karaoke Experience</h1>
              <p className="text-xl text-muted-foreground">
                Create unforgettable memories with our professional karaoke setup.
                Perfect for parties, corporate events, and social gatherings.
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="button-glow" asChild>
                  <Link href="/contact">Book Now</Link>
                </Button>
                <Button size="lg" variant="outline">
                  View Song List
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full card-hover">
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* Song Categories */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Extensive Song Library</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our comprehensive song collection features hits from every genre and era.
            Regular updates ensure you always have access to the latest releases.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {songCategories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
            >
              <Card className="h-full card-hover">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                  <p className="text-muted-foreground mb-4">{category.description}</p>
                  <ul className="space-y-2">
                    {category.examples.map((song) => (
                      <li key={song} className="flex items-center gap-2 text-sm">
                        <Star className="h-3 w-3 text-primary" />
                        {song}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Packages Section */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Choose Your Package</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select the perfect package for your event. All packages include professional
            equipment and support throughout your event.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 1 }}
            >
              <Card className="h-full card-hover gradient-border">
                <CardContent className="pt-6">
                  <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-4xl font-bold">{pkg.price}</span>
                    <span className="text-muted-foreground">/ {pkg.duration}</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Star className="h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full button-glow" asChild>
                    <Link href="/contact">Book This Package</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        className="text-center space-y-6 py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.5 }}
      >
        <h2 className="text-3xl font-bold">Ready to Start the Party?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Book your karaoke experience today and create lasting memories with friends and family.
          We'll handle all the technical details while you focus on having fun!
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" className="button-glow" asChild>
            <Link href="/contact">Book Now</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="tel:0815436748">Call Us</Link>
          </Button>
        </div>
      </motion.section>
    </div>
  )
} 