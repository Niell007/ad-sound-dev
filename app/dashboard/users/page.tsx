"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  CheckCircle, 
  Download, 
  Filter, 
  Search, 
  Shield, 
  SlidersHorizontal, 
  User, 
  Users 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/custom-toast-provider"
import { supabase } from "@/lib/supabase"
import { UserRole, setUserRole } from "@/lib/auth"

type UserWithRole = {
  id: string
  email: string
  created_at: string
  role: UserRole
  profile?: {
    full_name: string | null
    avatar_url: string | null
  } | null
}

export default function UsersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<UserWithRole[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserWithRole[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [sortBy, setSortBy] = useState("created_at-desc")

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true)
        
        // Fetch users from Supabase Auth
        const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
        
        if (authError) {
          throw authError
        }
        
        // Fetch user roles
        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id, role')
        
        if (rolesError) {
          throw rolesError
        }
        
        // Fetch profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('user_id, full_name, avatar_url')
        
        if (profilesError) {
          throw profilesError
        }
        
        // Combine the data
        const combinedUsers = authUsers.users.map(user => {
          const userRole = userRoles?.find(role => role.user_id === user.id)
          const userProfile = profiles?.find(profile => profile.user_id === user.id)
          
          return {
            id: user.id,
            email: user.email || '',
            created_at: user.created_at,
            role: (userRole?.role as UserRole) || UserRole.USER,
            profile: userProfile ? {
              full_name: userProfile.full_name,
              avatar_url: userProfile.avatar_url
            } : null
          }
        })
        
        setUsers(combinedUsers)
        setFilteredUsers(combinedUsers)
      } catch (error) {
        console.error("Error fetching users:", error)
        toast({
          title: "Error",
          description: "Failed to load users. Please try again.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [toast])

  useEffect(() => {
    // Apply filters and sorting
    let result = [...users]

    // Apply role filter
    if (roleFilter !== "all") {
      result = result.filter(user => user.role === roleFilter)
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(user => 
        user.email.toLowerCase().includes(query) ||
        user.profile?.full_name?.toLowerCase().includes(query) ||
        user.id.toLowerCase().includes(query)
      )
    }

    // Apply sorting
    switch (sortBy) {
      case "email-asc":
        result.sort((a, b) => a.email.localeCompare(b.email))
        break
      case "email-desc":
        result.sort((a, b) => b.email.localeCompare(a.email))
        break
      case "created_at-asc":
        result.sort((a, b) => a.created_at.localeCompare(b.created_at))
        break
      case "created_at-desc":
        result.sort((a, b) => b.created_at.localeCompare(a.created_at))
        break
      case "role-asc":
        result.sort((a, b) => a.role.localeCompare(b.role))
        break
      case "role-desc":
        result.sort((a, b) => b.role.localeCompare(a.role))
        break
      default:
        break
    }

    setFilteredUsers(result)
  }, [users, searchQuery, roleFilter, sortBy])

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      const success = await setUserRole(userId, newRole)
      
      if (success) {
        // Update local state
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === userId 
              ? { ...user, role: newRole } 
              : user
          )
        )
        
        toast({
          title: "Role Updated",
          description: `User role has been updated to ${newRole}.`
        })
      } else {
        throw new Error("Failed to update role")
      }
    } catch (error) {
      console.error("Error updating user role:", error)
      toast({
        title: "Error",
        description: "Failed to update user role. Please try again.",
        variant: "destructive"
      })
    }
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-16" /> : users.length}
            </div>
            <p className="text-xs text-muted-foreground">All registered users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
            <Shield className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                users.filter(user => user.role === UserRole.ADMIN).length
              )}
            </div>
            <p className="text-xs text-muted-foreground">Administrator accounts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Staff Users</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                users.filter(user => user.role === UserRole.STAFF).length
              )}
            </div>
            <p className="text-xs text-muted-foreground">Staff accounts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Regular Users</CardTitle>
            <User className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                users.filter(user => user.role === UserRole.USER).length
              )}
            </div>
            <p className="text-xs text-muted-foreground">Standard user accounts</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
              <SelectItem value={UserRole.STAFF}>Staff</SelectItem>
              <SelectItem value={UserRole.USER}>User</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email-asc">Email (A-Z)</SelectItem>
              <SelectItem value="email-desc">Email (Z-A)</SelectItem>
              <SelectItem value="created_at-desc">Newest First</SelectItem>
              <SelectItem value="created_at-asc">Oldest First</SelectItem>
              <SelectItem value="role-asc">Role (A-Z)</SelectItem>
              <SelectItem value="role-desc">Role (Z-A)</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.profile?.avatar_url || undefined} alt={user.profile?.full_name || user.email} />
                        <AvatarFallback>{getInitials(user.profile?.full_name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.profile?.full_name || 'Unnamed User'}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[150px]">ID: {user.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{formatDate(user.created_at)}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        user.role === UserRole.ADMIN 
                          ? "default" 
                          : user.role === UserRole.STAFF 
                          ? "secondary" 
                          : "outline"
                      }
                      className="capitalize"
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                        {user.role !== UserRole.ADMIN && (
                          <DropdownMenuItem onClick={() => handleRoleChange(user.id, UserRole.ADMIN)}>
                            <Shield className="mr-2 h-4 w-4 text-primary" />
                            Set as Admin
                          </DropdownMenuItem>
                        )}
                        {user.role !== UserRole.STAFF && (
                          <DropdownMenuItem onClick={() => handleRoleChange(user.id, UserRole.STAFF)}>
                            <Users className="mr-2 h-4 w-4 text-blue-600" />
                            Set as Staff
                          </DropdownMenuItem>
                        )}
                        {user.role !== UserRole.USER && (
                          <DropdownMenuItem onClick={() => handleRoleChange(user.id, UserRole.USER)}>
                            <User className="mr-2 h-4 w-4" />
                            Set as User
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => {
                            toast({
                              title: "Not Implemented",
                              description: "User deletion is not implemented yet.",
                              variant: "destructive"
                            })
                          }}
                        >
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 