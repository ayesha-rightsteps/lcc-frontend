import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { ChevronRight, ShieldCheck, Target, Award, Users, PhoneCall } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      <Navbar />

      <main className="flex-grow pt-20">
        {/* HERO SECTION */}
        <section className="relative w-full py-20 lg:py-32 overflow-hidden bg-[var(--color-surface)] border-b border-[var(--color-border)]">
          {/* Faded Background Element from the original poster styling */}
          <div className="absolute inset-0 z-0 opacity-5 md:opacity-10 pointer-events-none flex items-center justify-center">
             <img src="/images/heroBackground.png" alt="Hero Silhouettes" className="w-full h-full object-cover" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left"
              >
                <div className="inline-block px-4 py-1.5 rounded-full bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 text-[var(--color-accent-dark)] font-semibold text-xs tracking-widest uppercase mb-6">
                  Pakistan's NO.1 Online Academy
                </div>
                
                <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-[var(--color-primary-dark)] leading-tight mb-6">
                  Forge Your <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent-dark)] to-[var(--color-accent)]">
                    Future In Defense
                  </span>
                </h1>
                
                <p className="text-lg text-[var(--color-text-muted)] mb-10 max-w-xl">
                  Expert preparation for Initial Tests, Interviews & ISSB. Join the elite ranks of the Army, Navy, & PAF with our specialized online curriculum.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <a href="#contact" className="px-8 py-4 rounded-[var(--radius-md)] bg-[var(--color-primary)] text-white font-semibold flex items-center justify-center shadow-[var(--shadow-md)] hover:bg-[var(--color-primary-light)] transition-all hover:-translate-y-1">
                    Join Academy
                    <ChevronRight size={20} className="ml-2" />
                  </a>
                  <Link to="/login" className="px-8 py-4 rounded-[var(--radius-md)] bg-[var(--color-surface)] text-[var(--color-primary)] font-semibold border-2 border-[var(--color-primary)] flex items-center justify-center hover:bg-[var(--color-primary)]/5 transition-all">
                    Student Login
                  </Link>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="lg:w-1/2 w-full max-w-lg lg:max-w-none relative"
              >
                {/* Visual Banner wrapper showcasing the actual poster */}
                <div className="relative rounded-[var(--radius-xl)] overflow-hidden shadow-[var(--shadow-lg)] border-4 border-[var(--color-surface)] bg-white transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <img 
                    src="/images/heroBackground.png" 
                    alt="ISSB Smart Study Graphic" 
                    className="w-full h-auto"
                  />
                  {/* Premium overlay gleam effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none mix-blend-overlay"></div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -bottom-6 -left-6 bg-[var(--color-surface)] p-4 rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] border border-[var(--color-border)] flex items-center gap-3 animate-bounce" style={{ animationDuration: '3s' }}>
                  <div className="bg-[var(--color-success)]/10 p-2 rounded-full text-[var(--color-success)]">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Success Rate</p>
                    <p className="font-heading font-bold text-xl text-[var(--color-primary)]">98.5%</p>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section id="features" className="py-24 bg-[var(--color-bg)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-heading text-4xl font-bold text-[var(--color-primary-dark)] mb-4">Why Choose ISSB Smart Study?</h2>
              <div className="h-1 w-20 bg-[var(--color-accent)] mx-auto rounded-full mb-6"></div>
              <p className="text-[var(--color-text-muted)]">We provide an unparalleled learning ecosystem specifically designed to crack defense forces examinations.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: <Target size={32} />, title: "Precision Curriculum", desc: "Laser-focused material targeting exactly what examiners look for in Initial Tests and ISSB." },
                { icon: <Users size={32} />, title: "1-on-1 Mentorship", desc: "Direct access to Sir for personalized consultation, interview mockups, and psychological evaluation." },
                { icon: <Award size={32} />, title: "Premium Library", desc: "Secure video lectures and PDF resources accessible anytime through our custom learning platform." }
              ].map((feature, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -10 }}
                  className="bg-[var(--color-surface)] p-8 rounded-[var(--radius-xl)] shadow-[var(--shadow-sm)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 hover:shadow-[var(--shadow-accent)] transition-all group"
                >
                  <div className="w-14 h-14 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-[var(--radius-lg)] flex items-center justify-center mb-6 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="font-heading text-xl font-bold text-[var(--color-text)] mb-3">{feature.title}</h3>
                  <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section id="contact" className="py-20 relative overflow-hidden bg-[var(--color-primary-dark)]">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-6">Ready to Wear the Uniform?</h2>
            <p className="text-white/80 text-lg mb-10">Contact us today to secure your enrollment slot. Let's make your dream a reality.</p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm border border-white/20 px-8 py-4 rounded-[var(--radius-full)] text-white">
                <PhoneCall size={24} className="text-[var(--color-accent)]" />
                <span className="font-mono font-bold text-xl tracking-wider">03266111008</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm border border-white/20 px-8 py-4 rounded-[var(--radius-full)] text-white">
                <PhoneCall size={24} className="text-[var(--color-accent)]" />
                <span className="font-mono font-bold text-xl tracking-wider">03352535456</span>
              </div>
            </div>
            
            <p className="mt-8 text-[var(--color-accent)] font-semibold tracking-widest uppercase text-sm">
              @ISSBSMARTSTUDY
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
