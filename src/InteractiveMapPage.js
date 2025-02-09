import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const InteractiveMapPage = () => {
  const [ngos, setNgos] = useState([]);
  const [safeZones, setSafeZones] = useState([]);
  const [disasterZones, setDisasterZones] = useState([]);
  const [hoveredSafeZone, setHoveredSafeZone] = useState(null);

  useEffect(() => {
    // Sample data (Replace with your database fetch)
    setDisasterZones([
      { id: 1, location: "Bangalore", coords: [12.9716, 77.5946] },
      { id: 2, location: "Delhi", coords: [28.7041, 77.1025] },
    ]);
    setSafeZones([
      { id: 1, location: "Amritsar", coords: [31.634, 74.8723] },
      { id: 2, location: "Lucknow", coords: [26.8467, 80.9462] },
    ]);
    setNgos([
      { id: 1, name: "NGO 1", coords: [31.5204, 75.7074], resources: 50 },
      { id: 2, name: "NGO 2", coords: [26.4499, 80.3319], resources: 30 },
    ]);
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2); // Distance in km
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Disaster Zones (Red) */}
        {disasterZones.map((zone) => (
          <Marker
            key={zone.id}
            position={zone.coords}
            icon={L.divIcon({ className: "custom-icon red-icon" })}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={1}>
              <b>{zone.location} (Disaster Zone)</b>
            </Tooltip>
          </Marker>
        ))}

        {/* Safe Zones (Green) */}
        {safeZones.map((zone) => (
          <Marker
            key={zone.id}
            position={zone.coords}
            icon={L.divIcon({ className: "custom-icon green-icon" })}
            eventHandlers={{
              mouseover: () => setHoveredSafeZone(zone),
              mouseout: () => setHoveredSafeZone(null),
            }}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={1}>
              <b>{zone.location} (Safe Zone)</b>
            </Tooltip>
          </Marker>
        ))}

        {/* NGOs (Blue) */}
        {ngos.map((ngo) => (
          <Marker
            key={ngo.id}
            position={ngo.coords}
            icon={L.divIcon({ className: "custom-icon blue-icon" })}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={1}>
              <b>{ngo.name}</b> <br />
              Resources: {ngo.resources}
            </Tooltip>
          </Marker>
        ))}

        {/* Draw Lines from Safe Zone to Nearest NGOs */}
        {hoveredSafeZone &&
          ngos.map((ngo) => {
            const distance = calculateDistance(
              hoveredSafeZone.coords[0],
              hoveredSafeZone.coords[1],
              ngo.coords[0],
              ngo.coords[1]
            );
            return (
              <Polyline
                key={ngo.id}
                positions={[hoveredSafeZone.coords, ngo.coords]}
                color="purple"
              >
                <Tooltip direction="center" offset={[0, 0]} opacity={1}>
                  <b>{ngo.name}</b> <br />
                  Distance: {distance} km <br />
                  Resources: {ngo.resources}
                </Tooltip>
              </Polyline>
            );
          })}
      </MapContainer>
    </div>
  );
};

export default InteractiveMapPage;
