import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Compass, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

// Custom luxury SVG icon for Leaflet
const createGoldIcon = (label = '') => {
  return L.divIcon({
    className: 'custom-gold-marker',
    html: `
      <div style="
        background: #111720;
        border: 2px solid #D6B477;
        box-shadow: 0 0 12px rgba(214, 180, 119, 0.4);
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #D6B477;
        font-weight: bold;
        font-size: 11px;
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D6B477" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
};

const createAttractionIcon = () => {
  return L.divIcon({
    className: 'custom-attraction-marker',
    html: `
      <div style="
        background: #D6B477;
        border: 2px solid #111720;
        box-shadow: 0 0 8px rgba(214, 180, 119, 0.6);
        border-radius: 50%;
        width: 22px;
        height: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="width: 8px; height: 8px; background: #080B10; border-radius: 50%;"></div>
      </div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -12],
  });
};

const InteractiveMap = ({
  center = [25.0, 35.0],
  zoom = 3,
  destinations = [],
  attractions = [],
  height = '480px',
  singleDestination = null,
}) => {
  // If single destination specified, center on it
  const mapCenter = singleDestination?.coordinates
    ? [singleDestination.coordinates.lat, singleDestination.coordinates.lng]
    : center;

  const mapZoom = singleDestination ? 12 : zoom;

  return (
    <div style={{ height }} className="w-full rounded-2xl overflow-hidden border border-luxury-border/60 relative z-10 shadow-2xl">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        {/* Official OpenStreetMap Tiles (100% Free, Zero API Key Required) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {/* Single Destination Marker */}
        {singleDestination && singleDestination.coordinates && (
          <Marker
            position={[singleDestination.coordinates.lat, singleDestination.coordinates.lng]}
            icon={createGoldIcon()}
          >
            <Popup>
              <div className="p-1 min-w-[200px]">
                <h4 className="font-serif font-bold text-base text-gold mb-1">
                  {singleDestination.name || singleDestination.title}
                </h4>
                <p className="text-xs text-gray-300 mb-2">
                  {singleDestination.city ? `${singleDestination.city}, ` : ''}{singleDestination.country}
                </p>
                <p className="text-[11px] text-gray-400 line-clamp-2">
                  {singleDestination.shortDescription || singleDestination.description}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Multiple Destination Markers */}
        {!singleDestination &&
          destinations.map((dest) => {
            if (!dest.coordinates?.lat || !dest.coordinates?.lng) return null;
            return (
              <Marker
                key={dest._id}
                position={[dest.coordinates.lat, dest.coordinates.lng]}
                icon={createGoldIcon()}
              >
                <Popup>
                  <div className="p-1 min-w-[220px]">
                    {dest.images?.[0] && (
                      <img
                        src={dest.images[0]}
                        alt={dest.name}
                        className="w-full h-24 object-cover rounded-md mb-2 border border-gold/30"
                      />
                    )}
                    <span className="text-[10px] uppercase tracking-wider text-gold font-bold">
                      {dest.category}
                    </span>
                    <h4 className="font-serif font-bold text-sm text-gold-light">
                      {dest.name || dest.title}
                    </h4>
                    <p className="text-xs text-gray-300 mb-2">
                      {dest.country}
                    </p>
                    <Link
                      to={`/destination/${dest._id}`}
                      className="inline-flex items-center gap-1 text-xs text-gold hover:underline font-semibold"
                    >
                      <span>View Destination</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {/* Attractions Markers */}
        {attractions.map((attraction, idx) => {
          if (!attraction.coordinates?.lat || !attraction.coordinates?.lng) return null;
          return (
            <Marker
              key={idx}
              position={[attraction.coordinates.lat, attraction.coordinates.lng]}
              icon={createAttractionIcon()}
            >
              <Popup>
                <div className="p-1 min-w-[180px]">
                  <span className="text-[10px] uppercase tracking-wider text-gold font-semibold">
                    Attraction
                  </span>
                  <h4 className="font-serif font-bold text-sm text-white mb-1">
                    {attraction.name}
                  </h4>
                  {attraction.description && (
                    <p className="text-xs text-gray-300">
                      {attraction.description}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default InteractiveMap;
