import { motion } from 'framer-motion';
import { LogIn, PhoneCall } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[var(--color-bg)]/90 backdrop-blur-md border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-4 cursor-pointer"
          >
            <img src="/images/logo.png" alt="Logo" className="h-12 w-12 rounded-full shadow-sm object-cover border border-[var(--color-border)]" />
            <div className="flex flex-col">
              <span className="font-heading font-bold text-xl text-[var(--color-primary-dark)] tracking-wide">
                ISSB SMART STUDY
              </span>
              <span className="text-[10px] text-[var(--color-primary)] tracking-widest uppercase font-bold">
                Army, Navy & PAF
              </span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="hidden md:flex items-center space-x-8"
          >
            <a href="tel:03266111008" className="flex items-center space-x-2 text-sm font-bold text-[var(--color-accent-dark)] hover:text-[var(--color-accent)] transition-colors">
              <PhoneCall size={16} />
              <span>03266111008</span>
            </a>

            <div className="h-5 w-px bg-[var(--color-border)]"></div>

            <Link to="/login" className="flex items-center space-x-2 bg-[var(--color-primary-dark)] hover:bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-[var(--radius-sm)] text-sm font-semibold transition-all">
              <LogIn size={16} />
              <span>Login</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
