import type { PinWithCategory } from '$lib/types/database.types';

class GhostPinState {
  showGhost = $state(false);
  latitude = $state(0);
  longitude = $state(0);
  nearbyPins = $state<PinWithCategory[]>([]);
  address = $state<string>('');
  loadingAddress = $state(false);
  
  setGhostPin(lat: number, lng: number, nearby: PinWithCategory[] = []) {
    this.latitude = lat;
    this.longitude = lng;
    this.nearbyPins = nearby;
    this.showGhost = true;
    this.address = '';
    this.loadingAddress = true;
    
    // Fetch address asynchronously
    this.fetchAddress(lat, lng);
  }

  async fetchAddress(lat: number, lng: number) {
    try {
      const { reverseGeocode, formatAddress } = await import('$lib/utils/geocoding');
      const result = await reverseGeocode(lat, lng);
      this.address = formatAddress(result);
    } catch (error) {
      this.address = '';
    } finally {
      this.loadingAddress = false;
    }
  }

  clear() {
    this.showGhost = false;
    this.latitude = 0;
    this.longitude = 0;
    this.nearbyPins = [];
    this.address = '';
    this.loadingAddress = false;
    
    // Limpar marcador visual do mapa
    if (typeof window !== 'undefined') {
      import('$lib/components/map/map.svelte').then(({ mapState }) => {
        mapState.clearGhostPin();
      });
    }
  }
}

export const ghostPinState = new GhostPinState();

