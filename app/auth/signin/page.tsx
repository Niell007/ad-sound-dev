"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
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
import { useAuth } from "@/contexts/auth-context"
import { Github, Loader2, Mail, Music } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn, signInWithProvider } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isOAuthLoading, setIsOAuthLoading] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!searchParams) return;
    
    const msg = searchParams.get("message")
    const err = searchParams.get("error")
    const redirectedFrom = searchParams.get("redirectedFrom")
    
    if (msg) {
      setMessage(msg)
    }
    
    if (err) {
      setError(err)
      toast({
        title: "Authentication Error",
        description: err,
        variant: "destructive",
      })
    }
    
    // Store the redirectedFrom path for after successful login
    if (redirectedFrom) {
      sessionStorage.setItem("redirectAfterLogin", redirectedFrom)
    }
  }, [searchParams, toast])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      setError(null)
      
      const { success, error } = await signIn(values.email, values.password)

      if (!success) {
        const errorMessage = error?.message || "Invalid email or password. Please try again."
        setError(errorMessage)
        toast({
          title: "Sign In Failed",
          description: errorMessage,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success!",
        description: "You have been logged in successfully.",
      })

      // Check if there's a stored redirect path
      const redirectPath = sessionStorage.getItem("redirectAfterLogin") || "/dashboard"
      sessionStorage.removeItem("redirectAfterLogin")
      
      router.push(redirectPath)
      router.refresh()
    } catch (error: any) {
      console.error('Sign in error:', error)
      const errorMessage = error?.message || "Something went wrong. Please try again."
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleOAuthSignIn(provider: 'google' | 'github') {
    try {
      setIsOAuthLoading(provider)
      setError(null)
      
      const { success, error } = await signInWithProvider(provider)
      
      if (!success && error) {
        const errorMessage = error?.message || `Failed to sign in with ${provider}. Please try again.`
        setError(errorMessage)
        toast({
          title: "Sign In Failed",
          description: errorMessage,
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error(`${provider} sign in error:`, error)
      const errorMessage = error?.message || "Something went wrong. Please try again."
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsOAuthLoading(null)
    }
  }

  return (
    <div className="container relative flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Music className="mr-2 h-6 w-6" aria-hidden="true" />
          Soundmaster
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "Welcome back to Soundmaster. We've been waiting for you to create more amazing audio experiences."
            </p>
            <footer className="text-sm">Michael Chen</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Sign in to your account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>

          {message && (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-900/20">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
          
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Authentication Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4">
            <Button
              variant="outline"
              onClick={() => handleOAuthSignIn('github')}
              disabled={isOAuthLoading === 'github'}
            >
              {isOAuthLoading === 'github' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Github className="mr-2 h-4 w-4" aria-hidden="true" />
              )}
              Sign in with GitHub
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOAuthSignIn('google')}
              disabled={isOAuthLoading === 'google'}
            >
              {isOAuthLoading === 'google' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
              )}
              Sign in with Google
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email"
                        placeholder="name@example.com" 
                        {...field} 
                        disabled={isLoading} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter your password"
                        {...field} 
                        disabled={isLoading} 
                      />
                    </FormControl>
                    <FormMessage />
                    <Button variant="link" className="px-0 font-normal h-auto" asChild>
                      <Link href="/auth/reset-password">Forgot password?</Link>
                    </Button>
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </Form>

          <p className="px-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="hover:text-brand underline underline-offset-4">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}