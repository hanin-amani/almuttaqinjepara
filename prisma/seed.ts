import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Memulai pembersihan database...')

  // 1. Hapus artikel lama agar tidak terjadi error relasi
  await prisma.info.deleteMany({})
  
  // 2. Hapus kategori lama agar ID UUID tidak bentrok
  await prisma.infoCategory.deleteMany({})

  const categories = [
    // SETIAP ID HARUS BERBEDA (1111, 2222, 3333, dst)
    { id: '11111111-1111-1111-1111-111111111111', name: 'Artikel Umum', slug: 'artikel-umum' },
    { id: '22222222-2222-2222-2222-222222222222', name: 'Kabar Pondok', slug: 'kabar-pondok' },
    { id: '33333333-3333-3333-3333-333333333333', name: 'Materi Khutbah', slug: 'materi-khutbah' },
    { id: '44444444-4444-4444-4444-444444444444', name: 'Info Donasi', slug: 'info-donasi' },
    { id: '55555555-5555-5555-5555-555555555555', name: 'Kegiatan Santri', slug: 'kegiatan-santri' },
  ]

  console.log('Mengisi kategori Warta Al Muttaqin dengan UUID tetap...')
  
  for (const cat of categories) {
    await prisma.infoCategory.create({
      data: cat,
    })
  }

  console.log('✅ Sinkronisasi database berhasil.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })