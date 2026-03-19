export default function Thesis() {
  return (
    <section className="bg-navy py-section-m md:py-section px-6">
      <div className="max-w-3xl mx-auto text-center">
        {/* Blue dot divider above */}
        <span className="block mx-auto w-2 h-2 rounded-full bg-steel mb-16 md:mb-24" />

        <blockquote className="font-serif text-cream text-3xl md:text-5xl font-semibold leading-snug mb-8">
          &ldquo;Progress that isn&apos;t positive isn&apos;t progress.&rdquo;
        </blockquote>

        <p className="font-sans text-cream/70 text-base md:text-lg leading-relaxed">
          Technology should improve lives. That&apos;s the filter. That&apos;s why we build.
        </p>

        {/* Blue dot divider below */}
        <span className="block mx-auto w-2 h-2 rounded-full bg-steel mt-16 md:mt-24" />
      </div>
    </section>
  )
}
