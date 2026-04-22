import { Globe, MessageCircle, Share2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[var(--color-primary-dark)] text-white/80 py-10 border-t-4 border-[var(--color-accent)] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="font-heading text-2xl font-bold text-[var(--color-accent)] tracking-wider">ISSB SMART STUDY</h3>
            <p className="mt-2 text-sm max-w-xs font-medium">Pakistan's NO.1 Online Academy of Army, Navy & PAF. Prepare with the best.</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="flex space-x-6">
              <a href="#" className="hover:text-[var(--color-accent)] transition-colors"><Globe size={20} /></a>
              <a href="#" className="hover:text-[var(--color-accent)] transition-colors"><MessageCircle size={20} /></a>
              <a href="#" className="hover:text-[var(--color-accent)] transition-colors"><Share2 size={20} /></a>
            </div>
            <p className="mt-4 font-mono font-bold tracking-widest text-[var(--color-accent-light)]">@ISSBSMARTSTUDY</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
