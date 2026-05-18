import { useEffect } from 'react'

interface ToastProps {
  kind?: 'info' | 'ok' | 'warn'
  message: string
  onDismiss: () => void
  duration?: number
}

export function Toast({ kind = 'info', message, onDismiss, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const id = window.setTimeout(onDismiss, duration)
    return () => window.clearTimeout(id)
  }, [duration, onDismiss])

  return (
    <div className={`toast toast--${kind}`} role="status">
      {message}
    </div>
  )
}
