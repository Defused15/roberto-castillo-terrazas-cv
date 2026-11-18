import type {ResumeData} from '@/data/resume-data';
import {decodePhone} from '@/lib/decode-phone';

const SITE = 'https://www.rcastillo.dev';

/** Escapes a vCard 3.0 text value: backslash, comma, semicolon and newlines. */
export function escapeVCard(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\;')
    .replace(/,/g, '\\,')
    .replace(/\r\n|\r|\n/g, '\\n');
}

/** Folds a line to 75 octets-ish (75 chars) as RFC 2425 asks; continuation lines start with a space. */
function fold(line: string): string {
  if (line.length <= 75) return line;
  const chunks = [line.slice(0, 75)];
  for (let i = 75; i < line.length; i += 74)
    chunks.push(' ' + line.slice(i, i + 74));
  return chunks.join('\r\n');
}

/** vCard 3.0 for the owner, with CRLF line endings. Phones are decoded here, so they land in plain text. */
export function buildVCard(data: ResumeData): string {
  const [first, ...rest] = data.name.split(' ');
  const family = rest.join(' ');
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${escapeVCard(data.name)}`,
    `N:${escapeVCard(family)};${escapeVCard(first)};;;`,
    `TITLE:${escapeVCard(data.about)}`,
    `EMAIL;TYPE=INTERNET:${escapeVCard(data.contact.email)}`,
    ...data.contact.phones.map(
      p => `TEL;TYPE=CELL:${escapeVCard(decodePhone(p))}`,
    ),
    `URL:${SITE}`,
    ...data.contact.social.map(s => `URL:${s.url}`),
    `NOTE:${escapeVCard(`${data.about} - ${SITE}`)}`,
    'END:VCARD',
  ];
  return lines.map(fold).join('\r\n') + '\r\n';
}
