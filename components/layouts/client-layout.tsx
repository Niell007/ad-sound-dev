'use client'

import { ErrorBoundary } from "react-error-boundary"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthProvider } from "@/contexts/auth-context"
import { RBACProvider } from "@/contexts/rbac-context"
import { Providers } from "@/app/providers"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CustomToastProvider } from "@/components/ui/custom-toast-provider"

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <AlertTriangle className="mx-auto h-16 w-16 text-yellow-500" />
        <h1 className="text-4xl font-bold">Something went wrong</h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <Button onClick={resetErrorBoundary} variant="outline">
          Try Again
        </Button>
      </div>
    </div>
  )
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CustomToastProvider>
      <AuthProvider>
        <RBACProvider>
          <Providers>
            <ErrorBoundary
              FallbackComponent={ErrorFallback}
              onReset={() => window.location.reload()}
            >
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </div>
            </ErrorBoundary>
          </Providers>
        </RBACProvider>
      </AuthProvider>
    </CustomToastProvider>
  )
} 