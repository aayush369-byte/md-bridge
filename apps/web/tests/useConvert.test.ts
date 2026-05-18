import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { usePdfToMd } from '../src/hooks/useConvert'

function mockFetch(impl: (url: string, init?: RequestInit) => Promise<Response>) {
  vi.spyOn(globalThis, 'fetch').mockImplementation(impl as never)
}

describe('usePdfToMd', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('moves idle → loading → success', async () => {
    mockFetch(
      async () =>
        new Response(
          JSON.stringify({
            md: '# Hello',
            front_matter: {},
            warnings: [],
            stats: { headings: 1, tables: 0, bullets: 0 },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
    )

    const { result } = renderHook(() => usePdfToMd())
    expect(result.current.status).toBe('idle')

    const file = new File([new Uint8Array(10)], 'doc.pdf', { type: 'application/pdf' })
    await act(async () => {
      await result.current.run(file)
    })

    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.result?.md).toBe('# Hello')
  })

  it('captures an error envelope', async () => {
    mockFetch(
      async () =>
        new Response(
          JSON.stringify({ error: { code: 'wrong_file_type', message: 'Expected PDF' } }),
          { status: 400, headers: { 'Content-Type': 'application/json' } },
        ),
    )

    const { result } = renderHook(() => usePdfToMd())
    const file = new File([new Uint8Array(10)], 'note.txt', { type: 'text/plain' })
    await act(async () => {
      await result.current.run(file)
    })
    await waitFor(() => expect(result.current.status).toBe('error'))
    expect(result.current.error?.code).toBe('wrong_file_type')
  })
})
