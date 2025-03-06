"use client";

import Image from "next/image";
import { useState } from "react";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  [key: string]: any;
}

export function ImageWithFallback({
  src,
  alt,
  fallbackSrc = "/placeholder.jpg",
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  return (
    <Image
      src={error ? fallbackSrc : src}
      alt={alt}
      {...props}
      onError={() => setError(true)}
    />
  );
}
