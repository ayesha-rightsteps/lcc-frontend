import { useState, useRef, useEffect } from 'react';
import { useApi } from '../../hooks/useApi.js';
import API_ENDPOINTS from '../../constants/api-endpoints.js';
import { ScrollText, CheckCircle } from 'lucide-react';

const PRIMARY = '#2d6a4f';
const ACCENT = '#c9a84c';

const TermsModal = ({ onAccepted }) => {
  const { post } = useApi();
  const [scrolled, setScrolled] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const check = () => {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) setScrolled(true);
    };
    el.addEventListener('scroll', check);
    check();
    return () => el.removeEventListener('scroll', check);
  }, []);

  const handleAccept = async () => {
    setSubmitting(true);
    try {
      await post(API_ENDPOINTS.USERS.ACCEPT_TERMS, {});
      onAccepted();
    } finally { setSubmitting(false); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 620, maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 80px rgba(0,0,0,0.4)', border: '1px solid var(--color-border)' }}>

        {/* Header */}
        <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid var(--color-border)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ padding: 10, background: `${PRIMARY}18`, borderRadius: 'var(--radius-md)', color: PRIMARY }}>
              <ScrollText size={20} />
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
                Terms & Conditions
              </h2>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--color-text-muted)', margin: 0 }}>
                Please read carefully before continuing
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div ref={contentRef} style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', fontSize: '0.85rem', color: 'var(--color-text)', lineHeight: 1.8 }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--color-text-muted)', marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Effective Date: Upon Account Activation
          </p>

          <Section title="1. Account Access & Security">
            Your account is strictly personal and non-transferable. You are responsible for keeping your login credentials confidential. Sharing your username or password with any other person is a direct violation of these terms and will result in immediate suspension of your account.
          </Section>

          <Section title="2. Device Restriction">
            Your account is restricted to <strong>one (1) device at a time</strong>. Any attempt to log in from a second device will be flagged as suspicious activity and reported to the admin. Repeated violations may result in permanent account termination.
          </Section>

          <Section title="3. Content Usage">
            All video lectures, study materials, notes, and resources available on the LCC Academy portal are the exclusive intellectual property of ISSB Smart Study. You are granted a personal, non-exclusive, non-transferable licence to access this content solely for your own educational purposes.
          </Section>

          <Section title="4. Prohibited Activities">
            The following activities are strictly prohibited:
            <ul style={{ marginTop: 8, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>Screenshotting, screen recording, or any form of content capture</li>
              <li>Sharing, distributing, or reproducing any course material</li>
              <li>Attempting to bypass security measures or access controls</li>
              <li>Using developer tools, inspect element, or browser extensions to extract content</li>
              <li>Logging in from multiple devices or sharing access with others</li>
            </ul>
          </Section>

          <Section title="5. Monitoring & Security">
            LCC Academy employs security monitoring systems that detect and log suspicious activity including but not limited to: screenshot attempts, screen recording, developer tool access, IP changes, and device switching. All violations are automatically reported to the admin and may be used as grounds for termination.
          </Section>

          <Section title="6. Validity Period">
            Your access to the portal is limited to the validity period specified at the time of enrollment. Once your validity expires, access will be automatically revoked. Extensions must be requested through the admin.
          </Section>

          <Section title="7. Refund Policy">
            All payments made for enrollment are non-refundable. In cases of account suspension due to terms violations, no refund will be provided.
          </Section>

          <Section title="8. Amendments">
            LCC Academy reserves the right to modify these terms at any time. Continued use of the portal after any amendment constitutes your acceptance of the revised terms.
          </Section>

          <Section title="9. Acceptance">
            By clicking <strong>"I Accept"</strong> below, you confirm that you have read, understood, and agree to be bound by these Terms & Conditions in their entirety.
          </Section>

          {!scrolled && (
            <div style={{ textAlign: 'center', marginTop: 16, padding: '10px', background: `${ACCENT}18`, borderRadius: 'var(--radius-md)', color: '#7a5c00', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
              ↓ Scroll down to continue
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '20px 28px', borderTop: '1px solid var(--color-border)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', margin: 0 }}>
            {scrolled ? 'You have read the full terms.' : 'Scroll to the bottom to enable acceptance.'}
          </p>
          <button
            onClick={handleAccept}
            disabled={!scrolled || submitting}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 24px', borderRadius: 'var(--radius-md)', border: 'none',
              background: scrolled ? PRIMARY : 'var(--color-border)',
              color: scrolled ? '#fff' : 'var(--color-text-muted)',
              fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700,
              cursor: scrolled && !submitting ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s', letterSpacing: '0.04em',
            }}
          >
            <CheckCircle size={16} />
            {submitting ? 'Saving…' : 'I Accept'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 20 }}>
    <p style={{ fontWeight: 700, color: PRIMARY, marginBottom: 6, fontSize: '0.88rem' }}>{title}</p>
    <p style={{ margin: 0, color: 'var(--color-text)', lineHeight: 1.8 }}>{children}</p>
  </div>
);

export default TermsModal;
