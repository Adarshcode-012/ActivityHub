import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import ActivitiesSection from '@/components/ActivitiesSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <ActivitiesSection />

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-border-color bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-2xl font-serif text-[var(--gold-accent)]">
              ActivityHub
            </div>

            <div className="flex gap-8 text-foreground/60 text-sm">
              <a href="#" className="hover:text-foreground transition-colors duration-300">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground transition-colors duration-300">
                Terms
              </a>
              <a href="#" className="hover:text-foreground transition-colors duration-300">
                Contact
              </a>
            </div>

            <div className="text-foreground/40 text-sm">
              © 2024 ActivityHub. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
