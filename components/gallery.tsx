"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface GalleryImage {
  id: number
  src: string
  alt: string
  width: number
  height: number
}

const galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3",
    alt: "Wedding DJ Setup",
    width: 1200,
    height: 800,
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
    alt: "Party Event",
    width: 800,
    height: 1200,
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745",
    alt: "Karaoke Night",
    width: 1200,
    height: 800,
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1505236858219-8359eb29e329",
    alt: "Corporate Event",
    width: 800,
    height: 1200,
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7",
    alt: "Concert Setup",
    width: 1200,
    height: 800,
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
    alt: "Birthday Party",
    width: 800,
    height: 1200,
  },
]

export function Gallery() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {galleryImages.map((image) => (
          <div
            key={image.id}
            className={cn(
              "relative overflow-hidden rounded-lg cursor-pointer transition-transform hover:scale-[1.02]",
              image.height > image.width ? "row-span-2" : "row-span-1"
            )}
            onClick={() => setSelectedImage(image)}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              className="object-cover w-full h-full"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-sm font-medium">{image.alt}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          {selectedImage && (
            <div className="relative aspect-[16/9]">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                priority
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

