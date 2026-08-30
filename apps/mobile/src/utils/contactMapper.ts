import * as Contacts from "expo-contacts";
import { Contact } from "../types/contact";

export const normalizePhoneNumber = (phoneNumber: string): string | null => {
  const digits = phoneNumber.replace(/\D/g, "");

  if (digits.length === 10 && /^[6-9]/.test(digits)) {
    return digits;
  }

  if (digits.length === 12 && digits.startsWith("91")) {
    const local = digits.slice(2);

    if (/^[6-9]/.test(local)) {
      return local;
    }
  }

  return null;
};

export const mapContacts = (contacts: Contacts.ExistingContact[]): Contact[] => {
  const mapped: Contact[] = [];
  const seen = new Set<string>();

  for (const contact of contacts) {
    if (!contact.phoneNumbers?.length) {
      continue;
    }

    for (const phone of contact.phoneNumbers) {
      const normalized = normalizePhoneNumber(phone.number ?? "");

      if (!normalized) {
        continue;
      }

      if (seen.has(normalized)) {
        continue;
      }

      seen.add(normalized);

      mapped.push({
        id: `${contact.id}-${normalized}`,
        name: contact.name,
        phoneNumber: normalized,
      });
    }
  }

  return mapped;
};