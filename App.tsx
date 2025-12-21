
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
  ExternalLink,
  Ticket
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

const MapInvalidator = () => {
  const map = useMap();
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    const container = map.getContainer();
    resizeObserver.observe(container);

    // Force initial invalidation
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => {
      resizeObserver.disconnect();
    };
  }, [map]);
  return null;
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'map' | 'itinerary' | 'export' | 'booking' | 'flight'>('map');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showWeather, setShowWeather] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [itineraryFilter, setItineraryFilter] = useState<number | 'all'>('all');
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
        <div className="fixed inset-0 bg-black/30 z-[900] md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`
        fixed md:relative z-[1000] h-full w-80 bg-white border-r shadow-xl transition-all duration-300
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
                            {event.booking && (
                              <div className="flex items-center gap-1 mt-1 text-[10px] text-amber-600 font-medium bg-amber-50 px-1.5 py-0.5 rounded w-fit">
                                <Ticket size={10} />
                                <span>已預訂</span>
                              </div>
                            )}
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
            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg overflow-x-auto no-scrollbar">
              <button onClick={() => setActiveTab('map')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'map' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}>
                <MapIcon size={16} /> <span className="hidden sm:inline">地圖視圖</span>
              </button>
              <button onClick={() => setActiveTab('itinerary')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'itinerary' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}>
                <FileText size={16} /> <span className="hidden sm:inline">行程細節</span>
              </button>
              <button onClick={() => setActiveTab('booking')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'booking' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}>
                <Ticket size={16} /> <span className="hidden sm:inline">住宿預訂</span>
              </button>
              <button onClick={() => setActiveTab('flight')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'flight' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}>
                <Plane size={16} /> <span className="hidden sm:inline">機票資訊</span>
              </button>
              <button onClick={() => setActiveTab('export')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'export' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}>
                <Download size={16} /> <span className="hidden sm:inline">匯出資料</span>
              </button>
            </div>
          </div>
          <button
            onClick={() => setShowWeather(!showWeather)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-bold transition-all shadow-sm shrink-0 ${showWeather ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
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
                <MapInvalidator />
                <style>{`
                  .leaflet-popup-content-wrapper {
                    padding: 0 !important;
                    overflow: hidden;
                    border-radius: 16px !important;
                  }
                  .leaflet-popup-content {
                    margin: 0 !important;
                    width: auto !important;
                  }
                  .leaflet-popup-close-button {
                    top: 12px !important;
                    right: 12px !important;
                    color: #64748b !important;
                    font-size: 16px !important;
                  }
                `}</style>

                {currentDayData && (
                  <React.Fragment>
                    {currentDayData.events.map((event, eventIdx) => (
                      <Marker key={event.id} position={[event.lat, event.lng]} icon={createCustomIcon(currentDayData.color, eventIdx + 1)}>
                        <Popup>
                          <div className="p-4 min-w-[240px]">
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                              <span className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-black text-white shadow-sm" style={{ backgroundColor: currentDayData.color }}>{eventIdx + 1}</span>
                              <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-0.5">Day {currentDayData.day}</span>
                                <span className="text-sm font-mono font-bold text-slate-700 leading-none">{event.time}</span>
                              </div>
                            </div>
                            <h3 className="font-bold text-base leading-tight text-slate-800 mb-1">{event.location}</h3>
                            <div className="flex items-center gap-1.5 text-slate-500 mb-4">
                              {getEventIcon(event.type)}
                              <span className="text-xs font-medium">{event.activity}</span>
                            </div>
                            {event.booking && (
                              <div className="mb-4 bg-amber-50 border border-amber-100 rounded-xl p-3">
                                <div className="flex items-center gap-1.5 text-amber-700 font-bold text-xs mb-2">
                                  <Ticket size={14} />
                                  <span>預訂資訊</span>
                                </div>
                                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] text-slate-600">
                                  <div className="text-slate-400">預約編號</div>
                                  <div className="font-mono font-bold">{event.booking.number}</div>
                                  <div className="text-slate-400">金額</div>
                                  <div className="font-bold">{event.booking.price}</div>
                                </div>
                              </div>
                            )}
                            <a
                              href={getGoogleMapsUrl(event.location, event.lat, event.lng)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 w-full py-3 bg-slate-900 hover:bg-black text-white text-sm font-bold rounded-xl transition-all shadow-lg hover:shadow-xl no-underline active:scale-95"
                            >
                              <MapIcon size={16} />
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

                {/* Day Filter Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <button
                    onClick={() => setItineraryFilter('all')}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${itineraryFilter === 'all' ? 'bg-slate-800 text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                  >
                    全部行程
                  </button>
                  {ITINERARY_DATA.map(day => (
                    <button
                      key={day.day}
                      onClick={() => setItineraryFilter(day.day)}
                      className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${itineraryFilter === day.day ? 'text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                      style={itineraryFilter === day.day ? { backgroundColor: day.color } : {}}
                    >
                      Day {day.day}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                  {weatherData.map(w => (
                    <button
                      key={w.day}
                      onClick={() => setItineraryFilter(w.day)}
                      className={`p-3 border rounded-xl flex flex-col items-center justify-center text-center transition-all ${itineraryFilter === w.day ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-slate-50 hover:bg-slate-100'}`}
                    >
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Day {w.day}</span>
                      <div className="my-1">{w.icon}</div>
                      <span className="text-xs font-bold text-slate-700">{w.temp}</span>
                      <span className="text-[10px] text-slate-500">{w.desc}</span>
                    </button>
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
                      {ITINERARY_DATA
                        .filter(day => itineraryFilter === 'all' || day.day === itineraryFilter)
                        .flatMap(day => day.events.map((e, i) => ({ ...e, dayColor: day.color, order: i + 1, dayIdx: day.day })))
                        .map((event, idx) => {
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
                                {event.booking && (
                                  <div className="mt-2 bg-slate-50 border border-slate-200 rounded-lg p-2.5">
                                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-200">
                                      <div className="bg-amber-100 text-amber-700 p-1 rounded">
                                        <Ticket size={14} />
                                      </div>
                                      <span className="text-xs font-bold text-slate-700">住宿預訂詳情</span>
                                      <span className="ml-auto text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">
                                        {event.booking.provider}
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                                      <div>
                                        <div className="text-[10px] text-slate-400 mb-0.5">預約編號</div>
                                        <div className="font-mono font-bold text-slate-700">{event.booking.number}</div>
                                      </div>
                                      <div>
                                        <div className="text-[10px] text-slate-400 mb-0.5">支付金額</div>
                                        <div className="font-bold text-slate-700">{event.booking.price}</div>
                                      </div>
                                      <div>
                                        <div className="text-[10px] text-slate-400 mb-0.5">付款方式</div>
                                        <div className="text-slate-700">{event.booking.payment}</div>
                                      </div>
                                      <div>
                                        <div className="text-[10px] text-slate-400 mb-0.5">入住期間</div>
                                        <div className="text-slate-700">{event.booking.period}</div>
                                      </div>
                                    </div>
                                  </div>
                                )}
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

          {activeTab === 'booking' && (
            <div className="absolute inset-0 bg-white overflow-y-auto p-6 md:p-10">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-800">
                  <Ticket className="text-amber-600" /> 住宿預訂管理
                </h2>
                <div className="space-y-6">
                  {ITINERARY_DATA.flatMap(day =>
                    day.events.filter(e => e.booking).map(e => ({ ...e, dayColor: day.color, dayIdx: day.day }))
                  ).map((event, idx) => (
                    <div key={idx} className="border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all bg-white">
                      <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-0.5 rounded text-xs font-bold text-slate-900 bg-white">Day {event.dayIdx}</span>
                          <h3 className="font-bold text-lg">{event.location}</h3>
                        </div>
                        <div className="text-xs bg-white/20 px-2 py-1 rounded">{event.booking?.status || 'Confirmed'}</div>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <div>
                              <div className="text-xs text-slate-400 uppercase font-bold mb-1">預約編號</div>
                              <div className="text-2xl font-mono font-black text-slate-800 tracking-tight">{event.booking?.number}</div>
                            </div>
                            <div>
                              <div className="text-xs text-slate-400 uppercase font-bold mb-1">入住期間</div>
                              <div className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                <Calendar size={14} />
                                {event.booking?.period}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-slate-400 uppercase font-bold mb-1">人數</div>
                              <div className="text-sm font-medium text-slate-700">{event.booking?.people} 名</div>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <div className="text-xs text-slate-400 uppercase font-bold mb-1">支付金額</div>
                              <div className="text-2xl font-bold text-amber-600">{event.booking?.price}</div>
                            </div>
                            <div>
                              <div className="text-xs text-slate-400 uppercase font-bold mb-1">付款方式</div>
                              <div className="text-sm font-medium text-slate-700">{event.booking?.payment}</div>
                            </div>
                            <div>
                              <div className="text-xs text-slate-400 uppercase font-bold mb-1">訂房來源</div>
                              <div className="text-sm font-medium text-slate-700">{event.booking?.provider}</div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-6 pt-6 border-t flex justify-end">
                          <a
                            href={getGoogleMapsUrl(event.location, event.lat, event.lng)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-colors"
                          >
                            <MapIcon size={16} />
                            查看地圖位置
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'flight' && (
            <div className="absolute inset-0 bg-white overflow-y-auto p-6 md:p-10">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-800">
                  <Plane className="text-emerald-600" /> 機票資訊
                </h2>
                <div className="space-y-6">
                  {ITINERARY_DATA.flatMap(day =>
                    day.events.filter(e => e.flight).map(e => ({ ...e, dayColor: day.color, dayIdx: day.day }))
                  ).map((event, idx) => (
                    <div key={idx} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
                      {/* Header */}
                      <div className="bg-emerald-600 text-white p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2 font-bold">
                          <Plane size={20} />
                          <span>{event.flight?.airline}</span>
                        </div>
                        <div className="text-sm font-mono bg-white/20 px-2 py-1 rounded">
                          {event.flight?.flightNumber}
                        </div>
                      </div>

                      {/* Body */}
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
                          <div className="text-center md:text-left">
                            <div className="text-4xl font-black text-slate-800 mb-1">{event.flight?.departureAirport.split(' ')[0]}</div>
                            <div className="text-sm text-slate-500 font-medium">{event.flight?.departureAirport.split(' ')[1]}</div>
                            <div className="text-2xl font-bold text-emerald-600 mt-2">{event.flight?.departureTime}</div>
                            <div className="text-xs text-slate-400 mt-1">{event.flight?.terminal}</div>
                          </div>

                          <div className="flex-1 flex flex-col items-center w-full md:w-auto">
                            <div className="text-xs text-slate-400 font-bold mb-1 tracking-wider uppercase">Flight Duration</div>
                            <div className="flex items-center gap-2 w-full justify-center">
                              <div className="h-[2px] bg-slate-200 flex-1 relative">
                                <div className="absolute right-0 -top-1 w-2 h-2 rounded-full bg-slate-300"></div>
                              </div>
                              <Plane className="text-slate-300 rotate-90" size={16} />
                              <div className="h-[2px] bg-slate-200 flex-1 relative">
                                <div className="absolute left-0 -top-1 w-2 h-2 rounded-full bg-slate-300"></div>
                              </div>
                            </div>
                            <div className="text-xs font-bold text-slate-500 mt-1">{event.flight?.duration}</div>
                          </div>

                          <div className="text-center md:text-right">
                            <div className="text-4xl font-black text-slate-800 mb-1">{event.flight?.arrivalAirport.split(' ')[0]}</div>
                            <div className="text-sm text-slate-500 font-medium">{event.flight?.arrivalAirport.split(' ')[1]}</div>
                            <div className="text-2xl font-bold text-emerald-600 mt-2">{event.flight?.arrivalTime}</div>
                            <div className="text-xs text-slate-400 mt-1">Day {event.dayIdx}</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-dashed border-slate-200">
                          <div>
                            <div className="text-xs text-slate-400 uppercase font-bold mb-1">Class</div>
                            <div className="font-medium text-slate-700">{event.flight?.class}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-400 uppercase font-bold mb-1">Baggage</div>
                            <div className="font-medium text-slate-700">{event.flight?.baggage}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-400 uppercase font-bold mb-1">Status</div>
                            <div className="font-bold text-emerald-600">{event.flight?.status}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-400 uppercase font-bold mb-1">Date</div>
                            <div className="font-medium text-slate-700">2026/01/{event.dayIdx === 1 ? '20' : '24'}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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
