import { PrismaClient } from "@prisma/client";

/**
 * SINGLETON PRISMA (Anti-Digest & Anti-MaxClients)
 * Kunci utama agar koneksi database tidak "bocor" saat 
 * proses Hot-Reload di development dan Serverless di Vercel.
 */

const prismaClientSingleton = () => {
  return new PrismaClient({
    // Filter log: query dimatikan di prod agar tidak membebani log server
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

// Pastikan globalThis terdaftar di TypeScript
declare global {
  // eslint-disable-next-line no-var
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Gunakan instansi yang sudah ada atau buat baru
const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

// Di mode development, simpan instansi ke globalThis
// agar tidak tercipta koneksi baru setiap kali antum simpan (save) kode
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}