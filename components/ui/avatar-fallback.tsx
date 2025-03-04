"use client"

import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AvatarFallbackProps {
  name?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function AvatarFallback({ name, className, size = 'md' }: AvatarFallbackProps) {
  const getInitials = (name?: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base'
  };

  const initials = getInitials(name);

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-muted',
        sizeClasses[size],
        className
      )}
    >
      {initials ? (
        <span className="font-medium text-muted-foreground">{initials}</span>
      ) : (
        <User className="h-4 w-4 text-muted-foreground" />
      )}
    </div>
  );
}