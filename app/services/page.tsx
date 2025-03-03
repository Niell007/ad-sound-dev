"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Music, Mic2, Heart, Users, Calendar, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const services = [
  {
    title: "Party Sound",
    description: "Professional sound systems and customized playlists for any party or event.",
    icon: <Music className="h-6 w-6" />,
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1000",
    features: [
      "Customized playlists",
      "High-quality sound systems",
      "Professional DJ services",
      "Lighting effects",
    ],
    price: "From R1500",
    link: "/services/party-sound"
  },
  {
    title: "Karaoke Sound",
    description: "Complete karaoke setup with an extensive library of songs.",
    icon: <Mic2 className="h-6 w-6" />,
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=1000",
    features: [
      "Extensive song library",
      "Wireless microphones",
      "HD displays",
      "Professional hosting",
    ],
    price: "From R1200",
    link: "/services/karaoke"
  },
  {
    title: "Wedding Sound",
    description: "Elegant audio solutions for your special day.",
    icon: <Heart className="h-6 w-6" />,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1000",
    features: [
      "Ceremony & reception music",
      "Wireless microphones",
      "Custom playlists",
      "Professional coordination",
    ],
    price: "From R2500",
    link: "/services/wedding-sound"
  }
]

const stats = [
  { value: "500+", label: "Events Completed", icon: <Calendar className="h-4 w-4" /> },
  { value: "1000+", label: "Happy Clients", icon: <Users className="h-4 w-4" /> },
  { value: "4.9", label: "Average Rating", icon: <Star className="h-4 w-4" /> },
]

export default function ServicesPage() {
  return (
    <div className="container py-12 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <motion.h1 
          className="text-4xl font-bold gradient-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Professional Sound Services in Tzaneen
        </motion.h1>
        <motion.p 
          className="text-muted-foreground max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Elevate your events with premium audio solutions. Serving Tzaneen and the greater Limpopo area with top-quality sound equipment and professional service.
        </motion.p>
      </section>

      {/* Stats Section */}
      <motion.section 
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {stats.map((stat, index) => (
          <Card key={index} className="text-center glass card-hover">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-2">{stat.icon}</div>
              <h3 className="text-3xl font-bold gradient-text">{stat.value}</h3>
              <p className="text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </motion.section>

      {/* Services Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 * (index + 3) }}
          >
            <Card className="h-full card-hover gradient-border overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover image-zoom"
                />
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  {service.icon}
                  <CardTitle>{service.title}</CardTitle>
                </div>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <span className="font-semibold">{service.price}</span>
                <Button asChild className="button-glow">
                  <Link href={service.link}>Learn More</Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* CTA Section */}
      <motion.section 
        className="text-center space-y-6 py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      >
        <h2 className="text-3xl font-bold">Ready to Make Your Event Unforgettable?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Contact us today to discuss your event requirements and get a personalized quote.
        </p>
        <Button size="lg" className="button-glow" asChild>
          <Link href="/contact">Get in Touch</Link>
        </Button>
      </motion.section>
    </div>
  )
}

