import { SearchUserResponse } from "../api/users";
import { Contact } from "../types/contact";
import { RegisteredContact } from "../types/registeredContact";

export const mergeContacts = (
  contacts: Contact[],
  users: SearchUserResponse[],
): RegisteredContact[] => {
  const contactsByPhone = new Map(
    contacts.map((contact) => [
      contact.phoneNumber,
      contact,
    ]),
  );

  const merged = users.map((user) => {
    const contact = contactsByPhone.get(user.phone_number);

    return {
      userId: user.id,
      displayName: contact?.name ?? user.name,
      backendName: user.name,
      phoneNumber: user.phone_number,
    };
  });

  merged.sort((a, b) => a.displayName.localeCompare(b.displayName));

  return merged;
};