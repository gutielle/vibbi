export interface Preferences {
  name: string;
  intention: 'Comprar' | 'Alugar';
  propertyType: string;
  otherPropertyType: string;
  budget: {
    min: number;
    max: number;
  };
  location: string;
  priorities: string[];
  otherPriorities: string;
  bedrooms: number;
  bathrooms: number;
  extras: string[];
  otherExtras: string;
}

export interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  imageUrls: string[];
  description: string;
  personalizedPitch: string;
  imagePrompt: string;
  neighborhoodVibe: string;
  suggestionReason?: string;
}
