export const sanitizeNumber = (number: string) => {
  if (!number) {
    return ``;
  }
  return number
    .replace(/\s/g, '')
    .replace(`+`, ``)
    .replace(/[\])}[{(]/g, '');
};
