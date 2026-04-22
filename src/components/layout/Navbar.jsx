import React from 'react';
import { motion } from 'framer-motion';
import { LogIn, PhoneCall } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[var(--color-bg)]/80 backdrop-blur-md border-b border-[var(--color-border)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <img src="/images/logo.png" alt="ISSB Smart Study Logo" className="h-12 w-12 rounded-full shadow-md object-cover border-2 border-[var(--color-accent)]" />
            <div className="flex flex-col">
              <span className="font-heading font-bold text-xl text-[var(--color-text)] tracking-wide">
                ISSB SMART STUDY
              </span>
              <span className="text-xs text-[var(--color-text-muted)] tracking-wider uppercase font-semibold">
                Army, Navy & PAF
              </span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex items-center space-x-6"
          >
            <a href="#about" className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">About</a>
            <a href="#features" className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">Features</a>
            <a href="#contact" className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">Contact</a>
            
            <div className="h-6 w-px bg-[var(--color-border)] mx-2"></div>
            
            <a href="tel:03266111008" className="flex items-center space-x-2 text-sm font-medium text-[var(--color-accent-dark)] hover:text-[var(--color-accent)] transition-colors">
              <PhoneCall size={16} />
              <span>03266111008</span>
            </a>

            <Link to="/login" className="flex items-center space-x-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] text-white px-5 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-all shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]">
              <LogIn size={16} />
              <span>Student Login</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
