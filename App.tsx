
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  Calendar,
  Map as MapIcon,
  FileText,
  Download,
  Menu,
  X,
  Plane,
  Car,
  Utensils,
  Bed,
  Camera,
  ShoppingBag,
  ChevronRight,
  Info,
  Sun,
  CloudSnow,
  Thermometer,
  Wind,
  ExternalLink
} from 'lucide-react';
import { ITINERARY_DATA } from './constants';
import { fetchWeatherData } from './weatherService';
import { DayPlan, TripEvent, WeatherData } from './types';

// Initial empty state or loading state could be handled, but for now we start empty


const createCustomIcon = (color: string, index: number) => {
  return new L.DivIcon({
    html: `
      <div style="
        background-color: ${color}; 
        width: 26px; 
        height: 26px; 
        border: 2px solid white; 
        border-radius: 50%; 
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 800;
        font-size: 13px;
        font-family: 'Inter', system-ui, sans-serif;
      ">
        ${index}
      </div>`,
    className: 'custom-div-icon',
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -13]
  });
};

const MapController = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'map' | 'itinerary' | 'export'>('map');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showWeather, setShowWeather] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [mapConfig, setMapConfig] = useState<{ center: [number, number], zoom: number }>({
    center: [35.6895, 139.6917],
    zoom: 10
  });

  useEffect(() => {
    const loadWeather = async () => {
      const data = await fetchWeatherData(ITINERARY_DATA);
      setWeatherData(data);
    };
    loadWeather();
  }, []);

  const getGoogleMapsUrl = (location: string, lat: number, lng: number) => {
    const query = encodeURIComponent(`${location} ${lat},${lng}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  const handleFocusLocation = (event: TripEvent) => {
    setSelectedDay(event.day);
    setMapConfig({ center: [event.lat, event.lng], zoom: 15 });
    if (window.innerWidth < 768) setSidebarOpen(false);
    setActiveTab('map');
  };

  const currentDayData = useMemo(() => {
    return ITINERARY_DATA.find(d => d.day === selectedDay);
  }, [selectedDay]);

  // Update map bounds when day changes if not already focused on a specific point
  useEffect(() => {
    if (currentDayData && currentDayData.events.length > 0) {
      const firstEvent = currentDayData.events[0];
      setMapConfig({ center: [firstEvent.lat, firstEvent.lng], zoom: 11 });
    }
  }, [selectedDay, currentDayData]);

  const generateMarkdown = () => {
    let md = '| Day | 序號 | 時間 | 地點/活動 | Google Map | 備註/天氣預測 |\n';
    md += '| --- | --- | --- | --- | --- | --- |\n';
    ITINERARY_DATA.forEach(day => {
      const weather = weatherData.find(w => w.day === day.day);
      day.events.forEach((event, idx) => {
        md += `| Day ${day.day} | ${idx + 1} | ${event.time} | ${event.location} (${event.activity}) | [開啟地圖](${getGoogleMapsUrl(event.location, event.lat, event.lng)}) | ${weather?.temp} ${weather?.desc} - ${event.notes} |\n`;
      });
    });
    return md;
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'flight': return <Plane size={16} />;
      case 'transport': return <Car size={16} />;
      case 'food': return <Utensils size={16} />;
      case 'stay': return <Bed size={16} />;
      case 'sightseeing': return <Camera size={16} />;
      case 'shopping': return <ShoppingBag size={16} />;
      default: return <Info size={16} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`
        fixed md:relative z-50 h-full w-80 bg-white border-r shadow-xl transition-all duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:w-0 md:opacity-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex justify-between items-center bg-slate-900 text-white">
            <div>
              <h1 className="text-xl font-bold">2026 東京富士山</h1>
              <p className="text-xs text-slate-400 tracking-wide">智能行程 & 氣候分析</p>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 hover:bg-slate-800 rounded">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-4 bg-slate-50">
            {ITINERARY_DATA.map(day => {
              const weather = weatherData.find(w => w.day === day.day);
              const isActiveDay = selectedDay === day.day;
              return (
                <div
                  key={day.day}
                  className={`rounded-xl border bg-white overflow-hidden shadow-sm hover:shadow-md transition-all ${isActiveDay ? 'ring-2 ring-offset-2 ring-slate-400' : ''}`}
                >
                  <div className="p-3 font-bold text-white flex items-center justify-between" style={{ backgroundColor: day.color }}>
                    <div className="flex items-center gap-2">
                      <Calendar size={18} />
                      <span>Day {day.day}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-black/20 px-2 py-0.5 rounded text-[11px] font-normal backdrop-blur-sm">
                      {weather?.icon}
                      <span>{weather?.temp}</span>
                    </div>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {day.events.map((event, index) => (
                      <div key={event.id} className="group relative">
                        <button
                          onClick={() => handleFocusLocation(event)}
                          className="w-full p-3 text-left hover:bg-slate-50 flex gap-3 transition-colors items-start pr-10"
                        >
                          <div className="flex flex-col items-center min-w-[32px]">
                            <span className="text-[11px] font-bold h-6 w-6 rounded-full flex items-center justify-center border text-white mb-1 shadow-sm" style={{ backgroundColor: day.color, borderColor: 'white' }}>
                              {index + 1}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">{event.time}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold flex items-center justify-between gap-1">
                              <span className="truncate">{event.location}</span>
                              <span className="text-slate-300 group-hover:text-slate-600 shrink-0">
                                {getEventIcon(event.type)}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 truncate">{event.activity}</div>
                          </div>
                        </button>
                        <a
                          href={getGoogleMapsUrl(event.location, event.lat, event.lng)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-blue-600 transition-colors bg-white/50 rounded-lg hover:bg-blue-50"
                          title="在 Google 地圖中開啟"
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative min-w-0">
        <header className="h-14 bg-white border-b flex items-center justify-between px-4 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors border shadow-sm">
                <Menu size={20} />
              </button>
            )}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
              <button onClick={() => setActiveTab('map')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'map' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}>
                <MapIcon size={16} /> <span className="hidden sm:inline">地圖視圖</span>
              </button>
              <button onClick={() => setActiveTab('itinerary')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'itinerary' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}>
                <FileText size={16} /> <span className="hidden sm:inline">行程細節</span>
              </button>
              <button onClick={() => setActiveTab('export')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'export' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}>
                <Download size={16} /> <span className="hidden sm:inline">匯出資料</span>
              </button>
            </div>
          </div>
          <button
            onClick={() => setShowWeather(!showWeather)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-bold transition-all shadow-sm ${showWeather ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
          >
            <CloudSnow size={16} />
            <span className="hidden sm:inline">氣候預測</span>
          </button>
        </header>

        <div className="flex-1 relative overflow-hidden">
          {activeTab === 'map' && (
            <>
              {/* Day Selector Bar inside Map Area */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[500] bg-white/90 backdrop-blur-md px-2 py-1.5 rounded-2xl shadow-xl border border-white/50 flex gap-1">
                {ITINERARY_DATA.map(day => (
                  <button
                    key={`selector-${day.day}`}
                    onClick={() => setSelectedDay(day.day)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedDay === day.day ? 'text-white shadow-lg scale-105' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
                    style={selectedDay === day.day ? { backgroundColor: day.color } : {}}
                  >
                    Day {day.day}
                  </button>
                ))}
              </div>

              <MapContainer center={mapConfig.center} zoom={mapConfig.zoom} scrollWheelZoom={true} className="z-0">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapController center={mapConfig.center} zoom={mapConfig.zoom} />

                {currentDayData && (
                  <React.Fragment>
                    {currentDayData.events.map((event, eventIdx) => (
                      <Marker key={event.id} position={[event.lat, event.lng]} icon={createCustomIcon(currentDayData.color, eventIdx + 1)}>
                        <Popup>
                          <div className="p-1 min-w-[200px]">
                            <div className="flex items-center gap-2 mb-2 pb-1 border-b border-slate-100">
                              <span className="h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-black text-white" style={{ backgroundColor: currentDayData.color }}>{eventIdx + 1}</span>
                              <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-0.5">Day {currentDayData.day}</span>
                                <span className="text-xs font-mono font-bold text-slate-600 leading-none">{event.time}</span>
                              </div>
                            </div>
                            <h3 className="font-bold text-sm leading-tight text-slate-800">{event.location}</h3>
                            <div className="flex items-center gap-1.5 mt-1 text-slate-500 mb-4">
                              {getEventIcon(event.type)}
                              <span className="text-xs font-medium">{event.activity}</span>
                            </div>
                            <a
                              href={getGoogleMapsUrl(event.location, event.lat, event.lng)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-md no-underline active:scale-95"
                            >
                              <MapIcon size={14} />
                              Google 地圖開啟
                            </a>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                    <Polyline
                      positions={currentDayData.events.map(e => [e.lat, e.lng])}
                      pathOptions={{ color: currentDayData.color, weight: 4, opacity: 0.7, dashArray: '10, 10' }}
                    />
                  </React.Fragment>
                )}
              </MapContainer>

              {/* Weather Forecast Overlay Widget */}
              {showWeather && (
                <div className="absolute top-20 right-4 z-[400] w-72 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50 p-4 transition-all animate-in fade-in slide-in-from-top-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <Thermometer className="text-red-500" size={18} />
                      1 月平均氣候預測
                      {weatherData.some(w => w.isHistorical) && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200">
                          2025 歷史資料
                        </span>
                      )}
                    </h3>
                    <button onClick={() => setShowWeather(false)} className="text-slate-400 hover:text-slate-600">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {weatherData.map((w) => (
                      <div key={w.day} className="flex items-center justify-between p-2 rounded-lg bg-slate-50/50 hover:bg-slate-100/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-slate-400 w-8">D{w.day}</span>
                          {w.icon}
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-slate-700">{w.temp}</div>
                          <div className="text-[10px] text-slate-400">{w.desc} | 富士能見度: {w.fujiVisibility}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'itinerary' && (
            <div className="absolute inset-0 bg-white overflow-y-auto p-6 md:p-10">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-800">
                  <FileText className="text-blue-600" /> 詳細行程細節
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                  {weatherData.map(w => (
                    <div key={w.day} className="p-3 border rounded-xl flex flex-col items-center justify-center bg-slate-50 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Day {w.day}</span>
                      <div className="my-1">{w.icon}</div>
                      <span className="text-xs font-bold text-slate-700">{w.temp}</span>
                      <span className="text-[10px] text-slate-500">{w.desc}</span>
                    </div>
                  ))}
                </div>
                <div className="border rounded-xl overflow-hidden shadow-sm">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Day</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">時間</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">地點/活動</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">氣候/備註</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {ITINERARY_DATA.flatMap(day => day.events.map((e, i) => ({ ...e, dayColor: day.color, order: i + 1, dayIdx: day.day }))).map((event, idx) => {
                        const weather = weatherData.find(w => w.day === event.dayIdx);
                        return (
                          <tr key={`row-${idx}`} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap text-xs font-bold">
                              <span className="px-2 py-0.5 rounded text-white" style={{ backgroundColor: event.dayColor }}>
                                Day {event.dayIdx}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500 font-mono">{event.time}</td>
                            <td className="px-4 py-3 text-sm text-slate-900">
                              <div className="flex items-center gap-2 font-semibold">
                                {event.location}
                                <a
                                  href={getGoogleMapsUrl(event.location, event.lat, event.lng)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:text-blue-700"
                                >
                                  <ExternalLink size={12} />
                                </a>
                              </div>
                              <div className="text-xs text-slate-500 mt-0.5">{event.activity}</div>
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-500 italic">
                              <div className="flex items-center gap-1 text-[11px] text-blue-500 mb-1 font-bold">
                                {weather?.icon} {weather?.temp}
                              </div>
                              {event.notes}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="absolute inset-0 bg-white overflow-y-auto p-6 md:p-10">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <Download className="text-blue-600" /> 資料匯出 (包含天氣資訊)
                </h2>
                <div className="bg-slate-50 border rounded-xl p-6 overflow-x-auto font-mono text-[13px] text-slate-600">
                  {generateMarkdown().split('\n').map((line, i) => <div key={i}>{line}</div>)}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
