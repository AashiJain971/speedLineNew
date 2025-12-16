'use client';

import React, { useState, useRef, useMemo } from 'react';
import { Train, ZoomIn, ZoomOut, RotateCcw, Navigation, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { useNetworkConfig } from '../hooks/useNetworkConfig';
import { useTrainData } from '../hooks/useTrainData';

interface TrainPosition {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: string;
  speed: number;
  destination: string;
  section: string;
}

interface Station {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

interface RouteConnection {
  from: string;
  to: string;
  section: string;
  type: 'single' | 'double' | 'triple';
  capacity: number;
}

const GeographicMap: React.FC = () => {
  const [zoom, setZoom] = useState(50);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedTrain, setSelectedTrain] = useState<string | null>(null);
  const [hoveredTrain, setHoveredTrain] = useState<string | null>(null);
  const mapRef = useRef<SVGSVGElement>(null);

  // Fetch dynamic network config and train data
  const { data: networkConfig, loading: configLoading } = useNetworkConfig();
  const { trainData, isLoading: trainLoading } = useTrainData();

  // Generate stations from network config
  const stations: Station[] = useMemo(() => {
    if (!networkConfig?.stations) return [];
    
    // Generate geographic coordinates for each station (evenly distributed)
    const baseCoords = [
      { lat: 28.6139, lng: 77.2090 }, // STN_A
      { lat: 28.6500, lng: 77.2300 }, // STN_B
      { lat: 28.6400, lng: 77.2800 }, // STN_C
      { lat: 28.6100, lng: 77.3200 }, // STN_D
      { lat: 28.5800, lng: 77.3000 }, // STN_E
      { lat: 28.5500, lng: 77.2500 }, // STN_F
    ];
    
    return networkConfig.stations.map((stationId, index) => ({
      id: stationId,
      name: stationId.replace('_', ' '),
      lat: baseCoords[index % baseCoords.length]?.lat || 28.6,
      lng: baseCoords[index % baseCoords.length]?.lng || 77.2,
    }));
  }, [networkConfig]);

  // Generate route connections from network config sections
  const routes: RouteConnection[] = useMemo(() => {
    if (!networkConfig?.sections) return [];
    
    return networkConfig.sections.map((section) => ({
      from: section.start,
      to: section.end,
      section: section.id,
      type: section.capacity === 1 ? 'single' : section.capacity === 2 ? 'double' : 'triple',
      capacity: section.capacity,
    }));
  }, [networkConfig]);

  // Convert real train data to positions with geographic coordinates
  const trainPositions: TrainPosition[] = useMemo(() => {
    if (!trainData || !Array.isArray(trainData) || !networkConfig?.sections) return [];
    
    return trainData.map((bundle: any) => {
      const train = bundle.train;
      const section = bundle.section;
      
      // Find section config to get start/end stations
      const sectionConfig = networkConfig.sections.find((s) => s.id === section.section_id);
      if (!sectionConfig) return null;
      
      // Find station coordinates
      const startStation = stations.find((s) => s.id === sectionConfig.start);
      const endStation = stations.find((s) => s.id === sectionConfig.end);
      if (!startStation || !endStation) return null;
      
      // Calculate position along the route based on position_m
      const progress = Math.min(1, Math.max(0, train.current_location.position_m / (section.length_km * 1000)));
      const lat = startStation.lat + (endStation.lat - startStation.lat) * progress;
      const lng = startStation.lng + (endStation.lng - startStation.lng) * progress;
      
      return {
        id: train.train_id,
        name: `${train.type} ${train.train_id}`,
        lat,
        lng,
        status: train.status || 'Unknown',
        speed: train.max_speed_kmh || 0,
        destination: train.destination_station || 'Unknown',
        section: section.section_id,
      };
    }).filter(Boolean) as TrainPosition[];
  }, [trainData, networkConfig, stations]);

  // Convert geographic coordinates to SVG coordinates
  const geoToSVG = (lat: number, lng: number) => {
    const minLat = 28.5400;
    const maxLat = 28.6600;
    const minLng = 77.2000;
    const maxLng = 77.3300;
    
    const x = ((lng - minLng) / (maxLng - minLng)) * 800;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 600;
    
    return { x, y };
  };

  // Handle mouse events for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Zoom controls
  const handleZoomIn = () => setZoom(Math.min(zoom + 10, 100));
  const handleZoomOut = () => setZoom(Math.max(zoom - 10, 20));
  const handleReset = () => {
    setZoom(50);
    setPan({ x: 0, y: 0 });
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('on time')) return '#10b981'; // green
    if (statusLower.includes('delay')) return '#f59e0b'; // yellow
    if (statusLower.includes('stop') || statusLower.includes('wait')) return '#ef4444'; // red
    if (statusLower.includes('arrived')) return '#3b82f6'; // blue
    return '#6b7280'; // gray
  };

  const getTrackWidth = (type: string) => {
    switch (type) {
      case 'single': return 2;
      case 'double': return 4;
      case 'triple': return 6;
      default: return 2;
    }
  };

  // Show loading state
  if (configLoading || trainLoading) {
    return (
      <div className="relative w-full h-[700px] bg-white rounded-lg border shadow-sm overflow-hidden flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 text-sm">Loading network topology...</p>
        </div>
      </div>
    );
  }

  // Show error or empty state
  if (!networkConfig || !stations.length || !routes.length) {
    return (
      <div className="relative w-full h-[700px] bg-white rounded-lg border shadow-sm overflow-hidden flex items-center justify-center">
        <div className="text-center space-y-2">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto" />
          <p className="text-gray-600">No network data available</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-[700px] bg-white rounded-lg border shadow-sm overflow-hidden"
      onClick={() => setSelectedTrain(null)}
    >
      {/* Map Container */}
      <svg
        ref={mapRef}
        className="w-full h-full cursor-grab"
        viewBox="0 0 800 600"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {/* Background Grid */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f8fafc" strokeWidth="1"/>
          </pattern>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="1" dy="1" stdDeviation="2" floodOpacity="0.3"/>
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="#fefefe" />
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom / 50})`}>
          {/* Route Connections */}
          {routes.map((route, index) => {
            const fromStation = stations.find(s => s.id === route.from);
            const toStation = stations.find(s => s.id === route.to);
            
            if (!fromStation || !toStation) return null;
            
            const fromPos = geoToSVG(fromStation.lat, fromStation.lng);
            const toPos = geoToSVG(toStation.lat, toStation.lng);
            
            return (
              <g key={index}>
                {/* Route line */}
                <line
                  x1={fromPos.x}
                  y1={fromPos.y}
                  x2={toPos.x}
                  y2={toPos.y}
                  stroke="#d1d5db"
                  strokeWidth={getTrackWidth(route.type)}
                  strokeDasharray={route.capacity === 1 && route.from === 'STN_B' && route.to === 'STN_E' ? "8,4" : "none"}
                  opacity="0.8"
                />
                
                {/* Section label */}
                <text
                  x={(fromPos.x + toPos.x) / 2}
                  y={(fromPos.y + toPos.y) / 2 - 8}
                  textAnchor="middle"
                  className="fill-gray-500 text-xs font-medium"
                  fontSize="11"
                >
                  {route.section}
                </text>
              </g>
            );
          })}

          {/* City/Station Markers */}
          {stations.map((station) => {
            const pos = geoToSVG(station.lat, station.lng);
            return (
              <g key={station.id}>
                {/* Station circle with shadow */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="10"
                  fill="#3b82f6"
                  stroke="#ffffff"
                  strokeWidth="3"
                  filter="url(#shadow)"
                />
                
                {/* Station inner dot */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="4"
                  fill="#ffffff"
                />
                
                {/* Station label */}
                <text
                  x={pos.x}
                  y={pos.y + 28}
                  textAnchor="middle"
                  className="fill-gray-800 font-semibold"
                  fontSize="12"
                >
                  {station.name}
                </text>
                <text
                  x={pos.x}
                  y={pos.y + 42}
                  textAnchor="middle"
                  className="fill-gray-500 text-xs"
                  fontSize="10"
                >
                  {station.id}
                </text>
              </g>
            );
          })}

          {/* Train Positions - sorted to render selected/hovered on top */}
          {trainPositions
            .sort((a, b) => {
              if (selectedTrain === a.id) return 1;
              if (selectedTrain === b.id) return -1;
              if (hoveredTrain === a.id) return 1;
              if (hoveredTrain === b.id) return -1;
              return 0;
            })
            .map((train, index) => {
              const pos = geoToSVG(train.lat, train.lng);
              const isHovered = hoveredTrain === train.id;
              const isSelected = selectedTrain === train.id;
              
              // Add slight offset to prevent complete overlap
              const offsetX = (index % 3 - 1) * 2;
              const offsetY = Math.floor(index / 3) * 2;
              
              return (
                <g
                  key={train.id}
                  onMouseEnter={() => setHoveredTrain(train.id)}
                  onMouseLeave={() => setHoveredTrain(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTrain(selectedTrain === train.id ? null : train.id);
                  }}
                  className="cursor-pointer"
                  style={{ zIndex: isSelected || isHovered ? 1000 : index }}
                >
                  {/* Train marker */}
                  <circle
                    cx={pos.x + offsetX}
                    cy={pos.y + offsetY}
                    r={isSelected ? "12" : isHovered ? "10" : "8"}
                    fill={getStatusColor(train.status)}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? "4" : "3"}
                    className="transition-all duration-200"
                    style={{ transition: 'cx 0.6s linear, cy 0.6s linear, r 0.2s ease' }}
                    filter="url(#shadow)"
                  />
                  
                  {/* Train icon */}
                  <g transform={`translate(${pos.x + offsetX - 5}, ${pos.y + offsetY - 5})`}>
                    <rect width="10" height="10" fill="none" />
                    <path 
                      d="M2 6 L8 6 M3 3 L7 3 M2 7 L8 7"
                      stroke="white" 
                      strokeWidth="1.5" 
                      strokeLinecap="round"
                    />
                  </g>
                  
                  {/* Train ID label */}
                  <text
                    x={pos.x + offsetX}
                    y={pos.y + offsetY - 15}
                    textAnchor="middle"
                    className="fill-gray-800 font-bold pointer-events-none"
                    fontSize={isSelected ? "12" : "10"}
                    fontWeight={isSelected ? "bold" : "normal"}
                    style={{ transition: 'x 0.6s linear, y 0.6s linear' }}
                  >
                    {train.id}
                  </text>
                  
                  {/* Selection/Hover pulse effect */}
                  {(isHovered || isSelected) && (
                    <circle
                      cx={pos.x + offsetX}
                      cy={pos.y + offsetY}
                      r={isSelected ? "16" : "14"}
                      fill="none"
                      stroke={getStatusColor(train.status)}
                      strokeWidth="2"
                      opacity={isSelected ? "0.8" : "0.6"}
                      className={isSelected ? "animate-ping" : "animate-pulse"}
                    />
                  )}
                </g>
              );
            })}
        </g>
      </svg>

      {/* Floating Control Overlays */}
      <div className="absolute top-6 right-6 bg-white rounded-lg shadow-lg border p-3 space-y-2">
        <div className="text-xs text-gray-500 font-medium mb-2 text-center">Map Controls</div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleZoomIn}
          className="w-full hover:bg-blue-50 hover:border-blue-200"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleZoomOut}
          className="w-full hover:bg-blue-50 hover:border-blue-200"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleReset}
          className="w-full hover:bg-blue-50 hover:border-blue-200"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Minimalist Navigation Legend */}
      <div className="absolute bottom-6 left-6 bg-white rounded-lg shadow-lg border p-4 space-y-3 max-w-[200px]">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
          <Navigation className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-semibold text-gray-800">Network Legend</span>
        </div>
        
        <div className="space-y-2.5 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-sm flex-shrink-0"></div>
            <span className="text-gray-700">City Stations</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm flex-shrink-0"></div>
            <span className="text-gray-700">On Time</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-sm flex-shrink-0"></div>
            <span className="text-gray-700">Delayed</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-red-500 rounded-full shadow-sm flex-shrink-0"></div>
            <span className="text-gray-700">Stopped/Waiting</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-0.5 bg-gray-400 flex-shrink-0"></div>
            <span className="text-gray-700">Single Track</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-1 bg-gray-400 flex-shrink-0"></div>
            <span className="text-gray-700">Double Track</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-1.5 bg-gray-400 flex-shrink-0"></div>
            <span className="text-gray-700">Triple Track</span>
          </div>
          <div className="flex items-center gap-3">
            <svg width="32" height="4" className="flex-shrink-0">
              <line x1="0" y1="2" x2="32" y2="2" stroke="#9ca3af" strokeWidth="2" strokeDasharray="4,2"/>
            </svg>
            <span className="text-gray-700">Bypass Route</span>
          </div>
          <div className="pt-2 border-t border-gray-100 text-gray-500 italic text-[10px]">
            Hover for quick info • Click for details
          </div>
        </div>
      </div>

      {/* Hover Tooltip - Matches the green card design from reference image */}
      {hoveredTrain && (() => {
        const train = trainPositions.find(t => t.id === hoveredTrain);
        if (!train) return null;
        
        // Get current section info from network config
        const sectionInfo = networkConfig?.sections?.find(s => s.id === train.section);
        const trainBundle = trainData?.find((b: any) => b.train?.train_id === train.id);
        const trainDetails = trainBundle?.train;
        
        return (
          <div 
            className="absolute top-6 left-1/2 transform -translate-x-1/2 pointer-events-none z-[60]"
            style={{ animation: 'fadeIn 0.15s ease-in' }}
          >
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-2xl p-4 min-w-[280px] max-w-[320px] border-2 border-white">
              {/* Header with Train ID and Type */}
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-green-400/30">
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 rounded-lg px-3 py-1.5 backdrop-blur-sm">
                    <span className="font-bold text-white text-lg tracking-wide">{train.id}</span>
                  </div>
                  <div className="bg-white/90 rounded-md px-2.5 py-0.5">
                    <span className="font-semibold text-green-700 text-xs uppercase tracking-wider">
                      {trainDetails?.type || train.name.split(' ')[0]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Train Details Grid */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-green-100 font-medium">Current Section:</span>
                  <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded">{train.section}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-green-100 font-medium">Destination:</span>
                  <span className="font-bold text-white">{train.destination}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-green-100 font-medium">Status:</span>
                  <div className="flex items-center gap-1.5">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getStatusColor(train.status) }}
                    ></div>
                    <span className="font-semibold text-white text-xs">{train.status}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-green-100 font-medium">Max Speed:</span>
                  <span className="font-bold text-white">{train.speed} km/h</span>
                </div>

                {sectionInfo && (
                  <div className="pt-2 mt-2 border-t border-green-400/30 text-xs text-green-100">
                    <div className="flex justify-between">
                      <span>Section Length:</span>
                      <span className="text-white font-semibold">{sectionInfo.length_km} km</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Train Details Popup - Click to view (detailed view) */}
      {selectedTrain && (() => {
        const train = trainPositions.find(t => t.id === selectedTrain);
        if (!train) return null;
        
        return (
          <div 
            className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-2xl border-2 border-blue-200 p-5 min-w-[300px] max-w-[400px] z-50 animate-in fade-in slide-in-from-top-4 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b-2 border-gray-100 pb-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-5 h-5 rounded-full shadow-md ring-2 ring-white"
                    style={{ backgroundColor: getStatusColor(train.status) }}
                  ></div>
                  <span className="font-bold text-gray-900 text-lg">{train.name}</span>
                </div>
                <button
                  onClick={() => setSelectedTrain(null)}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded transition-colors"
                  title="Close"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="text-sm text-gray-600 space-y-2.5">
                <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-lg">
                  <span className="text-gray-500 font-medium">Train ID:</span>
                  <span className="font-bold text-gray-900">{train.id}</span>
                </div>
                <div className="flex justify-between items-center bg-blue-50 p-2.5 rounded-lg">
                  <span className="text-gray-500 font-medium">Status:</span>
                  <span 
                    className="font-semibold px-2 py-1 rounded text-white text-xs"
                    style={{ backgroundColor: getStatusColor(train.status) }}
                  >
                    {train.status}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-lg">
                  <span className="text-gray-500 font-medium">Speed:</span>
                  <span className="font-semibold text-gray-900">{train.speed} km/h</span>
                </div>
                <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-lg">
                  <span className="text-gray-500 font-medium">Destination:</span>
                  <span className="font-semibold text-gray-900">{train.destination}</span>
                </div>
                <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-lg">
                  <span className="text-gray-500 font-medium">Section:</span>
                  <span className="font-semibold text-gray-900">{train.section}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Zoom Level Indicator */}
      <div className="absolute bottom-6 right-6 bg-white rounded-lg shadow-lg border px-3 py-2">
        <div className="flex items-center gap-2">
          <MapPin className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-600 font-medium">Zoom: {zoom}%</span>
        </div>
      </div>
    </div>
  );
};

export default GeographicMap;