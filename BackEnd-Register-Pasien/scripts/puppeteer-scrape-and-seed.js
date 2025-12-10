import puppeteer from 'puppeteer'
import fs from 'fs/promises'
import path from 'path'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const TARGET_URL = process.env.SCRAPE_URL || 'https://example.com'
const UPLOAD_DIR = path.resolve('./uploads/dokter')

// Function to download and save images locally
async function downloadImage(imageUrl, filename) {
  try {
    if (!imageUrl || !imageUrl.startsWith('http')) return null
    
    // Ensure upload directory exists
    await fs.mkdir(UPLOAD_DIR, { recursive: true })
    
    const response = await fetch(imageUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    })
    
    if (!response.ok) {
      console.warn(`  ⚠️  Failed to download image: ${imageUrl}`)
      return null
    }
    
    const buffer = Buffer.from(await response.arrayBuffer())
    const filepath = path.join(UPLOAD_DIR, filename)
    await fs.writeFile(filepath, buffer)
    console.log(`  ✓ Downloaded: ${filename}`)
    
    // Return relative path for database storage
    return `/uploads/dokter/${filename}`
  } catch (err) {
    console.warn(`  ⚠️  Error downloading image: ${err.message}`)
    return null
  }
}

async function scrapeWithPuppeteer() {
  const browser = await puppeteer.launch({ headless: 'new' })
  const page = await browser.newPage()
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
  await page.setExtraHTTPHeaders({ 'Accept-Language': 'id,en;q=0.9' })
  await page.goto(TARGET_URL, { waitUntil: 'networkidle2', timeout: 60000 })

  // Wait for possible doctor cards or table rows
  try {
    await page.waitForSelector('a[href*="dokter-detail"], .doctor-card, .card-dokter, table tbody tr', { timeout: 10000 })
  } catch {}

  // Debug: Save HTML
  if (process.env.SCRAPE_DEBUG === '1') {
    const html = await page.content()
    await fs.writeFile('debug-puppeteer.html', html)
    console.log('Saved debug-puppeteer.html')
  }

  const data = await page.evaluate(() => {
    const absolutize = (base, url) => {
      try {
        if (!url) return null
        if (url.startsWith('http')) return url
        const b = new URL(base)
        return new URL(url, b).toString()
      } catch { return url }
    }

    const base = 'https://rspb.ihc.id/'
    const doctorsData = []
    const polisSet = new Set()
    
    // Scrape semua card dokter - each is a .card
    const cards = document.querySelectorAll('.card')
    cards.forEach(card => {
      
      // Doctor name is in h2 > a[href*="dokter-detail"]
      const nameLink = card.querySelector('h2 a[href*="dokter-detail"]')
      if (!nameLink) return
      const doctorName = nameLink.textContent?.trim() || ''
      
      // Photo dari img tag
      const imgEl = card.querySelector('img')
      const imgSrc = imgEl?.getAttribute('src') || null
      const photo = absolutize(base, imgSrc)
      
      // Ambil nama poli dari .product-price ins
      const priceEl = card.querySelector('.product-price ins')
      const subtitleText = priceEl?.textContent?.trim() || ''
      const poliMatch = subtitleText.match(/^(KLINIK|POLI)\s+(.+)$/i)
      const poliName = poliMatch ? poliMatch[2].trim() : null
      
      if (poliName) {
        polisSet.add(poliName)
      }
      
      // Ambil jadwal per hari dari tabel
      const jadwal = {
        senin: null,
        selasa: null,
        rabu: null,
        kamis: null,
        jumat: null,
        sabtu: null,
        minggu: null
      }
      
      const table = card.querySelector('table')
      if (table) {
        const dataCells = table.querySelectorAll('tbody td')
        dataCells.forEach((cell, idx) => {
          const text = cell.textContent.trim()
          if (text && text !== '-') {
            if (idx === 0) jadwal.senin = text
            else if (idx === 1) jadwal.selasa = text
            else if (idx === 2) jadwal.rabu = text
            else if (idx === 3) jadwal.kamis = text
            else if (idx === 4) jadwal.jumat = text
            else if (idx === 5) jadwal.sabtu = text
            else if (idx === 6) jadwal.minggu = text
          }
        })
      }
      
      if (doctorName && !doctorName.includes('Search Dokter')) {
        doctorsData.push({ 
          doctorName, 
          photo, 
          poliName,
          jadwal 
        })
      }
    })

    const polis = Array.from(polisSet).map(name => ({ name }))
    return { doctorsData, polis }
  })

  await browser.close()
  return data
}

