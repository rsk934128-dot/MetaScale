
import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 24,
          background: '#13151a',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '20%',
          border: '2px solid #00f2ff',
        }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '80%', height: '80%' }}
        >
          <path
            d="M50 10L84.641 30V70L50 90L15.359 70V30L50 10Z"
            stroke="#00f2ff"
            strokeWidth="8"
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
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
}
