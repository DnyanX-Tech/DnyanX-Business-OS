export interface MerchantProfile {
  merchantId: string;
  businessName: string;
  businessSlug: string;
  ownerName: string;
  phone: string;
  upiVpa: string;
  gstin?: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    latitude: number;
    longitude: number;
  };
  settings: {
    defaultLanguage: 'mr' | 'hi' | 'en';
    lowStockThreshold: number;
    enableSoundboxVoice: boolean;
    autoEODReportTime: string; // e.g. "21:00"
    enableFacialAttendance: boolean;
  };
  createdAt: string;
}

export interface CustomerRecord {
  customerId: string;
  merchantId: string;
  name: string;
  phone: string;
  totalSpent: number;
  udhaarBalance: number;
  loyaltyPoints: number;
  dateOfBirth?: string;
  anniversaryDate?: string;
  lastVisit: string;
  riskOfChurn: boolean;
}

export interface InventoryItem {
  itemId: string;
  merchantId: string;
  sku: string;
  barcode: string;
  nameMarathi: string;
  nameEnglish: string;
  category: string;
  buyPrice: number;
  sellPrice: number;
  gstRate: number; // 0, 5, 12, 18, 28
  godowns: {
    godownId: string;
    godownName: string;
    quantity: number;
  }[];
  totalStock: number;
  minStockLevel: number;
  batchExpiry?: string;
  isDeadStock: boolean;
  supplierId: string;
}

export interface InvoiceRecord {
  invoiceId: string; // UUID v4
  invoiceNumber: string; // e.g. "INV-2026-0042"
  merchantId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: {
    itemId: string;
    name: string;
    qty: number;
    rate: number;
    taxableAmount: number;
    gstRate: number;
    gstAmount: number;
    total: number;
  }[];
  subTotal: number;
  totalGst: number;
  cgst: number;
  sgst: number;
  igst: number;
  grandTotal: number;
  paymentSplit: {
    cash: number;
    upi: number;
    udhaar: number;
  };
  staffId?: string;
  staffCommission: number;
  isSynced: boolean;
  timestamp: string;
}

export interface ShiftCashAudit {
  shiftId: string;
  merchantId: string;
  staffId: string;
  staffName: string;
  openingCash: number;
  cashSales: number;
  cashExpenses: number;
  expectedDrawerCash: number;
  actualDrawerCash: number;
  discrepancy: number;
  isReconciled: boolean;
  securityAlertFired: boolean;
  startTime: string;
  endTime: string;
}
