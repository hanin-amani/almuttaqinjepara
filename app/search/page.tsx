import Link from "next/link";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

function stripHtml(html: string) {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function highlightKeyword(
  text: string,
  keyword: string
) {
  if (!keyword) return text;

  const escapedKeyword = keyword.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );

  const regex = new RegExp(
    `(${escapedKeyword})`,
    "gi"
  );

  return text.replace(
    regex,
    '<mark class="bg-yellow-200 px-1 rounded">$1</mark>'
  );
}

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const params = await searchParams;

  const q = params.q ?? "";

  let posts: any[] = [];

  if (q.trim()) {
    const apiKey =
      process.env.NEXT_PUBLIC_BLOGGER_API_KEY;

    const blogId =
      process.env.NEXT_PUBLIC_BLOGGER_BLOG_ID;

    const searchUrl =
      "https://www.googleapis.com/blogger/v3/blogs/" +
      blogId +
      "/posts/search?q=" +
      encodeURIComponent(q) +
      "&key=" +
      apiKey;

    try {
      const res = await fetch(searchUrl, {
        cache: "no-store",
      });

      if (res.ok) {
        const data = await res.json();
        posts = data.items || [];
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main className="min-h-screen bg-white">
      {/* HEADER */}
<div className="max-w-4xl mx-auto px-6 pt-8 pb-4">
  <p className="text-sm text-slate-500">
    Sekitar{" "}
    <span className="font-semibold">
      {posts.length}
    </span>{" "}
    hasil ditemukan untuk{" "}
    <span className="font-semibold text-slate-800">
      "{q}"
    </span>
  </p>
</div>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {posts.length > 0 ? (
          <div className="space-y-10">
            {posts.map((post) => {
              const slug =
                post.url
                  ?.split("/")
                  .pop()
                  ?.replace(".html", "") || "";

              const contentText =
                stripHtml(post.content || "");

              const snippet =
                contentText.length > 220
                  ? contentText.substring(
                      0,
                      220
                    ) + "..."
                  : contentText;

              return (
                <article
                  key={post.id}
                  className="group"
                >
                  {/* URL */}
                  <div className="text-sm text-green-700 mb-1 truncate">
                    radiosuaraalmuttaqin.com › blog › {slug}
                  </div>

                  {/* TITLE */}
                  <Link
                    href={`/blog/${slug}`}
                    className="block text-[22px] text-blue-700 hover:underline leading-tight"
                  >
                    {post.title}
                  </Link>

                  {/* DATE */}
                  <div className="text-xs text-slate-500 mt-1 mb-2">
                    {new Date(
                      post.published
                    ).toLocaleDateString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </div>

                  {/* SNIPPET */}
                  <div
                    className="text-[15px] text-slate-700 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html:
                        highlightKeyword(
                          snippet,
                          q
                        ),
                    }}
                  />
                </article>
              );
            })}
          </div>
        ) : (
          <div className="py-20">
            <h2 className="text-2xl font-bold mb-4">
              Tidak ada hasil
            </h2>

            <p className="text-slate-600 mb-4">
              Tidak ditemukan artikel yang cocok
              dengan kata kunci:
              <strong> {q}</strong>
            </p>

            <ul className="list-disc pl-6 text-slate-500 space-y-2">
              <li>
                Periksa ejaan kata kunci.
              </li>
              <li>
                Gunakan kata yang lebih umum.
              </li>
              <li>
                Gunakan kata yang lebih pendek.
              </li>
              <li>
                Coba topik yang berbeda.
              </li>
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}