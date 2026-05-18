---
name: markdown-to-pdf
description: Convert a structured Markdown file to a clean, well-typeset PDF using HTML + CSS via WeasyPrint. Reads YAML front matter for title/author/date, applies a CSS theme for the visual style, and supports A4 page format with auto page numbers, footnotes, tables, code blocks, and internal links. No external binaries needed (no Pandoc, no wkhtmltopdf). Trigger when the user asks to "convert markdown to pdf", "render md to pdf", "generate PDF from markdown", or names a .md file and asks for .pdf output.
---

# Markdown → PDF (HTML + CSS via WeasyPrint)

## When to use

- User has a `.md` file (usually one produced by the `pdf-to-markdown` skill) and wants a printable PDF.
- User wants a custom-styled PDF without installing Pandoc, LaTeX, or wkhtmltopdf.
- Output target: A4, screen-readable, with title page, headings, tables, code blocks, footnotes, links.

## When NOT to use

- Pixel-perfect reproduction of a source PDF (requires LaTeX template per document family, out of scope).
- Math-heavy content with MathJax/KaTeX rendering (WeasyPrint doesn't run JS).
- Very long docs (1000+ pages) where memory becomes a concern.

## Stack

| Layer | Tool | Why |
|---|---|---|
| MD → HTML | Python `markdown` lib (extensions: extra, tables, fenced_code, footnotes, toc, smarty, md_in_html) | Standard CommonMark + extensions |
| HTML + CSS → PDF | Playwright (headless Chromium) | Full CSS print support (@page, counters, page-break-*), modern CSS, no GTK/wkhtmltopdf binary needed on Windows |
| Theme | CSS file in `templates/` | Easily swappable per project |

Both libs already installed in this environment:
- `Markdown==3.10.2`
- `playwright==1.58.0` (+ Chromium binary)

First-time setup (if Playwright's Chromium isn't installed yet):
```bash
playwright install chromium
```

## Workflow

1. **Convert** with the default theme:
   ```bash
   python .claude/skills/markdown-to-pdf/scripts/convert.py "<input.md>" -o "<output.pdf>"
   ```

2. **Convert** with a custom CSS:
   ```bash
   python .claude/skills/markdown-to-pdf/scripts/convert.py "<input.md>" -o "<output.pdf>" --css path/to/theme.css
   ```

3. **Stack multiple CSS files** (e.g. base + overrides):
   ```bash
   python .claude/skills/markdown-to-pdf/scripts/convert.py "<input.md>" -o "<output.pdf>" \
     --css .claude/skills/markdown-to-pdf/templates/default.css \
     --css my_brand_overrides.css
   ```

4. **Set the HTML lang** (defaults to `pt-BR`):
   ```bash
   python .claude/skills/markdown-to-pdf/scripts/convert.py "<input.md>" -o "<output.pdf>" --lang en
   ```

## What the default theme provides

- A4, 2.5cm × 2cm margins
- Page number "N / Total" at the bottom (hidden on first page)
- Segoe UI sans-serif for body and headings, Consolas for code
- 11pt body, justified text with hyphenation
- H1 always starts a new page (except the first one)
- Heading hierarchy with sensible spacing
- Tables: collapsed borders, header row shaded, `page-break-inside: avoid`
- Code: inline gray pill + fenced block with border
- Blockquotes with left border + tinted background
- `<small>` for captions

## Front matter

If the `.md` starts with YAML front matter, `title` is used for the HTML `<title>`. The front matter block is stripped from the body before rendering, so it doesn't appear in the PDF.

```yaml
---
title: "Foundation Level Syllabus"
author: "Stan Bühne"
date: "2024-06-26"
---
```

Future extension: a "cover page" template that renders title/author/date from the front matter as a styled first page.

## Planned extensions (not yet implemented)

These were intentionally left as next steps to be designed with the user:

- **Theme variants** in `templates/` — corporate, academic, brand-specific (Edge/Vertex).
- **Cover page block** rendered from front matter (title, author, date, logo).
- **TOC generation** from headings (`[TOC]` placeholder + CSS for the listing).
- **Watermark / draft stamp** via `@page` background.
- **Per-section page breaks** controlled by front matter directives.
- **Image resolution check** (warn when an embedded image is below print DPI).

## Files

- `SKILL.md` — this file
- `scripts/convert.py` — main converter (MD → HTML → PDF)
- `templates/default.css` — neutral A4 print theme

## Round-trip with pdf-to-markdown

The two skills are designed to pair:

```bash
# PDF → MD (structure-preserving)
python .claude/skills/pdf-to-markdown/scripts/convert.py "input.pdf" -o "doc.md"

# MD → PDF (styled, not pixel-identical to original)
python .claude/skills/markdown-to-pdf/scripts/convert.py "doc.md" -o "doc-rendered.pdf"
```

The round-trip does NOT reproduce the original PDF's exact look — fonts, colors, and layout decisions come from the CSS theme. What's preserved is the **semantic structure** (headings, lists, tables, emphasis, links).
