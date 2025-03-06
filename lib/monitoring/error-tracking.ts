type ErrorMetadata = Record<string, any>

export class ErrorTracker {
  private static instance: ErrorTracker
  private errors: Array<{
    error: Error
    metadata: ErrorMetadata
    timestamp: Date
  }> = []

  private constructor() {
    this.setupGlobalErrorHandler()
  }

  static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker()
    }
    return ErrorTracker.instance
  }

  private setupGlobalErrorHandler() {
    if (typeof window !== 'undefined') {
      window.onerror = (msg, url, line, col, error) => {
        this.captureError(error || new Error(String(msg)), {
          url,
          line,
          col,
        })
      }

      window.onunhandledrejection = (event) => {
        this.captureError(event.reason, {
          type: 'unhandledRejection',
        })
      }
    }
  }

  captureError(error: Error, metadata: ErrorMetadata = {}) {
    this.errors.push({
      error,
      metadata: {
        ...metadata,
        url: typeof window !== 'undefined' ? window.location.href : '',
      },
      timestamp: new Date(),
    })

    // You can integrate with external error tracking services here
    console.error('Error captured:', {
      message: error.message,
      stack: error.stack,
      metadata,
    })
  }

  getErrors() {
    return this.errors
  }

  clearErrors() {
    this.errors = []
  }
} 