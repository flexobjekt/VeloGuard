export enum BikeStatus {
  SAFE = 'SICHER',
  STOLEN = 'GESTOHLEN',
  FOR_SALE = 'ZUM VERKAUF',
  SOLD = 'VERKAUFT'
}

export type BikeCondition = 'NEU' | 'GEBRAUCHT';

export type DocumentType = 'RECEIPT_PURCHASE' | 'RECEIPT_SALE' | 'INSURANCE' | 'OTHER';

export interface BikeDocument {
  id: string;
  name: string;
  type: DocumentType;
  url: string;
  dateAdded: string;
}

export interface Accessory {
  id: string;
  name: string; // e.g. "Tacho", "Sattel"
  description: string;
  price?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  dob: string;
  address: string;
  email: string;
}

export interface Bike {
  id: string;
  ownerId: string;
  frameNumber: string; // Fahrgestellnummer
  make: string; // Marke
  model: string; // Modell
  color: string; // Farbe
  description: string; // Allgemeine Beschreibung
  imageUrl?: string;
  status: BikeStatus;
  purchaseDate: string;
  purchasePrice?: number; // Kaufpreis
  price?: number; // For sale listing price
  
  // Extended fields
  condition: BikeCondition;
  storageLocation?: string; // Abstellort
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  documents: BikeDocument[];
  
  // Technical Details
  frameSize?: string; // Rahmengröße
  tireSize?: string; // Reifengröße
  suspensionTravel?: string; // Federweg
  brakeType?: string; // Bremstyp

  // New fields for details
  accessories: Accessory[]; // Nachträgliches Zubehör
  distinctiveFeatures: string; // Besonderheiten (Kratzer, Sticker etc.)
}

export interface DealerAd {
  id: string;
  dealerName: string;
  title: string;
  description: string;
  imageUrl?: string;
  websiteUrl?: string;
  price?: string; // Optional promo price text (e.g. "ab 49€")
}

export interface TheftReport {
  id: string;
  bikeId: string;
  incidentDate: string;
  incidentTime: string;
  location: string;
  details: string;
  policeReportStatus: 'PENDING' | 'SUBMITTED' | 'ACKNOWLEDGED';
  submissionDate: string;
}

export type ViewState = 'DASHBOARD' | 'REGISTER' | 'REPORT' | 'MARKET' | 'PROFILE';