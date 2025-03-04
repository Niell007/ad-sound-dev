"use client"

import Link from "next/link"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react"

const socialLinks = [
  { name: 'Facebook', href: 'https://facebook.com/soundmasterza', icon: Facebook },
  { name: 'Instagram', href: 'https://instagram.com/soundmaster.za', icon: Instagram },
  { name: 'Twitter', href: 'https://twitter.com/soundmasterza', icon: Twitter },
  { name: 'YouTube', href: 'https://youtube.com/@soundmasterza', icon: Youtube },
]

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <div className="flex items-center space-x-2">
              <Icons.logo className="h-7 w-7 text-primary" />
              <span className="font-bold text-lg bg-gradient-to-r from-primary/90 via-primary to-primary/90 bg-clip-text text-transparent tracking-tight">
                Soundmaster
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Professional sound and audio equipment rental in Tzaneen, Limpopo.
              Perfect for parties, weddings, and events.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Button
                  key={social.name}
                  variant="ghost"
                  size="icon"
                  className="hover:text-primary"
                  asChild
                >
                  <Link href={social.href} target="_blank" rel="noopener noreferrer">
                    <social.icon className="h-5 w-5" />
                    <span className="sr-only">{social.name}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold">Services</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/services/party-sound" className="text-sm text-muted-foreground hover:text-foreground">
                      Party Sound
                    </Link>
                  </li>
                  <li>
                    <Link href="/services/wedding-sound" className="text-sm text-muted-foreground hover:text-foreground">
                      Wedding Sound
                    </Link>
                  </li>
                  <li>
                    <Link href="/services/karaoke" className="text-sm text-muted-foreground hover:text-foreground">
                      Karaoke Night
                    </Link>
                  </li>
                  <li>
                    <Link href="/services/corporate" className="text-sm text-muted-foreground hover:text-foreground">
                      Corporate Events
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold">Company</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="/live-radio" className="text-sm text-muted-foreground hover:text-foreground">
                      Live Radio
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold">Legal</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold">Contact</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link 
                      href="tel:0815436748" 
                      className="flex items-center text-sm text-muted-foreground hover:text-foreground"
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      081 543 6748
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="mailto:contact@soundmaster.co.za" 
                      className="flex items-center text-sm text-muted-foreground hover:text-foreground"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      contact@soundmaster.co.za
                    </Link>
                  </li>
                  <li>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-2 h-4 w-4" />
                      Tzaneen, Limpopo
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Soundmaster. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Designed with ❤️ in South Africa
          </p>
        </div>
      </div>
    </footer>
  )
}

