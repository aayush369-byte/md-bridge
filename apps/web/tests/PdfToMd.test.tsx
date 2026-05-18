import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PdfToMd } from '../src/pages/PdfToMd'
import { I18nProvider } from '../src/i18n'

afterEach(() => {
  vi.restoreAllMocks()
})

function renderPage() {
  return render(
    <I18nProvider initialLocale="en">
      <MemoryRouter>
        <PdfToMd />
      </MemoryRouter>
    </I18nProvider>,
  )
}

function mockApi() {
  vi.spyOn(globalThis, 'fetch').mockImplementation(async (input: RequestInfo | URL) => {
    const url = typeof input === 'string' ? input : input.toString()
    if (url.endsWith('/api/inspect-pdf')) {
      return new Response(
        JSON.stringify({
          pages: 1,
          body_size_pt: 11.0,
          heading_sizes_pt: [18, 14],
          fonts: [{ name: 'Body', size: 11, count: 100, sample: 'hello' }],
          tagged: false,
          needs_ocr: false,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      )
    }
    if (url.endsWith('/api/pdf-to-md')) {
      return new Response(
        JSON.stringify({
          md: '# Title\n\nbody.',
          front_matter: { source: 'doc.pdf', pages: 1 },
          warnings: [],
          stats: { headings: 1, tables: 0, bullets: 0 },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      )
    }
    return new Response('not mocked', { status: 500 })
  })
}

describe('PdfToMd page', () => {
  it('inspects on upload, converts on click, shows the preview', async () => {
    mockApi()
    renderPage()

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    expect(fileInput).not.toBeNull()
    const file = new File([new Uint8Array(10)], 'doc.pdf', { type: 'application/pdf' })
    await userEvent.upload(fileInput, file)

    await waitFor(() => expect(screen.getByText('Pages')).toBeInTheDocument())

    const button = screen.getByRole('button', { name: /^convert$/i })
    await userEvent.click(button)

    await waitFor(() => expect(screen.getByText('Title')).toBeInTheDocument())
  })
})
