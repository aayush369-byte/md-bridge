import { useCallback, useRef, useState } from 'react'
import {
  ApiError,
  convertMdToPdf,
  convertPdfToMd,
  type MdToPdfOptions,
  type PdfToMdOptions,
  type PdfToMdResponse,
} from '../lib/api'

type Status = 'idle' | 'loading' | 'success' | 'error'

interface PdfToMdState {
  status: Status
  result: PdfToMdResponse | null
  error: { code: string; message: string } | null
}

export function usePdfToMd() {
  const [state, setState] = useState<PdfToMdState>({ status: 'idle', result: null, error: null })
  const abortRef = useRef<AbortController | null>(null)

  const run = useCallback(async (file: File, options: PdfToMdOptions = {}) => {
    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl
    setState({ status: 'loading', result: null, error: null })
    try {
      const result = await convertPdfToMd(file, options, ctrl.signal)
      setState({ status: 'success', result, error: null })
      return result
    } catch (err) {
      if (ctrl.signal.aborted) return null
      const msg =
        err instanceof ApiError
          ? { code: err.code, message: err.message }
          : { code: 'unknown', message: (err as Error).message ?? 'Unknown failure' }
      setState({ status: 'error', result: null, error: msg })
      return null
    }
  }, [])

  const reset = useCallback(() => {
    abortRef.current?.abort()
    setState({ status: 'idle', result: null, error: null })
  }, [])

  return { ...state, run, reset }
}

interface MdToPdfState {
  status: Status
  blob: Blob | null
  url: string | null
  error: { code: string; message: string } | null
}

export function useMdToPdf() {
  const [state, setState] = useState<MdToPdfState>({
    status: 'idle',
    blob: null,
    url: null,
    error: null,
  })
  const urlRef = useRef<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const run = useCallback(async (file: File, options: MdToPdfOptions = {}) => {
    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl
    setState({ status: 'loading', blob: null, url: null, error: null })
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current)
      urlRef.current = null
    }
    try {
      const blob = await convertMdToPdf(file, options, ctrl.signal)
      const url = URL.createObjectURL(blob)
      urlRef.current = url
      setState({ status: 'success', blob, url, error: null })
      return { blob, url }
    } catch (err) {
      if (ctrl.signal.aborted) return null
      const msg =
        err instanceof ApiError
          ? { code: err.code, message: err.message }
          : { code: 'unknown', message: (err as Error).message ?? 'Unknown failure' }
      setState({ status: 'error', blob: null, url: null, error: msg })
      return null
    }
  }, [])

  const reset = useCallback(() => {
    abortRef.current?.abort()
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current)
      urlRef.current = null
    }
    setState({ status: 'idle', blob: null, url: null, error: null })
  }, [])

  return { ...state, run, reset }
}
