import { useEffect, useState } from 'react'
import { Button } from '../components/Button'
import { ConvertButton } from '../components/ConvertButton'
import { DiagnosticPanel } from '../components/DiagnosticPanel'
import { DropZone } from '../components/DropZone'
import { MarkdownPreview } from '../components/MarkdownPreview'
import { Toast } from '../components/Toast'
import { usePdfToMd } from '../hooks/useConvert'
import { useInspect } from '../hooks/useInspect'
import { useTranslation } from '../i18n'

export function PdfToMd() {
  const { t } = useTranslation()
  const [file, setFile] = useState<File | null>(null)
  const [toast, setToast] = useState<{ kind: 'ok' | 'warn'; message: string } | null>(null)
  const inspect = useInspect()
  const convert = usePdfToMd()

  useEffect(() => {
    if (!file) {
      inspect.reset()
      convert.reset()
      return
    }
    void inspect.run(file)
  }, [file]) // eslint-disable-line react-hooks/exhaustive-deps

  const onConvert = async () => {
    if (!file) return
    const res = await convert.run(file)
    if (res) setToast({ kind: 'ok', message: t.pdfToMd.success })
  }

  const onDownload = () => {
    if (!convert.result) return
    const blob = new Blob([convert.result.md], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = (file?.name ?? 'document.pdf').replace(/\.pdf$/i, '.md')
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="page container">
      <header className="page__head">
        <h1>{t.pdfToMd.title}</h1>
        <p>{t.pdfToMd.subtitle}</p>
      </header>

      <div className="grid-2">
        <div className="stack">
          <DropZone
            accept=".pdf,application/pdf"
            acceptLabel="PDF"
            onFile={setFile}
            file={file}
            disabled={convert.status === 'loading'}
          />
          <DiagnosticPanel
            data={inspect.data}
            loading={inspect.status === 'loading'}
            error={inspect.status === 'error' ? inspect.error?.message : null}
          />
          <div className="stack__actions">
            <ConvertButton
              status={convert.status}
              onClick={onConvert}
              disabled={!file}
              labels={{
                idle: t.pdfToMd.convert,
                loading: t.pdfToMd.converting,
                success: t.pdfToMd.ready,
                error: t.pdfToMd.convert,
              }}
            />
            {convert.result && (
              <Button variant="ghost" onClick={onDownload}>
                {t.pdfToMd.download}
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
          <MarkdownPreview
            markdown={convert.result?.md ?? ''}
            empty={t.pdfToMd.previewEmpty}
          />
          {convert.result?.warnings.length ? (
            <ul className="warnings" aria-label={t.pdfToMd.warnings}>
              {convert.result.warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
      {toast && <Toast {...toast} onDismiss={() => setToast(null)} />}
    </div>
  )
}
