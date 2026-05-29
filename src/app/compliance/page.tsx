
"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  FileBadge, 
  ShieldCheck, 
  AlertCircle, 
  Building2, 
  UserCheck, 
  CreditCard, 
  History, 
  FileText, 
  Clock, 
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Download,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

export default function ComplianceIntelligencePage() {
  const [activeTab, setActiveTab] = useState("overview");

  const entityData = {
    legalName: "Rubelpay",
    regNo: "2200882501903677",
    country: "Bangladesh",
    address: "masumpor,sirajganj,6700, Bangladesh",
    established: "06/11/2025",
    verificationLevel: "L1 Verification",
    status: "Action Needed",
    complianceScore: 72,
    ubo: "Farid Sheikh",
    uboRole: "UBO & Director",
    settlement: {
      type: "CRYPTO",
      method: "WITHDRAW",
      currency: "USDT",
      address: "0xaf3c724065016dfe4458c05140fa4cbb40131207",
      network: "BNB Smart Chain",
      verified: false
    }
  };

  const documents = [
    { id: "doc-1", title: "Certificate of Incorporation", type: "Incorporation", status: "Verified", expiry: "N/A", lastChecked: "Today" },
    { id: "doc-2", title: "Farid Sheikh Passport", type: "ID", status: "Verified", expiry: "12/2028", lastChecked: "Yesterday" },
    { id: "doc-3", title: "Operational License Q4", type: "License", status: "Expired", expiry: "02/2024", lastChecked: "1h ago" },
    { id: "doc-4", title: "Tax Residency Certificate", type: "Tax", status: "Pending", expiry: "12/2024", lastChecked: "4h ago" },
  ];

  const auditLogs = [
    { time: "10:45 AM", actor: "System Agent", action: "Expiry Alert", details: "Operational License expired (02/2024). Alert triggered for Farid Sheikh." },
    { time: "09:30 AM", actor: "Farid Sheikh", action: "Settlement Update", details: "Manual change to BEP-20 wallet address. Pending security review." },
    { time: "Yesterday", actor: "Admin", action: "Entity Sync", details: "Legal standing verified against Bangladesh Registrar database." },
    { time: "2 days ago", actor: "Sumsub", action: "ID Verification", details: "Passport OCR check passed. Biometric match confirmed." },
  ];

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-accent" />
              Sovereign Governance & Compliance
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Readiness Index</p>
              <p className="text-lg font-headline font-bold text-accent">{entityData.complianceScore}%</p>
            </div>
            <Badge variant="outline" className="border-yellow-400/20 text-yellow-400">
              <AlertCircle className="mr-1 h-3 w-3" /> Regulatory Action Needed
            </Badge>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-headline font-bold mb-2">Evidence-Driven Governance</h2>
              <p className="text-muted-foreground">Managing verifiable credentials, institutional audits, and legal entity synchronization.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" /> Export Audit Package
              </Button>
              <Button size="sm" className="cyan-glow bg-accent text-background font-bold">
                Renew Critical Licenses
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-secondary/50 border border-white/5 p-1">
              <TabsTrigger value="overview">Executive Overview</TabsTrigger>
              <TabsTrigger value="vault">Evidence Vault</TabsTrigger>
              <TabsTrigger value="audit">Audit Center</TabsTrigger>
              <TabsTrigger value="settlement">Settlement Governance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 glass-panel border-l-4 border-l-yellow-400 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-accent" />
                      Entity: {entityData.legalName}
                    </CardTitle>
                    <CardDescription>Sovereign Standing & Regulatory Pulse</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: "Jurisdiction", value: entityData.country, icon: CheckCircle2, color: "text-accent" },
                        { label: "Level", value: entityData.verificationLevel, icon: ShieldCheck, color: "text-primary" },
                        { label: "Status", value: entityData.status, icon: AlertCircle, color: "text-yellow-400" },
                        { label: "Risk Score", value: "Low", icon: ShieldAlert, color: "text-green-400" }
                      ].map((item, i) => (
                        <div key={i} className="p-3 rounded-xl bg-secondary/30 border border-white/5 space-y-1">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">{item.label}</p>
                          <p className={`text-sm font-bold flex items-center gap-1 ${item.color}`}>
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span>Compliance Readiness Coverage</span>
                        <span className="text-accent">{entityData.complianceScore}%</span>
                      </div>
                      <Progress value={entityData.complianceScore} className="h-2" />
                      <p className="text-[10px] text-muted-foreground italic">
                        Missing evidence for 'Operational License' is depressing the overall score by 12%.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-panel">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      Compliance Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { event: "License Renewal", date: "Feb 28", status: "Overdue", color: "text-red-400" },
                      { event: "Tax Filing Q1", date: "Mar 15", status: "Upcoming", color: "text-accent" },
                      { event: "KYB Refresh", date: "June 11", status: "Scheduled", color: "text-muted-foreground" }
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center p-2 border-b border-white/5 last:border-0">
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold">{item.event}</p>
                          <p className="text-[10px] text-muted-foreground">{item.date}</p>
                        </div>
                        <Badge variant="outline" className={`text-[9px] ${item.color} border-current/20`}>{item.status}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="vault">
              <Card className="glass-panel">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg">Documentary Evidence Repository</CardTitle>
                      <CardDescription>Verifiable credentials and corporate artifacts</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                        <Input placeholder="Search documents..." className="h-8 pl-8 text-xs bg-secondary/30 w-48" />
                      </div>
                      <Button size="sm" variant="outline" className="h-8 text-[10px]">
                        <Filter className="mr-1 h-3 w-3" /> Filter
                      </Button>
                      <Button size="sm" className="h-8 text-[10px] cyan-glow bg-accent text-background">
                        Upload Evidence
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {documents.map((doc) => (
                      <div key={doc.id} className="p-4 rounded-xl border border-white/5 bg-secondary/20 hover:border-accent/30 transition-all group">
                        <div className="flex justify-between items-start mb-3">
                          <div className={`p-2 rounded-lg ${doc.status === 'Verified' ? 'bg-green-400/10' : doc.status === 'Expired' ? 'bg-red-400/10' : 'bg-yellow-400/10'}`}>
                            <FileText className={`h-4 w-4 ${doc.status === 'Verified' ? 'text-green-400' : doc.status === 'Expired' ? 'text-red-400' : 'text-yellow-400'}`} />
                          </div>
                          <Badge variant="outline" className="text-[9px] border-white/10">{doc.status}</Badge>
                        </div>
                        <h4 className="text-xs font-bold mb-1 truncate">{doc.title}</h4>
                        <div className="space-y-1 mb-4">
                          <p className="text-[9px] text-muted-foreground uppercase">Type: {doc.type}</p>
                          <p className="text-[9px] text-muted-foreground uppercase">Expires: {doc.expiry}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="audit">
              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <History className="h-5 w-5 text-accent" />
                    Immutable Governance Log
                  </CardTitle>
                  <CardDescription>Comprehensive audit trail of entity lifecycle and officer actions.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {auditLogs.map((log, i) => (
                        <div key={i} className="flex gap-4 p-4 rounded-xl border border-white/5 bg-secondary/10 items-start">
                          <div className="text-[10px] font-mono text-muted-foreground pt-1 w-20">{log.time}</div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white">{log.actor}</span>
                              <Badge className="text-[9px] bg-primary/20 text-primary border-primary/20">{log.action}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{log.details}</p>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settlement">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <Card className="glass-panel border-accent/20">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-accent" />
                      Settlement Infrastructure Governance
                    </CardTitle>
                    <CardDescription>Wallet ownership and disbursement policy enforcement</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 space-y-4">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <ShieldAlert className="h-4 w-4 text-yellow-400" />
                            <span className="text-xs font-bold">Ownership Proof Status</span>
                          </div>
                          <Badge variant="destructive" className="text-[9px]">Unverified</Badge>
                       </div>
                       <div className="p-3 bg-black/40 rounded border border-white/5 font-mono text-[11px] break-all">
                         {entityData.settlement.address}
                       </div>
                       <p className="text-[10px] text-muted-foreground">
                         System requires a small verification transaction (0.01 USDT) or a signed message to confirm control of this BEP-20 address.
                       </p>
                       <Button className="w-full text-xs font-bold cyan-glow bg-accent text-background">
                         Verify Wallet Ownership
                       </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-secondary/30 border border-white/5">
                        <p className="text-[9px] text-muted-foreground uppercase font-bold">Currency</p>
                        <p className="text-sm font-bold">{entityData.settlement.currency}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-secondary/30 border border-white/5">
                        <p className="text-[9px] text-muted-foreground uppercase font-bold">Cycle</p>
                        <p className="text-sm font-bold text-accent">T+1 Daily</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-panel">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <UserCheck className="h-5 w-5 text-primary" />
                      Ownership & Governance
                    </CardTitle>
                    <CardDescription>UBO Verification & Officer Registry</CardDescription>
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
                        <Badge className="bg-green-400/20 text-green-400 border-green-400/20">Identity Verified</Badge>
                     </div>
                     <div className="p-4 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center py-8">
                        <Building2 className="h-8 w-8 text-muted-foreground/30 mb-2" />
                        <p className="text-xs text-muted-foreground">Additional Director documentation required for L2 verification.</p>
                        <Button variant="ghost" size="sm" className="mt-2 text-primary text-[10px]">Add Officer</Button>
                     </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </SidebarInset>
    </div>
  );
}
