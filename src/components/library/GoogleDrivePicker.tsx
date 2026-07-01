
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Cloud, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// These keys should ideally come from environment variables.
// If they are not set, we will show a warning instead of crashing.
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "";
const SCOPES = "https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.metadata.readonly";

declare global {
  interface Window {
    google: any;
    gapi: any;
  }
}

interface GoogleDrivePickerProps {
  onFilesSelected: (files: any[]) => void;
}

export function GoogleDrivePicker({ onFilesSelected }: GoogleDrivePickerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const { toast } = useToast();

  const hasValidKeys = CLIENT_ID && CLIENT_ID !== "YOUR_CLIENT_ID" && API_KEY && API_KEY !== "YOUR_API_KEY";

  useEffect(() => {
    if (!hasValidKeys) return;

    const loadScripts = () => {
      const gapiScript = document.createElement("script");
      gapiScript.src = "https://apis.google.com/js/api.js";
      gapiScript.async = true;
      gapiScript.onload = () => {
        const gisScript = document.createElement("script");
        gisScript.src = "https://accounts.google.com/gsi/client";
        gisScript.async = true;
        gisScript.onload = () => setIsScriptLoaded(true);
        document.body.appendChild(gisScript);
      };
      document.body.appendChild(gapiScript);
    };

    loadScripts();
  }, [hasValidKeys]);

  const handleOpenPicker = async () => {
    if (!hasValidKeys) {
      toast({
        variant: "destructive",
        title: "Integration Not Configured",
        description: "Google Drive API keys are missing. Please add NEXT_PUBLIC_GOOGLE_CLIENT_ID and NEXT_PUBLIC_GOOGLE_API_KEY to your environment.",
      });
      return;
    }

    if (!isScriptLoaded) return;

    setIsLoading(true);

    try {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: async (response: any) => {
          if (response.error !== undefined) {
            setIsLoading(false);
            throw response;
          }
          createPicker(response.access_token);
        },
      });

      tokenClient.requestAccessToken({ prompt: "consent" });
    } catch (error: any) {
      console.error("Error initializing Google Picker:", error);
      toast({
        variant: "destructive",
        title: "Authorization Error",
        description: error.details || "Failed to connect to Google Drive. Check your Client ID configuration.",
      });
      setIsLoading(false);
    }
  };

  const createPicker = (accessToken: string) => {
    window.gapi.load("picker", () => {
      try {
        const picker = new window.google.picker.PickerBuilder()
          .addView(window.google.picker.ViewId.DOCS)
          .setOAuthToken(accessToken)
          .setDeveloperKey(API_KEY)
          .setCallback((data: any) => {
            if (data.action === window.google.picker.Action.PICKED) {
              onFilesSelected(data.docs);
              toast({
                title: "Files Selected",
                description: `Successfully imported ${data.docs.length} asset(s) from Drive.`,
              });
            }
            if (data.action === window.google.picker.Action.CANCEL || data.action === window.google.picker.Action.PICKED) {
              setIsLoading(false);
            }
          })
          .build();
        picker.setVisible(true);
      } catch (err) {
        console.error("Picker Build Error:", err);
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Picker Error",
          description: "Could not initialize the file picker.",
        });
      }
    });
  };

  if (!hasValidKeys) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="bg-secondary/30 border-yellow-500/20 text-yellow-500/50 cursor-not-allowed"
            >
              <AlertCircle className="mr-2 h-4 w-4" />
              Drive Unlinked
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-background border-white/10 text-xs p-3 max-w-xs">
            <p>Google Drive integration requires a valid Client ID and API Key. Please configure your environment variables.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleOpenPicker}
      disabled={isLoading || !isScriptLoaded}
      className="bg-secondary/30 border-white/10 hover:bg-secondary/50"
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Cloud className="mr-2 h-4 w-4 text-accent" />
      )}
      Import from Drive
    </Button>
  );
}
