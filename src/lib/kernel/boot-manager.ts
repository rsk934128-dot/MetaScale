'use client';

import { ServiceStatus, BootStatus } from './types';
import { validateEnvironment } from '@/services/config-validator';

/**
 * @fileOverview NoorNexus Sovereign OS - Core Bootstrap Manager
 * Updated v1.3: Integrated Config Validation to prevent Webhook Bottlenecks.
 */

export type ServiceName = 'AuthService' | 'WalletLedger' | 'BankingAPI' | 'ShieldEngine' | 'GatewayValidator';

export class SovereignBootManager {
  public isSystemReady: boolean = false;
  public lastBootTimestamp: number | null = null;
  public services: Record<ServiceName, ServiceStatus> = {
    'AuthService': 'OFFLINE',
    'WalletLedger': 'OFFLINE',
    'BankingAPI': 'OFFLINE',
    'ShieldEngine': 'OFFLINE',
    'GatewayValidator': 'OFFLINE'
  };

  constructor() {}

  /**
   * Executes the full system boot sequence.
   */
  async bootSystem(): Promise<boolean> {
    console.log("%c[Boot] Initializing NoorNexus Sovereign OS...", "color: #00f2ff; font-weight: bold;");

    try {
      // 1. Config Validation (Pre-flight check)
      await this.runPreflightCheck();

      // 2. Load ShieldEngine (Security First)
      await this.loadSecurityLayer();

      // 3. Establish Global Banking API Tunnels
      await this.connectGlobalBanking();

      // 4. Initialize Distributed Wallet Ledger
      await this.initWalletService();

      // 5. Initialize Identity Mesh
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

  private async runPreflightCheck() {
    this.services['GatewayValidator'] = 'INITIALIZING';
    const validation = await validateEnvironment();
    
    if (!validation.success) {
      this.services['GatewayValidator'] = 'FAILED';
      throw new Error(`PREFLIGHT_FAIL: ${validation.message}`);
    }
    
    this.services['GatewayValidator'] = 'ONLINE';
    console.log("[GatewayValidator] Environment keys verified.");
  }

  private async loadSecurityLayer() {
    this.services['ShieldEngine'] = 'INITIALIZING';
    return new Promise((resolve) => {
      setTimeout(() => {
        this.services['ShieldEngine'] = 'ONLINE';
        resolve(true);
      }, 500);
    });
  }

  private async connectGlobalBanking() {
    this.services['BankingAPI'] = 'INITIALIZING';
    return new Promise((resolve) => {
      setTimeout(() => {
        this.services['BankingAPI'] = 'ONLINE';
        resolve(true);
      }, 500);
    });
  }

  private async initWalletService() {
    this.services['WalletLedger'] = 'INITIALIZING';
    return new Promise((resolve) => {
      setTimeout(() => {
        this.services['WalletLedger'] = 'ONLINE';
        resolve(true);
      }, 500);
    });
  }

  private async initAuthService() {
    this.services['AuthService'] = 'INITIALIZING';
    return new Promise((resolve) => {
      setTimeout(() => {
        this.services['AuthService'] = 'ONLINE';
        resolve(true);
      }, 500);
    });
  }

  private triggerFailsafeProtocol(error: Error) {
    console.log("%c[Failsafe] Activating emergency containment...", "color: #f87171; font-weight: bold;");
    Object.keys(this.services).forEach(key => {
      if (this.services[key as ServiceName] !== 'ONLINE') {
        this.services[key as ServiceName] = 'FAILED';
      }
    });
  }

  public getSystemStatus(): BootStatus {
    return {
      ready: this.isSystemReady,
      services: { ...this.services },
      lastUpdate: Date.now()
    };
  }
}

export const bootManager = new SovereignBootManager();
