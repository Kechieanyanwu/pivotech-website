import Image from "next/image";
import { LINKEDIN, SUBSTACK } from "@/app/config";

export default function Footer() {
  return (
    <footer className="bg-beige border-t border-navy/12 px-6 md:px-12 py-10">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Logo */}
        <a href="#top" aria-label="Back to top">
          <Image src="/blue-logo.png" alt="Pivotech" width={100} height={100} />
        </a>

        {/* Social links */}
        <div className="flex items-center gap-6 font-sans text-[15px] text-navy/70">
          {/* <a
            href="https://youtube.com/@pivotech"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-navy transition-colors"
          >
            YouTube
          </a> */}
          <a
            href={LINKEDIN}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-navy transition-colors"
          >
            LinkedIn
          </a>
          <a
            href={SUBSTACK}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-navy transition-colors"
          >
            Substack
          </a>
        </div>
      </div>
    </footer>
  );
}
