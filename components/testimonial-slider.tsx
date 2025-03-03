"use client"

import React from "react"
import Image from "next/image"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface Testimonial {
  id: number
  name: string
  role: string
  company: string
  content: string
  rating: number
  image: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Event Planner",
    company: "Creative Events Co.",
    content: "The audio quality and professionalism of the team exceeded our expectations. They made our corporate event truly memorable with their perfect sound setup.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Wedding Coordinator",
    company: "Perfect Day Weddings",
    content: "I've worked with many audio companies, but none compare to the level of service and attention to detail provided here. They're my go-to for all wedding events.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Festival Director",
    company: "SoundWave Festival",
    content: "Their team's expertise in handling large-scale events is unmatched. The sound quality was pristine throughout our three-day music festival.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&h=150&auto=format&fit=crop"
  }
]

export function TestimonialSlider() {
  return (
    <div className="w-full py-12 bg-background">
      <div className="container">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="h-full p-6 space-y-4 bg-card rounded-xl border">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-12 h-12 overflow-hidden rounded-full">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role} at {testimonial.company}
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                  <blockquote className="text-muted-foreground">
                    "{testimonial.content}"
                  </blockquote>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-end gap-2 py-4">
            <CarouselPrevious className="static translate-x-0 translate-y-0" />
            <CarouselNext className="static translate-x-0 translate-y-0" />
          </div>
        </Carousel>
      </div>
    </div>
  )
}

