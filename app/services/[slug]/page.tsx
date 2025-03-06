import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowLeft, Music, Mic, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// This would typically come from a CMS or database
const services = {
  "party-sound": {
    title: "Party Sound",
    description:
      "Professional sound solutions for parties and events of all sizes",
    icon: Music,
    fullDescription: `
      Our Party Sound service provides everything you need to create the perfect atmosphere for your event. 
      From intimate gatherings to large-scale parties, we have the equipment and expertise to make your event unforgettable.
    `,
    features: [
      "High-quality sound systems",
      "Customized playlists",
      "Professional DJ services",
      "Lighting equipment",
      "Setup and teardown included",
      "Backup equipment",
      "Technical support throughout the event",
      "Sound level monitoring",
    ],
    pricing: [
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
    ],
    gallery: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
  },
  karaoke: {
    title: "Karaoke Sound",
    description: "Complete karaoke setup for interactive entertainment",
    icon: Mic,
    fullDescription: `
      Our Karaoke Sound service brings the fun of professional karaoke to your event. 
      With an extensive song library and high-quality equipment, we ensure everyone can be a star for the night.
    `,
    features: [
      "Extensive song library",
      "Multiple wireless microphones",
      "HD lyric display",
      "Professional sound mixing",
      "Host/MC available",
      "Song request system",
      "Voice effects",
      "Recording options",
    ],
    pricing: [
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
        ],
      },
    ],
    gallery: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
  },
  wedding: {
    title: "Wedding Sound",
    description: "Elegant audio solutions for your special day",
    icon: Heart,
    fullDescription: `
      Make your wedding day perfect with our professional Wedding Sound service.
      We provide elegant and reliable audio solutions for both your ceremony and reception.
    `,
    features: [
      "Ceremony & reception coverage",
      "Wireless microphones for speeches",
      "Customized music selection",
      "Backup equipment",
      "Early setup and sound check",
      "Professional sound engineer",
      "Multiple speaker setup",
      "Ambient lighting options",
    ],
    pricing: [
      {
        name: "Ceremony Package",
        price: "R2000",
        features: [
          "Up to 2 hours",
          "2 wireless microphones",
          "Ceremony music",
          "Professional setup",
        ],
      },
      {
        name: "Reception Package",
        price: "R3000",
        features: [
          "Up to 6 hours",
          "4 wireless microphones",
          "DJ services",
          "Dance floor lighting",
        ],
      },
      {
        name: "Complete Package",
        price: "R4500",
        features: [
          "Full day coverage",
          "All equipment included",
          "DJ services",
          "Lighting package",
          "Coordination with vendors",
        ],
      },
    ],
    gallery: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
  },
};

export default async function ServicePage({
  params,
}: {
  params: { slug: string };
}) {
  const service = services[params.slug as keyof typeof services];

  if (!service) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Service not found</h1>
        <Button asChild>
          <Link href="/services">Back to Services</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-12 space-y-16">
      <Button variant="ghost" className="mb-8" asChild>
        <Link href="/services" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Services
        </Link>
      </Button>

      <div className="grid gap-12">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-primary/10 p-2">
              <service.icon className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-4xl font-bold">{service.title}</h1>
            <p className="text-xl text-muted-foreground">
              {service.description}
            </p>
            <div className="space-y-2">
              {service.features.slice(0, 4).map((feature) => (
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
              src="/placeholder.svg?height=400&width=600"
              alt={service.title}
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {service.pricing.map((package_, index) => (
            <Card key={index}>
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

        <div>
          <h2 className="text-2xl font-bold mb-6">Gallery</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {service.gallery.map((image, index) => (
              <div
                key={index}
                className="relative aspect-video rounded-lg overflow-hidden"
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${service.title} Gallery Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
