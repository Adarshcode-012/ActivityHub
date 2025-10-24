import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import ActivitiesSection from '@/components/ActivitiesSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <Hero />
      <ActivitiesSection />
      
      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              ActivityHub
            </div>
            
            <div className="flex gap-6 text-white/60">
              <a href="#" className="hover:text-white transition-colors duration-300">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors duration-300">
                Terms
              </a>
              <a href="#" className="hover:text-white transition-colors duration-300">
                Contact
              </a>
            </div>
            
            <div className="text-white/40 text-sm">
              © 2024 ActivityHub. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
