function addZeroesToContract(contractAccount: string, len: number): string {
  let contractAccountFormatted = contractAccount;
  let counter = contractAccountFormatted.length;

  while (counter < len) {
    contractAccountFormatted = `0${contractAccountFormatted}`;

    counter += 1;
  }

  return contractAccountFormatted;
}

export default addZeroesToContract;
