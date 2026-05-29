
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AdCopywriter } from "@/components/ai/AdCopywriter";
import { Sparkles } from "lucide-react";

export default function CopywriterPage() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              AI Ad Copywriter
            </h1>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full">
          <div className="mb-8">
            <h2 className="text-3xl font-headline font-bold mb-2">Draft Compelling Ad Copy</h2>
            <p className="text-muted-foreground">
              Utilize high-performance LLMs to generate headlines and body text that drive results on Meta platforms.
            </p>
          </div>
          <AdCopywriter />
        </main>
      </SidebarInset>
    </div>
  );
}
