// src/types/google.d.ts
declare global {
    interface Window {
      google: typeof google;
    }
  }
  
  declare namespace google.maps {
    class DirectionsService {
      route(request: DirectionsRequest): Promise<DirectionsResult>;
    }
  
    class places {
      static Autocomplete: new (
        inputField: HTMLInputElement,
        opts?: AutocompleteOptions
      ) => Autocomplete;
    }
  
    interface DirectionsResult {
      routes: DirectionsRoute[];
      status: string;
    }
  
    interface DirectionsRoute {
      legs: DirectionsLeg[];
    }
  
    interface DirectionsLeg {
      duration: Duration;
      duration_in_traffic?: Duration;
      distance: Distance;
    }
  
    interface Duration {
      text: string;
      value: number;
    }
  
    interface Distance {
      text: string;
      value: number;
    }
  
    interface AutocompleteOptions {
      types?: string[];
    }
  
    interface Autocomplete {
      addListener(event: string, handler: () => void): void;
      getPlace(): Place;
    }
  
    interface Place {
      formatted_address?: string;
    }
  
    enum TravelMode {
      DRIVING = 'DRIVING',
    }
  
    enum TrafficModel {
      BEST_GUESS = 'BEST_GUESS',
    }
  
    interface DirectionsRequest {
      origin: string;
      destination: string;
      travelMode: TravelMode;
      drivingOptions?: {
        departureTime: Date;
        trafficModel: TrafficModel;
      };
    }
  }
  
  export {};