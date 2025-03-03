"use client"

import { Suspense, useState } from "react"
import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const DynamicChart = dynamic(
  () => import("./payment-chart").then((mod) => mod.PaymentChart).catch((err) => {
    console.error('Error loading chart:', err)
    return () => <ChartError />
  }),
  {
    loading: () => <ChartSkeleton />,
    ssr: false
  }
)

function ChartError() {
  return (
    <Card className="w-full h-[350px]">
      <CardContent className="flex flex-col items-center justify-center h-full space-y-4">
        <AlertTriangle className="h-12 w-12 text-yellow-500" />
        <div className="text-center">
          <h3 className="font-semibold">Failed to load chart</h3>
          <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
        </div>
      </CardContent>
    </Card>
  )
}

function ChartSkeleton() {
  return (
    <div className="w-full h-[350px] flex items-center justify-center">
      <div className="space-y-4 w-full">
        <Skeleton className="h-[300px] w-full" />
        <div className="flex justify-between">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-8" />
          ))}
        </div>
      </div>
    </div>
  )
}

export function Overview() {
  const [error, setError] = useState<Error | null>(null)

  if (error) {
    return <ChartError />
  }

  return (
    <Suspense fallback={<ChartSkeleton />}>
      <DynamicChart />
    </Suspense>
  )
}

