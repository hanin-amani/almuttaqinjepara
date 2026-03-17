"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";

export default function LeafletMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markerLayer = useRef<L.LayerGroup | null>(null);

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current || mapInstance.current) return;

      /* FIX ICON MARKER */
      delete (L.Icon.Default.prototype as any)._getIconUrl;

      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      /* INIT MAP */

      mapInstance.current = L.map(mapRef.current, {
        scrollWheelZoom: false,
        fadeAnimation: true,
      }).setView([-2, 118], 4); // fokus Indonesia

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
      }).addTo(mapInstance.current);

      /* LAYER MARKER */

      markerLayer.current = L.layerGroup().addTo(mapInstance.current);

      /* FIX SIZE RENDER */

      for (let i = 1; i <= 3; i++) {
        setTimeout(() => {
          mapInstance.current?.invalidateSize();
        }, i * 400);
      }

      /* FETCH LISTENER */

      try {
        const res = await fetch("/api/listeners");

        const data = await res.json();

        const listeners = data.listeners || [];

        markerLayer.current.clearLayers();

        const bounds = L.latLngBounds([]);

        let hasPoints = false;

        listeners.forEach((l: any) => {
          const lat = l?.location?.lat;
          const lon = l?.location?.lon;

          if (lat && lon && lat !== 0) {
            const marker = L.marker([lat, lon])
              .bindPopup(
                `<b>${l.location?.city || "Pendengar"}</b><br/>
                 ${l.location?.country || ""}`
              );

            markerLayer.current?.addLayer(marker);

            bounds.extend([lat, lon]);

            hasPoints = true;
          }
        });

        /* FIT MAP */

        if (hasPoints) {
          mapInstance.current?.fitBounds(bounds, {
            padding: [50, 50],
            maxZoom: 8,
          });
        }

      } catch (error) {
        console.warn("Listener map fetch error:", error);
      }
    };

    const timer = setTimeout(() => {
      setIsReady(true);
      initMap();
    }, 400);

    return () => {
      clearTimeout(timer);

      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <>
      {/* LOAD CSS LEAFLET */}

      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />

      <style jsx global>{`
        .leaflet-container {
          width: 100%;
          height: 100%;
          background: #f8fafc !important;
          z-index: 1;
        }
      `}</style>

      <div
        ref={mapRef}
        className="w-full h-full rounded-3xl overflow-hidden"
        style={{ minHeight: "420px" }}
      >
        {!isReady && (
          <div className="flex items-center justify-center h-full bg-gray-50 animate-pulse rounded-3xl">
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
              Menghubungkan Radar...
            </span>
          </div>
        )}
      </div>
    </>
  );
}