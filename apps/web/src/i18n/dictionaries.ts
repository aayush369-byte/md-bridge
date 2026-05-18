export type Locale = 'en' | 'pt'

export const LOCALES: { code: Locale; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'pt', label: 'Português' },
]

interface Dictionary {
  nav: {
    pdfToMd: string
    mdToPdf: string
    about: string
  }
  home: {
    title: string
    subtitle: string
    cards: {
      pdfToMd: { title: string; body: string; cta: string }
      mdToPdf: { title: string; body: string; cta: string }
    }
  }
  pdfToMd: {
    title: string
    subtitle: string
    convert: string
    converting: string
    ready: string
    download: string
    previewEmpty: string
    success: string
    warnings: string
  }
  mdToPdf: {
    title: string
    subtitle: string
    paste: string
    pasteLabel: string
    generate: string
    generating: string
    download: string
    previewEmpty: string
    pastedFilename: string
    success: string
  }
  about: {
    title: string
    intro: string
    how: { title: string; p1: string; p2: string }
    limits: { title: string; items: string[] }
    more: { title: string; body: string }
  }
  dropzone: {
    dropFile: (label: string) => string
    orClick: string
    sizeHint: (size: string) => string
    invalidType: (label: string) => string
    ariaLabel: (label: string) => string
  }
  diag: {
    title: string
    pages: string
    body: string
    headings: string
    tagged: string
    yes: string
    no: string
    loading: string
    empty: string
    fonts: (count: number) => string
    chars: string
    needsOcr: string
  }
  theme: {
    legend: string
    loading: string
    none: string
    errorPrefix: string
  }
  errors: {
    unknown: string
    themesUnavailable: string
  }
  languageSwitcher: {
    label: string
  }
}

const en: Dictionary = {
  nav: {
    pdfToMd: 'PDF · MD',
    mdToPdf: 'MD · PDF',
    about: 'About',
  },
  home: {
    title: 'Convert PDF and Markdown locally.',
    subtitle:
      'Deterministic heuristics between PDF and Markdown. Same input, same output, every run. No cloud, no subscriptions.',
    cards: {
      pdfToMd: {
        title: 'PDF → Markdown',
        body: 'Extracts structure: headings by font size, lists, tables and front matter. No OCR in v1.',
        cta: 'Convert a PDF',
      },
      mdToPdf: {
        title: 'Markdown → PDF',
        body: 'Renders via headless Chromium with a CSS theme of your choice. Consistent output, no GTK or wkhtmltopdf.',
        cta: 'Generate a PDF',
      },
    },
  },
  pdfToMd: {
    title: 'PDF to Markdown',
    subtitle: 'Upload a PDF and extract its content as structured Markdown.',
    convert: 'Convert',
    converting: 'Converting',
    ready: 'Ready',
    download: 'Download .md',
    previewEmpty: 'The Markdown will appear here after conversion.',
    success: 'Markdown generated.',
    warnings: 'Warnings',
  },
  mdToPdf: {
    title: 'Markdown to PDF',
    subtitle: 'Upload a .md file or paste text and generate a PDF with a CSS theme.',
    paste: 'Or paste markdown here...',
    pasteLabel: 'Pasted markdown',
    generate: 'Generate PDF',
    generating: 'Generating',
    download: 'Download .pdf',
    previewEmpty: 'The preview will appear here after generation.',
    pastedFilename: 'pasted.md',
    success: 'PDF generated.',
  },
  about: {
    title: 'About md-bridge',
    intro:
      'Local conversion tool between PDF and Markdown. Everything runs through hand-written heuristics in Python with PyMuPDF and headless Chromium. The conversion is deterministic and stays on the host: no uploads to external services.',
    how: {
      title: 'How it works',
      p1:
        'PyMuPDF inspects the PDF: font size, weight, position and the document outline drive heading detection. Lists, tables and paragraphs come from block geometry. The output ships with a YAML front matter carrying file metadata.',
      p2:
        'The reverse path renders Markdown to HTML, applies a CSS theme and prints to PDF through Chromium via Playwright.',
    },
    limits: {
      title: 'Known limits',
      items: [
        'No OCR in v1. Scanned PDFs need Tesseract first.',
        'Complex tables with merged cells can be flattened.',
        'Repeated headers and footers are heuristically dropped.',
      ],
    },
    more: {
      title: 'More details',
      body:
        'See REFERENCE.md inside packages/pdf-to-markdown/ for the heuristic internals, and docs/API.md for the REST walkthrough.',
    },
  },
  dropzone: {
    dropFile: (label) => `Drop a ${label}`,
    orClick: 'or click to select',
    sizeHint: (size) => `${size} · click to change`,
    invalidType: (label) => `Invalid type. Expected ${label}.`,
    ariaLabel: (label) => `Drop a ${label} file or click to choose`,
  },
  diag: {
    title: 'PDF diagnostics',
    pages: 'Pages',
    body: 'Body',
    headings: 'Detected headings',
    tagged: 'PDF/UA tagged',
    yes: 'yes',
    no: 'no',
    loading: 'Analyzing PDF...',
    empty: 'Upload a PDF to see diagnostics.',
    fonts: (count) => `Fonts (${count})`,
    chars: 'chars',
    needsOcr:
      'Little extractable text. PDF is likely scanned — run OCR before converting.',
  },
  theme: {
    legend: 'Theme',
    loading: 'Loading themes...',
    none: 'No themes available.',
    errorPrefix: 'Could not load themes:',
  },
  errors: {
    unknown: 'Unknown failure',
    themesUnavailable: 'Could not load themes',
  },
  languageSwitcher: {
    label: 'Language',
  },
}

