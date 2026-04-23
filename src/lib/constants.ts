export const BASE_URL = window.location.origin;
export const API_BASE = `${BASE_URL}/api`;

export interface Artwork {
  id: number;
  catalogNumber: string;
  title: string;
  titleFr: string;
  year: number;
  period: string;
  medium: string;
  dimensions: string;
  currentMuseum: string;
  locationPainted: string;
  letterNumber?: string;
  letterExcerpt?: string;
  descriptionVincent?: string;
  imageUrl: string;
}

export interface ShopifyProduct {
  shopifyId: string;
  title: string;
  handle: string;
  price: string;
  variantGid: string;
  gabaritId: string;
  category: string;
  variants: Array<{ id: string; title: string; price: string }>;
}

export interface VoiceSessionState {
  status: 'idle' | 'connecting' | 'active' | 'error';
  isMuted: boolean;
  activeArtwork?: Artwork;
}
