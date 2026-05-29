
import type {Metadata} from 'next';
import './globals.css';
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { KernelProvider } from "@/components/kernel/KernelProvider";

export const metadata: Metadata = {
  title: 'Sovereign OS | Deterministic Infrastructure',
  description: 'Mission-critical operating system for civic and financial infrastructure',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <KernelProvider>
          <SidebarProvider>
            {children}
          </SidebarProvider>
          <Toaster />
        </KernelProvider>
      </body>
    </html>
  );
}
