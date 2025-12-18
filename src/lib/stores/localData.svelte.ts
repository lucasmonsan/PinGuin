import { v4 as uuidv4 } from 'uuid';

const LOCAL_DATA_KEY = 'localist_offline_data';

// Interfaces
export interface LocalPin {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  category_id: string;
  photos: string[]; // base64 - SEM UPLOAD
  created_at: string;
  isLocal: true;
}

export interface LocalReview {
  id: string;
  pin_id: string;
  rating: number;
  comment: string;
  photos: never[]; // VAZIO - sem fotos offline
  created_at: string;
  isLocal: true;
}

export interface LocalData {
  pins: LocalPin[];
  reviews: LocalReview[];
  favorites: string[]; // pin IDs
  lastSync: Date | null;
}

class LocalDataStore {
  private data = $state<LocalData>({
    pins: [],
    reviews: [],
    favorites: [],
    lastSync: null
  });

  constructor() {
    if (typeof window !== 'undefined') {
      this.load();
    }
  }

  private load() {
    try {
      const stored = localStorage.getItem(LOCAL_DATA_KEY);
      if (stored) {
        this.data = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading local data:', error);
    }
  }

  private save() {
    try {
      localStorage.setItem(LOCAL_DATA_KEY, JSON.stringify(this.data));
    } catch (error) {
      console.error('Error saving local data:', error);
    }
  }

  // Adicionar pin local
  addPin(pin: Omit<LocalPin, 'id' | 'created_at' | 'isLocal'>): LocalPin {
    const newPin: LocalPin = {
      ...pin,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      isLocal: true
    };
    this.data.pins.push(newPin);
    this.save();
    return newPin;
  }

  // Adicionar review local
  addReview(review: Omit<LocalReview, 'id' | 'created_at' | 'isLocal' | 'photos'>): LocalReview {
    const newReview: LocalReview = {
      ...review,
      id: uuidv4(),
      photos: [],
      created_at: new Date().toISOString(),
      isLocal: true
    };
    this.data.reviews.push(newReview);
    this.save();
    return newReview;
  }

  // Toggle favorito local
  toggleFavorite(pinId: string): boolean {
    const index = this.data.favorites.indexOf(pinId);
    if (index > -1) {
      this.data.favorites.splice(index, 1);
    } else {
      this.data.favorites.push(pinId);
    }
    this.save();
    return index === -1; // retorna novo estado
  }

  // Verificar se pin é favorito
  isFavorite(pinId: string): boolean {
    return this.data.favorites.includes(pinId);
  }

  // Verificar se tem dados locais
  hasLocalData(): boolean {
    return this.data.pins.length > 0 ||
      this.data.reviews.length > 0 ||
      this.data.favorites.length > 0;
  }

  // Contar total de itens locais
  getTotalCount(): number {
    return this.data.pins.length + this.data.reviews.length + this.data.favorites.length;
  }

  // Limpar todos os dados locais
  clear() {
    this.data = { pins: [], reviews: [], favorites: [], lastSync: null };
    this.save();
  }

  // Remover pin específico
  removePin(pinId: string) {
    this.data.pins = this.data.pins.filter(p => p.id !== pinId);
    this.save();
  }

  // Remover review específica
  removeReview(reviewId: string) {
    this.data.reviews = this.data.reviews.filter(r => r.id !== reviewId);
    this.save();
  }

  // Getters
  get pins() { return this.data.pins; }
  get reviews() { return this.data.reviews; }
  get favorites() { return this.data.favorites; }
}

export const localDataStore = new LocalDataStore();
