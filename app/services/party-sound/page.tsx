"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Music, Check, Volume2, Lightbulb, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"

const features = [
  {
    icon: <Music className="h-6 w-6" />,
    title: "Customized Playlists",
    description: "Tailored music selection to match your event's theme and audience preferences."
  },
  {
    icon: <Volume2 className="h-6 w-6" />,
    title: "Premium Sound System",
    description: "High-quality speakers and audio equipment for crystal clear sound."
  },
  {
    icon: <Lightbulb className="h-6 w-6" />,
    title: "Lighting Effects",
    description: "Professional lighting setup to enhance the party atmosphere."
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Flexible Duration",
    description: "Available for events of any duration, from a few hours to all-night parties."
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Experienced Team",
    description: "Professional sound technicians and optional DJ services."
  }
]

const packages = [
  {
    name: "Basic Package",
    price: "R1500",
    duration: "4 hours",
    features: [
      "2x 15\" Powered Speakers",
      "1x Wireless Microphone",
      "Basic Lighting Setup",
      "Standard Music Library",
      "Setup & Teardown",
    ]
  },
  {
    name: "Premium Package",
    price: "R2500",
    duration: "6 hours",
    features: [
      "4x 15\" Powered Speakers",
      "2x Subwoofers",
      "2x Wireless Microphones",
      "Advanced Lighting System",
      "Premium Music Library",
      "Professional DJ",
      "Setup & Teardown",
    ]
  },
  {
    name: "Ultimate Package",
    price: "R3500",
    duration: "8 hours",
    features: [
      "6x 15\" Powered Speakers",
      "4x Subwoofers",
      "4x Wireless Microphones",
      "Full Lighting Production",
      "Premium Music Library",
      "Professional DJ",
      "Backup Equipment",
      "Setup & Teardown",
    ]
  }
]

const gallery = [
  {
    src: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7",
    alt: "Party event setup with professional lighting",
    priority: true,
    sizes: "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
  },
  {
    src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
    alt: "DJ performing at a live event",
    sizes: "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
  },
  {
    src: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec",
    alt: "Concert crowd enjoying music",
    sizes: "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
  },
  {
    src: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745",
    alt: "Professional sound equipment setup",
    sizes: "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
  },
  {
    src: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678",
    alt: "Concert lighting effects",
    sizes: "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
  },
  {
    src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622",
    alt: "Live music performance",
    sizes: "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
  }
]

export default function PartySoundPage() {
  return (
    <div className="container py-12 space-y-16">
      {/* Hero Section */}
      <section className="relative h-[500px] rounded-3xl overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3"
          alt="DJ mixing at a party"
          priority
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1536px) 95vw, 1536px"
          className="object-cover"
          showLoadingState
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/50 flex items-center">
          <div className="container">
            <motion.div
              className="max-w-2xl space-y-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold gradient-text">Party Sound Solutions</h1>
              <p className="text-xl text-muted-foreground">
                Transform your event with our professional sound systems and expert audio services.
                Perfect for parties, corporate events, and celebrations of any size.
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="button-glow" asChild>
                  <Link href="/contact">Book Now</Link>
                </Button>
                <Button size="lg" variant="outline">
                  View Packages
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
            className="flex flex-col items-center text-center p-6 rounded-xl bg-card"
          >
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </motion.div>
        ))}
      </section>

      {/* Packages Section */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-center">Our Packages</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
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
                        <Check className="h-4 w-4 text-primary" />
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

      {/* Gallery Section */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-center">Event Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {gallery.map((image, index) => (
            <motion.div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 1 }}
            >
              <ImageWithFallback
                src={image.src}
                alt={image.alt}
                fill
                sizes={image.sizes}
                className="object-cover hover:scale-105 transition-transform duration-300"
                showLoadingState
                priority={image.priority}
                enableZoom
              />
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
        <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Contact us today to discuss your event requirements and get a personalized quote.
          We're here to make your event unforgettable!
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