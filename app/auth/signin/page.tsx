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
      
      console.log('Submitting sign-in form with email:', values.email)
      
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

      router.push("/dashboard")
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
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <Music className="mx-auto h-6 w-6" />
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to sign in to your account
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

      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} disabled={isLoading} />
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
                    <Input type="password" {...field} disabled={isLoading} />
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" type="button" disabled={!!isOAuthLoading} onClick={() => handleOAuthSignIn('github')}>
            {isOAuthLoading === 'github' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Github className="mr-2 h-4 w-4" />
            )}
            GitHub
          </Button>
          <Button variant="outline" type="button" disabled={!!isOAuthLoading} onClick={() => handleOAuthSignIn('google')}>
            {isOAuthLoading === 'google' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Mail className="mr-2 h-4 w-4" />
            )}
            Google
          </Button>
        </div>
      </div>

      <p className="px-8 text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link href="/auth/signup" className="underline underline-offset-4 hover:text-primary">
          Sign up
        </Link>
      </p>
    </div>
  )
}