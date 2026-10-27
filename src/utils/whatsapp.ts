import { storeManager } from '../services/storeManager';

export function getWhatsAppNumber(alternate = false): string {
  const settings = storeManager.getSettings();
  const primaryRaw = String(settings?.whatsappNumber || '919462247004');
  const alternateRaw = String(settings?.alternateWhatsapp || settings?.supportPhone || primaryRaw);
  const rawNumber = alternate ? alternateRaw : primaryRaw;
  const digits = rawNumber.replace(/\D/g, '');
  if (!digits) return '919462247004';
  return digits.length === 10 ? `91${digits}` : digits;
}

export function getWhatsAppLink(message: string, alternate = false): string {
  return `https://wa.me/${getWhatsAppNumber(alternate)}?text=${encodeURIComponent(message)}`;
}

export function getContactWhatsAppLink(phoneNumber: string, message: string): string {
  const digits = String(phoneNumber || '').replace(/\D/g, '') || '919462247004';
  const internationalNumber = digits.length === 10 ? `91${digits}` : digits;
  return `https://wa.me/${internationalNumber}?text=${encodeURIComponent(message)}`;
}
