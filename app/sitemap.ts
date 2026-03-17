import { MetadataRoute } from 'next';
import prisma from "@/lib/prisma";

/**
 * GENERATE DYNAMIC SITEMAP
 * Membantu Google mengindeks halaman statis dan seluruh artikel Warta Pondok secara otomatis.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://almuttaqinjepara.vercel.app'; // Domain utama antum

  // 1. Ambil seluruh slug artikel yang sudah diterbitkan (publish)
  const articles = await prisma.info.findMany({
    where: { 
      status: "publish",
      is_active: true 
    },
    select: {
      slug: true,
      updated_at: true,
    },
  });

  // 2. Petakan artikel ke format sitemap
  const articleUrls = articles.map((article) => ({
    url: `${baseUrl}/warta/${article.slug}`,
    lastModified: article.updated_at,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // 3. Daftar Halaman Statis Utama
  const staticPaths = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0, // Halaman utama adalah prioritas tertinggi
    },
    {
      url: `${baseUrl}/jadwal`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/request-lagu`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ];

  return [...staticPaths, ...articleUrls];
}