"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Music, Utensils, Camera, Calendar, Award, Check, ArrowLeft, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const features = [
  {
    icon: <Users className="h-6 w-6" />,
    title: "Team Building",
    description: "Interactive activities to strengthen team bonds"
  },
  {
    icon: <Trophy className="h-6 w-6" />,
    title: "Award Ceremonies",
    description: "Elegant recognition events for your achievers"
  },
  {
    icon: <Music className="h-6 w-6" />,
    title: "Entertainment",
    description: "Professional performers and live music"
  },
  {
    icon: <Calendar className="h-6 w-6" />,
    title: "Full Planning",
    description: "End-to-end event management services"
  }
];

const eventTypes = [
  {
    title: "Conferences",
    items: [
      "Keynote presentations",
      "Breakout sessions",
      "Panel discussions",
      "Networking events",
    ]
  },
  {
    title: "Team Events",
    items: [
      "Team building workshops",
      "Holiday parties",
      "Company celebrations",
      "Outdoor activities",
    ]
  },
  {
    title: "Ceremonies",
    items: [
      "Award ceremonies",
      "Recognition events",
      "Product launches",
      "Milestone celebrations",
    ]
  }
];

const packages = [
  {
    name: "Essential Package",
    price: "R3,000",
    features: [
      "Up to 50 guests",
      "Basic sound system",
      "2 wireless microphones",
      "4-hour event duration",
      "1 event coordinator",
      "Basic lighting setup",
      "Standard photography",
    ],
  },
  {
    name: "Professional Package",
    price: "R5,000",
    features: [
      "Up to 100 guests",
      "Premium sound system",
      "4 wireless microphones",
      "6-hour event duration",
      "2 event coordinators",
      "Professional lighting",
      "Photo & video coverage",
      "DJ services",
      "Catering options",
    ],
  },
  {
    name: "Enterprise Package",
    price: "R8,000",
    features: [
      "Up to 200 guests",
      "Premium sound & AV system",
      "Multiple microphone options",
      "Full day coverage",
      "Full event team",
      "Custom lighting design",
      "Complete media coverage",
      "Entertainment options",
      "Full catering service",
      "VIP experience",
    ],
  },
];

const services = [
  {
    title: "Audio Visual",
    items: [
      "Professional sound systems",
      "High-definition projectors",
      "LED screens",
      "Stage lighting",
      "Live streaming setup",
      "Recording services",
    ]
  },
  {
    title: "Event Management",
    items: [
      "Venue selection",
      "Schedule planning",
      "Vendor coordination",
      "On-site management",
      "Guest registration",
      "Post-event reporting",
    ]
  },
  {
    title: "Additional Services",
    items: [
      "Corporate branding",
      "Photography/Videography",
      "Catering services",
      "Entertainment booking",
      "Transportation",
      "Accommodation",
    ]
  }
];

const gallery = [
  "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069",
  "https://images.unsplash.com/photo-1505236858219-8359eb29e329?q=80&w=2069",
  "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=2070",
];

export default function CorporateEventsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full">
        <Image
          src="https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069"
          alt="Corporate Event"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">
            Corporate Events
          </h1>
          <p className="text-lg md:text-xl text-center max-w-2xl mx-4">
            Professional event solutions for businesses of all sizes
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8"
          >
            <Link href="/contact">Plan Your Event</Link>
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

          {/* Services Tabs */}
          <div>
            <h2 className="text-3xl font-bold text-center mb-8">Comprehensive Event Services</h2>
            <Tabs defaultValue="audio-visual" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                {services.map((service) => (
                  <TabsTrigger key={service.title} value={service.title.toLowerCase().replace(" ", "-")}>
                    {service.title}
                  </TabsTrigger>
                ))}
              </TabsList>
              {services.map((service) => (
                <TabsContent key={service.title} value={service.title.toLowerCase().replace(" ", "-")}>
                  <Card>
                    <CardHeader>
                      <CardTitle>{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                      {service.items.map((item) => (
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

          {/* Event Types */}
          <div>
            <h2 className="text-3xl font-bold text-center mb-8">Event Types</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {eventTypes.map((type) => (
                <Card key={type.title}>
                  <CardHeader>
                    <CardTitle>{type.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {type.items.map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Pricing Packages */}
          <div>
            <h2 className="text-3xl font-bold text-center mb-8">Event Packages</h2>
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
                    alt={`Corporate Event Gallery Image ${index + 1}`}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <section className="bg-primary text-primary-foreground rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Plan Your Corporate Event?</h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Let our team of experts help you create an impactful and memorable corporate experience
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-primary hover:bg-white/90"
                asChild
              >
                <Link href="/contact">Request Proposal</Link>
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
  );
} 