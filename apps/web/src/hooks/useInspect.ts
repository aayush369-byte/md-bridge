import { useCallback, useRef, useState } from 'react'
import { ApiError, inspectPdf, type InspectPdfResponse } from '../lib/api'

type Status = 'idle' | 'loading' | 'success' | 'error'

interface State {
  status: Status
  data: InspectPdfResponse | null
  error: { code: string; message: string } | null
}

export function useInspect() {
  const [state, setState] = useState<State>({ status: 'idle', data: null, error: null })
  const abortRef = useRef<AbortController | null>(null)

  const run = useCallback(async (file: File) => {
    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl
    setState({ status: 'loading', data: null, error: null })
    try {
      const data = await inspectPdf(file, ctrl.signal)
      setState({ status: 'success', data, error: null })
      return data
    } catch (err) {
      if (ctrl.signal.aborted) return null
      const msg =
        err instanceof ApiError
          ? { code: err.code, message: err.message }
          : { code: 'unknown', message: (err as Error).message ?? 'Unknown failure' }
      setState({ status: 'error', data: null, error: msg })
      return null
    }
  }, [])

  const reset = useCallback(() => {
    abortRef.current?.abort()
    setState({ status: 'idle', data: null, error: null })
  }, [])

  return { ...state, run, reset }
}
