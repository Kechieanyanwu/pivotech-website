"use client";

import { CONVERSATIONS_LINK } from "@/app/config";
import { motion } from "framer-motion";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

/* Static SVG corner curl — approximates the track/rail motif from the design */
// function CornerCurl() {
//   return (
//     <svg
//       viewBox="0 0 520 520"
//       width="440"
//       height="440"
//       aria-hidden="true"
//       className="absolute top-[-40px] right-[-70px] pointer-events-none opacity-40"
//     >
//       <g stroke="#2d4bd4" fill="none" strokeWidth="2.4" opacity="0.5">
//         {/* Curved track lines suggesting the corner curl motif */}
//         <path d="M520,60 Q480,60 460,80 Q440,100 440,140 L440,520" />
//         <path d="M520,90 Q470,90 445,115 Q420,140 420,180 L420,520" />
//         <path d="M520,120 Q455,120 428,150 Q400,180 400,220 L400,520" />
//         <path d="M520,150 Q440,150 410,185 Q380,220 380,260 L380,520" />
//         <path d="M520,180 Q425,180 392,220 Q360,260 360,300 L360,520" />
//         <path d="M520,210 Q410,210 374,255 Q338,300 338,340 L338,520" />
//         <path d="M520,240 Q395,240 356,290 Q316,340 316,380 L316,520" />
//         <path d="M520,270 Q380,270 338,325 Q294,380 294,420 L294,520" />
//         <path d="M520,300 Q365,300 320,360 Q272,420 272,460 L272,520" />
//         <path d="M520,330 Q350,330 302,395 Q250,460 250,500 L250,520" />
//       </g>
//     </svg>
//   );
// }

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-beige px-6 md:px-12 pt-16 pb-14 md:pt-20 md:pb-18"
    >
      {/* <CornerCurl /> */}

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="max-w-[720px]"
        >
          <motion.h1
            variants={item}
            className="font-serif font-normal text-navy leading-[1.02] tracking-[-0.02em] mb-6"
            style={{ fontSize: "clamp(42px, 6vw, 66px)" }}
          >
            Ambitious technologists.{" "}
            <span className="italic">Impactful products.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="font-sans text-navy/70 text-[19px] leading-[1.55] max-w-[560px] mb-9"
          >
            Pivotech is the ecosystem where ambitious technologists turn ideas
            into impact through conversations, build sessions, and a community
            that raises your ambition.
          </motion.p>
          <motion.p
            variants={item}
            className="font-sans text-navy/70 text-[19px] leading-[1.55] max-w-[560px] mb-9"
          >
            We bring together technologists, founders, designers, and operators
            to learn, connect, and build impactful and commercially viable
            products.
          </motion.p>

          <motion.div
            variants={item}
            className="flex items-center gap-6 flex-wrap"
          >
            <a
              href={CONVERSATIONS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans font-semibold text-[16px] text-beige bg-blue px-7 py-[15px] rounded-[9px] hover:bg-blue/90 transition-colors"
            >
              Come to a Conversation
            </a>
            {/* <a
              href="https://pivotech.substack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans font-semibold text-[16px] text-navy flex items-center gap-2 hover:text-blue transition-colors"
            >
              Read our story <span>→</span>
            </a> */}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
