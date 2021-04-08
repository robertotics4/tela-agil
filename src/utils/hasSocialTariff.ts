function hasSocialTariff(subclass: string): boolean {
  const socialTariffSubclasses = [
    'Resid.Baixa Renda BPC',
    'Resid.Baixa Renda Indígena',
    'Resid.Baixa Renda Multifamiliar',
    'Resid.Baixa Renda Quilombola',
    'Resid.Baixa Renda',
  ];

  if (
    socialTariffSubclasses.some(
      socialTariffSubclass => subclass === socialTariffSubclass.toUpperCase(),
    )
  ) {
    return true;
  }

  return false;
}

export default hasSocialTariff;
