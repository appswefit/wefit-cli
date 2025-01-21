export function removeQuotation(text: string) {
  return text.replace(/^'|'$/g, '')
}