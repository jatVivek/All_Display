import React, { useState } from 'react';
import { AppIcon } from '../components/AppIcon';
import { storeManager } from '../services/storeManager';
import { getWhatsAppLink } from '../utils/whatsapp';
import { ActiveView } from '../types';

interface ContactViewProps {
  setActiveView: (view: ActiveView) => void;
  onToast: (msg: string) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({
  setActiveView,
  onToast,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const settings = storeManager.getSettings();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !message.trim()) {
      onToast('Please fill in your name and message.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const text =
        `*New Inquiry via Website*\n` +
        `• Name: ${firstName} ${lastName}\n` +
        `• Subject: ${subject || 'Jewellery Display Inquiry'}\n` +
        `• Message: ${message}`;
      window.open(getWhatsAppLink(text), '_blank');
      onToast('Thank you! Your message was sent to our Feel Khana sales desk.');
      setFirstName('');
      setLastName('');
      setSubject('');
      setMessage('');
    }, 400);
  };

  return (
    <div className="w-full bg-white pb-20 pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-600">
          <button
            onClick={() => setActiveView('home')}
            className="hover:text-orange-600 transition-colors"
          >
            Home
          </button>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Contact Us</span>
        </nav>

        {/* Section Header & Subtitle */}
        <div className="flex flex-col gap-2">
          <span className="w-fit bg-orange-50 text-orange-600 border border-orange-200/60 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Get in Touch
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Leave Us A Message
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Have questions about ready stock, custom jewelry card printing, or bulk wholesale rates? Reach out to our Feel Khana Hyderabad showroom team directly.
          </p>
        </div>

        {/* Main Content Grid: Form (Left) & Info Cards (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-first-name" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    First Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="contact-first-name"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-600 focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-last-name" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Last Name
                  </label>
                  <input
                    id="contact-last-name"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-600 focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="contact-subject" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Bulk order for Velvet Display Busts or Custom Jewellery Cards"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-600 focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="contact-message" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Your Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your requirements, quantities, or delivery destination here..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-600 focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all resize-y"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-2xl shadow-xs transition-colors cursor-pointer"
              >
                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                <AppIcon name="send" className="text-sm" />
              </button>
            </form>
          </div>

          {/* Right Contact Cards */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Email Support Card */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <AppIcon name="mail" className="text-2xl" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-slate-600 leading-relaxed">
                  For any order-related support or catalogue requests, please contact our support desk:
                </p>
                <a
                  href={`mailto:${settings.supportEmail || 'contact@alldisplay.com'}`}
                  className="text-xs sm:text-sm font-bold text-orange-600 hover:underline break-all"
                >
                  {settings.supportEmail || 'contact@alldisplay.com'}
                </a>
              </div>
            </div>

            {/* Feel Khana Hyderabad Store Address Card */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 border border-orange-100">
                <AppIcon name="location_on" className="text-2xl" />
              </div>
              <div className="flex flex-col gap-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Feel Khana Showroom &amp; Depot
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {settings.showroomAddress || '15-8-397, Feel Khana, Hyderabad 500012, Telangana, India'}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <a
                    href={`tel:${(settings.supportPhone || '+917396127273').replace(/\s+/g, '')}`}
                    className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full transition-colors"
                  >
                    <AppIcon name="phone" className="text-[13px] text-orange-600" />
                    <span>{settings.supportPhone || '+91 73961 27273'}</span>
                  </a>
                  <a
                    href={getWhatsAppLink('Hi All Display Feel Khana, I would like to visit or place an order.')}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-colors"
                  >
                    <AppIcon name="chat" className="text-[13px]" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Wholesale Direct Advantage */}
            <div className="bg-gradient-to-br from-slate-50 to-orange-50/40 rounded-3xl border border-orange-100/60 p-6 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-orange-600 font-bold text-xs uppercase tracking-wider">
                <AppIcon name="inventory_2" className="text-base" />
                <span>Wholesale &amp; Direct Exporter</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct manufacturing prices for jewellery showrooms, online boutiques, and packaging distributors across India. Bulk dispatch via safe road transport &amp; parcel services daily.
              </p>
            </div>

          </div>
        </div>

        {/* Embedded Interactive Map of Feel Khana, Hyderabad */}
        <div className="w-full bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 shadow-xs">
          <div className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AppIcon name="map" className="text-orange-600 text-base" />
              <span className="text-xs font-bold text-slate-900">
                Feel Khana, Hyderabad Wholesale Market Location
              </span>
            </div>
            <a
              href="https://maps.google.com/?q=15-8-397+Feel+Khana+Hyderabad+500012"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-orange-600 hover:underline font-semibold"
            >
              Open in Google Maps →
            </a>
          </div>
          <iframe
            title="All Display Feel Khana Hyderabad Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.472147395232!2d78.472304!3d17.377626!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9788f28d7a1f%3A0x7d6f5f9227f309d!2sFeelkhana%2C%20Begum%20Bazaar%2C%20Hyderabad%2C%20Telangana%20500012!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            className="w-full h-80 border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

      </div>
    </div>
  );
};
