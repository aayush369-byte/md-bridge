import { useState } from 'react'
import { Button } from '../components/Button'
import { ConvertButton } from '../components/ConvertButton'
import { DropZone } from '../components/DropZone'
import { MarkdownPreview } from '../components/MarkdownPreview'
import { ThemePicker } from '../components/ThemePicker'
import { Toast } from '../components/Toast'
import { useMdToPdf } from '../hooks/useConvert'
import { useTranslation } from '../i18n'

export function MdToPdf() {
  const { t } = useTranslation()
  const [file, setFile] = useState<File | null>(null)
  const [pasted, setPasted] = useState('')
  const [theme, setTheme] = useState('default')
  const [toast, setToast] = useState<{ kind: 'ok' | 'warn'; message: string } | null>(null)
  const convert = useMdToPdf()

  const sourceFile = (): File | null => {
    if (file) return file
    if (pasted.trim()) {
      return new File([pasted], t.mdToPdf.pastedFilename, { type: 'text/markdown' })
    }
    return null
  }

  const onConvert = async () => {
    const f = sourceFile()
    if (!f) return
    const res = await convert.run(f, { theme })
    if (res) {
      setToast({ kind: 'ok', message: t.mdToPdf.success })
      window.open(res.url, '_blank', 'noopener')
    }
  }

  const onDownload = () => {
    if (!convert.url || !convert.blob) return
    const a = document.createElement('a')
    a.href = convert.url
    const base = file?.name?.replace(/\.md$/i, '') ?? 'document'
    a.download = `${base}.pdf`
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  const previewMd = pasted.trim() || ''

  return (
    <div className="page container">
      <header className="page__head">
        <h1>{t.mdToPdf.title}</h1>
        <p>{t.mdToPdf.subtitle}</p>
      </header>

      <div className="grid-2">
        <div className="stack">
          <DropZone
            accept=".md,text/markdown"
            acceptLabel="Markdown"
            onFile={(f) => {
              setFile(f)
              setPasted('')
            }}
            file={file}
            disabled={convert.status === 'loading'}
          />
          <textarea
            className="md-input"
            placeholder={t.mdToPdf.paste}
            value={pasted}
            onChange={(e) => {
              setPasted(e.target.value)
              if (e.target.value) setFile(null)
            }}
            aria-label={t.mdToPdf.pasteLabel}
          />
          <ThemePicker value={theme} onChange={setTheme} />
          <div className="stack__actions">
            <ConvertButton
              status={convert.status}
              onClick={onConvert}
              disabled={!file && !pasted.trim()}
              labels={{
                idle: t.mdToPdf.generate,
                loading: t.mdToPdf.generating,
                success: t.pdfToMd.ready,
                error: t.mdToPdf.generate,
              }}
            />
            {convert.url && (
              <Button variant="ghost" onClick={onDownload}>
                {t.mdToPdf.download}
              </Button>
            )}
          </div>
          {convert.error && (
            <p role="alert" className="error">
              {convert.error.message}
            </p>
          )}
        </div>

        <div>
          {convert.url ? (
            <iframe
              title={t.mdToPdf.title}
              src={convert.url}
              className="pdf-preview"
            />
          ) : (
            <MarkdownPreview markdown={previewMd} empty={t.mdToPdf.previewEmpty} />
          )}
        </div>
      </div>
      {toast && <Toast {...toast} onDismiss={() => setToast(null)} />}
    </div>
  )
}
