"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, Clock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { NewsletterForm } from "@/components/newsletter-form"
import { formatDate } from "@/lib/utils"

const categories = [
  "All Posts",
  "Event Tips",
  "Equipment Guide",
  "Industry News",
  "Client Stories",
]

const posts = [
  {
    title: "Essential Sound Equipment for Outdoor Events",
    excerpt: "Learn about the key audio equipment needed to deliver exceptional sound quality at outdoor venues.",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80&w=1000",
    category: "Equipment Guide",
    author: "John Smith",
    date: "2023-10-15",
    readTime: "5 min read",
    slug: "essential-sound-equipment-outdoor-events",
  },
  {
    title: "10 Tips for Perfect Wedding Music",
    excerpt: "Expert advice on creating the perfect musical atmosphere for your wedding ceremony and reception.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1000",
    category: "Event Tips",
    author: "Sarah Johnson",
    date: "2023-10-10",
    readTime: "7 min read",
    slug: "tips-perfect-wedding-music",
  },
  {
    title: "The Evolution of Professional Audio",
    excerpt: "Exploring how professional audio equipment has evolved over the years and what the future holds.",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1000",
    category: "Industry News",
    author: "Michael Ndlovu",
    date: "2023-10-05",
    readTime: "6 min read",
    slug: "evolution-professional-audio",
  },
  {
    title: "Creating the Perfect Party Playlist",
    excerpt: "Tips and tricks for curating a playlist that keeps the dance floor packed all night long.",
    image: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&q=80&w=1000",
    category: "Event Tips",
    author: "John Smith",
    date: "2023-09-30",
    readTime: "4 min read",
    slug: "creating-perfect-party-playlist",
  },
  {
    title: "Success Story: Corporate Event Excellence",
    excerpt: "How we delivered exceptional audio solutions for a major corporate event in Tzaneen.",
    image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&q=80&w=1000",
    category: "Client Stories",
    author: "Sarah Johnson",
    date: "2023-09-25",
    readTime: "5 min read",
    slug: "success-story-corporate-event",
  },
  {
    title: "Understanding Sound System Components",
    excerpt: "A comprehensive guide to the essential components that make up a professional sound system.",
    image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&q=80&w=1000",
    category: "Equipment Guide",
    author: "Michael Ndlovu",
    date: "2023-09-20",
    readTime: "8 min read",
    slug: "understanding-sound-system-components",
  },
]

export default function BlogPage() {
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
          Sound Insights Blog
        </motion.h1>
        <motion.p
          className="text-muted-foreground max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Expert tips, industry insights, and success stories from the world of professional audio.
        </motion.p>
      </section>

      {/* Categories */}
      <motion.section
        className="flex flex-wrap gap-4 justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {categories.map((category, index) => (
          <Button
            key={category}
            variant={index === 0 ? "default" : "outline"}
            className={index === 0 ? "button-glow" : ""}
          >
            {category}
          </Button>
        ))}
      </motion.section>

      {/* Featured Post */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative aspect-video md:aspect-auto">
              <Image
                src={posts[0].image}
                alt={posts[0].title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6 flex flex-col justify-center">
              <div className="space-y-4">
                <Button variant="outline" className="pointer-events-none">
                  {posts[0].category}
                </Button>
                <h2 className="text-2xl font-bold">{posts[0].title}</h2>
                <p className="text-muted-foreground">{posts[0].excerpt}</p>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {posts[0].author}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(new Date(posts[0].date))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {posts[0].readTime}
                  </div>
                </div>
                <Button className="w-fit button-glow" asChild>
                  <Link href={`/blog/${posts[0].slug}`}>Read More</Link>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.section>

      {/* Posts Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.slice(1).map((post, index) => (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 * (index + 4) }}
          >
            <Card className="h-full card-hover">
              <div className="relative aspect-video">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover image-zoom"
                />
              </div>
              <CardHeader>
                <Button variant="outline" className="w-fit pointer-events-none">
                  {post.category}
                </Button>
                <h3 className="text-xl font-bold">{post.title}</h3>
                <p className="text-muted-foreground">{post.excerpt}</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(new Date(post.date))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/blog/${post.slug}`}>Read More</Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* Newsletter Section */}
      <NewsletterForm className="py-12" />
    </div>
  )
}

