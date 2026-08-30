import * as Contacts from "expo-contacts";

export const getDeviceContacts = async (): Promise<Contacts.ExistingContact[]> => {
  const { status } = await Contacts.getPermissionsAsync();

  if (status !== "granted") {
    throw new Error("Contacts permission denied");
  }

  const { data } = await Contacts.getContactsAsync({
    fields: [
      Contacts.Fields.PhoneNumbers,
    ],
  });

  return data;
};