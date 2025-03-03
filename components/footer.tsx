"use client"

import Link from "next/link"
import { Icons } from "@/components/icons"

export function Footer() {
  return (
    <div>
      <footer className="border-t bg-background">
        <div className="container py-8 md:py-12">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8">
              <div className="flex items-center space-x-2">
                <Icons.logo className="h-6 w-6" />
                <span className="font-bold">Soundmaster</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Professional sound and audio equipment rental in Tzaneen, Limpopo.
                Perfect for parties, weddings, and events.
              </p>
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
                    <li className="text-sm text-muted-foreground">
                      081 543 6748
                    </li>
                    <li className="text-sm text-muted-foreground">
                      [email protected]
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t pt-8">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Soundmaster. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

