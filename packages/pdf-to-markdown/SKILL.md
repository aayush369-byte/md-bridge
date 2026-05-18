---
name: pdf-to-markdown
description: Convert a digitally-generated PDF (not scanned) into structured Markdown, preserving headings (H1/H2/H3), bold/italic, super/subscript, hyperlinks, bulleted and numbered lists (with multi-level indent), tables, and paragraph flow. Adds YAML front matter from PDF metadata. No AI — heuristics on PyMuPDF font metadata combined with the PDF's outline (TOC) when present. Trigger when the user asks to "convert PDF to Markdown", "extract structured content from PDF", or names a .pdf and asks for .md output. Skip scanned/image-only PDFs (they need OCR first).
---

# PDF → Markdown (heuristic, no AI)

## When to use

- User has a digitally-generated PDF (text + font metadata intact) and wants Markdown that preserves structure.
- Works for any language (EN, PT-BR, ES, DE, etc.) — uses font metadata, not language understanding.

## When NOT to use

- Scanned/image-only PDFs → run OCR first. Test with `inspect_pdf.py`: if it shows 0 fonts/chars, it's scanned.
- PDFs with heavy multi-column layout, math formulas, or floating figures → output needs manual cleanup. See `REFERENCE.md`.

## Workflow

1. **Inspect** the PDF (per new document style):
   ```bash
   python .claude/skills/pdf-to-markdown/scripts/inspect_pdf.py "<input.pdf>"
   ```
   Reports: font size histogram, inferred body size, heading candidates, **and whether the PDF is tagged** (`/MarkInfo`, `/StructTreeRoot`, top structure tags).

2. **Convert**:
   ```bash
   python .claude/skills/pdf-to-markdown/scripts/convert.py "<input.pdf>" -o "output/<name>.md"
   ```
   Flags:
   - `--page-break` insert `---` between pages
   - `--with-images` extract images to `output/images/<pdf-stem>/` and reference them in the `.md` (default: off, no images pulled into the markdown)
   - `--no-front-matter` skip YAML front matter
   - `--debug` print inferred profile + TOC entry count

3. **Review** using `REFERENCE.md` (the post-conversion checklist).

## What it produces

```markdown
---
title: "DDP Syllabus"
author: "Stan Bühne"
date: "2024-06-26"
source: "ddp_foundationlevel_syllabus_en_v2.0.2.pdf"
pages: 37
---

# Foundation Level

### Terms of Use

All contents of this document, especially texts, photographs, graphics...

| Education Unit | Title | Level | Duration |
| --- | --- | --- | --- |
| EU 1 | Motivation for Digital Design | L2 | 30 min. |
```

## What it detects

| Element | Source signal |
|---|---|
| H1 / H2 / H3 | Font size relative to body (top 3 larger sizes), plus PDF outline (`doc.get_toc()`) for canonical titles. |
| Section labels | Body-size text in a non-body font OR bold-only short standalone line → H3. |
| Bold / italic | Font flags (bit 4 / bit 1) + font name contains "Bold"/"Italic"/"Oblique". |
| Superscript | Font flag bit 0 → wrapped in `<sup>...</sup>`. |
| Hyperlinks | `page.get_links()` bboxes intersected with span bboxes → `[text](url)`. |
| Bulleted lists | Lines starting with `▪ • ● ◦ ‣ ⁃ ∙` → `- `. |
| Numbered lists | `^\d+[.)]\s` or `^[a-z][.)]\s`. |
| List nesting | `(block.x0 - list_base_x0) / 18pt` → 2-space-per-level indent. |
| Tables | `page.find_tables()` with empty-column drop + wrapped-row merge. |
| Paragraphs | Block-level + merge when predecessor ends mid-phrase AND next starts lowercase / with `and·or·but` / comma / hyphen. |
| Front matter | `doc.metadata` (title, author, creationDate, subject, keywords) → YAML. |
| TOC dot leaders | `Title ........ 12` → stripped. |
| Headers/footers | Top 4% / bottom 4% of page → dropped. |

## How the PDF outline helps

If the PDF has a TOC outline (`doc.get_toc()`), it's used as the source of truth for chapter titles:
detected headings are matched against TOC entries; on match, the canonical title and level replace what the heuristic found. Fixes wrapped titles like "5 Structuring the building process from a Digital Design" + "perspective" automatically.

Tagged-PDF structure tags (`/H1`, `/P`, `/Table`) are **detected** by `inspect_pdf.py` but not yet used for conversion. The outline already covers most of the practical benefit.

## Cleanup behavior

- Re-running the converter on the same PDF wipes the prior images subdir before re-extracting (no stale files accumulate).
- Empty image dirs are removed at the end.
- The .md is overwritten in place.

## Files

- `SKILL.md` — this file
- `REFERENCE.md` — Word/PDF→Markdown capability table + post-conversion checklist
- `scripts/inspect_pdf.py` — font usage histogram + tagged-PDF detection
- `scripts/convert.py` — main converter
