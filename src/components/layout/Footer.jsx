import React from 'react';
import { Globe, MessageCircle, Share2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[var(--color-primary-dark)] text-white/80 py-12 border-t-4 border-[var(--color-accent)] mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="font-heading text-2xl font-bold text-[var(--color-accent)] tracking-wider">ISSB SMART STUDY</h3>
            <p className="mt-2 text-sm max-w-sm">Pakistan's NO.1 Online Academy of Army, Navy & PAF. Initial Test, Interview & ISSB Preparation.</p>
          </div>
          
          <div className="flex flex-col items-center">
            <h4 className="text-sm font-semibold tracking-widest uppercase text-white mb-4">Connect With Us</h4>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-[var(--color-accent)] transition-colors"><Globe size={24} /></a>
              <a href="#" className="hover:text-[var(--color-accent)] transition-colors"><MessageCircle size={24} /></a>
              <a href="#" className="hover:text-[var(--color-accent)] transition-colors"><Share2 size={24} /></a>
            </div>
            <p className="mt-4 font-mono font-medium text-[var(--color-accent-light)]">@ISSBSMARTSTUDY</p>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10 text-center flex flex-col md:flex-row justify-between items-center text-xs">
          <p>&copy; {new Date().getFullYear()} ISSB Smart Study. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <span>Contact: 03266111008 | 03352535456</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
