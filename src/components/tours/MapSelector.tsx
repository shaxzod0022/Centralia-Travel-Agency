"use client";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { LocationPoint } from "@/interfaces/calendar.interface";

/* ===============================
   FIX LEAFLET DEFAULT ICON ISSUE
================================ */
delete (L.Icon.Default.prototype as any)._getIconUrl;

/* ===============================
   CUSTOM LOCATION ICON
================================ */
const locationIcon = L.icon({
  iconUrl: "/icons/location.svg",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface MapSelectorProps {
  pickupArea?: {
    center?: { lat: number; lng: number };
    bounds?: {
      north: number;
      south: number;
      east: number;
      west: number;
    };
  };
  meetingPoint: LocationPoint;
  onLocationSelect: (location: { lat: number; lng: number }) => void;
}

export default function MapSelector({
  pickupArea,
  onLocationSelect,
}: MapSelectorProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const t = useTranslations("mapSelector");

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    /* ===============================
       MAP INIT
    ================================ */
    const map = L.map(mapRef.current).setView(
      [pickupArea?.center?.lat || 41.2995, pickupArea?.center?.lng || 69.2401],
      13,
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    /* ===============================
       PICKUP AREA RECTANGLE
    ================================ */
    if (pickupArea?.bounds) {
      const bounds = L.latLngBounds(
        [pickupArea.bounds.south, pickupArea.bounds.west],
        [pickupArea.bounds.north, pickupArea.bounds.east],
      );

      L.rectangle(bounds, {
        color: "#6EBB2D",
        weight: 2,
        fillOpacity: 0.15,
      }).addTo(map);

      map.fitBounds(bounds);
    }

    /* ===============================
       CLICK TO SELECT LOCATION
    ================================ */
    map.on("click", (e) => {
      const { lat, lng } = e.latlng;

      if (pickupArea?.bounds) {
        const bounds = L.latLngBounds(
          [pickupArea.bounds.south, pickupArea.bounds.west],
          [pickupArea.bounds.north, pickupArea.bounds.east],
        );

        if (!bounds.contains(e.latlng)) {
          // alert(t("selectPikup"));
          return;
        }
      }

      if (markerRef.current) {
        markerRef.current.remove();
      }

      markerRef.current = L.marker([lat, lng], {
        icon: locationIcon,
      })
        .addTo(map)
        .bindPopup(t("selected"))
        .openPopup();

      onLocationSelect({ lat, lng });
    });

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  return (
    <div className="relative">
      <div ref={mapRef} className="h-64 w-full rounded-lg" />
      <div className="absolute top-2 right-2 bg-white p-2 rounded shadow text-sm">
        {t("click")}
      </div>
    </div>
  );
}
