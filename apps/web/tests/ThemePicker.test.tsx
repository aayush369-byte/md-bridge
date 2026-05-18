import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ThemePicker } from '../src/components/ThemePicker'
import { I18nProvider } from '../src/i18n'

function renderWithI18n(ui: React.ReactNode) {
  return render(<I18nProvider initialLocale="en">{ui}</I18nProvider>)
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('ThemePicker', () => {
  it('lists themes from the API and reflects selection', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(
      async () =>
        new Response(
          JSON.stringify([
            { id: 'default', name: 'Default A4' },
            { id: 'editorial', name: 'Editorial' },
          ]),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
    )

    let current = 'default'
    const onChange = vi.fn((id: string) => {
      current = id
    })

    const { rerender } = renderWithI18n(<ThemePicker value={current} onChange={onChange} />)
    await waitFor(() => expect(screen.getByText('Default A4')).toBeInTheDocument())
    expect(screen.getByText('Editorial')).toBeInTheDocument()

    await userEvent.click(screen.getByLabelText('Editorial'))
    expect(onChange).toHaveBeenCalledWith('editorial')

    rerender(
      <I18nProvider initialLocale="en">
        <ThemePicker value="editorial" onChange={onChange} />
      </I18nProvider>,
    )
    const editorialRadio = screen.getByLabelText('Editorial') as HTMLInputElement
    expect(editorialRadio.checked).toBe(true)
  })
})
