import { NextPageContext } from 'next'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

interface ErrorProps {
  statusCode?: number
  message?: string
}

function Error({ statusCode, message }: ErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <AlertTriangle className="mx-auto h-16 w-16 text-yellow-500" />
        <h1 className="text-4xl font-bold">
          {statusCode ? `Error ${statusCode}` : 'An error occurred'}
        </h1>
        <p className="text-lg text-muted-foreground">
          {message || 'Sorry, something went wrong. Please try again later.'}
        </p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Try Again
        </Button>
      </div>
    </div>
  )
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error 