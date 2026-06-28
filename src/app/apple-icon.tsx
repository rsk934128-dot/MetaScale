
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#13151a',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '40px',
            border: '8px solid #00f2ff',
            boxShadow: '0 0 40px rgba(0, 242, 255, 0.4)',
          }}
        >
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '70%', height: '70%' }}
          >
            <path
              d="M50 10L84.641 30V70L50 90L15.359 70V30L50 10Z"
              stroke="#00f2ff"
              strokeWidth="6"
              strokeLinejoin="round"
            />
            <path
              d="M35 40C35 35 40 30 50 30C60 30 65 35 65 40C65 45 60 48 50 50C40 52 35 55 35 60C35 65 40 70 50 70C60 70 65 65 65 60"
              stroke="white"
              strokeWidth="10"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
