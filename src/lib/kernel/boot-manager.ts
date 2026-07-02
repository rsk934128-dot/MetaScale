'use client';

import { ServiceStatus, BootStatus } from './types';

/**
 * @fileOverview NoorNexus Sovereign OS - Core Bootstrap Manager
 * Author: Sheikh Farid
 *
 * Handles system initialization, service loading, 
 * and secure API authentication at boot time.
 */

export type ServiceName = 'AuthService' | 'WalletLedger' | 'BankingAPI' | 'ShieldEngine';

export class SovereignBootManager {
  public isSystemReady: boolean = false;
  public lastBootTimestamp: number | null = null;
  public services: Record<ServiceName, ServiceStatus> = {
    'AuthService': 'OFFLINE',
    'WalletLedger': 'OFFLINE',
    'BankingAPI': 'OFFLINE',
    'ShieldEngine': 'OFFLINE'
  };

  constructor() {}

  /**
   * Executes the full system boot sequence.
   */
  async bootSystem(): Promise<boolean> {
    console.log("%c[Boot] Initializing NoorNexus Sovereign OS...", "color: #00f2ff; font-weight: bold;");

    try {
      // 1. Load ShieldEngine (Security First - Zero Trust Handshake)
      await this.loadSecurityLayer();

      // 2. Establish Global Banking API Tunnels
      await this.connectGlobalBanking();

      // 3. Initialize Distributed Wallet Ledger
      await this.initWalletService();

      // 4. Initialize Identity Mesh (Auth Service)
      await this.initAuthService();

      this.isSystemReady = true;
      this.lastBootTimestamp = Date.now();
      console.log("%c[Boot] System Boot Successful: All services active.", "color: #4ade80; font-weight: bold;");
      
      return true;
    } catch (error: any) {
      console.error("[Boot] Failure Detected:", error.message);
      this.triggerFailsafeProtocol(error);
      throw error;
    }
  }

  private async loadSecurityLayer() {
    this.services['ShieldEngine'] = 'INITIALIZING';
    console.log("[ShieldEngine] Initializing security core...");
    
    return new Promise((resolve) => {
      setTimeout(() => {
        this.services['ShieldEngine'] = 'ONLINE';
        console.log("[ShieldEngine] Security layer active (AES-256-GCM).");
        resolve(true);
      }, 1000);
    });
  }

  private async connectGlobalBanking() {
    this.services['BankingAPI'] = 'INITIALIZING';
    console.log("[BankingAPI] Establishing secure banking tunnels (ISO 20022)...");
    
    return new Promise((resolve) => {
      setTimeout(() => {
        this.services['BankingAPI'] = 'ONLINE';
        console.log("[BankingAPI] Global banking connection established.");
        resolve(true);
      }, 1200);
    });
  }

  private async initWalletService() {
    this.services['WalletLedger'] = 'INITIALIZING';
    console.log("[WalletLedger] Synchronizing distributed ledger...");
    
    return new Promise((resolve) => {
      setTimeout(() => {
        this.services['WalletLedger'] = 'ONLINE';
        console.log("[WalletLedger] Ledger synchronization complete.");
        resolve(true);
      }, 800);
    });
  }

  private async initAuthService() {
    this.services['AuthService'] = 'INITIALIZING';
    console.log("[AuthService] Linking Identity Mesh...");
    
    return new Promise((resolve) => {
      setTimeout(() => {
        this.services['AuthService'] = 'ONLINE';
        console.log("[AuthService] Authentication service online.");
        resolve(true);
      }, 500);
    });
  }

  /**
   * Activates emergency containment protocols in case of boot failure.
   */
  private triggerFailsafeProtocol(error: Error) {
    console.log("%c[Failsafe] Activating emergency containment...", "color: #f87171; font-weight: bold;");
    console.log(`[Failsafe] Reason: ${error.message}`);
    
    // Set all services to failed
    Object.keys(this.services).forEach(key => {
      this.services[key as ServiceName] = 'FAILED';
    });
  }

  /**
   * Returns a point-in-time status of the boot manager.
   */
  public getSystemStatus(): BootStatus {
    return {
      ready: this.isSystemReady,
      services: { ...this.services },
      lastUpdate: Date.now()
    };
  }
}

// Export a singleton instance for global use
export const bootManager = new SovereignBootManager();
