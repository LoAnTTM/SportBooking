/**
 * Checks if a given character is a number.
 * @param char - The character to check.
 * @returns True if the character is a number, false otherwise.
 */
export const isNumber = (char: string): boolean => {
  return !isNaN(Number(char));
};

export const round = (value: number, decimals: number = 2): number => {
  return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
};
