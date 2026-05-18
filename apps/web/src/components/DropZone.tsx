import { useCallback, useRef, useState, type DragEvent } from 'react'
import { useTranslation } from '../i18n'
import './DropZone.css'

interface DropZoneProps {
  accept: string
  acceptLabel: string
  onFile: (file: File) => void
  disabled?: boolean
  file?: File | null
}

function matchesAccept(file: File, accept: string): boolean {
  const tokens = accept
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
  if (tokens.length === 0) return true
  const name = file.name.toLowerCase()
  const mime = file.type.toLowerCase()
  return tokens.some((t) => {
    if (t.startsWith('.')) return name.endsWith(t)
    return mime === t
  })
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export function DropZone({ accept, acceptLabel, onFile, disabled = false, file }: DropZoneProps) {
  const { t } = useTranslation()
  const [over, setOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleFile = useCallback(
    (selected: File) => {
      if (!matchesAccept(selected, accept)) {
        setError(t.dropzone.invalidType(acceptLabel))
        return
      }
      setError(null)
      onFile(selected)
    },
    [accept, acceptLabel, onFile, t.dropzone],
  )

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setOver(false)
    if (disabled) return
    const f = event.dataTransfer.files?.[0]
    if (f) handleFile(f)
  }

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (!disabled) setOver(true)
  }

  const onDragLeave = () => setOver(false)

  return (
    <div
      className={`dropzone ${over ? 'is-over' : ''} ${disabled ? 'is-disabled' : ''}`.trim()}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(e) => {
        if (disabled) return
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          inputRef.current?.click()
        }
      }}
      aria-disabled={disabled || undefined}
      aria-label={t.dropzone.ariaLabel(acceptLabel)}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="dropzone__input"
        disabled={disabled}
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) handleFile(f)
          e.target.value = ''
        }}
      />
      <div className="dropzone__inner">
        {file ? (
          <>
            <strong className="dropzone__name">{file.name}</strong>
            <span className="dropzone__hint">{t.dropzone.sizeHint(formatSize(file.size))}</span>
          </>
        ) : (
          <>
            <strong className="dropzone__name">{t.dropzone.dropFile(acceptLabel)}</strong>
            <span className="dropzone__hint">{t.dropzone.orClick}</span>
          </>
        )}
        {error && (
          <span className="dropzone__error" role="alert">
            {error}
          </span>
        )}
      </div>
    </div>
  )
}
