import React, { useState, useEffect } from 'react';
import { Sparkles, History, BarChart3, AlertCircle, RefreshCw } from 'lucide-react';
import Form from './components/Form';
import ProposalView from './components/ProposalView';
import HistoryView from './components/HistoryView';
import DashboardView from './components/DashboardView';
import Spinner from './components/Spinner';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5002/api';

export default function App() {
  const [activeView, setActiveView] = useState('generator');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [savedProposalId, setSavedProposalId] = useState(null);

  const [proposal, setProposal] = useState(null);
  const [inputDetails, setInputDetails] = useState(null);

  const [proposalsHistory, setProposalsHistory] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({
    totalProposals: 0,
    mostPopularPackage: 'N/A',
    mostPopularCity: 'N/A',
    trend: []
  });

  const getLocalProposals = () => {
    const raw = localStorage.getItem('thereelshoot_proposals');

    if (!raw) {
      const initial = [
        {
          id: 'prop_1780902892868',
          coupleNames: 'Sarah & Michael',
          weddingDate: '2026-09-15',
          venue: 'Taj Mahal Palace',
          city: 'Mumbai',
          events: ['Wedding Ceremony', 'Reception'],
          packageType: 'Premium',
          specialRequests: 'Drone coverage',
          theme: 'dark',
          createdAt: '2026-06-08T07:14:52.865Z',
          proposal: {
            introduction:
              'Dearest Sarah and Michael, It is with immense pleasure and profound excitement that we, the team at thereelshoot, present this personalized photography and videography proposal for your momentous wedding celebration. The thought of capturing your love story against the majestic backdrop of the Taj Mahal Palace in Mumbai on September 15, 2026, truly fills us with inspiration.',
            coveragePlan:
              '### **Wedding Ceremony**\n*   **Key Moments to Capture:**\n    *   Arrivals of guests and the bridal party...\n*   **Photography Plan:**\n    *   **Candid Storytelling:** Our two photographers will discreetly capture genuine emotions...',
            whatToExpect:
              "### **Your Premium Wedding Photography & Videography Experience**\nWith thereelshoot's Premium Package, Sarah and Michael, you are assured an extended, immersive, and exquisitely crafted visual narrative of your wedding day.",
            preWeddingConcept:
              '### **Pre-Wedding Concept: "Mumbai\'s Golden Legacy"**\n*   **Concept Title:** "Mumbai\'s Golden Legacy: A Timeless Romance"\n*   **Storyline:** We envision a romantic journey that intertwines Sarah and Michael\'s modern love story...'
          }
        }
      ];

      localStorage.setItem('thereelshoot_proposals', JSON.stringify(initial));
      return initial;
    }

    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error('Error parsing local storage proposals:', e);
      return [];
    }
  };

  const calculateLocalAnalytics = (proposals) => {
    const total = proposals.length;

    if (total === 0) {
      return {
        totalProposals: 0,
        mostPopularPackage: 'N/A',
        mostPopularCity: 'N/A',
        trend: []
      };
    }

    const packageCounts = {};
    const cityCounts = {};
    const trendCounts = {};

    proposals.forEach((p) => {
      const pkg = p.packageType || 'Unknown';
      packageCounts[pkg] = (packageCounts[pkg] || 0) + 1;

      const city = p.city || 'Unknown';
      cityCounts[city] = (cityCounts[city] || 0) + 1;

      const dateStr = p.createdAt ? p.createdAt.split('T')[0] : 'Unknown';
      trendCounts[dateStr] = (trendCounts[dateStr] || 0) + 1;
    });

    let mostPopularPackage = 'N/A';
    let maxPackageCount = 0;

    for (const [pkg, count] of Object.entries(packageCounts)) {
      if (count > maxPackageCount) {
        maxPackageCount = count;
        mostPopularPackage = pkg;
      }
    }

    let mostPopularCity = 'N/A';
    let maxCityCount = 0;

    for (const [city, count] of Object.entries(cityCounts)) {
      if (count > maxCityCount) {
        maxCityCount = count;
        mostPopularCity = city;
      }
    }

    const trend = Object.entries(trendCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-7);

    return {
      totalProposals: total,
      mostPopularPackage,
      mostPopularCity,
      trend
    };
  };

  const generateLocalMockProposal = (formData) => {
    const cNames = formData.coupleNames || 'Unnamed Couple';
    const wDate = formData.weddingDate || 'TBD';
    const vVenue = formData.venue || 'TBD Venue';
    const cCity = formData.city || 'TBD City';
    const eEvents = formData.events || ['General Coverage'];
    const pType = formData.packageType || 'Premium';
    const sRequests = formData.specialRequests || '';

    const introduction = `Dear ${cNames},

Welcome to thereelshoot. We are absolutely thrilled at the prospect of capturing your love story on your wedding day, ${wDate}, at the iconic ${vVenue} in ${cCity}. This legendary venue, with its majestic architecture and rich history, provides the ultimate backdrop for a love story as special as yours.

Our team of visual artists is dedicated to crafting a timeless, cinematic narrative that perfectly preserves every emotion, laugh, and tear of your celebration. As luxury wedding storytellers, we believe that your wedding is not just an event, but a collection of profound moments waiting to be immortalized. Choosing the right team to document these memories is an intimate decision, and we are honored to present this custom ${pType.toLowerCase()} photography and videography proposal tailored precisely to your vision.

${sRequests ? `With your request for "${sRequests}", we are excited to incorporate these elements seamlessly, capturing breathtaking perspectives and unique moments.` : ''} Our mission is to make you feel comfortable, beautiful, and fully present, knowing that every detail is being meticulously recorded. Let’s embark on this beautiful journey together to create a visual legacy that you and your families will cherish for generations.`;

    const coveragePlan = `## Wedding Photography & Videography Coverage Plan: ${cNames}

${eEvents
  .map(
    (evt, idx) => `### ${idx + 1}. ${evt}
*   **Key Moments to Capture**: The candid emotional glances, interactions among family and friends, key milestones of the ${evt}, and celebratory moments.
*   **Photography Plan**: A seamless blend of **candid photojournalism** capturing raw emotions and **editorial portraiture** utilizing the venue layout. We will utilize natural light and architectural framing to create timeless portraits.
*   **Videography Plan**: A **cinematic multi-camera capture** utilizing prime lenses for a shallow depth of field. This includes crystal-clear audio recording and a dedicated cinematic reel focusing on slow-motion emotional reactions.`
  )
  .join('\n\n')}`;

    const whatToExpect = `## Your ${pType} Package Deliverables

Choosing our ${pType} Package ensures an elevated level of storytelling, comprehensive coverage, and meticulously crafted deliverables. Here is what you can expect from **thereelshoot**:

*   **Extended Coverage**: ${pType === 'Luxury' ? 'Unlimited coverage' : pType === 'Premium' ? 'Up to 10 hours' : 'Up to 6 hours'} of continuous coverage, ensuring we capture everything from the final touches of preparation to the high-energy highlights.
*   **Expert Team**: A dedicated team of ${pType === 'Luxury' ? 'three professional photographers and three professional videographers' : pType === 'Premium' ? 'two professional photographers and two professional videographers' : 'one professional photographer and one professional videographer'} working in perfect harmony.
*   **High-Resolution Digital Gallery**: An online, password-protected gallery featuring professionally edited images, delivered in high resolution with full printing rights.
*   **Cinematic Recap Film**: A beautifully edited highlight film set to licensed music, weaving together the most emotional and energetic moments of your day.
${pType === 'Luxury' ? '*   **Premium Leather-Bound Album**: A custom-designed luxury album.\n*   **Drone Coverage**: Complete aerial photography and videography.\n*   **Raw Footage**: Delivery of all high-quality raw files.' : ''}
${pType === 'Premium' ? `*   **Drone Integration**: Breathtaking aerial perspectives of ${vVenue}.` : ''}`;

    const preWeddingConcept = `## Pre-Wedding Concept: "A Romance in ${cCity}"

*   **Concept Title**: "A Romance in ${cCity}: Timeless and Pure"
*   **Storyline**: A romantic, narrative-driven photoshoot exploring the contrast between heritage backdrops and modern romance. The couple wanders through scenic spots, sharing quiet moments, culminating in a dramatic sunset viewing.
*   **Visual Style**: Warm, golden-hour tones paired with rich colors. The lighting will transition from soft, diffused morning light to a dramatic, sun-drenched golden glow. We will use cinematic framing to emphasize the grand architecture and intimate connection.
*   **Outfit Recommendations**: Elegant and timeless. For the bride, a flowing gown that moves beautifully. For the groom, a tailored suit or linen attire.
*   **Ideal Timing**: Early morning sunrise (6:00 AM - 8:00 AM) for empty streets and soft light, followed by late afternoon golden hour (4:30 PM - 6:30 PM).
*   **Why this suits ${cNames}**: Since you have chosen the majestic ${vVenue} and our ${pType} Package, this concept acts as the perfect artistic prelude. It complements the aesthetic of your wedding day while offering a relaxed, candid environment to get comfortable in front of our lenses prior to the main event.`;

    return {
      introduction,
      coveragePlan,
      whatToExpect,
      preWeddingConcept
    };
  };

  useEffect(() => {
    fetchHistory();
    fetchAnalytics();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/proposals`);

      if (!response.ok) {
        throw new Error('Failed to fetch proposal history.');
      }

      const data = await response.json();
      setProposalsHistory(data);
    } catch (err) {
      console.warn('API fetchHistory failed, using local storage fallback:', err);
      const localData = getLocalProposals();
      setProposalsHistory(localData);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics`);

      if (!response.ok) {
        throw new Error('Failed to fetch analytics.');
      }

      const data = await response.json();
      setAnalyticsData(data);
    } catch (err) {
      console.warn('API fetchAnalytics failed, using local storage fallback:', err);
      const localData = getLocalProposals();
      setAnalyticsData(calculateLocalAnalytics(localData));
    }
  };

  const handleGenerate = async (formData) => {
  setIsLoading(true);
  setErrorMessage(null);
  setProposal(null);
  setInputDetails(formData);
  setSavedProposalId(null);

  let generatedProposal = null;
  let usedFallback = false;

  try {
    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || 'Failed to connect to the generator engine.');
    }

    generatedProposal = await response.json();
  } catch (err) {
    console.warn('API generate failed, using local mock proposal:', err);
    generatedProposal = generateLocalMockProposal(formData);
    usedFallback = true;
  }

  setProposal(generatedProposal);

  // Always try to save generated proposal to backend MySQL
  try {
    const saveResponse = await fetch(`${API_BASE_URL}/proposals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        proposal: generatedProposal
      })
    });

    if (!saveResponse.ok) {
      throw new Error('Backend save failed.');
    }

    const savedRecord = await saveResponse.json();
    setSavedProposalId(savedRecord.id);

    await fetchHistory();
    await fetchAnalytics();

    if (usedFallback) {
      setErrorMessage('Gemini failed, so a local mock proposal was generated and saved to MySQL history.');
    }
  } catch (saveErr) {
    console.warn('Save failed, saving to localStorage only:', saveErr);

    const proposalRecord = {
      ...formData,
      proposal: generatedProposal,
      createdAt: new Date().toISOString(),
      id: 'local_prop_' + Date.now()
    };

    const currentHistory = getLocalProposals();
    currentHistory.unshift(proposalRecord);
    localStorage.setItem('thereelshoot_proposals', JSON.stringify(currentHistory));

    setSavedProposalId(proposalRecord.id);
    setProposalsHistory(currentHistory);
    setAnalyticsData(calculateLocalAnalytics(currentHistory));
    setErrorMessage('Proposal generated, but backend save failed. It was saved only in browser local storage.');
  } finally {
    setIsLoading(false);
  }
};
  const handleSave = async () => {
    if (!proposal || !inputDetails) return;

    if (savedProposalId) {
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/proposals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...inputDetails,
          proposal
        })
      });

      if (!response.ok) {
        throw new Error('Could not save this proposal via API.');
      }

      const savedRecord = await response.json();
      setSavedProposalId(savedRecord.id);
      fetchHistory();
      fetchAnalytics();
    } catch (err) {
      console.warn('API save failed, saving to localStorage fallback:', err);

      const proposalRecord = {
        ...inputDetails,
        proposal,
        createdAt: new Date().toISOString(),
        id: 'local_prop_' + Date.now()
      };

      const currentHistory = getLocalProposals();
      currentHistory.unshift(proposalRecord);
      localStorage.setItem('thereelshoot_proposals', JSON.stringify(currentHistory));

      setSavedProposalId(proposalRecord.id);
      fetchHistory();
      fetchAnalytics();
      setErrorMessage('Backend save failed, so this proposal was saved in browser local storage.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectHistoricalProposal = (item) => {
    setProposal(item.proposal);

    setInputDetails({
      coupleNames: item.coupleNames,
      weddingDate: item.weddingDate,
      venue: item.venue,
      city: item.city,
      events: item.events,
      packageType: item.packageType,
      specialRequests: item.specialRequests,
      theme: item.theme || 'dark'
    });

    setSavedProposalId(item.id);
    setActiveView('generator');
  };

  const handleResetGenerator = () => {
    setProposal(null);
    setInputDetails(null);
    setErrorMessage(null);
    setSavedProposalId(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-bg text-zinc-100 selection:bg-gold-400 selection:text-zinc-950">
      <header className="border-b border-gold-400/10 bg-zinc-950/80 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-gold-400/30 flex items-center justify-center bg-gold-400/5">
              <Sparkles className="w-5 h-5 text-gold-400" />
            </div>

            <div>
              <h1 className="font-serif text-lg tracking-wider text-white font-semibold uppercase">
                thereelshoot
              </h1>
              <p className="text-3xs tracking-widest text-gold-400 uppercase font-bold -mt-0.5">
                AI Wedding Proposal Studio
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-1 bg-zinc-900/60 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => {
                setActiveView('generator');
                setErrorMessage(null);
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeView === 'generator'
                  ? 'bg-gold-400 text-zinc-950'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Generator
            </button>

            <button
              onClick={() => {
                setActiveView('history');
                setErrorMessage(null);
                fetchHistory();
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeView === 'history'
                  ? 'bg-gold-400 text-zinc-950'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              History
            </button>

            <button
              onClick={() => {
                setActiveView('analytics');
                setErrorMessage(null);
                fetchAnalytics();
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeView === 'analytics'
                  ? 'bg-gold-400 text-zinc-950'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Analytics
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 md:py-12">
        {errorMessage && (
          <div className="glass-card-accent rounded-xl p-4 mb-6 border-red-500/30 bg-red-950/15 max-w-3xl mx-auto flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />

            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-200">System Notification</h4>
              <p className="text-xs text-red-300/80 mt-0.5 leading-relaxed">
                {errorMessage}
              </p>
            </div>

            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs text-red-400 hover:text-red-300 font-semibold px-2 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {activeView === 'generator' && (
          <div className="space-y-8 animate-fade-in">
            {isLoading ? (
              <Spinner />
            ) : proposal ? (
              <div>
                <div className="max-w-4xl mx-auto mb-4 flex justify-end">
                  <button
                    onClick={handleResetGenerator}
                    className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-gold-400 hover:text-gold-300 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Create New Proposal
                  </button>
                </div>

                <ProposalView
                  {...inputDetails}
                  proposal={proposal}
                  onSave={handleSave}
                  isSaving={isSaving}
                  alreadySaved={!!savedProposalId}
                />
              </div>
            ) : (
              <Form onSubmit={handleGenerate} isLoading={isLoading} />
            )}
          </div>
        )}

        {activeView === 'history' && (
          <div className="animate-fade-in">
            <HistoryView
              proposals={proposalsHistory}
              onSelectProposal={handleSelectHistoricalProposal}
            />
          </div>
        )}

        {activeView === 'analytics' && (
          <div className="animate-fade-in">
            <DashboardView analytics={analyticsData} />
          </div>
        )}
      </main>

      <footer className="border-t border-gold-400/10 py-8 bg-zinc-950/60 text-center text-xs text-gray-500">
        <div className="max-w-6xl mx-auto px-4 space-y-2">
          <p className="font-serif tracking-widest text-gold-400/70 text-sm font-medium uppercase">
            thereelshoot
          </p>
          <p>
            © {new Date().getFullYear()} thereelshoot. Built for speed and visual excellence. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
