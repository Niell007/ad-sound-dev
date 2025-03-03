import { Metadata } from "next"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import ClientLayout from "@/components/layouts/client-layout"

export const metadata: Metadata = {
  title: "Soundmaster - Professional Audio Solutions",
  description: "Professional sound and audio equipment rental in Tzaneen, Limpopo. Perfect for parties, weddings, and events.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <ClientLayout>
          {children}
          <Toaster />
        </ClientLayout>
      </body>
    </html>
  )
}