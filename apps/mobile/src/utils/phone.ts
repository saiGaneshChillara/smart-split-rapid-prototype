export const normalizePhoneNumber = (value: string) => {
  return value.replace(/\D/g, "");
};

export const isValidIndianPhoneNumber = (value: string) => {
  return /^[6-9]\d{9}$/.test(value);
};