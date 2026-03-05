import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@radio.com";
  const plainPassword = "admin123";

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // PERBAIKAN: Gunakan model 'Admin' (huruf A besar)
  // Kolomnya sudah benar 'password' sesuai schema antum
  const admin = await prisma.admin.create({
    data: {
      email,
      password: hashedPassword,
      role: "admin",
    },
  });

  console.log("Admin berhasil dibuat di tabel public.admins:");
  console.log("Email:", email);
}

main()
  .catch((e) => {
    console.error("Gagal membuat admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });