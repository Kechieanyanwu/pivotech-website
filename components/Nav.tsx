import { getSiteContent } from "@/lib/sanity/content";
import Image from "next/image";
import Link from "next/link";

export default async function Nav() {
  const { settings } = await getSiteContent();
  return (
    <nav className="sticky top-0 z-50 bg-beige border-b border-navy/10 px-6 md:px-12">
      <div className="max-w-6xl mx-auto flex items-center justify-between py-5">
        {/* Logo */}
        <Link href="/#top" aria-label="Pivotech home">
          <Image
            src="/blue-logo.png"
            alt="Pivotech"
            width={1774}
            height={444}
            loading="eager"
            className="h-auto w-[150px]"
          />
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8 font-sans text-[15px] font-medium text-navy">
          <Link
            href="/#ecosystem"
            className="hover:text-blue transition-colors"
          >
            Connect
          </Link>
          <Link
            href="/#ecosystem"
            className="hover:text-blue transition-colors"
          >
            Build
          </Link>
          <Link
            href="/#ecosystem"
            className="hover:text-blue transition-colors"
          >
            Accelerate
          </Link>
          <a
            href={settings.substack}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue transition-colors"
          >
            Be Inspired
          </a>
        </div>

        {/* CTA */}
        <a
          href={settings.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans font-semibold text-[15px] text-beige bg-blue px-[18px] py-[9px] rounded-lg hover:bg-blue/90 transition-colors"
        >
          Join →
        </a>
      </div>
    </nav>
  );
}
