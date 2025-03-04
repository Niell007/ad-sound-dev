"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Music, Users, Calendar, Star, Award, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const stats = [
  {
    value: "2022",
    label: "Founded",
    icon: Calendar,
  },
  {
    value: "500+",
    label: "Events Completed",
    icon: Music,
  },
  {
    value: "1000+",
    label: "Happy Clients",
    icon: Users,
  },
  {
    value: "4.9",
    label: "Average Rating",
    icon: Star,
  },
]

const values = [
  {
    title: "Quality Equipment",
    description: "We invest in top-tier audio equipment to deliver exceptional sound quality at every event.",
    icon: Award,
  },
  {
    title: "Professional Service",
    description: "Our experienced team ensures smooth execution and professional conduct throughout your event.",
    icon: Users,
  },
  {
    title: "Client Satisfaction",
    description: "We go above and beyond to exceed client expectations and create memorable experiences.",
    icon: Heart,
  },
]

const team = [
  {
    name: "John Smith",
    role: "Founder & Sound Engineer",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
    bio: "With over 15 years of experience in sound engineering, John founded Soundmaster to bring professional audio solutions to Tzaneen.",
  },
  {
    name: "Sarah Johnson",
    role: "Event Coordinator",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
    bio: "Sarah ensures every event runs smoothly, from initial consultation to final execution.",
  },
  {
    name: "Michael Ndlovu",
    role: "Technical Director",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    bio: "Michael oversees our equipment maintenance and setup, ensuring optimal performance at every event.",
  },
]

export default function AboutPage() {
  return (
    <div className="container py-12 space-y-16">
      {/* Hero Section */}
      <section className="relative h-[500px] rounded-3xl overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=2000"
          alt="Sound Equipment"
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
              <h1 className="text-4xl font-bold gradient-text">About Soundmaster</h1>
              <p className="text-xl text-muted-foreground">
                Bringing professional sound solutions to Tzaneen and the greater Limpopo area since 2022.
                Making your events unforgettable with premium audio experiences.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <motion.section
        className="grid grid-cols-2 md:grid-cols-4 gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {stats.map((stat, index) => (
          <Card key={stat.label} className="text-center glass card-hover">
            <CardContent className="pt-6">
              <stat.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-3xl font-bold gradient-text">{stat.value}</div>
              <p className="text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </motion.section>

      {/* Mission Section */}
      <motion.section
        className="space-y-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl font-bold">Our Mission</h2>
          <p className="text-muted-foreground">
            To provide exceptional audio experiences that elevate events and create lasting memories.
            We strive to deliver professional service, cutting-edge equipment, and unmatched expertise
            to every client we serve.
          </p>
        </div>
      </motion.section>

      {/* Values Section */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-center">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 * (index + 3) }}
            >
              <Card className="h-full card-hover">
                <CardContent className="pt-6">
                  <div className="rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 mb-4">
                    <value.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-center">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 * (index + 6) }}
            >
              <Card className="h-full card-hover overflow-hidden">
                <div className="relative h-64">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </div>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-primary mb-2">{member.role}</p>
                  <p className="text-muted-foreground">{member.bio}</p>
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
        transition={{ duration: 0.5, delay: 1.4 }}
      >
        <h2 className="text-3xl font-bold">Ready to Work With Us?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Let's create an unforgettable event together. Contact us to discuss your requirements
          and get a personalized quote.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" className="button-glow" asChild>
            <Link href="/contact">Get in Touch</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/services">View Services</Link>
          </Button>
        </div>
      </motion.section>
    </div>
  )
}

