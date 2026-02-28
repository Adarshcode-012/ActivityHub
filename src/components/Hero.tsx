'use client';



export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Background element */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--gold-accent)_0%,transparent_15%)] opacity-10" />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-serif leading-tight mb-8 text-foreground animate-fade-in-up">
          Discover <br />
          <span className="text-[var(--gold-accent)]">Amazing Activities</span>
        </h1>

        <p className="text-base md:text-lg text-foreground/60 mb-12 animate-fade-in-up animation-delay-200 max-w-2xl mx-auto leading-loose">
          Book unique experiences and create unforgettable memories with our curated collection of activities
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up animation-delay-400">
          <button
            onClick={() => {
              document.getElementById('activities')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-10 py-4 bg-foreground text-background text-sm font-medium hover:bg-[var(--gold-accent)] hover:text-white transition-colors duration-500 rounded-full"
          >
            Explore Activities
          </button>

          <button
            onClick={() => {
              document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-10 py-4 border border-foreground/20 text-foreground text-sm font-medium hover:border-foreground transition-colors duration-500 rounded-full"
          >
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}
