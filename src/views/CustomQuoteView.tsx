import { AppIcon } from '../components/AppIcon';
import React, { useState } from 'react';
import { ActiveView, CartItem } from '../types';
import { getWhatsAppLink, getWhatsAppNumber } from '../utils/whatsapp';
import { storeManager } from '../services/storeManager';

interface CustomQuoteViewProps {
  onNavigate: (view: ActiveView) => void;
  onAddToCart: (item: Omit<CartItem, 'id'>, qty: number) => void;
}

export const CustomQuoteView: React.FC<CustomQuoteViewProps> = ({
  onNavigate,
  onAddToCart
}) => {
  // Form states
  const [storeName, setStoreName] = useState('');
  const [gstin, setGstin] = useState('');
  const [contactName, setContactName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [storeType, setStoreType] = useState("Men's Wear");
  const [floorArea, setFloorArea] = useState('500-1000');
  
  const [selectedFixtures, setSelectedFixtures] = useState<string[]>([
    'Floor Display Racks & Center Islands',
    'Wall Slotted Channels & Shelf Brackets'
  ]);

  const [selectedFinish, setSelectedFinish] = useState('Industrial Matte Black');
  const [timeline, setTimeline] = useState('1-2 Weeks');
  const [customNotes, setCustomNotes] = useState('');
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [submittedFeedback, setSubmittedFeedback] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submissionNotice, setSubmissionNotice] = useState<string | null>(null);

  const fixtureOptions = [
    { id: 'floor-racks', label: 'Floor Display Racks & Center Islands', desc: 'Triple pipe, double bumper, circular spinner stands' },
    { id: 'wall-channels', label: 'Wall Slotted Channels & Shelf Brackets', desc: 'Heavy gauge concealed wall post systems with wooden/glass shelves' },
    { id: 'mannequins', label: 'Mannequins & Tailor Dummies', desc: 'Fiberglass full body forms, magnetic limbs, velvet bridal torsos' },
    { id: 'hangers', label: 'Premium Wooden / Acrylic Hangers', desc: 'Lotus wood, non-slip rubberized, metal swivels in bulk boxes' },
    { id: 'cash-counters', label: 'Cash Counters & Display Island Tables', desc: 'Modular architectural reception and checkout consoles' },
    { id: 'trial-rooms', label: 'Trial Room & Fitting Accessories', desc: 'Curtain pipes, wall faceout hooks, mirrors, acrylic price holders' },
  ];

  const finishes = [
    { id: 'matte-black', name: 'Industrial Matte Black', color: '#1A1C20' },
    { id: 'pvd-gold', name: 'Brushed Champagne Gold (PVD)', color: '#D4AF37' },
    { id: 'chrome', name: 'Luxury Mirror Chrome', color: '#C2C7CF' },
    { id: 'white', name: 'Crisp Architectural White', color: '#FFFFFF' },
  ];

  const handleToggleFixture = (label: string) => {
    setSelectedFixtures(prev => 
      prev.includes(label) ? prev.filter(x => x !== label) : [...prev, label]
    );
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0].name);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0].name);
    }
  };

  const handleWhatsAppSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || submittedFeedback) return;
    const phoneDigits = whatsapp.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '');
    if (phoneDigits.length !== 10 || selectedFixtures.length === 0) {
      setSubmissionError('Enter a valid 10-digit WhatsApp number and select at least one fixture type.');
      return;
    }
    setIsSubmitting(true);
    setSubmissionError(null);
    const whatsappWindow = window.open('about:blank', '_blank');
    try {
      const quote = await storeManager.createQuote({
        customerName: contactName.trim(),
        storeName: storeName.trim(),
        whatsapp: phoneDigits,
        city: deliveryLocation.trim(),
        area: `${floorArea} sq.ft`,
        storeType,
        notes: [
          customNotes.trim(),
          `Requested fixtures: ${selectedFixtures.join(', ')}`,
          `Preferred finish: ${selectedFinish}`,
          `Timeline: ${timeline}`,
          gstin.trim() ? `GSTIN: ${gstin.trim()}` : '',
          uploadedFile ? `Customer listed attachment: ${uploadedFile} (file not uploaded)` : '',
        ].filter(Boolean).join('\n'),
        fixtures: selectedFixtures,
        finish: selectedFinish,
        timeline,
        gstin: gstin.trim(),
        attachmentName: uploadedFile,
      });
      const message = `Hi All Display Chennai, I submitted custom factory quote request *${quote.quoteNo}*.\n\nStore: ${quote.storeName}\nContact: ${quote.customerName} (+91 ${quote.whatsapp})\nLocation: ${quote.city}\nStore format: ${quote.storeType} (${quote.area})\nFixtures: ${quote.fixtures?.join(', ')}\nFinish: ${quote.finish}\nTimeline: ${quote.timeline}\n${quote.gstin ? `GSTIN: ${quote.gstin}\n` : ''}${customNotes ? `Notes: ${customNotes}\n` : ''}${uploadedFile ? `I will attach ${uploadedFile} in this chat.\n` : ''}\nPlease share itemized CAD BOQ and wholesale pricing.`;
      if (whatsappWindow) whatsappWindow.location.href = getWhatsAppLink(message);
      else setSubmissionError(`Quote ${quote.quoteNo} is saved, but your browser blocked the WhatsApp window.`);
      setSubmittedFeedback(true);
      setSubmissionNotice(`Quote ${quote.quoteNo} was saved to the admin Quote Requests list.`);
    } catch (error) {
      whatsappWindow?.close();
      setSubmissionError(error instanceof Error ? error.message : 'Could not save this quote. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Can you customize heights to match our ceiling beam height?',
      a: 'Yes, our Feel Khana facility fabricates custom pipe uprights and floor-to-ceiling channel assemblies up to 12 feet. Simply share your ceiling slab-to-false-ceiling elevation on WhatsApp.'
    },
    {
      q: 'How is freight calculated for outstation dispatches to AP, Karnataka, or Tamil Nadu?',
      a: 'Freight is billed at actuals based on cubic volume and crate weight via trusted road carriers (VRL, Navata, TCI, Kranti). We deliver goods to the Hyderabad transport hub with zero local cartage fee.'
    },
    {
      q: 'Do you provide installation technicians at the store site?',
      a: 'All our triple pipe racks and slotted wall systems are engineered for boltless 10-minute interlocking assembly. Any local handyman or shop carpenter can install them using our video guides. For full showroom turnkey projects (>1,500 sq.ft) in South India, our factory technician team can be deputed.'
    },
    {
      q: 'What is the minimum order quantity (MOQ) for custom PVD gold coating?',
      a: 'For PVD titanium champagne gold coating, the MOQ is 4 floor racks or 40 running feet of wall channels to justify batch vacuum chamber deposition.'
    }
  ];

  return (
    <div className="w-full">
      {/* Top Hero & Context Strip */}
      <section className="w-full bg-surface-container-low py-10 px-4 lg:px-8 border-b border-surface-container">
        <div className="max-w-7xl mx-auto flex flex-col items-start gap-4">
          <div className="flex items-center gap-2 bg-surface-container px-3 py-1 rounded-full shadow-sm">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span className="text-xs uppercase font-bold tracking-wider text-secondary">
              B2B Custom Manufacturing &amp; Wholesale Rollouts
            </span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between w-full gap-6">
            <div className="max-w-3xl flex flex-col gap-2">
              <h1 className="font-serif text-3xl lg:text-4xl font-bold text-primary tracking-tight leading-tight">
                Get a Factory-Direct Quote for Custom Racks or Full Boutique Fit-Outs
              </h1>
              <p className="text-sm md:text-base text-on-surface-variant max-w-2xl leading-relaxed">
                Whether you need custom-height triple pipe racks, PVD gold wall channels cut to your wall dimensions, or a turnkey setup for a 2,000 sq.ft showroom, our Feel Khana team prepares comprehensive itemized proforma estimates within 2 hours.
              </p>
            </div>

            {/* Quick B2B Assurance Badges */}
            <div className="flex items-center gap-3 flex-shrink-0 bg-surface-container-lowest p-3 rounded-xl shadow-sm border border-surface-container">
              <div className="flex flex-col items-center justify-center p-2.5 bg-surface-container-low rounded-lg text-center min-w-[90px]">
                <span className="font-serif text-xl font-bold text-primary">2 Hrs</span>
                <span className="text-[10px] text-on-surface-variant uppercase font-semibold">Fast Proforma</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2.5 bg-surface-container-low rounded-lg text-center min-w-[90px]">
                <span className="font-serif text-xl font-bold text-secondary">100%</span>
                <span className="text-[10px] text-on-surface-variant uppercase font-semibold">Factory B2B</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2.5 bg-surface-container-low rounded-lg text-center min-w-[90px]">
                <span className="font-serif text-xl font-bold text-primary">Pan-India</span>
                <span className="text-[10px] text-on-surface-variant uppercase font-semibold">Safe Freight</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Visual Showcase Grid */}
      <section className="max-w-7xl mx-auto w-full px-4 lg:px-8 -mt-5 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-md flex items-center gap-4 border border-surface-container">
            <div className="w-18 h-22 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjrRSOAMgfWt-QaZq7ngqtB0vqOvOre6VkG-RrXaa50u9gWy_mYYyG9igzMobt3ozelyWlgb_qw8ho9vBIJcShf3cbwfI7LVSH8JEeHcRuIiLqstu6hSeFIFBDHURQDc2leapMoaA3PEB-Z6HP4Pox1-B-IJ3vNUR9q9CK1xgiC3ck4rx8GFeihMCpk7G9EFFiiAsltCoCVQov0bxiXjQF5aYlQ1MByoCebaPgfo1kjrMLnsJRhVmq" 
                alt="Boutique triple pipe display rack"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-bold uppercase text-secondary">Best-Seller Fixture</span>
              <h3 className="font-bold text-sm text-primary truncate">Triple Pipe Racks</h3>
              <p className="text-xs text-on-surface-variant line-clamp-2 mt-0.5">High load-bearing commercial steel with modular tempered glass spans.</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-md flex items-center gap-4 border border-surface-container">
            <div className="w-18 h-22 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZAb6dC9wseZhTD1es6eKfy7a6YaIm5dCB0OiQfQhcorOJulbUp20RZfyYVFfuiERhjvTiZZ9_ln6o1szmyIVb_Azc3CgBxpHjDjzVfaVT69x_QFy4apXDIl_grvEGM9pWES1O8UcHcihDOufp3nOvavuESkRtdXKsrpAwuDMoqXy_Ob5KfAPfJfVyh4EXEqGQND3E_D7Xur2jq15p6UAvqis2hKeHwMn0RZT-zBv0QlGcw89qDQKt" 
                alt="Wood and metal hanging rods"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-bold uppercase text-secondary">Industrial Wall Slat</span>
              <h3 className="font-bold text-sm text-primary truncate">Wood &amp; Metal Hanging Rods</h3>
              <p className="text-xs text-on-surface-variant line-clamp-2 mt-0.5">Wall-mounted black iron flanges paired with oiled teak tops.</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-md flex items-center gap-4 border border-surface-container">
            <div className="w-18 h-22 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAP2KBeZC8HdZtfgHHNqVJaTGIave3fJXdoSnbiHFC0wWWwRibvjd-1rHR4GhLm0qCWWfQR6T7KrMrrs6Im4XfnWQERfS0xMaZ2P_KrgSwWEfRHyNw2G2Dtq5rkoMK0Veo7_OHvZ5SSd9Fb61giUNzKnymglsoeKYYV5L5zyBD9MJsM50fuqvRI3Z3r-OPWMm6WXmFaxcJP-37YnYT2BJD3YG9ipY3VhrRaOInDRphXPSlmg-AV9IVa" 
                alt="PVD gold wall"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-bold uppercase text-secondary">Luxury Grade</span>
              <h3 className="font-bold text-sm text-primary truncate">PVD Brushed Gold Wall</h3>
              <p className="text-xs text-on-surface-variant line-clamp-2 mt-0.5">Titanium coated rust-resistant 1.5mm commercial slot channels.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dual-Column Interactive Quote Builder & Consultation Form */}
      <section className="max-w-7xl mx-auto w-full px-4 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form (7 cols) */}
          <div className="lg:col-span-7 flex flex-col bg-surface-container-lowest rounded-2xl p-6 lg:p-8 shadow-lg border border-surface-container">
            <div className="flex flex-col gap-1 pb-4 mb-6 border-b border-surface-container">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-wider text-secondary">Official Wholesale Ingestion Form</span>
                <span className="bg-secondary text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase shadow-2xs">Priority Dispatch</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-primary mt-1">Store Specifications &amp; Bill of Materials</h2>
              <p className="text-xs text-on-surface-variant">Fill in your requirements below. Our factory estimation engineers in Feel Khana will prepare a detailed GST itemized quote.</p>
            </div>

            <form onSubmit={handleWhatsAppSubmit} className="flex flex-col gap-6">
              {/* Section 1: Business Credentials */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <span className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center text-[10px]">1</span>
                  <span>Client &amp; Store Credentials</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-on-surface">Store or Firm Name *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Royal Silks & Menswear"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="bg-surface-container-low px-3 py-2 rounded-lg text-on-surface border border-surface-container focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-on-surface">GSTIN (Optional)</label>
                    <input 
                      type="text"
                      placeholder="36AAHCA1234F1Z8"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value)}
                      className="bg-surface-container-low px-3 py-2 rounded-lg text-on-surface border border-surface-container focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-on-surface">Contact Person Name *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Proprietor / Architect Name"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="bg-surface-container-low px-3 py-2 rounded-lg text-on-surface border border-surface-container focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-on-surface">Direct WhatsApp Number *</label>
                    <div className="flex items-center bg-surface-container-low rounded-lg px-3 py-2 border border-surface-container">
                      <span className="text-on-surface-variant font-mono pr-2 mr-2 border-r border-surface-container">+91</span>
                      <input 
                        type="tel" 
                        required
                        placeholder="10-digit mobile number"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="w-full bg-transparent text-on-surface focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-1">
                    <label className="font-semibold text-on-surface">Delivery Location / Warehouse Depot *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="City, State, and Pincode (e.g. Vijayawada, AP - 520001)"
                      value={deliveryLocation}
                      onChange={(e) => setDeliveryLocation(e.target.value)}
                      className="bg-surface-container-low px-3 py-2 rounded-lg text-on-surface border border-surface-container focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Store Format & Area */}
              <div className="flex flex-col gap-3 pt-2 border-t border-surface-container">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <span className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center text-[10px]">2</span>
                  <span>Retail Format &amp; Carpet Area</span>
                </div>
                
                <div className="flex flex-col gap-1.5 text-xs">
                  <span className="font-semibold text-on-surface">Type of Store</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {["Men's Wear", "Women's Ethnic & Sarees", "Western Boutique", "Kidswear & Baby Care", "Multi-Brand Showroom", "Wholesale Warehouse"].map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setStoreType(type)}
                        className={`px-3 py-2 rounded-lg text-center transition-all cursor-pointer ${
                          storeType === type
                            ? 'bg-primary text-on-primary font-bold shadow'
                            : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 text-xs pt-1">
                  <span className="font-semibold text-on-surface">Store Floor Area (Sq. Ft.)</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: '<500', label: '<500', desc: 'Compact Boutique' },
                      { id: '500-1000', label: '500-1000', desc: 'Standard Store' },
                      { id: '1000-2500', label: '1000-2500', desc: 'Large Showroom' },
                      { id: '2500+', label: '2500+', desc: 'Mega Retail / Mall' },
                    ].map(area => {
                      const isSelected = floorArea === area.id;
                      return (
                        <button
                          key={area.id}
                          type="button"
                          onClick={() => setFloorArea(area.id)}
                          className={`p-2.5 rounded-lg text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-primary text-on-primary font-bold shadow-md ring-2 ring-primary/20'
                              : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                          }`}
                        >
                          <span className="block font-serif text-base font-bold leading-tight">{area.label}</span>
                          <span className={`text-[10px] uppercase font-semibold ${isSelected ? 'text-white/90' : 'text-on-surface-variant'}`}>
                            {area.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Section 3: Required Fixtures */}
              <div className="flex flex-col gap-3 pt-2 border-t border-surface-container">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <span className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center text-[10px]">3</span>
                  <span>Required Fixtures &amp; Accessories</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {fixtureOptions.map((f) => (
                    <label
                      key={f.id}
                      onClick={() => handleToggleFixture(f.label)}
                      className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedFixtures.includes(f.label)
                          ? 'bg-surface-container-lowest border-primary shadow-sm'
                          : 'bg-surface-container-low border-transparent hover:bg-surface-container'
                      }`}
                    >
                      <input 
                        type="checkbox"
                        checked={selectedFixtures.includes(f.label)}
                        onChange={() => {}}
                        className="mt-0.5 accent-primary"
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-primary">{f.label}</span>
                        <span className="text-[11px] text-on-surface-variant leading-snug">{f.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Section 4: Architectural Finish */}
              <div className="flex flex-col gap-3 pt-2 border-t border-surface-container">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <span className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center text-[10px]">4</span>
                  <span>Preferred Architectural Finish</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {finishes.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setSelectedFinish(f.name)}
                      className={`flex items-center gap-2 p-2.5 rounded-lg border text-left transition-all ${
                        selectedFinish === f.name
                          ? 'bg-surface-container-lowest border-primary shadow-sm ring-1 ring-primary'
                          : 'bg-surface-container-low border-transparent hover:bg-surface-container'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/10" style={{ backgroundColor: f.color }}></span>
                      <span className="text-[11px] font-bold text-on-surface leading-tight">{f.name.split(' (')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Section 5: Floor Plan Upload Dropzone */}
              <div className="flex flex-col gap-2 pt-2 border-t border-surface-container text-xs">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <span className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center text-[10px]">5</span>
                  <span>Upload Floor Plan or Reference Drawings</span>
                </div>
                
                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                  className="border-2 border-dashed border-outline-variant hover:border-primary rounded-xl p-6 text-center flex flex-col items-center justify-center gap-2 bg-surface-container-low transition-colors cursor-pointer"
                  onClick={() => document.getElementById('file-upload-input')?.click()}
                >
                  <input 
                    id="file-upload-input" 
                    type="file" 
                    className="hidden" 
                    accept=".dwg,.skp,.pdf,.png,.jpg,.jpeg"
                    onChange={handleFileInput}
                  />
                  <AppIcon name="cloud_upload" className="text-[36px] text-secondary" />
                  <div role="note" className="text-[11px] text-amber-700">The file is not uploaded to the site yet. After WhatsApp opens, attach it in the chat.</div>
                  {uploadedFile ? (
                    <div className="flex items-center gap-2 text-primary font-bold">
                      <AppIcon name="check_circle" className="text-[18px] text-[#25D366]" />
                      <span>{uploadedFile}</span>
                    </div>
                  ) : (
                    <>
                      <div className="font-bold text-primary">Drag &amp; drop shop blueprint or photo here</div>
                      <div className="text-[11px] text-on-surface-variant">Supports PDF, DWG, SKP, PNG, JPG (Max 50MB)</div>
                      <div className="text-[10px] text-secondary font-semibold mt-1">Or simply take a photo of your paper sketch and attach on WhatsApp!</div>
                    </>
                  )}
                </div>
              </div>

              {/* Section 6: Timeline & Notes */}
              <div className="flex flex-col gap-3 pt-2 border-t border-surface-container text-xs">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <span className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center text-[10px]">6</span>
                  <span>Target Launch &amp; Custom Notes</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Emergency 48-72h', '1-2 Weeks', '3-4 Weeks', 'Planning Stage'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTimeline(t)}
                      className={`p-2 rounded-lg text-center transition-all font-semibold cursor-pointer ${
                        timeline === t ? 'bg-primary text-on-primary shadow' : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <textarea
                  rows={3}
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="Special instructions: e.g. need 1.8mm gauge heavy lehenga hanging bars, or specific store column positions..."
                  className="w-full bg-surface-container-low rounded-lg p-3 text-xs text-on-surface border border-surface-container focus:outline-none focus:border-primary mt-1"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col gap-2.5 pt-2">
                {submissionError && <div role="alert" className="rounded-lg bg-red-50 p-3 text-xs text-red-800">{submissionError}</div>}
                {submissionNotice && <div role="status" className="rounded-lg bg-green-50 p-3 text-xs text-green-800">{submissionNotice}</div>}
                <button
                  type="submit"
                  disabled={isSubmitting || submittedFeedback}
                  className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all transform hover:-translate-y-0.5"
                >
                  <AppIcon name="send" className="text-[20px]" />
                  <span>{isSubmitting ? 'Saving Quote…' : submittedFeedback ? 'Quote Request Saved' : 'Save Quote & Continue to WhatsApp'}</span>
                </button>

                <a
                  href={`tel:+${getWhatsAppNumber(true)}`}
                  className="w-full bg-surface-container hover:bg-surface-container-high text-primary py-2.5 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-surface-container"
                >
                  <AppIcon name="phone" className="text-[18px]" />
                  <span>Request Call Back from Feel Khana Desk Lead (+{getWhatsAppNumber(true)})</span>
                </a>
              </div>
            </form>
          </div>

          {/* Right Column: Workflow, Guarantee & Hyderabad Showroom Addresses (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* 4-Stage Workflow */}
            <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-surface-container flex flex-col gap-4">
              <span className="text-xs uppercase font-bold tracking-wider text-secondary">
                All Display Direct Workflow
              </span>
              <div className="flex flex-col gap-3">
                {[
                  { num: '01', title: 'Hand Sketch Ingestion', desc: 'Share your carpet dimensions or AutoCAD floor plan on WhatsApp.' },
                  { num: '02', title: 'CAD & Bill of Materials (BOQ)', desc: 'Our Hyderabad specialists optimize rack bays and provide millimetric cut-sheets.' },
                  { num: '03', title: 'Direct Ex-Factory Dispatch', desc: 'Heavy bubble wrap + pinewood crating from Feel Khana Depot warehouse.' },
                  { num: '04', title: 'Boltless Rapid Assembly', desc: 'Interlocking socket pillars assembled in 10 minutes per rack.' },
                ].map((step) => (
                  <div key={step.num} className="flex items-start gap-3 p-2 rounded-lg hover:bg-surface-container-low transition-colors">
                    <span className="font-mono text-base font-bold text-secondary shrink-0">{step.num}</span>
                    <div className="flex flex-col">
                      <span className="font-bold text-xs text-primary">{step.title}</span>
                      <span className="text-[11px] text-on-surface-variant leading-snug">{step.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Wholesale Policy Guarantee */}
            <div className="bg-[#1a1c20] text-surface p-5 rounded-xl shadow-sm flex flex-col gap-3 border border-white/10">
              <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-wider">
                <AppIcon name="verified" className="text-[20px]" />
                <span>Direct Wholesale Guarantee</span>
              </div>
              <p className="text-xs text-primary-fixed leading-relaxed">
                We manufacture and assemble everything in-house in Hyderabad, Telangana. No middleman margins. 100% advance RTGS / NEFT before transport loading.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-secondary-fixed pt-1 border-t border-white/10">
                <AppIcon name="videocam" className="text-[16px]" />
                <span>Live video inspection before vehicle handoff guaranteed.</span>
              </div>
            </div>

            {/* Visit Our Feel Khana Store */}
            <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-surface-container flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-wider text-secondary">
                  Visit Our Feel Khana Store
                </span>
                <span className="text-[10px] text-[#25D366] font-bold uppercase bg-[#25D366]/10 px-2 py-0.5 rounded">
                  Open Mon - Sat
                </span>
              </div>

              {/* Showroom 1 */}
              <div className="flex flex-col gap-1 text-xs border-b border-surface-container pb-3">
                <div className="flex items-center gap-1.5 font-bold text-primary">
                  <AppIcon name="store" className="text-secondary text-[16px]" />
                  <span>Feel Khana Wholesale Showroom</span>
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  15-8-397, Feel Khana, Hyderabad 500012, Telangana, India
                </p>
                <div className="text-[11px] text-secondary font-semibold">Display: Over 120+ Racks &amp; Dummies on Display</div>
              </div>

              {/* Showroom 2 */}
              <div className="flex flex-col gap-1 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-primary">
                  <AppIcon name="factory" className="text-secondary text-[16px]" />
                  <span>Feel Khana Central Manufacturing &amp; Warehouse</span>
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  15-8-397, Feel Khana, Hyderabad 500012, Telangana, India
                </p>
                <div className="text-[11px] text-secondary font-semibold">Bulk Loading &amp; Outstation Logistics Depot</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Standard Modular Specs Table */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-8 w-full">
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs uppercase font-bold text-secondary tracking-wider">Quick Specification Ledger</span>
              <h3 className="font-serif text-xl font-bold text-primary">Standard Modular Specs Reference</h3>
            </div>
            <button
              onClick={() => onNavigate('quote-cart')}
              className="text-xs font-bold text-secondary hover:underline flex items-center gap-1"
            >
              <span>View Current Order List</span>
              <AppIcon name="arrow_forward" className="text-[16px]" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-surface-container bg-surface-container-low text-on-surface">
                  <th className="py-2.5 px-3 font-bold uppercase text-[10px]">Model Code</th>
                  <th className="py-2.5 px-3 font-bold uppercase text-[10px]">Product System</th>
                  <th className="py-2.5 px-3 font-bold uppercase text-[10px]">Steel Alloy / Gauge</th>
                  <th className="py-2.5 px-3 font-bold uppercase text-[10px]">Load Rating</th>
                  <th className="py-2.5 px-3 font-bold uppercase text-[10px]">Ex-Factory Price</th>
                  <th className="py-2.5 px-3 font-bold uppercase text-[10px] text-right">Quick Add</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                <tr className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-primary">AD-TPR-739</td>
                  <td className="py-3 px-3 font-semibold text-primary">Commercial Triple Pipe Rack</td>
                  <td className="py-3 px-3 text-on-surface-variant">Cold Rolled 1.6mm ERW</td>
                  <td className="py-3 px-3 text-[#128C7E] font-semibold">140 kg Certified</td>
                  <td className="py-3 px-3 font-bold text-primary">₹3,850 <span className="text-[10px] text-outline font-normal">/ unit (4-9 tier)</span></td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onAddToCart({
                        productId: 'ad-tpr-739',
                        sku: 'AD-TPR-739',
                        title: 'Triple Pipe Commercial Rack System',
                        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXybVXMlvZGeKYb_0JXEtHxZmiY36LraReoSDO2Auwjuyr6Nr9AmLN02CqnVSfW5qty_u1k1zBD3_8xhryMVP33uzyGFfJT-Irp_zV2RwgYU3JRLGf_A_X5jCoLJ4YtNB_MLXGfONPve3BhVwvtJJNkGZE4FJ2H53n7H1J-0lWZWLhZREwRq9q-GBEXPajJREpKLmpuAXp1s4ZoBzc79alpLRtJ6Es_FBOpz6L-smTtuCpCvs9H85f',
                        unitPrice: 3850,
                        quantity: 4,
                        moq: 1,
                        unitLabel: 'units',
                        finish: 'Industrial Matte Black',
                        sizeOrSpec: '5.5 Ft (3 Tiers + Glass Deck)',
                        gauge: '1.6mm Commercial Heavy Gauge',
                        packingType: 'Standard Flat-Pack Crate'
                      }, 4)}
                      className="px-2.5 py-1 rounded bg-surface-container hover:bg-primary hover:text-white font-bold text-[10px] transition-colors"
                    >
                      + Add 4 Units
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-primary">AD-WCH-520</td>
                  <td className="py-3 px-3 font-semibold text-primary">Slotted Wall Channel System</td>
                  <td className="py-3 px-3 text-on-surface-variant">1.6mm Heavy Slotted Profile</td>
                  <td className="py-3 px-3 text-[#128C7E] font-semibold">120 kg / Bay</td>
                  <td className="py-3 px-3 font-bold text-primary">₹520 <span className="text-[10px] text-outline font-normal">/ running ft</span></td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onAddToCart({
                        productId: 'ad-wch-520',
                        sku: 'AD-WCH-520',
                        title: 'Slotted Wall Channel System',
                        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVNvkNuZowrWf1dlKaQ9PAhnG5XqL-culdoxgiC6AXE0ZUt6YD6LDBRmHv9ZIR5XxNLNIwARAPWWxDQPa2mSvIEyBOmuRSDMz0vnZ9Rg8bMazkPUP3Lp1sL7tgBMRO-gN2Cv3nrmxs2Jjvuv6xUCTsZNEAtxsGSEh8vbDOKTIOV1bbYPjsB1jBo_-S2IjbM9JN0LQFLvXzCOKCZYHG2w6ApnZref1PMgulE-M47pn9XZIYqEwLy-xT',
                        unitPrice: 520,
                        quantity: 10,
                        moq: 5,
                        unitLabel: 'rft',
                        finish: 'Industrial Black + Teak',
                        sizeOrSpec: 'Slotted Post & Rod Fixture',
                        gauge: '1.6mm Slotted Channel',
                        packingType: 'Precision Slotting Bundle'
                      }, 10)}
                      className="px-2.5 py-1 rounded bg-surface-container hover:bg-primary hover:text-white font-bold text-[10px] transition-colors"
                    >
                      + Add 10 Rft
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-primary">AD-MF-880</td>
                  <td className="py-3 px-3 font-semibold text-primary">Abstract Fiberglass Mannequin</td>
                  <td className="py-3 px-3 text-on-surface-variant">Fiberglass + Magnetic Joint</td>
                  <td className="py-3 px-3 text-[#128C7E] font-semibold">Commercial Boutique</td>
                  <td className="py-3 px-3 font-bold text-primary">₹5,200 <span className="text-[10px] text-outline font-normal">/ unit</span></td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onAddToCart({
                        productId: 'ad-mf-880',
                        sku: 'AD-MF-880',
                        title: 'Abstract Fiberglass Mannequin',
                        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANKdoF2fJzGaZ2PkgUR5MBdFVxCvnBmmBU_Kb4p1F4G_EwXokdEU7shOQMhrvEZKqShMqLhYp3J-gJ5zBsovdz1EPxRAYpIa5Hx1tTEuJkYA24crSZgCS1P1TDgfAn-E6jAZeseFqnfjZ7RyoqU48Tx_8wD35xIvoaNaPyEdiPPovNq-9xit2xaZgiplP71oFkS4nZmYIRAMSAGqY7yNZ3H2FMMYU1u3pQ8lvm5qIpD9z0CJ93rqqE',
                        unitPrice: 5200,
                        quantity: 2,
                        moq: 1,
                        unitLabel: 'units',
                        finish: 'Matte Off-White',
                        sizeOrSpec: 'Full Height with Glass Base',
                        gauge: 'Fiberglass Resin',
                        packingType: 'Shock-Proof Bubble Wrap'
                      }, 2)}
                      className="px-2.5 py-1 rounded bg-surface-container hover:bg-primary hover:text-white font-bold text-[10px] transition-colors"
                    >
                      + Add 2 Units
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-8 w-full mb-8">
        <div className="flex flex-col gap-2 mb-6">
          <span className="text-xs uppercase font-bold text-secondary tracking-wider">Help &amp; Guidance</span>
          <h3 className="font-serif text-2xl font-bold text-primary">Frequently Asked Wholesale Questions</h3>
        </div>

        <div className="flex flex-col gap-2">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="bg-surface-container-lowest rounded-xl border border-surface-container overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between font-bold text-xs text-primary hover:bg-surface-container-low transition-colors"
              >
                <span>{faq.q}</span>
                <AppIcon name={openFaq === idx ? 'expand_less' : 'expand_more'} className="text-[18px] text-secondary" />
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 pt-1 text-xs text-on-surface-variant leading-relaxed border-t border-surface-container/60">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
