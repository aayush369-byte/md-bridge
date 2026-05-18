import { Button } from './Button'
import { useTranslation } from '../i18n'

type Status = 'idle' | 'loading' | 'success' | 'error'

interface ConvertButtonProps {
  status: Status
  onClick: () => void
  disabled?: boolean
  labels?: {
    idle?: string
    loading?: string
    success?: string
    error?: string
  }
}

export function ConvertButton({ status, onClick, disabled, labels }: ConvertButtonProps) {
  const { t } = useTranslation()
  const defaults = {
    idle: t.pdfToMd.convert,
    loading: t.pdfToMd.converting,
    success: t.pdfToMd.ready,
    error: t.pdfToMd.convert,
  }
  const merged = { ...defaults, ...labels }
  const label = merged[status] ?? merged.idle
  return (
    <Button
      onClick={onClick}
      disabled={disabled || status === 'loading'}
      loading={status === 'loading'}
      variant={status === 'error' ? 'ghost' : 'primary'}
    >
      {label}
    </Button>
  )
}
