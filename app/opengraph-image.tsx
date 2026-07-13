import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Pivotech - Ambitious technologists. Impactful products.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const image = await readFile(join(process.cwd(), "public/opengraph-image.png"));

  return new Response(image, {
    headers: {
      "Content-Type": contentType,
    },
  });
}
