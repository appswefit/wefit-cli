export function removeSpecialCharacters(text: string) {
  return text.replace(/^'|'$|\\/g, '').trim();
}