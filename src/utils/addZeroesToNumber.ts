function addZeroesToNumber(numberString: string, len: number): string {
  let numberFormatted = numberString;
  let counter = numberFormatted.length;

  while (counter < len) {
    numberFormatted = `0${numberFormatted}`;

    counter += 1;
  }

  return numberFormatted;
}

export default addZeroesToNumber;
