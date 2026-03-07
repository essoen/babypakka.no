import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Babypakka.no – Lei babyutstyr tilpasset barnets alder';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #f0f9ff 0%, #fdf2f8 50%, #fefce8 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          padding: '60px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.5">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
            />
          </svg>
          <span style={{ fontSize: '48px', fontWeight: 700, color: '#1e293b' }}>
            Babypakka.no
          </span>
        </div>
        <div
          style={{
            fontSize: '32px',
            fontWeight: 600,
            color: '#475569',
            textAlign: 'center',
            lineHeight: 1.4,
            maxWidth: '800px',
          }}
        >
          Lei babyutstyr tilpasset barnets alder
        </div>
        <div
          style={{
            fontSize: '20px',
            color: '#94a3b8',
            marginTop: '24px',
            textAlign: 'center',
          }}
        >
          Kvalitetsutstyr som vokser med barnet ditt. Enkelt, bærekraftig og rimelig.
        </div>
      </div>
    ),
    { ...size }
  );
}
