import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Quote } from 'lucide-react'

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative h-[600px]">
          <Image
            src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070"
            alt="DJ mixing at a party"
            fill
            className="object-cover"
            priority
          />
          <div className="container relative flex h-full flex-col items-center justify-center text-center text-white">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Professional Audio Solutions
            </h1>
            <p className="mt-4 max-w-[700px] text-lg text-white/90 sm:text-xl">
              Experience crystal-clear sound and unforgettable moments with our
              premium audio equipment and expert services.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/services">Our Services</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-[800px] text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Why Choose Soundmaster?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We deliver exceptional audio experiences with top-quality equipment
              and professional expertise.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg border bg-card p-8 text-card-foreground shadow-sm"
              >
                <feature.icon className="h-10 w-10 text-primary" />
                <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
                <p className="mt-2 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="bg-muted py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-[800px] text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Our Services
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From intimate gatherings to large-scale events, we have the perfect
              audio solution for you.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.title}
                className="group relative h-[400px] overflow-hidden rounded-lg"
              >
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/0 p-8 flex flex-col justify-end text-white">
                  <h3 className="text-2xl font-semibold">{service.title}</h3>
                  <p className="mt-2 text-white/90">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button size="lg" asChild>
              <Link href="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted">
        <div className="container">
          <div className="mx-auto max-w-[800px] text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              What Our Clients Say
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Don't just take our word for it - hear from some of our satisfied clients
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-lg border bg-background p-8 transition-all hover:shadow-lg"
              >
                <Quote className="absolute right-4 top-4 h-12 w-12 text-muted-foreground/20" />
                <div className="relative">
                  <p className="text-muted-foreground">{testimonial.content}</p>
                  <div className="mt-6 flex items-center gap-4">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.title}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative h-[400px]">
          <Image
            src="https://images.unsplash.com/photo-1516223725307-6f76b9ec8742?q=80&w=2074"
            alt="Concert crowd"
            fill
            className="object-cover"
            priority
          />
          <div className="container relative flex h-full flex-col items-center justify-center text-center text-white">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready to Experience Premium Sound?
            </h2>
            <p className="mt-4 max-w-[600px] text-lg text-white/90">
              Let's create unforgettable moments together. Contact us today to
              discuss your event needs.
            </p>
            <Button size="lg" className="mt-8" asChild>
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}

const features = [
  {
    title: 'Premium Equipment',
    description:
      'State-of-the-art sound systems and equipment to deliver exceptional audio quality.',
    icon: function SpeakerIcon(props: React.ComponentProps<'svg'>) {
      return (
        <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
          <circle cx="12" cy="14" r="4" />
          <line x1="12" y1="6" x2="12.01" y2="6" />
        </svg>
      )
    },
  },
  {
    title: 'Expert Team',
    description:
      'Professional sound engineers and technicians with years of experience.',
    icon: function TeamIcon(props: React.ComponentProps<'svg'>) {
      return (
        <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
  },
  {
    title: 'Tailored Solutions',
    description:
      'Customized audio setups designed to match your specific event requirements.',
    icon: function SettingsIcon(props: React.ComponentProps<'svg'>) {
      return (
        <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )
    },
  },
]

const services = [
  {
    title: 'Event Sound Systems',
    description: 'Complete audio solutions for events of any size.',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070',
  },
  {
    title: 'Live Music Production',
    description: 'Professional sound for live performances and concerts.',
    image: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?q=80&w=2070',
  },
  {
    title: 'DJ Equipment Rental',
    description: 'Top-quality DJ gear for your party or event.',
    image: 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?q=80&w=2070',
  },
]

const testimonials = [
  {
    content:
      "Soundmaster transformed our wedding reception into an unforgettable celebration. The sound quality was impeccable, and their team's professionalism was outstanding.",
    name: "Sarah Johnson",
    title: "Wedding Client",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop",
  },
  {
    content:
      "As a venue owner, I've worked with many sound companies, but Soundmaster stands out. Their attention to detail and reliability make them our go-to choice for events.",
    name: "Michael Chen",
    title: "Venue Owner",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1770&auto=format&fit=crop",
  },
  {
    content:
      "The team at Soundmaster went above and beyond for our corporate event. Their expertise and state-of-the-art equipment delivered an exceptional experience.",
    name: "Emily Rodriguez",
    title: "Event Coordinator",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop",
  },
]

