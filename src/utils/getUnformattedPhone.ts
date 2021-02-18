function getUnformattedFone(phone: string): string {
  if (!phone) return '';

  phone = phone.replace(/[^\d]+/g, '');

  if (phone.length > 10)
    phone = phone.slice(0, 2) + phone.slice(3, phone.length);

  return phone;
}

export default getUnformattedFone;
