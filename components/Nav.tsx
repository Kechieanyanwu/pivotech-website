import { LINKEDIN } from "@/app/config";
import Image from "next/image";

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-beige border-b border-navy/10 px-6 md:px-12">
      <div className="max-w-6xl mx-auto flex items-center justify-between py-5">
        {/* Logo */}
        <a href="#top" aria-label="Back to top">
          <Image
            src="/blue-logo.png"
            alt="Pivotech"
            width={1774}
            height={444}
            loading="eager"
            className="h-auto w-[150px]"
          />
        </a>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8 font-sans text-[15px] font-medium text-navy">
          <a href="#ecosystem" className="hover:text-blue transition-colors">
            Connect
          </a>
          <a href="#ecosystem" className="hover:text-blue transition-colors">
            Build
          </a>
          <a href="#ecosystem" className="hover:text-blue transition-colors">
            Accelerate
          </a>
          <a
            href="https://pivotech.substack.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue transition-colors"
          >
            Be Inspired
          </a>
        </div>

        {/* CTA */}
        <a
          href={LINKEDIN}
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
