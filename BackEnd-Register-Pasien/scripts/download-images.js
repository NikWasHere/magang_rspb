import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import https from 'https';

const prisma = new PrismaClient();
const UPLOAD_DIR = path.resolve('./uploads/dokter');

// Ensure upload directory exists
async function ensureUploadDir() {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    console.log('✓ Upload directory ensured');
  } catch (err) {
    console.error('❌ Error creating upload directory:', err);
    throw err;
  }
}

// Download image from URL
function downloadImage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed with status ${response.statusCode}`));
        return;
      }
      
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
    }).on('error', reject);
  });
}

// Main function
async function main() {
  try {
    await ensureUploadDir();
    
    // Get all doctors with photos
    const dokters = await prisma.dokters.findMany({
      where: {
        photo: {
          not: null
        }
      }
    });

    console.log(`Found ${dokters.length} doctors with photos`);
    
    let successCount = 0;
    let failCount = 0;

    for (const dokter of dokters) {
      try {
        const photoUrl = dokter.photo;
        
        // Skip if already local path
        if (!photoUrl.startsWith('http')) {
          console.log(`⊘ ${dokter.name} - Already local: ${photoUrl}`);
          successCount++;
          continue;
        }

        // Extract filename from URL
        const urlObj = new URL(photoUrl);
        const filename = path.basename(urlObj.pathname);
        const filepath = path.join(UPLOAD_DIR, filename);

        // Check if already downloaded
        try {
          await fs.access(filepath);
          console.log(`⊘ ${dokter.name} - Already exists: ${filename}`);
          // Update database to use local path
          await prisma.dokters.update({
            where: { id: dokter.id },
            data: { photo: `/uploads/dokter/${filename}` }
          });
          successCount++;
          continue;
        } catch {
          // File doesn't exist, proceed with download
        }

        // Download image
        console.log(`⬇️  Downloading: ${dokter.name}...`);
        const imageBuffer = await downloadImage(photoUrl);
        
        // Save to disk
        await fs.writeFile(filepath, imageBuffer);
        
        // Update database with local path
        await prisma.dokters.update({
          where: { id: dokter.id },
          data: { photo: `/uploads/dokter/${filename}` }
        });

        console.log(`✓ ${dokter.name} - Saved: ${filename}`);
        successCount++;
      } catch (err) {
        console.error(`✗ ${dokter.name} - Error: ${err.message}`);
        failCount++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✓ Success: ${successCount}`);
    console.log(`   ✗ Failed: ${failCount}`);
    console.log(`\n✅ Download complete!`);
  } catch (err) {
    console.error('❌ Fatal error:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
