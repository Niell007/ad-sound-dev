"use client"

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
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
  User, 
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
      { title: 'Dashboard', href: '/dashboard', icon: User },
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
              <Icons.logo className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block">AD Sound</span>
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
              variant="outline"
              className="hidden md:flex items-center gap-2"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
              <span>Search...</span>
              <kbd className="hidden ml-2 text-xs md:inline-block">⌘K</kbd>
            </Button>

            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost" size="sm" className="gap-2">
                <Phone className="h-4 w-4" />
                <span>081 543 6748</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <Mail className="h-4 w-4" />
                <span>contact@adsound.com</span>
              </Button>
            </div>

            {/* User Menu with Recent Bookings */}
            <div className="flex items-center gap-2">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
                      <div className="relative h-8 w-8 rounded-full overflow-hidden">
                        <LoadingImage
                          src={user.user_metadata?.avatar_url || "/placeholder-avatar.jpg"}
                          alt={user.user_metadata?.full_name || "User avatar"}
                          className="object-cover"
                          fill
                          sizes="32px"
                          priority
                          fallback={<AvatarFallback />}
                        />
                      </div>
                      <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 border-2 border-background" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.user_metadata?.full_name || "User"}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-80 overflow-y-auto">
                      <div className="p-2">
                        <h4 className="text-sm font-medium mb-2">Recent Bookings</h4>
                        <RecentBookingsPreview />
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/bookings" className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        My Bookings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => signOut()}
                      className="flex items-center cursor-pointer text-red-600 focus:text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="ghost" asChild className="hidden md:inline-flex">
                    <Link href="/auth/login">Log in</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/auth/register">Sign up</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 top-16 z-50 bg-background/95 backdrop-blur-sm md:hidden">
            <nav className="container py-6">
              <div className="flex flex-col space-y-4">
                <div className="space-y-4 border-b pb-4">
                  <p className="text-sm font-medium text-muted-foreground">Services</p>
                  {services.map((service) => (
                    <div key={service.title} className="space-y-2">
                      <Link
                        href={service.href}
                        className="flex items-center text-lg font-semibold"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <service.icon className="mr-2 h-5 w-5" />
                        {service.title}
                      </Link>
                      <div className="pl-7 space-y-1">
                        {service.subItems.map((item) => (
                          <Link
                            key={item.title}
                            href={item.href}
                            className="block text-sm text-muted-foreground hover:text-primary"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {item.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  {mainNavItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center text-lg font-semibold"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="mr-2 h-5 w-5" />
                      {item.name}
                    </Link>
                  ))}
                </div>

                <div className="mt-6 border-t pt-6">
                  <div className="flex flex-col space-y-4">
                    {user ? (
                      <>
                        <Link
                          href="/dashboard"
                          className="flex items-center text-lg font-semibold"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <User className="mr-2 h-5 w-5" />
                          Dashboard
                        </Link>
                        <Link
                          href="/bookings"
                          className="flex items-center text-lg font-semibold"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Calendar className="mr-2 h-5 w-5" />
                          My Bookings
                        </Link>
                        <Link
                          href="/settings"
                          className="flex items-center text-lg font-semibold"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Settings className="mr-2 h-5 w-5" />
                          Settings
                        </Link>
                        <button
                          onClick={() => {
                            signOut();
                            setMobileMenuOpen(false);
                          }}
                          className="flex items-center text-lg font-semibold text-red-600"
                        >
                          <LogOut className="mr-2 h-5 w-5" />
                          Log out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/auth/login"
                          className="flex items-center text-lg font-semibold"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <User className="mr-2 h-5 w-5" />
                          Log in
                        </Link>
                        <Link
                          href="/auth/register"
                          className="flex items-center text-lg font-semibold"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <User className="mr-2 h-5 w-5" />
                          Sign up
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>

      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput 
          placeholder="Search for services, bookings, or help..." 
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          {searchError && (
            <div className="p-4 text-sm text-red-500">
              Error: {searchError.message}
            </div>
          )}
          <CommandEmpty>
            {searchLoading ? (
              <div className="py-6 text-center text-sm">
                Searching...
              </div>
            ) : (
              'No results found.'
            )}
          </CommandEmpty>
          {searchResults.length > 0 && (
            <CommandGroup heading="Results">
              {searchResults.map((result) => (
                <CommandItem
                  key={result.href}
                  onSelect={() => handleSearchSelect(result)}
                >
                  {result.icon && <result.icon className="mr-2 h-4 w-4" />}
                  <span>{result.title}</span>
                  {result.description && (
                    <span className="ml-2 text-muted-foreground text-xs">
                      {result.description}
                    </span>
                  )}
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
                    onSelect={() => handleSearchSelect(item)}
                  >
                    {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                    {item.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
          <CommandSeparator />
          <CommandGroup heading="Quick Links">
            {mainNavItems.map((item) => (
              <CommandItem
                key={item.name}
                onSelect={() => handleSearchSelect({
                  title: item.name,
                  href: item.href,
                  icon: item.icon
                })}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
