import React from 'react';
import { safetyRules, safetyChecklist, dosItems, dontsItems } from '../data/safetyGuidelines';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, CheckSquare, Printer, CheckCircle2, XCircle, PhoneCall, AlertTriangle, FileText, MapPin, Ruler, Users, Flame, Ban, Package } from 'lucide-react';

const RuleIconRenderer = ({ iconName, size = 32, color = 'var(--crimson-red)' }) => {
  if (iconName === 'FileText') return <FileText size={size} color={color} />;
  if (iconName === 'MapPin') return <MapPin size={size} color={color} />;
  if (iconName === 'Ruler') return <Ruler size={size} color={color} />;
  if (iconName === 'Users') return <Users size={size} color={color} />;
  if (iconName === 'Flame') return <Flame size={size} color={color} />;
  if (iconName === 'Ban') return <Ban size={size} color={color} />;
  if (iconName === 'AlertTriangle') return <AlertTriangle size={size} color={color} />;
  if (iconName === 'Package') return <Package size={size} color={color} />;
  return <ShieldCheck size={size} color={color} />;
};

export const Safety = () => {
  const { language } = useLanguage();

  return (
    <div className="safety-page-light" style={{ padding: '2.5rem 0 5rem', background: '#f8fafc', minHeight: '100vh', color: '#1e293b' }}>
      <div className="container" style={{ maxWidth: '1040px' }}>
        
        {/* Light Festive Hero Banner */}
        <div className="safety-hero-banner" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #fffdf5 50%, #fef3c7 100%)', border: '1.5px solid #fef08a', borderRadius: 'var(--radius-lg)', padding: '2rem 2.25rem', marginBottom: '2.5rem', boxShadow: '0 4px 24px rgba(217, 4, 41, 0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
            <div>
              <div className="sparkle-badge" style={{ marginBottom: '0.65rem' }}>
                <ShieldCheck size={14} />
                <span>{language === 'ta' ? '100% பசுமை பட்டாசுகள் பாதுகாப்பு வழிகாட்டி' : '100% CSIR-NEERI Green Certified'}</span>
              </div>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a', margin: '0.35rem 0' }}>
                {language === 'ta' ? 'பட்டாசு பாதுகாப்பு வழிமுறைகள் & எச்சரிக்கைகள்' : 'Cracker Safety Guidelines & Precautions'}
              </h1>
              <p style={{ color: '#475569', fontSize: '0.95rem', maxWidth: '640px', margin: 0, lineHeight: 1.5 }}>
                {language === 'ta'
                  ? 'உங்கள் குடும்பத்தினர் மற்றும் அண்டை வீட்டாருடன் தீபாவளி பண்டிகையை பாதுகாப்பாகவும் மகிழ்ச்சியாகவும் கொண்டாட இந்த அவசிய விதிகளைப் பின்பற்றுங்கள்.'
                  : 'Follow these essential rules to ensure a joyful, incident-free, and safe festival for your family and neighbors.'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
              <div style={{ background: '#ffffff', padding: '0.75rem 1.15rem', borderRadius: 'var(--radius-md)', border: '1.5px solid #a7f3d0', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <PhoneCall size={16} /> 108 / 101
                </div>
                <div style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>
                  {language === 'ta' ? 'அவசர உதவி எண்' : 'Fire Emergency'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side-by-Side DO'S & DON'TS Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem', marginBottom: '3rem' }}>
          
          {/* DO'S Column (Green) */}
          <div style={{ background: '#ffffff', border: '1.5px solid #a7f3d0', borderRadius: '20px', padding: '1.75rem', boxShadow: '0 8px 24px rgba(5, 150, 105, 0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1.5px solid #ecfdf5' }}>
              <CheckCircle2 size={24} color="#059669" />
              <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#059669', margin: 0 }}>
                {language === 'ta' ? 'செய்ய வேண்டியவை (DO\'S)' : 'Mandatory Safety Rules (DO\'S)'}
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {dosItems.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', background: '#f0fdf4', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #dcfce7' }}>
                  <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.9rem', color: '#166534', fontWeight: 600, lineHeight: 1.4 }}>
                    {language === 'ta' ? item.textTa : item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* DON'TS Column (Red) */}
          <div style={{ background: '#ffffff', border: '1.5px solid #fecdd3', borderRadius: '20px', padding: '1.75rem', boxShadow: '0 8px 24px rgba(217, 4, 41, 0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1.5px solid #fff1f2' }}>
              <XCircle size={24} color="#d90429" />
              <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#d90429', margin: 0 }}>
                {language === 'ta' ? 'செய்யக்கூடாதவை (DON\'TS)' : 'Safety Prohibitions (DON\'TS)'}
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {dontsItems.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', background: '#fff1f2', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #ffe4e6' }}>
                  <XCircle size={18} color="#d90429" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.9rem', color: '#9f1239', fontWeight: 600, lineHeight: 1.4 }}>
                    {language === 'ta' ? item.textTa : item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Safety Rules Cards Grid */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', background: '#ffffff', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1.5px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <AlertTriangle size={20} color="var(--crimson-red)" />
              {language === 'ta' ? 'விரிவான பாதுகாப்பு வழிகாட்டி' : 'Detailed Safety Instructions & Standards'}
            </h2>
          </div>

          <div className="safety-rules-grid">
            {safetyRules.map(rule => (
              <div key={rule.id} style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '16px', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', transition: 'transform 0.2s ease, border-color 0.2s ease' }}>
                <div style={{ marginBottom: '0.85rem' }}>
                  <RuleIconRenderer iconName={rule.icon} size={32} color="var(--crimson-red)" />
                </div>
                <div style={{ fontSize: '0.725rem', color: '#800f2f', background: '#fff1f2', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0.2rem 0.55rem', borderRadius: '4px', display: 'inline-block', marginBottom: '0.5rem' }}>
                  {language === 'ta' ? (rule.categoryTa || rule.category) : rule.category}
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0.25rem 0 0.5rem' }}>
                  {language === 'ta' ? (rule.titleTa || rule.title) : rule.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.55 }}>
                  {language === 'ta' ? (rule.descriptionTa || rule.description) : rule.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Do's & Don'ts Checklist Card */}
        <div style={{ background: '#ffffff', padding: '2rem 2.25rem', borderRadius: '20px', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <CheckSquare size={24} color="#059669" />
              {language === 'ta' ? 'கட்டாய பாதுகாப்பு சரிபார்ப்புப் பட்டியல்' : 'Mandatory Festive Safety Checklist'}
            </h2>
            <button className="btn-secondary" onClick={() => window.print()} style={{ background: '#f8fafc', color: '#0f172a', border: '1.5px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1.1rem', borderRadius: 'var(--radius-full)', cursor: 'pointer' }}>
              <Printer size={16} /> {language === 'ta' ? 'பட்டியலை அச்சிடுக' : 'Print Checklist'}
            </button>
          </div>

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', padding: 0 }}>
            {safetyChecklist.map((item, idx) => (
              <li key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.95rem', background: '#f8fafc', padding: '0.85rem 1.15rem', borderRadius: '12px', border: '1px solid #e2e8f0', fontWeight: 600, color: '#1e293b' }}>
                <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0 }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
};

