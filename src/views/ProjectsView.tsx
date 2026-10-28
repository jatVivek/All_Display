import { AppIcon } from '../components/AppIcon';
import React, { useState } from 'react';
import { ActiveView, ProjectReel } from '../types';
import { PROJECT_REELS, REVIEWS } from '../data/catalog';
import { getWhatsAppLink, getWhatsAppNumber } from '../utils/whatsapp';

interface ProjectsViewProps {
  onNavigate: (view: ActiveView) => void;
  onOpenReel: (reel: ProjectReel) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  onNavigate,
  onOpenReel
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Projects (59+)' },
    { id: 'bridal', label: 'Bridal & Heavy Ethnic' },
    { id: 'streetwear', label: "Men's Casual & Denim" },
    { id: 'boutiques', label: 'Designer Boutiques' },
    { id: 'wholesale', label: 'Wholesale Depots & Godowns' },
    { id: 'wall-channel', label: 'Wall Channel Fit-Outs' },
  ];

  const filteredProjects = activeCategory === 'all'
    ? PROJECT_REELS
    : PROJECT_REELS.filter((p) => p.category === activeCategory || (activeCategory === 'wall-channel' && (p.specs?.wallSlotChannels?.length || 0) > 0));

  return (
    <div className="w-full">
      {/* Top Visual Hero / Architectural Status */}
      <section className="relative w-full overflow-hidden bg-surface-container-low px-4 lg:px-8 py-10 border-b border-surface-container">
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-secondary-fixed/20 blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 bottom-0 w-80 h-80 rounded-full bg-surface-variant/30 blur-2xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col gap-6 relative z-10">
          {/* Breadcrumb & Social Proof Pill Row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 bg-surface-container-lowest px-3 py-1.5 rounded-full shadow-sm text-on-surface border border-surface-container">
              <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              <span className="text-xs uppercase font-bold tracking-wider text-secondary">
                Proven On-Site Turnkey Fit-Outs • Hyderabad &amp; South India
              </span>
            </div>

            <a 
              href="https://www.instagram.com/all_display_?cplk=MXNpcGN3cno4MHI0Nw==" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-surface-container-lowest hover:bg-surface-container px-3.5 py-1.5 rounded-full shadow-sm transition-all transform hover:-translate-y-0.5 border border-surface-container text-xs"
            >
              <svg className="w-4 h-4 text-[#E1306C]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span className="font-bold text-on-surface">@all_display_</span>
              <span className="text-outline-variant">•</span>
              <span className="text-on-surface-variant font-mono">9,153 Followers</span>
              <span className="text-outline-variant">•</span>
              <span className="text-secondary font-bold uppercase tracking-wider hover:underline">Follow Live Stories →</span>
            </a>
          </div>

          {/* Main Headline & Summary Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-8 flex flex-col gap-2">
              <h1 className="font-serif text-3xl lg:text-4xl font-bold text-primary tracking-tight leading-tight">
                Over 500+ Clothing Stores &amp; Boutiques Built With All Display Fixtures
              </h1>
              <p className="text-sm md:text-base text-on-surface-variant max-w-3xl leading-relaxed">
                Watch verified turnkey shop installation reels, triple-pipe rack load walkthroughs, and heavy-gauge electroplated channel systems filmed directly on site across Jubilee Hills, Banjara Hills, George Town, Vijayawada, and Bangalore.
              </p>
            </div>
            
            <div className="lg:col-span-4 grid grid-cols-2 gap-3">
              <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-surface-container flex flex-col">
                <span className="font-serif text-2xl lg:text-3xl font-bold text-primary">500+</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant">Retail Fit-Outs</span>
                <span className="text-xs text-secondary font-semibold mt-0.5">South India Hub</span>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-surface-container flex flex-col">
                <span className="font-serif text-2xl lg:text-3xl font-bold text-primary">48 Hrs</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant">Dispatch Window</span>
                <span className="text-xs text-[#25D366] font-semibold mt-0.5">Feel Khana Depot</span>
              </div>
            </div>
          </div>

          {/* B2B Transparency Banner */}
          <div className="bg-surface-container-highest/60 border border-surface-container rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs text-on-surface">
              <AppIcon name="verified" className="text-secondary text-[22px] shrink-0" />
              <span>
                <strong>B2B Direct Wholesale Policy:</strong> Strictly 100% Prepaid Orders before transport loading. Zero Cash-On-Delivery. Live video call inspection provided prior to freight dispatch.
              </span>
            </div>
            <a 
              href={getWhatsAppLink('Hi All Display, I want to verify fixture stock via video call.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-primary hover:bg-[#2A2D34] text-on-primary px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm"
            >
              <AppIcon name="videocam" className="text-[16px] text-secondary" />
              <span>Schedule Video Call</span>
            </a>
          </div>
        </div>
      </section>

      {/* Filter & Segmentation Sticky Bar */}
      <section className="sticky top-20 z-30 bg-surface/95 backdrop-blur-md py-3 px-4 lg:px-8 border-b border-surface-container shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-2 flex-nowrap">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === c.id
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-2 flex-shrink-0 text-on-surface-variant text-xs font-mono">
            <AppIcon name="play_circle" className="text-secondary text-[18px]" />
            <span>Includes Video Load Demonstrations</span>
          </div>
        </div>
      </section>

      {/* Video Showcase & Project Bento Grid */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <article 
              key={project.id}
              className="flex flex-col bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-surface-container group"
            >
              {/* Media Canvas with Video Trigger */}
              <div 
                onClick={() => onOpenReel(project)}
                className="relative w-full aspect-[4/5] bg-surface-container overflow-hidden cursor-pointer"
              >
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent"></div>
                
                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="bg-primary/80 backdrop-blur-sm text-surface text-[10px] font-bold uppercase px-2.5 py-1 rounded-md">
                    {project.location.split(',')[0]} • {project.area}
                  </span>
                  <span className="bg-[#E1306C] text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <AppIcon name="play_arrow" className="text-[13px]" /> {project.duration}
                  </span>
                </div>

                {/* Bottom Floating Trigger Indicator */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-surface">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-secondary text-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <AppIcon name="play_arrow" className="text-[20px] ml-0.5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-xs text-white">Walkthrough Video Proof</span>
                      <span className="text-[10px] text-surface-container-highest/90">Insta: @all_display_</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-secondary-fixed font-semibold">{project.turnkeyTime}</span>
                </div>
              </div>

              {/* Content & Specifications */}
              <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">
                      {project.categoryLabel}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-primary group-hover:text-secondary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Technical Spec Ledger */}
                <div className="bg-surface-container-low rounded-lg p-3 flex flex-col gap-1 text-xs text-on-surface-variant border border-surface-container">
                  <div className="flex items-center justify-between">
                    <span className="text-outline">Floor Units:</span>
                    <span className="font-semibold text-primary font-mono">{project.specs?.floorUnits || project.metrics?.racksInstalled || 'Standard'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-outline">Wall Slot Channels:</span>
                    <span className="font-semibold text-primary font-mono">{project.specs?.wallSlotChannels || project.metrics?.capacity || 'Standard'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-outline">Special:</span>
                    <span className="font-semibold text-primary font-mono">{project.specs?.special || project.metrics?.finishType || 'Custom'}</span>
                  </div>
                </div>

                {/* Action Footprint */}
                <div className="flex items-center justify-between pt-1 border-t border-surface-container">
                  <div className="flex items-center gap-1.5">
                    {(project.finishes || []).map((f: { name: string; color: string }, i: number) => (
                      <span key={i} className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: f.color }} title={f.name}></span>
                    ))}
                    <span className="text-[10px] uppercase font-bold text-outline ml-1">{project.finishLabel || project.metrics?.finishType || ''}</span>
                  </div>
                  <a 
                    href={getWhatsAppLink(`Hi All Display, I saw the ${project.title} setup. Please quote for a similar setup.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:text-secondary font-bold text-xs transition-colors"
                  >
                    <span>Get Similar Setup</span>
                    <AppIcon name="arrow_forward" className="text-[16px]" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 2D Floor Plan & Rack Estimator Banner */}
      <section className="w-full bg-[#1a1c20] text-surface px-4 lg:px-8 py-12 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-secondary/15 to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full w-fit">
              <AppIcon name="architecture" className="text-secondary text-[18px]" />
              <span className="text-[10px] uppercase tracking-wider text-secondary-fixed font-bold">
                Free CAD &amp; Floor-Plan Estimation Service
              </span>
            </div>
            <h2 className="font-serif text-2xl lg:text-3xl font-bold text-surface tracking-tight">
              Have a 2D Floor Plan or Rough Shop Sketch?
            </h2>
            <p className="text-xs sm:text-sm text-primary-fixed max-w-2xl leading-relaxed">
              Send your shop dimensions, architectural AutoCAD drawings, or hand-drawn measurements directly to our Feel Khana desk on WhatsApp. Our engineers calculate your exact rack count, wall channel lengths, and tiered wholesale cost within 2 hours.
            </p>

            {/* Process Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-white/5 p-3 rounded-lg flex items-start gap-3 border border-white/10">
                <span className="font-serif text-2xl font-bold text-secondary leading-none">1</span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-surface">Send Layout</span>
                  <span className="text-[11px] text-primary-fixed-dim">WhatsApp CAD, PDF, or Photo</span>
                </div>
              </div>
              <div className="bg-white/5 p-3 rounded-lg flex items-start gap-3 border border-white/10">
                <span className="font-serif text-2xl font-bold text-secondary leading-none">2</span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-surface">BOQ Generated</span>
                  <span className="text-[11px] text-primary-fixed-dim">Itemized rack &amp; bracket list</span>
                </div>
              </div>
              <div className="bg-white/5 p-3 rounded-lg flex items-start gap-3 border border-white/10">
                <span className="font-serif text-2xl font-bold text-secondary leading-none">3</span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-surface">Direct Dispatch</span>
                  <span className="text-[11px] text-primary-fixed-dim">From Feel Khana Depot</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Card */}
          <div className="lg:col-span-5 bg-surface-container-lowest text-on-surface p-6 rounded-2xl shadow-xl flex flex-col gap-4 border border-surface-container">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-secondary">Fast-Track Response</span>
                <h3 className="font-serif text-lg font-bold text-primary">WhatsApp Direct Desk</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center">
                <AppIcon name="chat" className="text-[24px]" />
              </div>
            </div>

            <div className="flex flex-col gap-2 text-xs text-on-surface-variant">
              <div className="flex items-center gap-2">
                <AppIcon name="check_circle" className="text-[#25D366] text-[18px]" />
                <span>Average estimate response time: <strong>45 - 90 Minutes</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <AppIcon name="check_circle" className="text-[#25D366] text-[18px]" />
                <span>Includes 3D fixture arrangement suggestions</span>
              </div>
              <div className="flex items-center gap-2">
                <AppIcon name="check_circle" className="text-[#25D366] text-[18px]" />
                <span>GST B2B invoice with Pan-India transport freight bill</span>
              </div>
            </div>

            <a 
              href={getWhatsAppLink('Hi All Display, I have a store floor plan for estimation. Can you help me calculate racks and budget?')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <AppIcon name="send" className="text-[18px]" />
              <span>Send Floor Plan on WhatsApp</span>
            </a>

            <div className="text-center text-[11px] text-on-surface-variant">
              Or Call Hyderabad Head: <a href={`tel:+${getWhatsAppNumber(true)}`} className="text-secondary font-bold underline">+{getWhatsAppNumber(true)}</a>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Trade Customer Feedback */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-12 w-full">
        <div className="flex flex-col gap-2 mb-8 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 justify-center bg-surface-container px-3 py-1 rounded-full w-fit mx-auto text-secondary text-xs uppercase font-bold">
            <AppIcon name="rate_review" className="text-[16px]" />
            <span>Verified Trade Customer Feedback</span>
          </div>
          <h2 className="font-serif text-2xl lg:text-3xl font-bold text-primary tracking-tight">
            Trusted Across Telangana, Andhra Pradesh &amp; Karnataka
          </h2>
          <p className="text-xs text-on-surface-variant">
            Real feedback from boutique owners, showroom managers, and apparel retail chains who rely on our Feel Khana &amp; Hyderabad wholesale supply.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((rev) => (
            <div key={rev.id} className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-surface-container flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1 text-[#ffb800]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <AppIcon name="star" className="text-[18px]" />
                  ))}
                </div>
                <p className="text-xs text-on-surface-variant italic leading-relaxed">
                  "{rev.text || rev.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-surface-container">
                <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-xs text-primary">
                  {rev.initials || rev.author?.slice(0, 2).toUpperCase() || 'AD'}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-primary">{rev.author}</span>
                  <span className="text-[10px] text-on-surface-variant">{rev.role} • {rev.location || rev.city || rev.storeName}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
