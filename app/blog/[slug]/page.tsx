"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, Clock, User, ChevronLeft, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { NewsletterForm } from "@/components/newsletter-form"
import { formatDate } from "@/lib/utils"

// This would typically come from a CMS or database
const posts = {
  "essential-sound-equipment-outdoor-events": {
    title: "Essential Sound Equipment for Outdoor Events",
    excerpt: "Learn about the key audio equipment needed to deliver exceptional sound quality at outdoor venues.",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80&w=1000",
    category: "Equipment Guide",
    author: "John Smith",
    date: "2023-10-15",
    readTime: "5 min read",
    content: `
      <h2>Introduction</h2>
      <p>Outdoor events present unique challenges when it comes to sound setup. Weather conditions, ambient noise, and large open spaces can all affect sound quality. In this guide, we'll explore the essential equipment needed to deliver exceptional audio experiences at outdoor venues.</p>

      <h2>Core Sound System Components</h2>
      <h3>1. Speakers</h3>
      <p>For outdoor events, you'll need powerful, weather-resistant speakers. We recommend:</p>
      <ul>
        <li>Main PA Speakers (minimum 1000W each)</li>
        <li>Subwoofers for low-frequency coverage</li>
        <li>Monitor speakers for performers</li>
      </ul>

      <h3>2. Amplification</h3>
      <p>Professional power amplifiers are crucial for outdoor sound systems. They need to provide:</p>
      <ul>
        <li>Clean, undistorted power</li>
        <li>Headroom for dynamic range</li>
        <li>Protection against overheating</li>
      </ul>

      <h2>Additional Equipment</h2>
      <p>Beyond the basics, consider these important components:</p>
      <ul>
        <li>Digital mixing console</li>
        <li>Signal processors</li>
        <li>Wireless microphone systems</li>
        <li>Backup power supplies</li>
      </ul>

      <h2>Weather Protection</h2>
      <p>Always be prepared for weather changes:</p>
      <ul>
        <li>Waterproof covers for equipment</li>
        <li>Elevated platforms for ground protection</li>
        <li>Proper grounding for electrical safety</li>
      </ul>

      <h2>Setup Considerations</h2>
      <p>Proper setup is crucial for outdoor sound:</p>
      <ul>
        <li>Speaker placement and angles</li>
        <li>Cable management and protection</li>
        <li>Sound check in various locations</li>
      </ul>

      <h2>Conclusion</h2>
      <p>Success in outdoor event sound requires the right equipment and proper preparation. With these essentials in place, you can deliver exceptional audio experiences regardless of the venue or conditions.</p>
    `,
    relatedPosts: [
      {
        title: "Understanding Sound System Components",
        excerpt: "A comprehensive guide to the essential components that make up a professional sound system.",
        image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&q=80&w=1000",
        slug: "understanding-sound-system-components",
      },
      {
        title: "The Evolution of Professional Audio",
        excerpt: "Exploring how professional audio equipment has evolved over the years and what the future holds.",
        image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1000",
        slug: "evolution-professional-audio",
      },
    ],
  },
  // Add more blog posts here
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = posts[params.slug as keyof typeof posts]

  if (!post) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
        <Button asChild>
          <Link href="/blog">Back to Blog</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-12 space-y-16">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button variant="ghost" className="mb-8" asChild>
          <Link href="/blog" className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </Button>
      </motion.div>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="space-y-4">
          <Button variant="outline" className="pointer-events-none">
            {post.category}
          </Button>
          <h1 className="text-4xl font-bold gradient-text">{post.title}</h1>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {post.author}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {formatDate(new Date(post.date))}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {post.readTime}
            </div>
          </div>
        </div>

        <div className="relative aspect-video rounded-xl overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      </motion.section>

      {/* Content */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-3xl mx-auto"
      >
        <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
      </motion.section>

      {/* Share Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center space-y-4"
      >
        <h2 className="text-xl font-semibold">Share this Article</h2>
        <div className="flex justify-center gap-4">
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </motion.section>

      {/* Related Posts */}
      {post.relatedPosts && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="space-y-8"
        >
          <h2 className="text-2xl font-bold text-center">Related Articles</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {post.relatedPosts.map((relatedPost, index) => (
              <Card key={relatedPost.slug} className="card-hover">
                <Link href={`/blog/${relatedPost.slug}`}>
                  <div className="relative aspect-video">
                    <Image
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      fill
                      className="object-cover image-zoom"
                    />
                  </div>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-bold mb-2">{relatedPost.title}</h3>
                    <p className="text-muted-foreground">{relatedPost.excerpt}</p>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </motion.section>
      )}

      {/* Newsletter Section */}
      <NewsletterForm className="py-12" />
    </div>
  )
}