const pt: Dictionary = {
  nav: {
    pdfToMd: 'PDF · MD',
    mdToPdf: 'MD · PDF',
    about: 'Sobre',
  },
  home: {
    title: 'Converta PDF e Markdown local.',
    subtitle:
      'Heurística determinística entre PDF e Markdown. Mesma entrada, mesma saída, em toda execução. Sem nuvem, sem assinatura.',
    cards: {
      pdfToMd: {
        title: 'PDF → Markdown',
        body: 'Extrai estrutura: títulos por tamanho de fonte, listas, tabelas e front matter. Sem OCR no v1.',
        cta: 'Converter um PDF',
      },
      mdToPdf: {
        title: 'Markdown → PDF',
        body: 'Renderiza via Chromium headless com tema CSS escolhido por você. Saída consistente, sem GTK ou wkhtmltopdf.',
        cta: 'Gerar um PDF',
      },
    },
  },
  pdfToMd: {
    title: 'PDF para Markdown',
    subtitle: 'Suba um PDF e extraia o conteúdo como Markdown estruturado.',
    convert: 'Converter',
    converting: 'Convertendo',
    ready: 'Pronto',
    download: 'Baixar .md',
    previewEmpty: 'O Markdown aparece aqui depois da conversão.',
    success: 'Markdown gerado.',
    warnings: 'Avisos',
  },
  mdToPdf: {
    title: 'Markdown para PDF',
    subtitle: 'Suba um .md ou cole texto e gere um PDF com tema CSS.',
    paste: 'Ou cole markdown aqui...',
    pasteLabel: 'Markdown colado',
    generate: 'Gerar PDF',
    generating: 'Gerando',
    download: 'Baixar .pdf',
    previewEmpty: 'O preview aparece aqui depois da geração.',
    pastedFilename: 'colado.md',
    success: 'PDF gerado.',
  },
  about: {
    title: 'Sobre o md-bridge',
    intro:
      'Ferramenta local de conversão entre PDF e Markdown. Toda a lógica é heurística, escrita em Python com PyMuPDF e Chromium headless. A conversão é determinística e roda no seu host: nenhum upload para serviços externos.',
    how: {
      title: 'Como funciona',
      p1:
        'O PyMuPDF analisa o PDF: tamanho de fonte, peso, posição e o índice nativo guiam a detecção de títulos. Listas, tabelas e parágrafos vêm da geometria dos blocos. A saída traz um front matter YAML com metadados do arquivo.',
      p2:
        'O caminho reverso renderiza Markdown como HTML, aplica um CSS de tema e usa Playwright para imprimir em PDF via Chromium.',
    },
    limits: {
      title: 'Limites conhecidos',
      items: [
        'Sem OCR no v1. PDFs escaneados precisam de Tesseract antes.',
        'Tabelas complexas com células mescladas podem ser achatadas.',
        'Cabeçalhos e rodapés repetidos são heuristicamente ignorados.',
      ],
    },
    more: {
      title: 'Mais detalhes',
      body:
        'Veja REFERENCE.md em packages/pdf-to-markdown/ para os bastidores da heurística, e docs/API.md para o passo a passo da REST.',
    },
  },
  dropzone: {
    dropFile: (label) => `Solte um ${label}`,
    orClick: 'ou clique para selecionar',
    sizeHint: (size) => `${size} · clique para trocar`,
    invalidType: (label) => `Tipo inválido. Esperado ${label}.`,
    ariaLabel: (label) => `Solte um arquivo ${label} ou clique para escolher`,
  },
  diag: {
    title: 'Diagnóstico do PDF',
    pages: 'Páginas',
    body: 'Corpo',
    headings: 'Headings detectados',
    tagged: 'PDF/UA marcado',
    yes: 'sim',
    no: 'não',
    loading: 'Analisando PDF...',
    empty: 'Suba um PDF para ver o diagnóstico.',
    fonts: (count) => `Fontes (${count})`,
    chars: 'chars',
    needsOcr:
      'Pouco texto extraível. PDF provavelmente escaneado, rode OCR antes de converter.',
  },
  theme: {
    legend: 'Tema',
    loading: 'Carregando temas...',
    none: 'Nenhum tema disponível.',
    errorPrefix: 'Não foi possível carregar temas:',
  },
  errors: {
    unknown: 'Falha desconhecida',
    themesUnavailable: 'Não foi possível carregar temas',
  },
  languageSwitcher: {
    label: 'Idioma',
  },
}

export const DICTIONARIES: Record<Locale, Dictionary> = { en, pt }

export type { Dictionary }
