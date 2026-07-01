
"use client";

/**
 * ShurukkhaStandardPage
 * This page acts as a route shell. The actual content is rendered by 
 * PersistentStandardsPortal in the root layout to avoid iframe reloads.
 */
export default function ShurukkhaStandardPage() {
  return (
    <div className="flex-1 bg-background flex flex-col items-center justify-center p-6 text-center">
      {/* 
          Actual content is handled by PersistentStandardsPortal in RootLayout. 
          This prevents the iframe from unmounting and reloading.
      */}
    </div>
  );
}
