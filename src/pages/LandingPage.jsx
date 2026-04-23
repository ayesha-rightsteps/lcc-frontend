import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PhoneCall, ChevronRight, ShieldCheck, BookOpen, Users, Star, CheckCircle, ChevronDown, FileText, MessageSquare, Layers } from 'lucide-react';
const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

const BRANCHES = [
  {
    id: 'army',
    label: 'Pak Army',
    color: '#2d5a27',
    courses: [
      'PMA Long Course',
      'Technical Cadet Course (TCC)',
      'Army Medical Cadet (AMC)',
      'Lady Cadet Course (LCC)',
      'Armed Forces Nursing Services (AFNS)',
      'Direct Short Service Commission',
      'ICTO',
    ],
  },
  {
    id: 'paf',
    label: 'Pak Air Force',
    color: '#1a3a6b',
    courses: [
      'General Duty Pilot (GDP)',
      'Aeronautical Engineers (CAE)',
      'Air Defence (AD)',
      'Admin and Special Duties (A&SD)',
      'Logistics',
      'PAF Short Service Commission',
    ],
  },
  {
    id: 'navy',
    label: 'Pak Navy',
    color: '#0a2a4a',
    courses: [
      'PN Cadets',
      'Short Service Commission (SSC)',
      'Pakistan Navy Medical Cadet (PNMC)',
      'Sailors',
    ],
  },
];

const SUBSECTIONS = [
  {
    icon: <FileText size={16} />,
    title: 'Initial Test',
    desc: 'Comprehensive written exam preparation — intelligence tests, academic subjects, and past paper practice.',
  },
  {
    icon: <MessageSquare size={16} />,
    title: 'Interview',
    desc: 'Personality interview coaching, communication skills, confidence building, and mock interview sessions.',
  },
  {
    icon: <Layers size={16} />,
    title: 'ISSB',
    desc: 'Full ISSB preparation — psychological tests, GTO tasks, command tasks, and conference stage guidance.',
  },
];

