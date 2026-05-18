import ReactMarkdown from 'react-markdown'
import './MarkdownPreview.css'

interface MarkdownPreviewProps {
  markdown: string
  empty?: string
}

export function MarkdownPreview({ markdown, empty = '' }: MarkdownPreviewProps) {
  if (!markdown.trim()) {
    return <div className="md-preview md-preview--empty">{empty}</div>
  }
  return (
    <div className="md-preview">
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  )
}
