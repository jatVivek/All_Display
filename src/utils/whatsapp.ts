import { storeManager } from '../services/storeManager';

export function getWhatsAppNumber(alternate = false): string {
  const alternateNumber = storeManager.getSettings().alternateWhatsapp.replace(/\D/g, '');
  const rawNumber = alternate && alternateNumber
    ? storeManager.getSettings().alternateWhatsapp
    : storeManager.getSettings().whatsappNumber;
  const digits = rawNumber.replace(/\D/g, '');
  return digits.length === 10 ? `91${digits}` : digits;
}

export function getWhatsAppLink(message: string, alternate = false): string {
  return `https://wa.me/${getWhatsAppNumber(alternate)}?text=${encodeURIComponent(message)}`;
}

export function getContactWhatsAppLink(phoneNumber: string, message: string): string {
  const digits = phoneNumber.replace(/\D/g, '');
  const internationalNumber = digits.length === 10 ? `91${digits}` : digits;
  return `https://wa.me/${internationalNumber}?text=${encodeURIComponent(message)}`;
}
