import { expect, test } from '@playwright/test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const FIXTURE = path.resolve(
  here,
  '..',
  '..',
  '..',
  'Arquivos-pdf',
  'Design Digital',
  'ddp-factsheet-en.pdf',
)

test.beforeEach(async ({ context }) => {
  // Force English UI for stable assertions.
  await context.addInitScript(() => {
    window.localStorage.setItem('md-bridge:locale', 'en')
  })
})

test('PDF → Markdown end-to-end', async ({ page }) => {
  await page.goto('/convert/pdf-to-md')

  await page.locator('input[type="file"]').setInputFiles(FIXTURE)

  await expect(page.getByText('Pages')).toBeVisible({ timeout: 30_000 })

  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: /^convert$/i }).click()
  await expect(page.locator('.md-preview h1, .md-preview h2, .md-preview p').first()).toBeVisible({
    timeout: 30_000,
  })

  await page.getByRole('button', { name: /download \.md/i }).click()
  const download = await downloadPromise
  const stream = await download.createReadStream()
  const chunks: Buffer[] = []
  await new Promise<void>((resolve, reject) => {
    if (!stream) {
      reject(new Error('download stream missing'))
      return
    }
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
    stream.on('end', () => resolve())
    stream.on('error', reject)
  })
  const head = Buffer.concat(chunks).toString('utf-8').slice(0, 200)
  expect(head.startsWith('---\ntitle:')).toBeTruthy()
})
