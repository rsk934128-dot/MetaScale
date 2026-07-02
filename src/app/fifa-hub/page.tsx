
"use client";

/**
 * FifaHubPage
 * Route shell for the persistent FIFA Live Hub.
 */
export default function FifaHubPage() {
  return (
    <div className="flex-1 bg-background flex flex-col items-center justify-center p-6 text-center">
      {/* 
          Actual content is handled by FifaHubPortal in RootLayout. 
          This prevents the iframe from unmounting and reloading when switching pages.
      */}
    </div>
  );
}
