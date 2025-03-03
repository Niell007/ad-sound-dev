"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Phone, Mail, MapPin, Clock, Calendar, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useToast } from "@/components/ui/custom-toast-provider"
import { Label } from "@/components/ui/label"
import { CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const contactInfo = [
  {
    icon: <Phone className="h-6 w-6" />,
    title: "Phone",
    value: "081 543 6748",
    link: "tel:0815436748"
  },
  {
    icon: <Mail className="h-6 w-6" />,
    title: "Email",
    value: "soundmaster@gmail.com",
    link: "mailto:soundmaster@gmail.com"
  },
  {
    icon: <MapPin className="h-6 w-6" />,
    title: "Location",
    value: "Tzaneen, Limpopo",
    link: "https://maps.google.com/?q=Tzaneen,Limpopo"
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Business Hours",
    value: "Mon-Sun: 8am - 8pm",
  }
]

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  eventType: z.string().min(1, "Please select an event type"),
  eventDate: z.string().min(1, "Please select an event date"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  guestCount: z.string().min(1, "Please enter expected guest count"),
  message: z.string().optional(),
})

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      eventType: "",
      eventDate: "",
      location: "",
      guestCount: "",
      message: "",
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name || !email || !message) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields.",
        variant: "destructive"
      })
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast({
        title: "Message Sent!",
        description: "We'll get back to you as soon as possible.",
      })
      
      // Reset form
      setName("")
      setEmail("")
      setMessage("")
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-12 space-y-16">
      {/* Hero Section */}
      <section className="relative h-[400px] rounded-3xl overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1000"
          alt="Contact Us"
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
              <h1 className="text-4xl font-bold gradient-text">Get in Touch</h1>
              <p className="text-xl text-muted-foreground">
                Ready to make your event unforgettable? Contact us today to discuss your
                requirements and get a personalized quote.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Info Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {contactInfo.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full card-hover">
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                {item.link ? (
                  <a
                    href={item.link}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-muted-foreground">{item.value}</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* Booking Form */}
      <section className="grid md:grid-cols-2 gap-12">
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold">Book Your Event</h2>
          <p className="text-muted-foreground">
            Fill out the form below and we'll get back to you within 24 hours with
            a customized quote for your event.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Calendar className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-semibold">Fast Response</h3>
                <p className="text-sm text-muted-foreground">
                  We respond to all inquiries within 24 hours
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Music className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-semibold">Professional Service</h3>
                <p className="text-sm text-muted-foreground">
                  Experienced team with top-quality equipment
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Your email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="Your phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="eventType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select event type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="party">Party</SelectItem>
                              <SelectItem value="wedding">Wedding</SelectItem>
                              <SelectItem value="karaoke">Karaoke</SelectItem>
                              <SelectItem value="corporate">Corporate Event</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="eventDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="guestCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expected Guests</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Number of guests" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Event venue or address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Details</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us more about your event..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full button-glow"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Submit Booking Request"}
                  </Button>

                  {isSuccess && (
                    <p className="text-center text-green-500">
                      Thank you for your booking request! We'll be in touch soon.
                    </p>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  )
}

