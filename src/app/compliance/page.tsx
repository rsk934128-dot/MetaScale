
"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileBadge, ShieldCheck, AlertCircle, Building2, UserCheck, CreditCard, Wallet, MapPin, ExternalLink, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function CompliancePage() {
  const entityData = {
    legalName: "Rubelpay",
    regNo: "2200882501903677",
    country: "Bangladesh",
    address: "masumpor,sirajganj,6700, Bangladesh",
    established: "06/11/2025",
    verificationLevel: "L1 Verification",
    status: "Action Needed",
    ubo: "Farid Sheikh",
    uboRole: "UBO & Director",
    settlement: {
      type: "CRYPTO",
      method: "WITHDRAW",
      currency: "USDT",
      address: "0xaf3c724065016dfe4458c05140fa4cbb40131207",
      network: "BNB Smart Chain"
    }
  };

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2">
              <FileBadge className="h-5 w-5 text-accent" />
              Sovereign Compliance & Credentials
            </h1>
          </div>
          <Badge variant="outline" className="border-yellow-400/20 text-yellow-400 animate-pulse">
            <AlertCircle className="mr-1 h-3 w-3" /> KYB: {entityData.status}
          </Badge>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-headline font-bold mb-2">Enterprise Verification Hub</h2>
              <p className="text-muted-foreground">Manage legal entity standing, UBO documentation, and settlement infrastructure.</p>
            </div>
            <Button className="cyan-glow bg-accent text-background font-bold">
              Complete Step 6/6
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Verification Status */}
            <Card className="lg:col-span-2 glass-panel border-l-4 border-l-yellow-400">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-accent" />
                  Sovereign Standing
                </CardTitle>
                <CardDescription>Current verification progress: 85%</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 rounded-xl bg-secondary/30 border border-white/5 space-y-2">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Certification Level</p>
                    <p className="text-xl font-headline font-bold text-white">{entityData.verificationLevel}</p>
                    <Badge variant="outline" className="text-[10px] border-accent/20 text-accent">Tier 1 Status</Badge>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/30 border border-white/5 space-y-2">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Registration Status</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-headline font-bold text-yellow-400">{entityData.status}</p>
                    </div>
                    <p className="text-[10px] text-muted-foreground italic">Pending Settlement Validation</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>KYB Completion</span>
                    <span className="text-accent">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Entity Quick Info */}
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  Legal Identifier
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Corporate Name</p>
                  <p className="text-sm font-bold">{entityData.legalName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Registration Number</p>
                  <p className="text-sm font-mono">{entityData.regNo}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Jurisdiction</p>
                  <div className="flex items-center gap-1 text-sm font-bold">
                    <MapPin className="h-3 w-3 text-primary" /> {entityData.country}
                  </div>
                </div>
                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full text-[10px] border-white/10">
                    <ExternalLink className="mr-1 h-3 w-3" /> View Certificate
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
             {/* Settlement Infrastructure */}
             <Card className="glass-panel border-accent/10">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-accent" />
                  Settlement Pipeline
                </CardTitle>
                <CardDescription>Configuration for merchant fund disbursements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-3 rounded-lg bg-secondary/30 border border-white/5">
                      <p className="text-[9px] text-muted-foreground uppercase font-bold">Settlement Type</p>
                      <p className="text-sm font-bold">{entityData.settlement.type}</p>
                   </div>
                   <div className="p-3 rounded-lg bg-secondary/30 border border-white/5">
                      <p className="text-[9px] text-muted-foreground uppercase font-bold">Currency</p>
                      <p className="text-sm font-bold text-accent">{entityData.settlement.currency}</p>
                   </div>
                </div>
                <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 space-y-3">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-accent" />
                        <span className="text-xs font-bold">Target Wallet (BEP-20)</span>
                      </div>
                      <Badge className="bg-accent/20 text-accent text-[9px]">Active</Badge>
                   </div>
                   <p className="text-[11px] font-mono break-all text-white/80 p-2 bg-black/40 rounded border border-white/5">
                      {entityData.settlement.address}
                   </p>
                   <div className="flex justify-between items-center text-[10px]">
                      <span className="text-muted-foreground">Network: {entityData.settlement.network}</span>
                      <span className="text-muted-foreground">Method: {entityData.settlement.method}</span>
                   </div>
                </div>
              </CardContent>
            </Card>

            {/* Applicant & Governance */}
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-primary" />
                  Governance & Ownership
                </CardTitle>
                <CardDescription>Ultimate Beneficial Owner (UBO) Verification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                      FS
                    </div>
                    <div className="flex-1">
                       <p className="text-sm font-bold text-white">{entityData.ubo}</p>
                       <p className="text-[10px] text-muted-foreground">{entityData.uboRole}</p>
                    </div>
                    <Badge className="bg-green-400/20 text-green-400 border-green-400/20">Verified (Sumsub)</Badge>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-secondary/20 border border-white/5 flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">Established</span>
                       </div>
                       <span className="text-[10px] font-bold">{entityData.established}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/20 border border-white/5 flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">Region</span>
                       </div>
                       <span className="text-[10px] font-bold">Bangladesh</span>
                    </div>
                 </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}
