import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@radio.com";
  const plainPassword = "admin123";

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // PERBAIKAN: Ganti 'user' menjadi 'users' sesuai nama model di schema.prisma
  const user = await prisma.users.create({
    data: {
      email,
      password: hashedPassword,
      role: "admin",
    },
  });

  console.log("Admin berhasil dibuat:");
  console.log("Email:", email);
  console.log("Password:", plainPassword);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });