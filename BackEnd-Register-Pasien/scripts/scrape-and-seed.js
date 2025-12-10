import axios from 'axios'
import { load as cheerioLoad } from 'cheerio'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const TARGET_URL = process.env.SCRAPE_URL || 'https://example.com'

async function fetchHtml(url) {
  const res = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
    timeout: 20000,
    validateStatus: s => s >= 200 && s < 400,
  })
  const html = res.data
  if (process.env.SCRAPE_DEBUG === '1') {
    // Save raw HTML for inspection
    try {
      const fs = await import('node:fs/promises')
      await fs.writeFile(new URL('./out.html', import.meta.url), html)
      console.log('[debug] Saved HTML to scripts/out.html')
    } catch (e) {
      console.warn('[debug] Failed to save HTML:', e.message)
    }
  }
  return html
}

function absolutize(base, maybeUrl) {
  try {
    if (!maybeUrl) return null
    if (maybeUrl.startsWith('http')) return maybeUrl
    const b = new URL(base)
    return new URL(maybeUrl, b).toString()
  } catch { return maybeUrl }
}

async function scrapeDoctors() {
  const html = await fetchHtml(TARGET_URL)
  const $ = cheerioLoad(html)
  const items = []
  if (process.env.SCRAPE_DEBUG === '1') {
    console.log('[debug] doctor-card count:', $('.doctor-card').length)
    console.log('[debug] card-dokter count:', $('.card-dokter').length)
    console.log('[debug] doctor-item count:', $('.doctor-item').length)
    console.log('[debug] list-doctor .item count:', $('.list-doctor .item').length)
    console.log('[debug] table rows:', $('table tbody tr').length)
  }

  // TODO: Update selectors according to the real website structure
  $('.doctor-card, .card-dokter, .doctor-item, .list-doctor .item').each((_, el) => {
    const name = $(el).find('.doctor-name').text().trim()
    const specialization = $(el).find('.doctor-specialization, .spesialis, .specialization').text().trim()
    const phone = $(el).find('.doctor-phone, .phone').text().trim() || null
    const imgSrc = $(el).find('img').attr('src') || null
    const photo = absolutize(TARGET_URL, imgSrc)
    const shift = $(el).find('.doctor-shift, .shift').text().trim() || null
    if (name && specialization) {
      items.push({ name, specialization, phone, photo, shift })
    }
  })

  if (items.length === 0) {
    // Try table-based layout
    $('table tbody tr').each((_, el) => {
      const tds = $(el).find('td')
      const name = $(tds[0]).text().trim()
      const specialization = $(tds[1]).text().trim()
      const phone = $(tds[2])?.text()?.trim() || null
      const photo = null
      const shift = null
      if (name && specialization) items.push({ name, specialization, phone, photo, shift })
    })
  }
  return items
}

async function scrapePolis() {
  const html = await fetchHtml(TARGET_URL)
  const $ = cheerioLoad(html)
  const items = []
  if (process.env.SCRAPE_DEBUG === '1') {
    console.log('[debug] poli-card count:', $('.poli-card').length)
    console.log('[debug] card-poli count:', $('.card-poli').length)
    console.log('[debug] poli-item count:', $('.poli-item').length)
    console.log('[debug] list-poli .item count:', $('.list-poli .item').length)
    console.log('[debug] table rows:', $('table tbody tr').length)
  }

  // TODO: Update selectors according to the real website structure
  $('.poli-card, .card-poli, .poli-item, .list-poli .item').each((_, el) => {
    const name = $(el).find('.poli-name, .name').text().trim()
    if (name) items.push({ name })
  })
  if (items.length === 0) {
    $('table tbody tr').each((_, el) => {
      const tds = $(el).find('td')
      const name = $(tds[0]).text().trim()
      if (name) items.push({ name })
    })
  }
  return items
}

async function seedPolis(polis) {
  for (const p of polis) {
    await prisma.polis.upsert({
      where: { name: p.name },
      update: {},
      create: { name: p.name },
    })
  }
}

async function seedDoctors(doctors) {
  for (const d of doctors) {
    await prisma.dokters.create({
      data: {
        name: d.name,
        specialization: d.specialization,
        phone: d.phone,
        photo: d.photo,
        shift: d.shift,
      },
    })
  }
}

async function main() {
  console.log('Scraping from', TARGET_URL)
  const [polis, doctors] = await Promise.all([scrapePolis(), scrapeDoctors()])
  console.log(`Found polis: ${polis.length}, doctors: ${doctors.length}`)
  if (polis.length === 0 && doctors.length === 0) {
    console.warn('No items found. Please update CSS selectors to match the target site.')
  }
  await seedPolis(polis)
  await seedDoctors(doctors)
  console.log('Seeding complete')
}

main()
  .catch(err => { console.error(err); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
