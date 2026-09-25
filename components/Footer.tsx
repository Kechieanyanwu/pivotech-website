import Image from "next/image";
import Link from "next/link";
import { LINKEDIN, SUBSTACK } from "@/app/config";

export default function Footer() {
  return (
    <footer className="bg-beige border-t border-navy/12 px-6 md:px-12 py-10">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/#top" aria-label="Pivotech home">
          <Image
            src="/blue-logo.png"
            alt="Pivotech"
            width={1774}
            height={444}
            className="h-auto w-[100px]"
          />
        </Link>

        {/* Social links */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-sans text-[15px] text-navy/70">
          <Link href="/submit?type=talk" className="inline-flex min-h-11 items-center hover:text-navy transition-colors">Submit a talk</Link>
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
