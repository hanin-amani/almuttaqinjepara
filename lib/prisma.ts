import { PrismaClient } from "@prisma/client";

/**
 * SINGLETON PRISMA: 
 * Menghindari kebocoran koneksi database saat Hot-Reload di development
 * dan membatasi koneksi di serverless production.
 */

const prismaClientSingleton = () => {
  return new PrismaClient({
    // Log query hanya di development agar tidak membebani server production
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
};

// Menggunakan tipe data global agar TypeScript tidak komplain
declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Gunakan instansi yang sudah ada (global) atau buat baru
const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

// Simpan instansi ke global di mode development
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}