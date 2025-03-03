import { Icons } from '@/components/icons'

export default function AuthLoading() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Icons.logo className="mx-auto h-6 w-6 animate-pulse" />
          <h1 className="text-2xl font-semibold tracking-tight animate-pulse">
            Loading...
          </h1>
          <div className="h-4 w-3/4 mx-auto bg-muted animate-pulse rounded" />
        </div>
        <div className="space-y-4">
          <div className="h-10 bg-muted animate-pulse rounded" />
          <div className="h-10 bg-muted animate-pulse rounded" />
          <div className="h-10 bg-muted animate-pulse rounded" />
        </div>
      </div>
    </div>
  )
} 