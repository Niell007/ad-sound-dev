"use client"

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import type { User } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Icons } from '@/components/icons'
import { useSearch } from '@/hooks/use-search'
import { ImageWithFallback } from '@/components/ui/image-with-fallback'
import { AvatarFallback } from '@/components/ui/avatar-fallback'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { cn } from '@/lib/utils'
import { 
  Phone, 
  Mail, 
  Search, 
  Menu, 
  X, 
  User as UserIcon, 
  Settings, 
  LogOut,
  Music,
  PartyPopper,
  BellRing,
  Mic2,
  Briefcase,
  Calendar,
  BookOpen,
  Radio,
  Info,
  MessageSquare
} from 'lucide-react'
import { RecentBookingsPreview } from './recent-bookings-preview'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/search-command"
import { LoadingImage } from '@/components/ui/loading-image'

const services = [
  {
    title: "Party Sound",
    href: "/services/party-sound",
    description: "Professional sound systems and music for any party or event.",
    icon: PartyPopper,
    subItems: [
      { title: "DJ Services", href: "/services/party-sound" },
      { title: "Sound Equipment", href: "/services/party-sound" },
      { title: "Lighting", href: "/services/party-sound" },
    ]
  },
  {
    title: "Wedding Sound",
    href: "/services/wedding-sound",
    description: "Complete audio solutions for your special day.",
    icon: BellRing,
    subItems: [
      { title: "Ceremony Audio", href: "/services/wedding-sound" },
      { title: "Reception Music", href: "/services/wedding-sound" },
      { title: "Package Deals", href: "/services/wedding-sound" },
    ]
  },
  {
    title: "Karaoke Night",
    href: "/services/karaoke",
    description: "High-quality karaoke equipment and extensive song collection.",
    icon: Mic2,
    subItems: [
      { title: "Song Library", href: "/services/karaoke" },
      { title: "Equipment Rental", href: "/services/karaoke" },
      { title: "Host Services", href: "/services/karaoke" },
    ]
  },
  {
    title: "Corporate Events",
    href: "/services/corporate",
    description: "Professional audio solutions for business events.",
    icon: Briefcase,
    subItems: [
      { title: "Conferences", href: "/services/corporate" },
      { title: "Presentations", href: "/services/corporate" },
      { title: "Team Building", href: "/services/corporate" },
    ]
  },
]

const mainNavItems = [
  { name: "Live Radio", href: "/live-radio", icon: Radio },
  { name: "Blog", href: "/blog", icon: BookOpen },
  { name: "About", href: "/about", icon: Info },
  { name: "Contact", href: "/contact", icon: MessageSquare },
]

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Type guard to check if user exists and has required properties
  const hasUserData = (user: User | null): user is User => {
    return user !== null
  }

  // Use the custom search hook
  const searchableItems = useMemo(() => [
    ...services.map(service => ({
      title: service.title,
      description: service.description,
      href: service.href,
      icon: service.icon,
      searchTerms: [...service.subItems.map(item => item.title)]
    })),
    ...mainNavItems.map(item => ({
      title: item.name,
      href: item.href,
      icon: item.icon
    })),
    ...(user ? [
      { title: 'Dashboard', href: '/dashboard', icon: UserIcon },
      { title: 'My Bookings', href: '/bookings', icon: Calendar },
      { title: 'Settings', href: '/settings', icon: Settings }
    ] : [])
  ], [user])

  const {
    isOpen: searchOpen,
    setIsOpen: setSearchOpen,
    query: searchQuery,
    setQuery: setSearchQuery,
    results: searchResults,
    onSelect: handleSearchSelect,
    isLoading: searchLoading,
    error: searchError,
    recentSearches
  } = useSearch(searchableItems)

  // Handle keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [setSearchOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchOpen(true)
  }

  // Function to handle navigation
  const handleNavigation = (href: string) => {
    router.push(href)
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center space-x-2">
              <Icons.logo className="h-7 w-7 text-primary animate-pulse" />
              <span className="hidden sm:inline-block">
                <span className="font-bold text-lg bg-gradient-to-r from-primary/90 via-primary to-primary/90 bg-clip-text text-transparent tracking-tight hover:from-primary hover:to-primary transition-all duration-300">
                  Soundmaster
                </span>
              </span>
            </Link>

            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <Music className="mr-2 h-4 w-4" />
                    Services
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                      {services.map((service) => (
                        <li key={service.title}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={service.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="flex items-center gap-2">
                                <service.icon className="h-4 w-4" />
                                <div className="text-sm font-medium leading-none">{service.title}</div>
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {service.description}
                              </p>
                              <div className="mt-2 flex flex-wrap gap-1">
                                {service.subItems.map((item) => (
                                  <Button
                                    key={item.title}
                                    variant="outline"
                                    size="sm"
                                    className="mt-1 h-7 rounded-full text-xs"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      handleNavigation(item.href)
                                    }}
                                  >
                                    {item.title}
                                  </Button>
                                ))}
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {mainNavItems.map((item) => (
                  <NavigationMenuItem key={item.name}>
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.name}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="px-2"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
              <kbd className="pointer-events-none ml-2 hidden select-none rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:inline-block">
                ⌘K
              </kbd>
            </Button>

            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost" size="sm" className="gap-2">
                <Phone className="h-4 w-4" />
                <span>081 543 6748</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <Mail className="h-4 w-4" />
                <span>contact@soundmaster.co.za</span>
              </Button>
            </div>

            {/* User Menu with Recent Bookings */}
            <div className="flex items-center gap-2">
              {hasUserData(user) ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <ImageWithFallback
                        src={user.image ?? ''}
                        alt={`${user.name ?? 'User'}'s avatar`}
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full"
                        fallbackName={user.name ?? undefined}
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.name ?? 'User'}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email ?? 'No email'}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                        <UserIcon className="mr-2 h-4 w-4" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push('/bookings')}>
                        <Calendar className="mr-2 h-4 w-4" />
                        My Bookings
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push('/settings')}>
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="default" size="sm" asChild>
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              className="ml-2 px-2 md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t md:hidden">
            <div className="container space-y-1 p-4">
              <div className="grid grid-cols-2 gap-4">
                {services.map((service) => (
                  <Link
                    key={service.title}
                    href={service.href}
                    className="flex items-center gap-2 rounded-lg p-2 hover:bg-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <service.icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{service.title}</span>
                  </Link>
                ))}
              </div>
              <div className="mt-4 space-y-1">
                {mainNavItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-2 rounded-lg p-2 hover:bg-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput
          placeholder="Search services and pages..."
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {searchResults.length > 0 && (
            <CommandGroup heading="Search Results">
              {searchResults.map((result) => (
                <CommandItem
                  key={result.href}
                  value={result.title}
                  onSelect={() => handleSearchSelect(result)}
                >
                  {result.icon && <result.icon className="mr-2 h-4 w-4" />}
                  <span>{result.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {recentSearches.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Recent Searches">
                {recentSearches.map((item) => (
                  <CommandItem
                    key={item.href}
                    value={item.title}
                    onSelect={() => handleSearchSelect(item)}
                  >
                    {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                    <span>{item.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
