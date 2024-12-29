import { useEffect, useRef } from 'react';
import L from 'leaflet';

export default function Map() {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (mapContainerRef.current) {
      // Initialize the map
      const map = L.map(mapContainerRef.current).setView([51.505, -0.09], 13); // Default position

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Add a marker to the map
      L.marker([51.505, -0.09]).addTo(map)
        .bindPopup('A marker')
        .openPopup();

      // Cleanup on component unmount
      return () => {
        map.remove();
      };
    }
  }, []);

  return (
    <div
      ref={mapContainerRef}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
