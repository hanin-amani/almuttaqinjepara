export function generateSlug(title: string): string {

  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")     // hapus karakter aneh
    .replace(/\s+/g, "-")         // spasi jadi -
    .replace(/--+/g, "-")         // double - jadi single
    .trim();

}