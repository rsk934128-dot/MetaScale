/**
 * NoorNexus Sovereign OS - System Kernel Health Monitor
 * এই মডিউলটি সিস্টেমের রিয়েল-টাইম হেলথ মনিটর করে।
 */

export interface SystemStatus {
  isLocked: boolean;
  activeServices: string[];
  lastBootTime: number;
}

/**
 * getKernelHealth
 * Analyzing the boot manager state to return a simplified health status.
 */
export const getKernelHealth = (bootManager: any): SystemStatus => {
  // If services is an object, convert to array of active service names
  let activeServices: string[] = [];
  
  if (bootManager.services && typeof bootManager.services === 'object' && !Array.isArray(bootManager.services)) {
    activeServices = Object.entries(bootManager.services)
      .filter(([_, status]) => status === 'ONLINE')
      .map(([name]) => name);
  } else if (Array.isArray(bootManager.services)) {
    activeServices = bootManager.services;
  }

  return {
    isLocked: !bootManager.isSystemReady,
    activeServices: activeServices,
    lastBootTime: bootManager.lastBootTimestamp || Date.now()
  };
};

console.log("Kernel Health Monitor: Operational.");
