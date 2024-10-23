export const isValidPersianPhoneNumber = (phoneNumber: string): boolean => {
  const regex = /^09[0-9]{9}$/;
  return regex.test(phoneNumber);
};
