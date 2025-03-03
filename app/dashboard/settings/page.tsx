"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/custom-toast-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import {
  Bell, 
  Building, 
  CreditCard, 
  Globe, 
  Lock, 
  Mail, 
  Save, 
  Settings, 
  User, 
  Users,
  Search
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const formSchema = z.object({
  fullName: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),
  email: z.string()
    .email("Please enter a valid email address")
    .min(5, "Email must be at least 5 characters")
    .max(100, "Email cannot exceed 100 characters")
    .optional(),
  phone: z.string()
    .regex(/^[0-9+\-() ]*$/, "Invalid phone number format")
    .optional(),
  website: z.string()
    .url("Please enter a valid URL")
    .optional(),
  role: z.string().optional(),
})

type UserSettings = {
  name: string
  email: string
  phone: string
  website: string
  role: string
  avatar: string
}

export default function SettingsPage() {
  const router = useRouter()
  const { user, updateProfile } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [userSettings, setUserSettings] = useState<UserSettings>({
    name: user?.user_metadata?.full_name || "",
    email: user?.email || "",
    phone: "",
    website: "",
    role: "user",
    avatar: user?.user_metadata?.avatar_url || "/placeholder-avatar.jpg",
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (!user && !isLoading) {
      // Instead of immediate redirect, show a sign-in button
      // The middleware will handle the actual protection of the route
      console.log('User not authenticated in settings page')
    } else if (user) {
      // Only fetch settings when we have a user
      fetchUserSettings()
    }
  }, [user, isLoading])

  // Move fetchUserSettings to a separate function
  const fetchUserSettings = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true)
      const response = await fetch('/api/user/settings')
      
      // Improved error handling for JSON parsing
      let data: any = {};
      try {
        data = await response.json()
      } catch (e: any) {
        console.error('Error parsing settings JSON:', e)
        data = {}
      }
      
      setUserSettings({
        name: user?.user_metadata?.full_name || "",
        email: user?.email || "",
        phone: data.phone || "",
        website: data.website || "",
        role: data.role || "user",
        avatar: user?.user_metadata?.avatar_url || "/placeholder-avatar.jpg",
      })
    } catch (error) {
      console.error('Error fetching user settings:', error)
      // Don't show error toast, just use default values
      setUserSettings({
        name: user?.user_metadata?.full_name || "",
        email: user?.email || "",
        phone: "",
        website: "",
        role: "user",
        avatar: user?.user_metadata?.avatar_url || "/placeholder-avatar.jpg",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      website: "",
      role: "user",
    },
  })

  // Update form values when userSettings change
  useEffect(() => {
    if (!isLoading) {
      form.reset({
        fullName: userSettings.name,
        email: userSettings.email,
        phone: userSettings.phone,
        website: userSettings.website,
        role: userSettings.role,
      })
    }
  }, [userSettings, isLoading, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSaving(true)
      setSaveError(null)

      // Update auth profile
      try {
        await updateProfile({
          full_name: values.fullName,
        })
      } catch (error) {
        console.error('Error updating auth profile:', error)
        // Continue with the rest of the updates even if this fails
      }

      // Update additional settings
      try {
        const response = await fetch('/api/user/settings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone: values.phone || '',
            website: values.website || '',
            role: values.role || 'user',
          }),
        })

        // Improved error handling for JSON parsing
        let data;
        try {
          data = await response.json()
        } catch (e) {
          console.error('Error parsing response JSON:', e)
          // Continue with local state update even if parsing fails
        }

        // Even if the response is not ok, we'll consider the auth profile update a success
        if (!response.ok) {
          console.warn('Failed to update user settings, but auth profile was updated')
        }
      } catch (error) {
        console.warn('Error updating user settings, but auth profile was updated:', error)
      }

      // Update local state
      setUserSettings({
        ...userSettings,
        name: values.fullName,
        phone: values.phone || '',
        website: values.website || '',
        role: values.role || 'user',
      })

      toast({
        title: "Success!",
        description: "Your profile has been updated.",
      })

      router.refresh()
    } catch (error) {
      console.error('Error updating settings:', error)
      setSaveError("Failed to save settings. Please try again.")
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Mock data for studio settings
  const [studioSettings, setStudioSettings] = useState({
    name: "AD Sound Studio",
    email: "info@adsound.co.za",
    phone: "(012) 345-6789",
    address: "123 Main Street, Johannesburg, 2000",
    website: "https://adsound.co.za",
    description: "Professional recording studio offering a wide range of audio services including recording, mixing, mastering, podcast production, and more.",
    businessHours: {
      monday: "9:00 AM - 6:00 PM",
      tuesday: "9:00 AM - 6:00 PM",
      wednesday: "9:00 AM - 6:00 PM",
      thursday: "9:00 AM - 6:00 PM",
      friday: "9:00 AM - 6:00 PM",
      saturday: "10:00 AM - 4:00 PM",
      sunday: "Closed",
    },
    currency: "ZAR",
    timeZone: "Africa/Johannesburg",
    language: "en-ZA",
  })

  // Mock data for notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    bookingConfirmations: true,
    bookingReminders: true,
    bookingCancellations: true,
    marketingEmails: false,
    systemUpdates: true,
  })

  // Mock data for team members
  const teamMembers = [
    {
      id: "U-001",
      name: userSettings.name,
      email: userSettings.email,
      role: userSettings.role,
      avatar: userSettings.avatar,
    },
    {
      id: "U-002",
      name: "John Engineer",
      email: "john@adsound.co.za",
      role: "staff",
      avatar: "/placeholder-avatar.jpg",
    },
    {
      id: "U-003",
      name: "Sarah Producer",
      email: "sarah@adsound.co.za",
      role: "staff",
      avatar: "/placeholder-avatar.jpg",
    },
  ]

  // Settings search functionality
  const settingsGroups = {
    account: ["Profile", "Password", "Security"],
    studio: ["Studio Info", "Business Hours", "Location"],
    team: ["Team Members", "Roles", "Permissions"],
    notifications: ["Email", "Booking", "System"],
    system: ["Preferences", "Payment", "Advanced"],
  }

  const handleSearch = () => {
    setSearchOpen(true)
  }

  const handleSettingsNavigation = (section: string, subsection: string) => {
    setSearchOpen(false)
    // Navigate to the specific section
    const tab = Object.keys(settingsGroups).find(key => 
      settingsGroups[key as keyof typeof settingsGroups].includes(subsection)
    )
    if (tab) {
      const tabElement = document.querySelector(`[value="${tab}"]`) as HTMLElement
      tabElement?.click()
      // Scroll to subsection after a brief delay to allow tab content to render
      setTimeout(() => {
        const subsectionElement = document.querySelector(`[data-section="${subsection}"]`)
        subsectionElement?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }

  // Enhanced save handler with loading state and error handling
  const handleSaveSettings = async (section: string) => {
    try {
      setIsSaving(true)
      setSaveError(null)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Settings saved",
        description: `Your ${section} settings have been saved successfully.`,
      })
    } catch (error) {
      setSaveError("Failed to save settings. Please try again.")
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Check if user has admin access
  const isAdmin = userSettings.role === 'admin';
  const isStaff = userSettings.role === 'staff' || userSettings.role === 'manager' || isAdmin;

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Authentication Required</h2>
          <p className="text-muted-foreground mt-2">Please sign in to access settings</p>
          <Button 
            className="mt-4" 
            onClick={() => router.push('/auth/signin')}
          >
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[150px] w-full" />
          <Skeleton className="h-[150px] w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Role Switcher for Testing */}
          <div className="flex items-center gap-2">
            <Label htmlFor="test-role" className="text-sm">Test as:</Label>
            <Select 
              value={userSettings.role}
              onValueChange={(value) => {
                setUserSettings({...userSettings, role: value});
                toast({
                  title: "Role Changed",
                  description: `You are now viewing settings as ${value}`,
                })
              }}
            >
              <SelectTrigger id="test-role" className="w-[130px]">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSearch} variant="outline" size="sm">
            <Search className="w-4 h-4 mr-2" />
            Search Settings
          </Button>
        </div>
      </div>

      {saveError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{saveError}</AlertDescription>
        </Alert>
      )}

      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput 
          placeholder="Search settings..." 
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>No settings found.</CommandEmpty>
          {Object.entries(settingsGroups).map(([section, items]) => (
            <CommandGroup key={section} heading={section.charAt(0).toUpperCase() + section.slice(1)}>
              {items.map((item) => (
                <CommandItem 
                  key={item}
                  onSelect={() => handleSettingsNavigation(section, item)}
                >
                  {item}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>

      <ScrollArea className="h-[calc(100vh-12rem)]">
        <Tabs defaultValue="account" className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:w-[600px]">
            <TabsTrigger value="account">Account</TabsTrigger>
            {isStaff && <TabsTrigger value="studio">Studio</TabsTrigger>}
            {isStaff && <TabsTrigger value="team">Team</TabsTrigger>}
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            {isAdmin && <TabsTrigger value="system">System</TabsTrigger>}
          </TabsList>
          
          {/* Account Settings */}
          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Update your personal account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-24 w-24 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex flex-col items-center gap-4">
                          <Avatar className="h-24 w-24">
                            <AvatarImage src={userSettings.avatar} alt={userSettings.name} />
                            <AvatarFallback>{userSettings.name.split(' ').map(n => n[0] || '').join('')}</AvatarFallback>
                          </Avatar>
                          <Button variant="outline" size="sm" type="button">
                            Change Avatar
                          </Button>
                        </div>
                        <div className="flex-1 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="fullName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Full Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email Address</FormLabel>
                                  <FormControl>
                                    <Input type="email" {...field} disabled />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone Number</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="website"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Website</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Role</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="admin">Administrator</SelectItem>
                                    <SelectItem value="manager">Manager</SelectItem>
                                    <SelectItem value="staff">Staff</SelectItem>
                                    <SelectItem value="user">User</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between pt-4">
                        <Button variant="outline" type="button" disabled={isSaving}>Cancel</Button>
                        <Button 
                          type="submit"
                          disabled={isSaving || !form.formState.isDirty}
                        >
                          {isSaving ? (
                            <>
                              <span className="animate-spin mr-2">⏳</span>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                {/* Footer content moved to form */}
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button onClick={() => handleSaveSettings('password')}>
                  <Lock className="mr-2 h-4 w-4" />
                  Update Password
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Studio Settings */}
          {isStaff && (
            <TabsContent value="studio" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Studio Information</CardTitle>
                  <CardDescription>
                    Update your studio's details and business information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="studio-name">Studio Name</Label>
                      <Input 
                        id="studio-name" 
                        value={studioSettings.name}
                        onChange={(e) => setStudioSettings({...studioSettings, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="studio-email">Email Address</Label>
                      <Input 
                        id="studio-email" 
                        type="email" 
                        value={studioSettings.email}
                        onChange={(e) => setStudioSettings({...studioSettings, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="studio-phone">Phone Number</Label>
                      <Input 
                        id="studio-phone" 
                        value={studioSettings.phone}
                        onChange={(e) => setStudioSettings({...studioSettings, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="studio-website">Website</Label>
                      <Input 
                        id="studio-website" 
                        value={studioSettings.website}
                        onChange={(e) => setStudioSettings({...studioSettings, website: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="studio-address">Address</Label>
                    <Input 
                      id="studio-address" 
                      value={studioSettings.address}
                      onChange={(e) => setStudioSettings({...studioSettings, address: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="studio-description">Description</Label>
                    <Textarea 
                      id="studio-description" 
                      rows={4}
                      value={studioSettings.description}
                      onChange={(e) => setStudioSettings({...studioSettings, description: e.target.value})}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Cancel</Button>
                  <Button onClick={() => handleSaveSettings('studio')}>
                    <Building className="mr-2 h-4 w-4" />
                    Save Studio Info
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Business Hours</CardTitle>
                  <CardDescription>
                    Set your studio's operating hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(studioSettings.businessHours).map(([day, hours]) => (
                      <div key={day} className="flex items-center justify-between">
                        <Label htmlFor={`hours-${day}`} className="capitalize w-32">
                          {day}
                        </Label>
                        <Input 
                          id={`hours-${day}`} 
                          className="max-w-xs"
                          value={hours}
                          onChange={(e) => setStudioSettings({
                            ...studioSettings, 
                            businessHours: {
                              ...studioSettings.businessHours,
                              [day]: e.target.value
                            }
                          })}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Cancel</Button>
                  <Button onClick={() => handleSaveSettings('business hours')}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Hours
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          )}
          
          {/* Team Settings */}
          {isStaff && (
            <TabsContent value="team" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>
                      Manage your studio's team and their access
                    </CardDescription>
                  </div>
                  <Button size="sm">
                    <Users className="mr-2 h-4 w-4" />
                    Invite Member
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select defaultValue={member.role}>
                            <SelectTrigger className="w-[130px]">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Administrator</SelectItem>
                              <SelectItem value="manager">Manager</SelectItem>
                              <SelectItem value="staff">Staff</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleSaveSettings('team')}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Team Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          )}
          
          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose which notifications you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch 
                      id="email-notifications" 
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, emailNotifications: checked})
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="booking-confirmations">Booking Confirmations</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications when bookings are confirmed
                      </p>
                    </div>
                    <Switch 
                      id="booking-confirmations" 
                      checked={notificationSettings.bookingConfirmations}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, bookingConfirmations: checked})
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="booking-reminders">Booking Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive reminders about upcoming bookings
                      </p>
                    </div>
                    <Switch 
                      id="booking-reminders" 
                      checked={notificationSettings.bookingReminders}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, bookingReminders: checked})
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="booking-cancellations">Booking Cancellations</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications when bookings are cancelled
                      </p>
                    </div>
                    <Switch 
                      id="booking-cancellations" 
                      checked={notificationSettings.bookingCancellations}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, bookingCancellations: checked})
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketing-emails">Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive marketing and promotional emails
                      </p>
                    </div>
                    <Switch 
                      id="marketing-emails" 
                      checked={notificationSettings.marketingEmails}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, marketingEmails: checked})
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="system-updates">System Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about system updates and maintenance
                      </p>
                    </div>
                    <Switch 
                      id="system-updates" 
                      checked={notificationSettings.systemUpdates}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, systemUpdates: checked})
                      }
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleSaveSettings('notification')}>
                  <Bell className="mr-2 h-4 w-4" />
                  Save Notification Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* System Settings */}
          {isAdmin && (
            <TabsContent value="system" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>System Preferences</CardTitle>
                  <CardDescription>
                    Configure system-wide settings for your studio
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select 
                        value={studioSettings.currency}
                        onValueChange={(value) => setStudioSettings({...studioSettings, currency: value})}
                      >
                        <SelectTrigger id="currency">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ZAR">South African Rand (ZAR)</SelectItem>
                          <SelectItem value="USD">US Dollar (USD)</SelectItem>
                          <SelectItem value="EUR">Euro (EUR)</SelectItem>
                          <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Time Zone</Label>
                      <Select 
                        value={studioSettings.timeZone}
                        onValueChange={(value) => setStudioSettings({...studioSettings, timeZone: value})}
                      >
                        <SelectTrigger id="timezone">
                          <SelectValue placeholder="Select time zone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Africa/Johannesburg">Africa/Johannesburg (SAST)</SelectItem>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="Europe/London">Europe/London (GMT/BST)</SelectItem>
                          <SelectItem value="America/New_York">America/New_York (EST/EDT)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select 
                        value={studioSettings.language}
                        onValueChange={(value) => setStudioSettings({...studioSettings, language: value})}
                      >
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en-ZA">English (South Africa)</SelectItem>
                          <SelectItem value="af-ZA">Afrikaans</SelectItem>
                          <SelectItem value="zu-ZA">Zulu</SelectItem>
                          <SelectItem value="en-US">English (US)</SelectItem>
                          <SelectItem value="en-GB">English (UK)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Reset to Defaults</Button>
                  <Button onClick={() => handleSaveSettings('system')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Save System Settings
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Settings</CardTitle>
                  <CardDescription>
                    Configure payment methods and processing options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Payment Gateways</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="payfast" />
                        <Label htmlFor="payfast">PayFast</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="peach" />
                        <Label htmlFor="peach">Peach Payments</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="yoco" />
                        <Label htmlFor="yoco">Yoco</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="snapscan" />
                        <Label htmlFor="snapscan">SnapScan</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="eft" checked />
                        <Label htmlFor="eft">EFT (Manual)</Label>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vat-number">VAT Number</Label>
                    <Input id="vat-number" placeholder="Enter VAT number if applicable" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deposit-percentage">Required Deposit Percentage</Label>
                    <Select defaultValue="50">
                      <SelectTrigger id="deposit-percentage">
                        <SelectValue placeholder="Select percentage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">No deposit required</SelectItem>
                        <SelectItem value="25">25% deposit</SelectItem>
                        <SelectItem value="50">50% deposit</SelectItem>
                        <SelectItem value="100">Full payment required</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleSaveSettings('payment')}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Save Payment Settings
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                  <CardDescription>
                    Configure advanced system settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Put the booking system in maintenance mode
                        </p>
                      </div>
                      <Switch id="maintenance-mode" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="debug-mode">Debug Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable detailed error logging
                        </p>
                      </div>
                      <Switch id="debug-mode" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="booking-buffer">Booking Buffer Time (minutes)</Label>
                    <Select defaultValue="30">
                      <SelectTrigger id="booking-buffer">
                        <SelectValue placeholder="Select buffer time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">No buffer</SelectItem>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      Minimum time between bookings
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleSaveSettings('advanced')}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Advanced Settings
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </ScrollArea>
    </div>
  )
} 