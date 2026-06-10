import React, { useState, useRef } from 'react';
import { Copy, Download, Save, Check, Award, Calendar, MapPin, Sparkles, BookOpen } from 'lucide-react';
import html2pdf from 'html2pdf.js';

export default function ProposalView({ coupleNames, weddingDate, venue, city, events, packageType, specialRequests, proposal, onSave, isSaving, alreadySaved, theme = 'dark' }) {
  const [activeTab, setActiveTab] = useState('intro');
  const [copiedSection, setCopiedSection] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(alreadySaved || false);
  const pdfRef = useRef(null);
  const isLight = theme === 'light';

  // Display name fallback for missing couple names
  const displayName = coupleNames && coupleNames.trim() ? coupleNames : 'Unnamed Couple';

  const tabs = [
    { id: 'intro', name: 'Photographer Intro', key: 'introduction' },
    { id: 'coverage', name: 'Coverage Plan', key: 'coveragePlan' },
    { id: 'expect', name: 'What to Expect', key: 'whatToExpect' },
    { id: 'concept', name: 'Pre-Wedding Concept', key: 'preWeddingConcept' }
  ];

  const handleCopy = (key) => {
    const text = proposal[key];
    navigator.clipboard.writeText(text);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleSave = async () => {
    try {
      await onSave();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const downloadPDF = () => {
    const element = pdfRef.current;
    
    // Formatting filename
    const cleanNames = coupleNames.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const filename = `${cleanNames}_wedding_proposal.pdf`;
    
    const opt = {
      margin:       15,
      filename:     filename,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { 
        scale: 2, 
        useCORS: true, 
        backgroundColor: '#ffffff',
        logging: false
      },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(element).set(opt).save();
  };

  // Custom simple Markdown to JSX renderer to keep styles premium and consistent
  const renderMarkdown = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Headers
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className={`font-serif text-lg md:text-xl font-semibold mt-4 mb-2 border-b pb-1 ${isLight ? 'text-amber-800 border-stone-200' : 'text-gold-300 border-zinc-800'}`}>
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h3 key={idx} className={`font-serif text-xl md:text-2xl font-semibold mt-5 mb-3 ${isLight ? 'text-amber-900' : 'text-gold-400'}`}>
            {line.replace('## ', '')}
          </h3>
        );
      }
      if (line.startsWith('# ')) {
        return (
          <h2 key={idx} className={`font-serif text-2xl md:text-3xl font-semibold mt-6 mb-4 ${isLight ? 'text-amber-900' : 'text-gold-400'}`}>
            {line.replace('# ', '')}
          </h2>
        );
      }
      // Bullet points
      if (line.startsWith('* ') || line.startsWith('- ')) {
        const cleanText = line.replace(/^[\*\-]\s+/, '');
        return (
          <li key={idx} className={`list-disc ml-5 mb-2 leading-relaxed text-sm md:text-base ${isLight ? 'text-stone-700' : 'text-gray-300'}`}>
            {formatBoldText(cleanText)}
          </li>
        );
      }
      // Empty lines
      if (line.trim() === '') return <div key={idx} className="h-3" />;
      // Regular paragraphs
      return (
        <p key={idx} className={`mb-4 leading-relaxed text-sm md:text-base ${isLight ? 'text-stone-700' : 'text-gray-300'}`}>
          {formatBoldText(line)}
        </p>
      );
    });
  };

  // Helper to format text with **bold** highlights
  const formatBoldText = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className={`font-semibold ${isLight ? 'text-stone-950 font-bold' : 'text-gold-200'}`}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  // Clean, printable HTML elements for PDF generation (with white background & black text)
  const renderPdfContent = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return <h4 key={idx} style={{ fontFamily: 'Georgia, serif', color: '#855d14', fontSize: '14pt', fontWeight: 'bold', marginTop: '12pt', marginBottom: '6pt', borderBottom: '1px solid #e2e8f0', paddingBottom: '3pt' }}>{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('## ') || line.startsWith('# ')) {
        return <h3 key={idx} style={{ fontFamily: 'Georgia, serif', color: '#855d14', fontSize: '16pt', fontWeight: 'bold', marginTop: '16pt', marginBottom: '8pt' }}>{line.replace(/^#+\s+/, '')}</h3>;
      }
      if (line.startsWith('* ') || line.startsWith('- ')) {
        const cleanText = line.replace(/^[\*\-]\s+/, '').replace(/\*\*/g, '');
        return <li key={idx} style={{ color: '#334155', fontSize: '10.5pt', marginBottom: '4pt', marginLeft: '20px', listStyleType: 'disc' }}>{cleanText}</li>;
      }
      if (line.trim() === '') return <div key={idx} style={{ height: '6pt' }} />;
      return <p key={idx} style={{ color: '#334155', fontSize: '10.5pt', lineHeight: '1.5', marginBottom: '8pt' }}>{line.replace(/\*\*/g, '')}</p>;
    });
  };

  const currentTab = tabs.find(t => t.id === activeTab);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Action Header */}
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl p-4 md:p-6 border ${
        isLight ? 'ivory-card border-gold-600/30 shadow-md' : 'glass-card border-gold-400/20'
      }`}>
        <div>
          <span className={`text-xs font-semibold tracking-widest uppercase ${isLight ? 'text-amber-800' : 'text-gold-400'}`}>Interactive Proposal</span>
          <h2 className={`font-serif text-xl md:text-2xl font-medium mt-0.5 ${isLight ? 'text-stone-900' : 'text-white'}`}>{displayName}</h2>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          {/* Download PDF Button */}
          <button
            onClick={downloadPDF}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
              isLight 
                ? 'border-gold-600/40 text-gold-700 hover:bg-gold-600/10' 
                : 'border-gold-400/30 text-gold-300 hover:bg-gold-400/10'
            }`}
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>

          {/* Save Proposal Button */}
          <button
            onClick={handleSave}
            disabled={isSaving || saveSuccess}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold tracking-wider uppercase transition-all cursor-pointer ${
              saveSuccess 
                ? 'bg-emerald-500 text-white' 
                : isLight
                  ? 'bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-500 hover:to-gold-300 text-stone-950 hover:shadow-md'
                  : 'bg-gradient-to-r from-gold-500 to-gold-300 hover:from-gold-400 hover:to-gold-200 text-zinc-950'
            }`}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-4 h-4" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Proposal
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs Menu & Content Area */}
      <div className={`rounded-2xl overflow-hidden border ${
        isLight ? 'ivory-card border-gold-600/20' : 'glass-card border-gold-400/15'
      }`}>
        {/* Tabs Bar */}
        <div className={`flex flex-wrap border-b scrollbar-none overflow-x-auto ${
          isLight ? 'bg-stone-100/80 border-gold-600/15' : 'bg-zinc-950/60 border-gold-400/10'
        }`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[120px] text-center py-4 px-4 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                activeTab === tab.id
                  ? isLight
                    ? 'border-gold-600 text-gold-800 bg-gold-600/5'
                    : 'border-gold-400 text-gold-300 bg-gold-400/5'
                  : isLight
                    ? 'border-transparent text-stone-500 hover:text-gold-800 hover:bg-stone-200/50'
                    : 'border-transparent text-gray-400 hover:text-gold-300/80 hover:bg-zinc-900/30'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content Box */}
        <div className="p-6 md:p-8 space-y-6">
          <div className={`flex justify-between items-center pb-3 border-b ${
            isLight ? 'border-stone-200' : 'border-zinc-800/80'
          }`}>
            <span className={`text-xs uppercase tracking-widest font-semibold ${
              isLight ? 'text-amber-800' : 'text-gold-400/70'
            }`}>
              Section Content
            </span>
            <button
              onClick={() => handleCopy(currentTab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs transition-all cursor-pointer ${
                isLight 
                  ? 'border-stone-200 text-stone-600 hover:border-gold-600/40 hover:text-gold-700' 
                  : 'border-zinc-800 text-gray-300 hover:border-gold-400/40 hover:text-gold-300'
              }`}
            >
              {copiedSection === currentTab.key ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500 font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Section</span>
                </>
              )}
            </button>
          </div>

          <div className={isLight ? "prose max-w-none text-stone-800" : "prose prose-invert max-w-none"}>
            {renderMarkdown(proposal[currentTab.key])}
          </div>
        </div>
      </div>

      {/* =======================================================
          HIDDEN PRINTABLE CONTAINER FOR PDF GENERATION
          ======================================================= */}
      <div style={{ display: 'none' }}>
        <div ref={pdfRef} className="pdf-print-container">
          {/* header branding */}
          <div style={{ textAlign: 'center', marginBottom: '25px', borderBottom: '2px solid #855d14', paddingBottom: '15px' }}>
            <h1 style={{ fontFamily: 'Georgia, serif', color: '#1c1917', fontSize: '24pt', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', margin: '0' }}>
              thereelshoot
            </h1>
            <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', color: '#64748b', fontSize: '10pt', margin: '4px 0 0 0' }}>
              Wedding Photography & Videography Studio
            </p>
          </div>

          {/* proposal heading */}
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', color: '#855d14', fontSize: '16pt', margin: '0 0 5px 0', textTransform: 'uppercase' }}>
              Wedding Coverage Proposal
            </h2>
            <p style={{ color: '#475569', fontSize: '10.5pt', margin: '0' }}>
              Specially curated for <strong>{displayName}</strong>
            </p>
          </div>

          {/* metadata table details */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '15px', marginBottom: '25px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10pt' }}>
              <tbody>
                <tr>
                  <td style={{ width: '18%', padding: '6px 0', color: '#64748b', fontWeight: 'bold' }}>Wedding Date:</td>
                  <td style={{ padding: '6px 0', color: '#334155' }}>{weddingDate}</td>
                  <td style={{ width: '18%', padding: '6px 0', color: '#64748b', fontWeight: 'bold' }}>Venue:</td>
                  <td style={{ padding: '6px 0', color: '#334155' }}>{venue}</td>
                </tr>
                <tr>
                  <td style={{ padding: '6px 0', color: '#64748b', fontWeight: 'bold' }}>City:</td>
                  <td style={{ padding: '6px 0', color: '#334155' }}>{city}</td>
                  <td style={{ padding: '6px 0', color: '#64748b', fontWeight: 'bold' }}>Package Tier:</td>
                  <td style={{ padding: '6px 0', color: '#855d14', fontWeight: 'bold' }}>{packageType}</td>
                </tr>
                <tr>
                  <td style={{ padding: '6px 0', color: '#64748b', fontWeight: 'bold' }}>Events Covered:</td>
                  <td colSpan="3" style={{ padding: '6px 0', color: '#334155' }}>{events.join(', ')}</td>
                </tr>
                {specialRequests && (
                  <tr>
                    <td style={{ padding: '6px 0', color: '#64748b', fontWeight: 'bold' }}>Special Requests:</td>
                    <td colSpan="3" style={{ padding: '6px 0', color: '#334155', fontStyle: 'italic' }}>{specialRequests}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Section 1: Introduction */}
          <div style={{ marginBottom: '25px', pageBreakAfter: 'always' }}>
            <h3 style={{ fontFamily: 'Georgia, serif', color: '#855d14', fontSize: '13pt', borderBottom: '1.5px solid #855d14', paddingBottom: '4px', textTransform: 'uppercase', marginBottom: '10px' }}>
              1. Photographer Introduction
            </h3>
            <div style={{ color: '#334155', fontSize: '10.5pt', lineHeight: '1.6' }}>
              {renderPdfContent(proposal.introduction)}
            </div>
          </div>

          {/* Section 2: Coverage Plan */}
          <div style={{ marginBottom: '25px', pageBreakAfter: 'always' }}>
            <h3 style={{ fontFamily: 'Georgia, serif', color: '#855d14', fontSize: '13pt', borderBottom: '1.5px solid #855d14', paddingBottom: '4px', textTransform: 'uppercase', marginBottom: '10px' }}>
              2. Event-By-Event Coverage Plan
            </h3>
            <div style={{ color: '#334155', fontSize: '10.5pt', lineHeight: '1.6' }}>
              {renderPdfContent(proposal.coveragePlan)}
            </div>
          </div>

          {/* Section 3: What to Expect */}
          <div style={{ marginBottom: '25px', pageBreakAfter: 'always' }}>
            <h3 style={{ fontFamily: 'Georgia, serif', color: '#855d14', fontSize: '13pt', borderBottom: '1.5px solid #855d14', paddingBottom: '4px', textTransform: 'uppercase', marginBottom: '10px' }}>
              3. Service Deliverables & Expectations
            </h3>
            <div style={{ color: '#334155', fontSize: '10.5pt', lineHeight: '1.6' }}>
              {renderPdfContent(proposal.whatToExpect)}
            </div>
          </div>

          {/* Section 4: Creative Concept */}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ fontFamily: 'Georgia, serif', color: '#855d14', fontSize: '13pt', borderBottom: '1.5px solid #855d14', paddingBottom: '4px', textTransform: 'uppercase', marginBottom: '10px' }}>
              4. Creative Pre-Wedding Concept
            </h3>
            <div style={{ color: '#334155', fontSize: '10.5pt', lineHeight: '1.6' }}>
              {renderPdfContent(proposal.preWeddingConcept)}
            </div>
          </div>

          {/* footer branding */}
          <div style={{ textAlign: 'center', marginTop: '40px', paddingTop: '15px', borderTop: '1px solid #e2e8f0', color: '#64748b', fontSize: '8.5pt' }}>
            <p style={{ margin: '0' }}>Thank you for choosing <strong>thereelshoot</strong>. We look forward to capturing your eternal love story.</p>
            <p style={{ margin: '3px 0 0 0', color: '#855d14' }}>www.thereelshoot.com | hello@thereelshoot.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
