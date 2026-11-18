import {ImageResponse} from 'next/og';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {RESUME_DATA} from '@/data/resume-data';
import {OG_HIGHLIGHTS, OG_VALUE_LINE, SITE_DOMAIN} from '@/app/site-config';

const LOCATIONS = RESUME_DATA.locations.map(l => l.name).join(' · ');
const SKILLS = OG_HIGHLIGHTS.join(', ');
const PLACES = RESUME_DATA.locations.map(l => l.name).join(' and ');

export const alt = `Social card for ${RESUME_DATA.name}, ${
  RESUME_DATA.about
}: ${OG_VALUE_LINE.replaceAll(
  ' · ',
  ', ',
)}. Skills: ${SKILLS}. Based in ${PLACES}. ${SITE_DOMAIN}`;
export const size = {width: 1200, height: 630};
export const contentType = 'image/png';

// Palette: the business card's. White paper, black type, greys, and one navy accent.
const C = {
  bg: '#ffffff',
  fg: '#000000',
  soft: '#4b5563',
  muted: '#6b7280',
  rule: '#9ca3af',
  accent: '#1e3a8a',
};

// Self-hosted avatar, inlined at build time so rendering needs no network.
function loadAvatar(): string {
  const file = readFileSync(join(process.cwd(), 'public', 'avatar.jpg'));
  return `data:image/jpeg;base64,${file.toString('base64')}`;
}

// The R logo's path, read from the favicon so there is one source of truth.
// Drawn as an inline <svg> (the file's dark-mode <style> means nothing to next/og).
function loadLogoPath(): string {
  const svg = readFileSync(join(process.cwd(), 'public', 'icon.svg'), 'utf8');
  const d = svg.match(/<path[^>]*\sd="([^"]+)"/)?.[1];
  if (!d) throw new Error('public/icon.svg has no <path d>');
  return d;
}

const LOGO = 30; // logo size in px, next to the domain

const AV = 184; // avatar diameter
const ZOOM = 1.12; // crop in so the face fills the circle
const FACE = {x: 235 / 460, y: 200 / 460}; // face centre in the source photo

function Avatar({src}: {src: string}) {
  const img = Math.round(AV * ZOOM);
  const left = Math.round(AV / 2 - FACE.x * img);
  const top = Math.round(AV / 2 - FACE.y * img);
  const photo = (
    <div
      style={{
        display: 'flex',
        width: AV,
        height: AV,
        borderRadius: 999,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <img
        src={src}
        width={img}
        height={img}
        style={{position: 'absolute', left, top}}
      />
      {/* hairline inner border */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: AV,
          height: AV,
          display: 'flex',
          borderRadius: 999,
          border: '1px solid rgba(17,24,39,0.10)',
        }}
      />
    </div>
  );

  // No hard ring: a hairline edge plus a soft shadow, like a card resting on paper.
  return (
    <div
      style={{
        display: 'flex',
        borderRadius: 999,
        boxShadow: '0 10px 40px rgba(17,24,39,0.12)',
      }}
    >
      {photo}
    </div>
  );
}

export default function OpengraphImage() {
  const avatar = loadAvatar();
  const logo = loadLogoPath();
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        background: C.bg,
        color: C.fg,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 26,
            color: C.muted,
          }}
        >
          <svg
            width={LOGO}
            height={LOGO}
            viewBox="0 0 1024 1024"
            style={{marginRight: 12}}
          >
            <path fill={C.fg} fillRule="evenodd" d={logo} />
          </svg>
          {SITE_DOMAIN}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 26,
          }}
        >
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <div
              style={{
                display: 'flex',
                fontSize: 96,
                lineHeight: 1,
                letterSpacing: '-0.03em',
              }}
            >
              {RESUME_DATA.name}
            </div>
            {/* the card's short navy rule between name and role */}
            <div
              style={{
                display: 'flex',
                width: 56,
                height: 4,
                marginTop: 28,
                background: C.accent,
              }}
            />
            <div
              style={{
                display: 'flex',
                marginTop: 26,
                fontSize: 30,
                fontWeight: 500,
                letterSpacing: '0.09em',
                textTransform: 'uppercase',
                color: C.fg,
              }}
            >
              {RESUME_DATA.about.replace(' | ', ' · ')}
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: 18,
                fontSize: 26,
                color: C.soft,
              }}
            >
              {OG_VALUE_LINE}
            </div>
          </div>
          <Avatar src={avatar} />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 52,
            paddingTop: 32,
            borderTop: `1px solid ${C.rule}`,
          }}
        >
          <div style={{display: 'flex'}}>
            {OG_HIGHLIGHTS.map(h => (
              <div
                key={h}
                style={{
                  display: 'flex',
                  fontSize: 28,
                  color: C.soft,
                  padding: '10px 24px',
                  marginRight: 14,
                  borderRadius: 999,
                  background: '#f9fafb',
                  border: '1px solid #d1d5db',
                }}
              >
                {h}
              </div>
            ))}
          </div>
          <div style={{display: 'flex', fontSize: 26, color: C.muted}}>
            {LOCATIONS}
          </div>
        </div>
      </div>
    </div>,
    {...size},
  );
}
