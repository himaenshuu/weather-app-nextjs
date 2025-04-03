import { Component, ErrorInfo, ReactNode } from 'react'
import { toast } from 'react-hot-toast'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
    toast.error('Something went wrong. Please try again.')
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Something went wrong
            </h2>
            <button
              onClick={() => {
                this.setState({ hasError: false })
                window.location.reload()
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
} 