const CoursesSection = () => {
  const [activeBranch, setActiveBranch] = useState('army');
  const [expandedCourse, setExpandedCourse] = useState(null);

  const branch = BRANCHES.find(b => b.id === activeBranch);

  return (
    <section style={{ background: 'var(--color-bg)', padding: '80px 24px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--color-primary)', marginBottom: '12px' }}>What We Cover</p>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
            Courses We <span style={{ color: 'var(--color-accent-dark)' }}>Offer</span>
          </h2>
          <div style={{ width: '48px', height: '3px', background: 'var(--color-accent)', margin: '16px auto 0' }} />
        </motion.div>

        {/* Branch Tabs */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '40px' }}>
          {BRANCHES.map(b => (
            <button
              key={b.id}
              onClick={() => { setActiveBranch(b.id); setExpandedCourse(null); }}
              style={{
                padding: '12px 28px',
                borderRadius: 'var(--radius-md)',
                border: activeBranch === b.id ? '2px solid var(--color-accent)' : '2px solid var(--color-border)',
                background: activeBranch === b.id ? 'var(--color-primary-dark)' : 'var(--color-surface)',
                color: activeBranch === b.id ? '#fff' : 'var(--color-text-muted)',
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {b.label}
            </button>
          ))}
        </div>

        {/* Course Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeBranch}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            {branch.courses.map((course, i) => (
              <motion.div
                key={course}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: i * 0.05 }}
                style={{
                  border: expandedCourse === course ? '1.5px solid var(--color-accent)' : '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--color-surface)',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s',
                }}
              >
                <button
                  onClick={() => setExpandedCourse(expandedCourse === course ? null : course)}
                  style={{
                    width: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '18px 24px',
                    background: 'none', border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: expandedCourse === course ? 'var(--color-accent)' : 'var(--color-border)',
                      transition: 'background 0.2s', flexShrink: 0,
                    }} />
                    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '1rem', color: 'var(--color-primary-dark)' }}>
                      {course}
                    </span>
                  </div>
                  <ChevronDown
                    size={18}
                    color="var(--color-text-muted)"
                    style={{ transform: expandedCourse === course ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.25s', flexShrink: 0 }}
                  />
                </button>

                <AnimatePresence>
                  {expandedCourse === course && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '16px', padding: '0 24px 24px',
                        borderTop: '1px solid var(--color-border)',
                        paddingTop: '20px',
                      }}>
                        {SUBSECTIONS.map(sub => (
                          <div key={sub.title} style={{
                            background: 'var(--color-bg)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)',
                            padding: '16px',
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--color-primary)' }}>
                              {sub.icon}
                              <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-primary-dark)' }}>{sub.title}</span>
                            </div>
                            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.65, margin: 0 }}>{sub.desc}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

const LeadForm = () => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', branch: '', course: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const selectedBranch = BRANCHES.find(b => b.label === form.branch);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await fetch(`${BASE}/v1/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      }).then(r => r.json()).then(data => {
        if (data.statusCode && data.statusCode >= 400) throw new Error(data.message || 'Failed to submit');
      });
      setSuccess(true);
      setForm({ name: '', phone: '', email: '', branch: '', course: '', message: '' });
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 14px',
    border: '1.5px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    background: 'var(--color-bg)',
    color: 'var(--color-text)',
    fontFamily: 'var(--font-sans)', fontSize: '0.9rem',
    outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    display: 'block', marginBottom: '6px',
    fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
    letterSpacing: '0.1em', textTransform: 'uppercase',
    color: 'var(--color-text-muted)', fontWeight: 600,
  };

  return (
    <section style={{ background: 'var(--color-surface)', padding: '80px 24px', borderTop: '1px solid var(--color-border)' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--color-primary)', marginBottom: '12px' }}>Get Started</p>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
            Let Us Know <span style={{ color: 'var(--color-accent-dark)' }}>About You</span>
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginTop: '12px' }}>
            Fill in your details and we'll reach out to get you enrolled.
          </p>
          <div style={{ width: '48px', height: '3px', background: 'var(--color-accent)', margin: '16px auto 0' }} />
        </motion.div>

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'var(--color-bg)', border: '1.5px solid var(--color-accent)',
              borderRadius: 'var(--radius-xl)', padding: '48px', textAlign: 'center',
            }}
          >
            <CheckCircle size={48} color="var(--color-primary)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '8px' }}>
              Thank You!
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              We've received your information and will contact you soon.
            </p>
            <button
              onClick={() => setSuccess(false)}
              style={{ marginTop: '24px', padding: '10px 24px', background: 'var(--color-primary-dark)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem' }}
            >
              Submit Another
            </button>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            onSubmit={handleSubmit}
            style={{
              background: 'var(--color-bg)', border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)', padding: '40px',
              display: 'flex', flexDirection: 'column', gap: '20px',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Full Name *</label>
                <input
                  style={inputStyle} placeholder="Your full name"
                  value={form.name} required
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  onFocus={e => { e.target.style.borderColor = 'var(--color-accent)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--color-border)'; }}
                />
              </div>
              <div>
                <label style={labelStyle}>Phone *</label>
                <input
                  style={inputStyle} placeholder="03XX XXXXXXX"
                  value={form.phone} required type="tel"
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  onFocus={e => { e.target.style.borderColor = 'var(--color-accent)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--color-border)'; }}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Email (optional)</label>
              <input
                style={inputStyle} placeholder="your@email.com"
                value={form.email} type="email"
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                onFocus={e => { e.target.style.borderColor = 'var(--color-accent)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--color-border)'; }}
              />
            </div>

            <div>
              <label style={labelStyle}>Branch *</label>
              <select
                style={{ ...inputStyle, appearance: 'none' }}
                value={form.branch} required
                onChange={e => setForm(f => ({ ...f, branch: e.target.value, course: '' }))}
                onFocus={e => { e.target.style.borderColor = 'var(--color-accent)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--color-border)'; }}
              >
                <option value="">Select branch...</option>
                {BRANCHES.map(b => <option key={b.id} value={b.label}>{b.label}</option>)}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Course *</label>
              <select
                style={{ ...inputStyle, appearance: 'none' }}
                value={form.course} required disabled={!selectedBranch}
                onChange={e => setForm(f => ({ ...f, course: e.target.value }))}
                onFocus={e => { e.target.style.borderColor = 'var(--color-accent)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--color-border)'; }}
              >
                <option value="">Select course...</option>
                {selectedBranch?.courses.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Message (optional)</label>
              <textarea
                style={{ ...inputStyle, resize: 'vertical', minHeight: '90px' }}
                placeholder="Any additional information..."
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                onFocus={e => { e.target.style.borderColor = 'var(--color-accent)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--color-border)'; }}
              />
            </div>

            {error && (
              <p style={{ color: '#dc2626', fontSize: '0.85rem', margin: 0, padding: '10px 14px', background: '#fef2f2', borderRadius: 'var(--radius-sm)', border: '1px solid #fecaca' }}>
                {error}
              </p>
            )}

            <button
              type="submit" disabled={loading}
              style={{
                padding: '14px', background: loading ? 'var(--color-border)' : 'var(--color-primary-dark)',
                color: '#fff', border: 'none', borderRadius: 'var(--radius-md)',
                fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              {loading ? 'Submitting...' : 'Submit'}
              {!loading && <ChevronRight size={16} />}
            </button>
          </motion.form>
        )}
      </div>
    </section>
  );
};

const LandingPage = () => {
  return (
    <div style={{ fontFamily: 'var(--font-sans)', background: 'var(--color-bg)', color: 'var(--color-text)', minHeight: '100vh' }}>

      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(248, 246, 240, 0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--color-border)',
        height: '72px',
        display: 'flex', alignItems: 'center',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img src="/images/logo.png" alt="ISSB Smart Study" style={{ height: '54px', width: '54px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-accent)', flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.15rem', color: 'var(--color-primary-dark)', lineHeight: 1.1 }}>ISSB Smart Study</div>
              <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--color-primary)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '3px' }}>Army · Navy · PAF</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <a href="tel:03266111008" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', color: 'var(--color-primary)', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none', borderRadius: 'var(--radius-sm)' }}>
              <PhoneCall size={15} />
              <span style={{ display: 'none' }} className="md:!inline">Contact</span>
            </a>
            <Link to="/login" style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '9px 20px',
              background: 'var(--color-primary-dark)',
              color: '#fff',
              fontSize: '0.82rem', fontWeight: 600,
              textDecoration: 'none',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
            }}>
              <span>Login</span>
              <ChevronRight size={15} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        paddingTop: '72px',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 60%, var(--color-primary-light) 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 70% 70% at 80% 50%, rgba(201,168,76,0.12) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 80px, rgba(255,255,255,0.02) 80px, rgba(255,255,255,0.02) 81px)`,
        }} />

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 24px', width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', alignItems: 'center' }}>

          <div style={{ color: '#fff' }}>
            <motion.div {...rise(0.1)} style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(201,168,76,0.15)',
              border: '1px solid rgba(201,168,76,0.4)',
              padding: '6px 14px', borderRadius: 'var(--radius-full)',
              marginBottom: '28px',
            }}>
              <Star size={12} fill="var(--color-accent)" color="var(--color-accent)" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-accent-light)' }}>
                Pakistan's No.1 Defence Academy
              </span>
            </motion.div>

            <motion.h1 {...rise(0.2)} style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
              fontWeight: 700,
              lineHeight: 1.1,
              color: '#fff',
              marginBottom: '20px',
            }}>
              Prepare for the <br />
              <span style={{ color: 'var(--color-accent)' }}>Initial Test,</span>
              <br />Interview &amp; ISSB
            </motion.h1>

            <motion.p {...rise(0.3)} style={{ fontSize: '1rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.7)', maxWidth: '460px', marginBottom: '36px' }}>
              Join Pakistan's most trusted online platform for Army, Navy and PAF test preparation. Expert-led content, secure video streaming, and 1-on-1 mentorship.
            </motion.p>

            <motion.div {...rise(0.4)} style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '48px' }}>
              <a href="tel:03266111008" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'var(--color-accent)',
                color: 'var(--color-text-on-accent)',
                padding: '13px 28px', borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem', fontWeight: 700, textDecoration: 'none',
                boxShadow: '0 4px 24px rgba(201,168,76,0.35)',
              }}>
                <PhoneCall size={17} />
                Enrol Today
              </a>
              <Link to="/login" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.25)',
                padding: '13px 28px', borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none',
              }}>
                Student Login
              </Link>
            </motion.div>

            <motion.div {...rise(0.5)} style={{ display: 'flex', gap: '36px', flexWrap: 'wrap' }}>
              {[['500+', 'Students'], ['98%', 'Success Rate'], ['3+', 'Years']].map(([val, label]) => (
                <div key={label}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-accent)', lineHeight: 1 }}>{val}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '4px' }}>{label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40, rotate: 2 }}
            animate={{ opacity: 1, y: 0, rotate: -1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <div style={{ position: 'relative', maxWidth: '560px', width: '100%' }}>
              <div style={{
                position: 'absolute', inset: '-6px',
                border: '1px solid rgba(201,168,76,0.35)',
                borderRadius: 'var(--radius-xl)',
                transform: 'rotate(1.5deg)',
              }} />
              <div style={{
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                border: '3px solid var(--color-accent)',
                boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
              }}>
                <img src="/images/heroBackground.png" alt="ISSB Smart Study" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section style={{ background: 'var(--color-surface)', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '56px' }}
          >
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--color-primary)', marginBottom: '12px' }}>Why Choose Us</p>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
              Everything You Need to <span style={{ color: 'var(--color-accent-dark)' }}>Succeed</span>
            </h2>
            <div style={{ width: '48px', height: '3px', background: 'var(--color-accent)', margin: '16px auto 0' }} />
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {[
              { icon: <BookOpen size={24} />, title: 'Secure Content Library', desc: 'Video lectures and PDFs streamed securely from our private platform.' },
              { icon: <ShieldCheck size={24} />, title: 'Complete ISSB Coverage', desc: 'From Initial Tests and Psychological Evals to full ISSB stages for Army, Navy & PAF.' },
              { icon: <Users size={24} />, title: 'Daily Sessions & Consultations', desc: 'Sir conducts live sessions daily. Students can also book 1-on-1 time with Sir directly for personal queries and guidance.' },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '32px',
                  transition: 'box-shadow 0.2s, border-color 0.2s',
                  cursor: 'default',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-accent)'; e.currentTarget.style.borderColor = 'var(--color-accent)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--color-border)'; }}
              >
                <div style={{ width: '52px', height: '52px', background: 'var(--color-primary-dark)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)', marginBottom: '20px' }}>
                  {f.icon}
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '10px' }}>{f.title}</h3>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--color-text-muted)' }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Checklist */}
      <section style={{ background: 'var(--color-surface-elevated)', padding: '80px 24px', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', alignItems: 'center' }}>
          {[
            'Initial Test Preparation',
            'Interview Coaching',
            'ISSB Psychological Prep',
            'PAF / Navy Coverage',
            'Private Video Lectures',
            '1-on-1 Mentorship Sessions',
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle size={18} color="var(--color-primary)" />
              <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Courses Section */}
      <CoursesSection />

      {/* Lead Form */}
      <LeadForm />

      {/* CTA */}
      <section id="contact" style={{
        background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
        padding: '100px 24px',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}
        >
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '16px' }}>
            Ready to Begin?
          </p>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 700, color: '#fff', lineHeight: 1.15, marginBottom: '16px' }}>
            Your journey to the uniform starts today
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: '44px' }}>
            Message us on the numbers below and our team will respond to get you enrolled and set up on the platform.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center', marginBottom: '40px' }}>
            {['03266111008', '03352535456'].map(num => (
              <a key={num} href={`tel:${num}`} style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                background: 'var(--color-accent)',
                color: 'var(--color-text-on-accent)',
                padding: '15px 32px', borderRadius: 'var(--radius-md)',
                fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 4px 24px rgba(201,168,76,0.3)',
              }}>
                <PhoneCall size={18} />
                {num}
              </a>
            ))}
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>@ISSBSMARTSTUDY</p>
        </motion.div>
      </section>

      <footer style={{
        background: 'var(--color-primary-dark)',
        borderTop: '1px solid rgba(201,168,76,0.15)',
        padding: '32px 24px',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/images/logo.png" alt="Logo" style={{ height: '36px', width: '36px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(201,168,76,0.4)' }} />
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-accent)' }}>ISSB Smart Study</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {[
              { label: 'YouTube', href: 'https://youtube.com/@issbsmartstudy', svg: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
              { label: 'Facebook', href: 'https://facebook.com/issbsmartstudy', svg: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
              { label: 'Instagram', href: 'https://instagram.com/issbsmartstudy', svg: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg> },
              { label: 'TikTok', href: 'https://tiktok.com/@issbsmartstudy', svg: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/></svg> },
            ].map(({ label, href, svg }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" title={label}
                style={{ color: 'rgba(255,255,255,0.35)', transition: 'color 0.2s ease', lineHeight: 0 }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-accent)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}
              >
                {svg}
              </a>
            ))}
          </div>

          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em' }}>
            © {new Date().getFullYear()} ISSB Smart Study · All Rights Reserved
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
