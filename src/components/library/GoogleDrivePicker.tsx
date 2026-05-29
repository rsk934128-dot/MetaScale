
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Cloud, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Placeholders for Google Client ID and API Key.
// In a real app, these would come from environment variables.
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "YOUR_CLIENT_ID";
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "YOUR_API_KEY";
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

  useEffect(() => {
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
  }, []);

  const handleOpenPicker = async () => {
    if (!isScriptLoaded) return;

    setIsLoading(true);

    try {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: async (response: any) => {
          if (response.error !== undefined) {
            throw response;
          }
          createPicker(response.access_token);
        },
      });

      tokenClient.requestAccessToken({ prompt: "consent" });
    } catch (error) {
      console.error("Error initializing Google Picker:", error);
      toast({
        variant: "destructive",
        title: "Auth Error",
        description: "Failed to connect to Google Drive.",
      });
      setIsLoading(false);
    }
  };

  const createPicker = (accessToken: string) => {
    window.gapi.load("picker", () => {
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
    });
  };

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