async function seedPolis(polis) {
  console.log('Seeding polis...')
  for (const p of polis) {
    await prisma.polis.create({
      data: { name: p.name }
    })
    console.log(`  ✓ ${p.name}`)
  }
}

async function seedDoctors(doctorsData) {
  console.log('Seeding doctors...')
  const createdDoctors = []
  for (const d of doctorsData) {
    const existing = await prisma.dokters.findFirst({
      where: { name: d.doctorName }
    })
    
    // Download image and get local path
    let localPhoto = null
    if (d.photo) {
      const filename = `${Date.now()}-${d.doctorName.replace(/\s+/g, '-')}.jpg`
      localPhoto = await downloadImage(d.photo, filename)
    }
    
    if (!existing) {
      const doctor = await prisma.dokters.create({
        data: {
          name: d.doctorName,
          specialization: '-',
          phone: null,
          photo: localPhoto,
          shift: null,
        }
      })
      createdDoctors.push({ ...doctor, poliName: d.poliName, jadwal: d.jadwal })
      console.log(`  ✓ ${d.doctorName}`)
    } else {
      createdDoctors.push({ ...existing, poliName: d.poliName, jadwal: d.jadwal })
    }
  }
  return createdDoctors
}

async function seedPoliDokter(doctorsData) {
  console.log('Seeding poli_dokter relationships...')
  const limit = (val) => (val ? val.slice(0, 100) : null)
  for (const d of doctorsData) {
    if (!d.poliName) continue
    
    const poli = await prisma.polis.findFirst({ where: { name: d.poliName } })
    if (!poli) continue
    
    const existing = await prisma.poli_dokter.findFirst({
      where: { dokter_id: d.id, poli_id: poli.id }
    })
    
    if (!existing) {
      await prisma.poli_dokter.create({
        data: {
          dokter_id: d.id,
          poli_id: poli.id,
          jadwal_senin: limit(d.jadwal.senin),
          jadwal_selasa: limit(d.jadwal.selasa),
          jadwal_rabu: limit(d.jadwal.rabu),
          jadwal_kamis: limit(d.jadwal.kamis),
          jadwal_jumat: limit(d.jadwal.jumat),
          jadwal_sabtu: limit(d.jadwal.sabtu),
          jadwal_minggu: limit(d.jadwal.minggu),
        }
      })
      console.log(`  ✓ ${d.name} → ${poli.name}`)
    }
  }
}

async function main() {
  console.log('Scraping (Puppeteer) from', TARGET_URL)
  const { doctorsData, polis } = await scrapeWithPuppeteer()
  console.log(`Found: ${polis.length} polis, ${doctorsData.length} doctors`)
  
  if (doctorsData.length === 0) {
    console.warn('No doctors found. Site may require additional interactions.')
    return
  }
  
  // Clear existing data
  console.log('\nClearing existing data...')
  await prisma.$executeRaw`TRUNCATE TABLE "poli_dokter", "registrations", "dokters", "polis" RESTART IDENTITY CASCADE`
  
  // Seed in order: polis -> dokters -> poli_dokter
  console.log('\n=== SEEDING DATA ===')
  await seedPolis(polis)
  const doctorsWithIds = await seedDoctors(doctorsData)
  await seedPoliDokter(doctorsWithIds)
  
  console.log('\n✅ Seeding complete!')
  console.log(`   - ${polis.length} polis`)
  console.log(`   - ${doctorsWithIds.length} doctors`)
  console.log(`   - Relationships with schedules created`)
}

main()
  .catch(err => { console.error(err); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
