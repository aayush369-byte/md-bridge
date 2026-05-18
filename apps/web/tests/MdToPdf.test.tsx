import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MdToPdf } from '../src/pages/MdToPdf'
import { I18nProvider } from '../src/i18n'

const PDF_BYTES = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31])

function renderPage() {
  return render(
    <I18nProvider initialLocale="en">
      <MemoryRouter>
        <MdToPdf />
      </MemoryRouter>
    </I18nProvider>,
  )
}

beforeEach(() => {
  if (!('createObjectURL' in URL)) {
    Object.defineProperty(URL, 'createObjectURL', { value: vi.fn(() => 'blob:test'), writable: true })
    Object.defineProperty(URL, 'revokeObjectURL', { value: vi.fn(), writable: true })
  } else {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined)
  }
  vi.spyOn(window, 'open').mockImplementation(() => null)
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('MdToPdf page', () => {
  it('accepts pasted markdown and generates a PDF blob', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : input.toString()
      if (url.endsWith('/api/themes')) {
        return new Response(JSON.stringify([{ id: 'default', name: 'Default A4' }]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      }
      if (url.endsWith('/api/md-to-pdf')) {
        return new Response(PDF_BYTES, {
          status: 200,
          headers: { 'Content-Type': 'application/pdf' },
        })
      }
      return new Response('not mocked', { status: 500 })
    })

    renderPage()

    const textarea = screen.getByLabelText(/pasted markdown/i)
    await userEvent.type(textarea, '# hello')

    await waitFor(() => expect(screen.getByText('Default A4')).toBeInTheDocument())

    const button = screen.getByRole('button', { name: /generate pdf/i })
    await userEvent.click(button)

    await waitFor(() => expect(URL.createObjectURL).toHaveBeenCalled())
    expect(window.open).toHaveBeenCalledWith('blob:test', '_blank', 'noopener')
  })
})
