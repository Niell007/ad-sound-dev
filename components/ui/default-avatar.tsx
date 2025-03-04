"use client"

import { useMemo } from 'react'

interface DefaultAvatarProps {
  name?: string
  width?: number
  height?: number
  className?: string
}

const colors = [
  '#FF6B6B', // coral red
  '#4ECDC4', // turquoise
  '#45B7D1', // sky blue
  '#96CEB4', // sage green
  '#FFEEAD', // cream yellow
  '#D4A5A5', // dusty rose
  '#9B59B6', // purple
  '#3498DB', // blue
  '#E67E22', // orange
  '#1ABC9C', // emerald
]

export function DefaultAvatar({ name = '', width = 40, height = 40, className = '' }: DefaultAvatarProps) {
  const initials = useMemo(() => {
    if (!name) return '?'
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }, [name])

  const backgroundColor = useMemo(() => {
    if (!name) return colors[0]
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
    return colors[index]
  }, [name])

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="20" cy="20" r="20" fill={backgroundColor} />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy="0.35em"
        fill="white"
        fontFamily="system-ui"
        fontSize="16"
        fontWeight="bold"
      >
        {initials}
      </text>
    </svg>
  )
} 