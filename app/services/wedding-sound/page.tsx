"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, Music, Mic2, Clock, Users, Star, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const features = [
  {
    icon: <Music className="h-6 w-6" />,
    title: "Ceremony Music",
    description: "Professional sound setup for your wedding ceremony, including processional and recessional music."
  },
  {
    icon: <Mic2 className="h-6 w-6" />,
    title: "Reception Entertainment",
    description: "High-quality sound system for speeches, background music, and dancing."
  },
  {
    icon: <Bell className="h-6 w-6" />,
    title: "Custom Playlists",
    description: "Personalized music selection for every moment of your special day."
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Full Day Coverage",
    description: "Seamless audio coverage from ceremony to reception and everything in between."
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Professional Team",
    description: "Experienced sound technicians to ensure everything runs smoothly."
  }
]

const packages = [
  {
    name: "Ceremony Package",
    price: "R2500",
    description: "Perfect for intimate ceremonies",
    features: [
      "2x Professional Speakers",
      "2x Wireless Microphones",
      "Ceremony Music Playlist",
      "Sound Technician",
      "Early Setup & Sound Check",
      "Backup Equipment",
    ]
  },
  {
    name: "Reception Package",
    price: "R3500",
    description: "Ideal for wedding receptions",
    features: [
      "4x Professional Speakers",
      "2x Subwoofers",
      "4x Wireless Microphones",
      "DJ Services (4 hours)",
      "Dance Floor Lighting",
      "Custom Music Selection",
      "Sound Technician",
      "Setup & Teardown",
    ]
  },
  {
    name: "Complete Wedding Package",
    price: "R5500",
    description: "Full coverage for your special day",
    features: [
      "Complete Ceremony Setup",
      "Full Reception System",
      "6x Professional Speakers",
      "4x Subwoofers",
      "6x Wireless Microphones",
      "DJ Services (6 hours)",
      "Premium Lighting Package",
      "Custom Music Planning",
      "2x Sound Technicians",
      "Backup Equipment",
      "Early Setup & Sound Check",
    ]
  }
]

const timeline = [
  {
    time: "Pre-Ceremony",
    description: "Ambient music as guests arrive and are seated",
    examples: ["Canon in D - Pachelbel", "Air on G String - Bach"]
  },
  {
    time: "Ceremony",
    description: "Traditional or modern processional and ceremony music",
    examples: ["Wedding March - Mendelssohn", "A Thousand Years - Christina Perri"]
  },
  {
    time: "Post-Ceremony",
    description: "Uplifting recessional music and photo session background",
    examples: ["All You Need Is Love - The Beatles", "Signed, Sealed, Delivered - Stevie Wonder"]
  },
  {
    time: "Reception Entrance",
    description: "High-energy introduction of the wedding party",
    examples: ["Can't Stop the Feeling - Justin Timberlake", "Celebration - Kool & The Gang"]
  },
  {
    time: "Dinner",
    description: "Soft background music during dining",
    examples: ["Jazz Standards", "Contemporary Acoustic Covers"]
  },
  {
    time: "Dancing",
    description: "Mix of classics and current hits to keep the dance floor full",
    examples: ["Mix of Top 40, Classic Rock, and Guest Requests"]
  }
]

export default function WeddingSoundPage() {
  return (
    <div className="container py-12 space-y-16">
      {/* Hero Section */}
      <section className="relative h-[500px] rounded-3xl overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1000"
          alt="Wedding Ceremony"
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
              <h1 className="text-4xl font-bold gradient-text">Wedding Sound Solutions</h1>
              <p className="text-xl text-muted-foreground">
                Professional audio services for your perfect day. From intimate ceremonies
                to grand receptions, we ensure every moment sounds beautiful.
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="button-glow" asChild>
                  <Link href="/contact">Book Consultation</Link>
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

      {/* Packages Section */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Wedding Packages</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose from our carefully curated packages or let us create a custom solution
            for your special day.
          </p>
        </div>
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
                  <p className="text-muted-foreground mb-4">{pkg.description}</p>
                  <div className="text-4xl font-bold mb-6">{pkg.price}</div>
                  <ul className="space-y-2 mb-6">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Heart className="h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full button-glow" asChild>
                    <Link href="/contact">Book Consultation</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Wedding Day Timeline</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We coordinate every musical moment of your special day, ensuring a perfect
            flow from start to finish.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {timeline.map((item, index) => (
            <motion.div
              key={item.time}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 1 }}
            >
              <Card className="h-full card-hover">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2">{item.time}</h3>
                  <p className="text-muted-foreground mb-4">{item.description}</p>
                  <div className="space-y-2">
                    {item.examples.map((example) => (
                      <p key={example} className="text-sm flex items-center gap-2">
                        <Star className="h-3 w-3 text-primary" />
                        {example}
                      </p>
                    ))}
                  </div>
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
        <h2 className="text-3xl font-bold">Let's Plan Your Perfect Day</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Schedule a consultation to discuss your wedding vision and how we can help
          create the perfect soundtrack for your special day.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" className="button-glow" asChild>
            <Link href="/contact">Book Consultation</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="tel:0815436748">Call Us</Link>
          </Button>
        </div>
      </motion.section>
    </div>
  )
} 