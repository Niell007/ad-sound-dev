export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number[]>

  private constructor() {
    this.metrics = new Map()
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  startTimer(key: string): () => number {
    const start = performance.now()
    return () => {
      const duration = performance.now() - start
      if (!this.metrics.has(key)) {
        this.metrics.set(key, [])
      }
      this.metrics.get(key)?.push(duration)
      return duration
    }
  }

  getMetrics(key: string) {
    const measurements = this.metrics.get(key) || []
    if (measurements.length === 0) return null

    return {
      average: measurements.reduce((a, b) => a + b, 0) / measurements.length,
      min: Math.min(...measurements),
      max: Math.max(...measurements),
      count: measurements.length,
    }
  }

  clearMetrics(key?: string) {
    if (key) {
      this.metrics.delete(key)
    } else {
      this.metrics.clear()
    }
  }
} 