import type { PinWithCategory } from '$lib/types/database.types';

class GhostPinState {
  showGhost = $state(false);
  latitude = $state(0);
  longitude = $state(0);
  nearbyPins = $state<PinWithCategory[]>([]);
  
  setGhostPin(lat: number, lng: number, nearby: PinWithCategory[] = []) {
    this.latitude = lat;
    this.longitude = lng;
    this.nearbyPins = nearby;
    this.showGhost = true;
  }

  clear() {
    this.showGhost = false;
    this.latitude = 0;
    this.longitude = 0;
    this.nearbyPins = [];
  }
}

export const ghostPinState = new GhostPinState();

