"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, Car, Cloud, Calendar } from "lucide-react";

interface RouteData {
  origin: string;
  destination: string;
  departureTime: string;
  estimatedDuration: number | null;
  distance: number | null;
  weather: string | null;
  trafficLevel: "Low" | "Medium" | "Heavy" | null;
}

const RouteCalculator = () => {
  const [routeData, setRouteData] = useState<RouteData>({
    origin: "",
    destination: "",
    departureTime: "",
    estimatedDuration: null,
    distance: null,
    weather: null,
    trafficLevel: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);

  const originInputRef = useRef<HTMLInputElement>(null);
  const destinationInputRef = useRef<HTMLInputElement>(null);
  const originAutocomplete = useRef<google.maps.places.Autocomplete | null>(null);
  const destinationAutocomplete = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    // Check if Google Maps is available (loaded by the Script component)
    const checkGoogleMapsLoaded = () => {
      if (window.google?.maps) {
        setMapsLoaded(true);
        initializeAutocomplete();
      } else {
        // If not loaded yet, check again in a moment
        setTimeout(checkGoogleMapsLoaded, 100);
      }
    };

    const initializeAutocomplete = () => {
      if (!originInputRef.current || !destinationInputRef.current) {
        return;
      }

      if (!originAutocomplete.current) {
        originAutocomplete.current = new google.maps.places.Autocomplete(
          originInputRef.current,
          { types: ["address"] }
        );

        originAutocomplete.current.addListener("place_changed", () => {
          const place = originAutocomplete.current?.getPlace();
          const address = place?.formatted_address || "";
          setRouteData(prev => ({
            ...prev,
            origin: address
          }));
        });
      }

      if (!destinationAutocomplete.current) {
        destinationAutocomplete.current = new google.maps.places.Autocomplete(
          destinationInputRef.current,
          { types: ["address"] }
        );

        destinationAutocomplete.current.addListener("place_changed", () => {
          const place = destinationAutocomplete.current?.getPlace();
          const address = place?.formatted_address || "";
          setRouteData(prev => ({
            ...prev,
            destination: address
          }));
        });
      }
    };

    checkGoogleMapsLoaded();

    return () => {
      if (originAutocomplete.current) {
        google.maps.event.clearInstanceListeners(originAutocomplete.current);
      }
      if (destinationAutocomplete.current) {
        google.maps.event.clearInstanceListeners(destinationAutocomplete.current);
      }
    };
  }, []);

  const calculateRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!window.google?.maps) {
        throw new Error("Google Maps not loaded");
      }

      const directionsService = new google.maps.DirectionsService();

      const result = await directionsService.route({
        origin: routeData.origin,
        destination: routeData.destination,
        travelMode: google.maps.TravelMode.DRIVING,
        drivingOptions: {
          departureTime: new Date(routeData.departureTime),
          trafficModel: google.maps.TrafficModel.BEST_GUESS,
        },
      });

      if (result.routes?.[0]?.legs?.[0]) {
        const leg = result.routes[0].legs[0];
        const normalDuration = leg.duration?.value || 0;
        const trafficDuration = leg.duration_in_traffic?.value || normalDuration;
        const trafficRatio = trafficDuration / normalDuration;

        let trafficLevel: "Low" | "Medium" | "Heavy";
        if (trafficRatio < 1.1) trafficLevel = "Low";
        else if (trafficRatio < 1.3) trafficLevel = "Medium";
        else trafficLevel = "Heavy";

        setRouteData(prev => ({
          ...prev,
          estimatedDuration: Math.round(trafficDuration / 60),
          distance: leg.distance?.value 
            ? Math.round((leg.distance.value / 1609.34) * 10) / 10 
            : null,
          trafficLevel,
          weather: "Data not available",
        }));
      }
    } catch (err) {
      setError("Failed to calculate route. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-muted/40 flex min-h-screen w-full items-center justify-center">
      <div className="flex w-full max-w-2xl flex-col px-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-6 w-6" />
              Weekly Drive Route Calculator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={calculateRoute} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="origin" className="block text-sm font-medium">
                  Starting Point
                </label>
                <input
                  ref={originInputRef}
                  id="origin"
                  type="text"
                  value={routeData.origin}
                  onChange={(e) =>
                    setRouteData((prev) => ({
                      ...prev,
                      origin: e.target.value,
                    }))
                  }
                  placeholder="Enter starting address"
                  required
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="destination" className="block text-sm font-medium">
                  Destination
                </label>
                <input
                  ref={destinationInputRef}
                  id="destination"
                  type="text"
                  value={routeData.destination}
                  onChange={(e) =>
                    setRouteData((prev) => ({
                      ...prev,
                      destination: e.target.value,
                    }))
                  }
                  placeholder="Enter destination address"
                  required
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="departureTime" className="block text-sm font-medium">
                  Departure Time
                </label>
                <input
                  id="departureTime"
                  type="datetime-local"
                  value={routeData.departureTime}
                  onChange={(e) =>
                    setRouteData((prev) => ({
                      ...prev,
                      departureTime: e.target.value,
                    }))
                  }
                  required
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>

              <Button
                type="submit"
                disabled={loading || !mapsLoaded}
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
              >
                {loading ? "Calculating..." : "Calculate Route"}
              </Button>
            </form>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {routeData.estimatedDuration && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>Estimated Duration: {routeData.estimatedDuration} minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  <span>Distance: {routeData.distance} miles</span>
                </div>
                <div className="flex items-center gap-2">
                  <Cloud className="h-5 w-5" />
                  <span>Weather: {routeData.weather}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>Traffic Level: {routeData.trafficLevel}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RouteCalculator;