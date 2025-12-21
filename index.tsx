
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
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
  ExternalLink,
  Navigation
} from 'lucide-react';

// --- Types ---
interface TripEvent {
  id: string;
  time: string;
  location: string;
  activity: string;
  notes: string;
  lat: number;
  lng: number;
  day: number;
  type: 'flight' | 'transport' | 'food' | 'stay' | 'sightseeing' | 'shopping';
}

interface DayPlan {
  day: number;
  date: string;
  title: string;
  color: string;
  events: TripEvent[];
}

// --- Constants ---
const ITINERARY_DATA: DayPlan[] = [
  {
    day: 1,
    date: '2026/01/20 (二)',
    title: '抵達、燈飾與壽司迎賓',
    color: '#ef4444',
    events: [
      { id: '1-1', day: 1, time: '12:00', location: '成田機場 (NRT)', activity: '抵達機場', notes: '第一航廈', lat: 35.772, lng: 140.392, type: 'flight' },
      { id: '1-2', day: 1, time: '13:30', location: 'ORIX 租車成田機場店', activity: '取車手續', notes: '準備自駕之旅', lat: 35.765, lng: 140.385, type: 'transport' },
      { id: '1-3', day: 1, time: '15:30', location: '讀賣樂園', activity: '寶石燈飾秀', notes: '必看絕美點燈', lat: 35.625, lng: 139.517, type: 'sightseeing' },
      { id: '1-4', day: 1, time: '20:00', location: '梅丘壽司之美登利', activity: '晚餐', notes: '新百合之丘OPA店', lat: 35.602, lng: 139.508, type: 'food' },
      { id: '1-5', day: 1, time: '21:30', location: 'Hotel Molino Shin-Yuri', activity: '住宿 Check-in', notes: '首晚歇息', lat: 35.602, lng: 139.508, type: 'stay' }
    ]
  },
  {
    day: 2,
    date: '2026/01/21 (三)',
    title: '富士野生動物園全制霸',
    color: '#3b82f6',
    events: [
      { id: '2-0', day: 2, time: '08:00', location: 'Hotel Molino Shin-Yuri', activity: '飯店出發', notes: '自駕往御殿場方向', lat: 35.602, lng: 139.508, type: 'stay' },
      { id: '2-1', day: 2, time: '09:30', location: '富士野生動物園', activity: '叢林巴士、自駕Safari', notes: '親近野生動物', lat: 35.247, lng: 138.838, type: 'sightseeing' },
      { id: '2-2', day: 2, time: '17:00', location: '御殿場 Premium Outlets', activity: '逛街購物', notes: '精品與風景', lat: 35.308, lng: 138.966, type: 'shopping' },
      { id: '2-3', day: 2, time: '21:00', location: '木之花之湯', activity: '溫泉享受', notes: '放鬆身心', lat: 35.305, lng: 138.968, type: 'sightseeing' },
      { id: '2-4', day: 2, time: '22:00', location: 'HOTEL CLAD', activity: '住宿', notes: '御殿場住宿', lat: 35.308, lng: 138.966, type: 'stay' }
    ]
  },
  {
    day: 3,
    date: '2026/01/22 (四)',
    title: '圍爐裏燒烤與新宿之夜',
    color: '#22c55e',
    events: [
      { id: '3-0', day: 3, time: '08:30', location: 'HOTEL CLAD', activity: '飯店出發', notes: '往山中湖', lat: 35.308, lng: 138.966, type: 'stay' },
      { id: '3-1', day: 3, time: '09:30', location: '山中湖 KABA BUS', activity: '水陸巴士', notes: '湖上體驗', lat: 35.423, lng: 138.875, type: 'sightseeing' },
      { id: '3-2', day: 3, time: '11:30', location: '新倉山淺間公園', activity: '參拜/拍照', notes: '忠靈塔必拍', lat: 35.491, lng: 138.804, type: 'sightseeing' },
      { id: '3-3', day: 3, time: '13:00', location: '山麓園 Sanrokuen', activity: '午餐', notes: '傳統圍爐裏燒烤', lat: 35.485, lng: 138.773, type: 'food' },
      { id: '3-4', day: 3, time: '16:30', location: '西鐵 Inn 新宿', activity: '還車/Check-in', notes: '入住西鐵 Inn', lat: 35.694, lng: 139.695, type: 'stay' },
      { id: '3-5', day: 3, time: '17:00', location: '東京都廳 南展望室', activity: '賞夜景', notes: '免費俯瞰東京', lat: 35.689, lng: 139.691, type: 'sightseeing' },
      { id: '3-6', day: 3, time: '18:30', location: '牛舌の檸檬', activity: '晚餐', notes: '極厚切牛舌', lat: 35.693, lng: 139.698, type: 'food' },
      { id: '3-7', day: 3, time: '20:00', location: '回憶橫丁', activity: '夜生活', notes: '昭和風情街', lat: 35.693, lng: 139.699, type: 'sightseeing' },
      { id: '3-8', day: 3, time: '20:30', location: '歌舞伎町', activity: '夜生活', notes: '哥吉拉頭地標', lat: 35.694, lng: 139.702, type: 'sightseeing' },
      { id: '3-9', day: 3, time: '21:30', location: '西鐵 Inn 新宿', activity: '住宿', notes: '返回飯店休息', lat: 35.694, lng: 139.695, type: 'stay' }
    ]
  },
  {
    day: 4,
    date: '2026/01/23 (五)',
    title: '強運、行軍與頂級牛排',
    color: '#a855f7',
    events: [
      { id: '4-0', day: 4, time: '07:30', location: '西鐵 Inn 新宿', activity: '飯店出發', notes: '步行至新宿西口站 (E01)', lat: 35.694, lng: 139.695, type: 'stay' },
      { id: '4-1', day: 4, time: '08:00', location: '築地場外市場', activity: '吃早餐', notes: '搭乘都營大江戶線至 築地市場站 (E18) A1出口', lat: 35.665, lng: 139.771, type: 'food' },
      { id: '4-2', day: 4, time: '09:30', location: '小網神社', activity: '參拜', notes: '步行至築地站 (H10) 搭日比谷線至 人形町站 (H13) A2出口', lat: 35.685, lng: 139.777, type: 'sightseeing' },
      { id: '4-3', day: 4, time: '11:00', location: '銀座 炸豬排 檍', activity: '午餐', notes: '人形町站 (H13) 搭日比谷線至 銀座站 (H08)', lat: 35.669, lng: 139.761, type: 'food' },
      { id: '4-4', day: 4, time: '12:30', location: '皇居二重橋', activity: '散步', notes: '銀座站 (H08) 搭日比谷線至 日比谷站 (H07) 步行前往', lat: 35.679, lng: 139.758, type: 'sightseeing' },
      { id: '4-5', day: 4, time: '14:30', location: '宮下公園', activity: '散步/咖啡', notes: '二重橋前站 (C10) 搭千代田線至 明治神宮前站 (C03) 步行', lat: 35.662, lng: 139.702, type: 'sightseeing' },
      { id: '4-6', day: 4, time: '16:00', location: 'SHIBUYA SKY', activity: '賞夕陽夜景', notes: '步行前往 (需預約)', lat: 35.658, lng: 139.702, type: 'sightseeing' },
      { id: '4-7', day: 4, time: '17:30', location: 'AND THE FRIET', activity: '點心', notes: '澀谷 Hikarie B2F', lat: 35.658, lng: 139.703, type: 'food' },
      { id: '4-8', day: 4, time: '18:30', location: 'Peter Luger Steakhouse', activity: '頂級晚餐', notes: '澀谷站 搭 JR 山手線至 惠比壽站，步行前往', lat: 35.643, lng: 139.715, type: 'food' },
      { id: '4-9', day: 4, time: '21:00', location: '西鐵 Inn 新宿', activity: '住宿', notes: '惠比壽站 搭 JR 山手線至 新宿站', lat: 35.694, lng: 139.695, type: 'stay' }
    ]
  },
  {
    day: 5,
    date: '2026/01/24 (六)',
    title: '招財貓、吉祥寺與返台',
    color: '#f97316',
    events: [
      { id: '5-0', day: 5, time: '07:00', location: '西鐵 Inn 新宿', activity: '飯店出發', notes: '新宿站 搭 JR 山手線至 原宿站 (表參道口)', lat: 35.694, lng: 139.695, type: 'stay' },
      { id: '5-1', day: 5, time: '07:30', location: '明治神宮', activity: '晨間散步', notes: '步行前往', lat: 35.676, lng: 139.699, type: 'sightseeing' },
      { id: '5-2', day: 5, time: '09:00', location: '豪德寺', activity: '參拜', notes: '明治神宮前站 (C03) 搭千代田線(直通小田急) 至 豪德寺站', lat: 35.648, lng: 139.647, type: 'sightseeing' },
      { id: '5-3', day: 5, time: '10:30', location: '下北澤', activity: '逛街', notes: '豪德寺站 搭小田急線至 下北澤站', lat: 35.662, lng: 139.667, type: 'shopping' },
      { id: '5-4', day: 5, time: '12:00', location: '根岸牛舌 吉祥寺店', activity: '午餐', notes: '下北澤站 搭京王井之頭線(急行) 至 吉祥寺站', lat: 35.703, lng: 139.580, type: 'food' },
      { id: '5-5', day: 5, time: '13:00', location: '井之頭恩賜公園', activity: '散步', notes: '步行前往', lat: 35.700, lng: 139.576, type: 'sightseeing' },
      { id: '5-6', day: 5, time: '16:39', location: '新宿站', activity: '前往機場', notes: '吉祥寺站 搭 JR 中央線(快速) 至 新宿站轉 NEX', lat: 35.689, lng: 139.700, type: 'transport' },
      { id: '5-7', day: 5, time: '20:20', location: '成田機場 (NRT)', activity: '搭機返台', notes: '第一航廈 BR195', lat: 35.772, lng: 140.392, type: 'flight' }
    ]
  }
];

const WEATHER_DATA = [
  { day: 1, temp: '3°C / 10°C', icon: <Sun className="text-orange-400" />, desc: '晴朗' },
  { day: 2, temp: '-5°C / 5°C', icon: <CloudSnow className="text-blue-400" />, desc: '寒冷' },
  { day: 3, temp: '-2°C / 7°C', icon: <Sun className="text-orange-400" />, desc: '晴朗' },
  { day: 4, temp: '4°C / 11°C', icon: <Sun className="text-orange-400" />, desc: '多雲' },
  { day: 5, temp: '2°C / 9°C', icon: <Sun className="text-orange-400" />, desc: '晴朗' },
];

// --- Helpers ---
const createCustomIcon = (color: string, index: number) => {
  return new L.DivIcon({
    html: `<div style="background-color: ${color}; width: 26px; height: 26px; border: 2px solid white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 13px;">${index}</div>`,
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

// --- App Component ---
const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'map' | 'itinerary' | 'export'>('map');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showWeather, setShowWeather] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [mapConfig, setMapConfig] = useState<{ center: [number, number], zoom: number }>({
    center: [35.6895, 139.6917],
    zoom: 10
  });

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

  const locateMe = () => {
    if (!navigator.geolocation) {
      alert("您的瀏覽器不支援定位功能");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserPos([latitude, longitude]);
        setMapConfig({ center: [latitude, longitude], zoom: 14 });
        setActiveTab('map');
      },
      (err) => {
        console.error(err);
        alert("無法取得您的位置，請確認是否已允許定位權限。");
      }
    );
  };

  const currentDayData = useMemo(() => ITINERARY_DATA.find(d => d.day === selectedDay), [selectedDay]);

  useEffect(() => {
    if (currentDayData && currentDayData.events.length > 0) {
      const firstEvent = currentDayData.events[0];
      setMapConfig({ center: [firstEvent.lat, firstEvent.lng], zoom: 11 });
    }
  }, [selectedDay, currentDayData]);

  const generateMarkdown = () => {
    let md = '| Day | 序號 | 時間 | 地點/活動 | Google Map | 備註 |\n| --- | --- | --- | --- | --- | --- |\n';
    ITINERARY_DATA.forEach(day => {
      day.events.forEach((event, idx) => {
        md += `| Day ${day.day} | ${idx + 1} | ${event.time} | ${event.location} | [開啟地圖](${getGoogleMapsUrl(event.location, event.lat, event.lng)}) | ${event.notes} |\n`;
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
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed md:relative z-50 h-full w-80 bg-white border-r shadow-xl transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:w-0 md:opacity-0'}`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex justify-between items-center bg-slate-900 text-white">
            <h1 className="text-lg font-bold">2026 東京富士山</h1>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 hover:bg-slate-800 rounded"><X size={20} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-4 bg-slate-50">
            {ITINERARY_DATA.map(day => (
              <div key={day.day} className={`rounded-xl border bg-white overflow-hidden shadow-sm ${selectedDay === day.day ? 'ring-2 ring-slate-400' : ''}`}>
                <div className="p-3 font-bold text-white flex justify-between items-center" style={{ backgroundColor: day.color }}>
                  <div className="flex items-center gap-2">
                    <span>Day {day.day}</span>
                    {(() => {
                      const w = WEATHER_DATA.find(wd => wd.day === day.day);
                      if (!w) return null;
                      return (
                        <div className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded text-[10px] font-normal">
                          {w.icon}
                          <span>{w.temp}</span>
                        </div>
                      );
                    })()}
                  </div>
                  <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded">{day.date}</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {day.events.map((event, index) => (
                    <button key={event.id} onClick={() => handleFocusLocation(event)} className="w-full p-3 text-left hover:bg-slate-50 flex gap-3 transition-colors items-start group">
                      <span className="text-[11px] font-bold h-5 w-5 rounded-full flex items-center justify-center text-white shrink-0 mt-0.5" style={{ backgroundColor: day.color }}>{index + 1}</span>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold truncate flex items-center gap-1">{event.location} {getEventIcon(event.type)}</div>
                        <div className="text-xs text-slate-500 truncate">{event.activity}</div>
                      </div>
                      <a
                        href={getGoogleMapsUrl(event.location, event.lat, event.lng)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors shrink-0"
                        title="在 Google 地圖中開啟"
                      >
                        <MapIcon size={16} />
                      </a>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative min-w-0">
        <header className="h-14 bg-white border-b flex items-center justify-between px-4 z-30 shadow-sm">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pr-2">
            {!sidebarOpen && <button onClick={() => setSidebarOpen(true)} className="p-2 border rounded shadow-sm shrink-0"><Menu size={20} /></button>}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg shrink-0">
              <button onClick={() => setActiveTab('map')} className={`px-3 py-1.5 rounded-md text-sm font-medium ${activeTab === 'map' ? 'bg-white shadow text-blue-600' : 'text-slate-600'}`}>地圖</button>
              <button onClick={() => setActiveTab('itinerary')} className={`px-3 py-1.5 rounded-md text-sm font-medium ${activeTab === 'itinerary' ? 'bg-white shadow text-blue-600' : 'text-slate-600'}`}>細節</button>
              <button onClick={() => setActiveTab('export')} className={`px-3 py-1.5 rounded-md text-sm font-medium ${activeTab === 'export' ? 'bg-white shadow text-blue-600' : 'text-slate-600'}`}>匯出</button>
            </div>
            <button onClick={locateMe} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border bg-white hover:bg-slate-50 text-sm font-bold shadow-sm shrink-0"><Navigation size={16} className="text-blue-500" /> 我在哪</button>
          </div>
          <button onClick={() => setShowWeather(!showWeather)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-bold shadow-sm shrink-0 ${showWeather ? 'bg-blue-600 text-white' : 'bg-white hover:bg-slate-50'}`}><CloudSnow size={16} /> 氣候</button>
        </header>

        <div className="flex-1 relative flex flex-col">
          {activeTab === 'map' && (
            <>
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[500] bg-white/90 backdrop-blur-md p-1 rounded-2xl shadow-xl flex gap-1 border border-white/50">
                {ITINERARY_DATA.map(day => (
                  <button key={day.day} onClick={() => setSelectedDay(day.day)} className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedDay === day.day ? 'text-white shadow-lg scale-105' : 'text-slate-400'}`} style={selectedDay === day.day ? { backgroundColor: day.color } : {}}>Day {day.day}</button>
                ))}
              </div>
              <MapContainer center={mapConfig.center} zoom={mapConfig.zoom} className="z-0 flex-1 w-full h-full">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapController center={mapConfig.center} zoom={mapConfig.zoom} />
                <MapInvalidator />
                {userPos && (
                  <Marker position={userPos} icon={new L.DivIcon({
                    html: `<div class="animate-pulse bg-blue-500 w-4 h-4 rounded-full border-2 border-white shadow-lg"></div>`,
                    className: 'user-pos',
                    iconSize: [16, 16],
                    iconAnchor: [8, 8]
                  })}>
                    <Popup>您目前大約在此位置</Popup>
                  </Marker>
                )}
                {currentDayData && (
                  <>
                    {currentDayData.events.map((e, idx) => (
                      <Marker key={e.id} position={[e.lat, e.lng]} icon={createCustomIcon(currentDayData.color, idx + 1)}>
                        <Popup>
                          <div className="p-1 min-w-[150px]">
                            <h3 className="font-bold text-sm">{e.location}</h3>
                            <div className="text-xs text-slate-500 my-1">{e.activity} ({e.time})</div>
                            <a href={getGoogleMapsUrl(e.location, e.lat, e.lng)} target="_blank" className="block text-center py-2 bg-slate-900 text-white rounded text-[10px] no-underline">Google Maps</a>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                    <Polyline positions={currentDayData.events.map(e => [e.lat, e.lng])} pathOptions={{ color: currentDayData.color, weight: 3, dashArray: '5, 5' }} />
                  </>
                )}
              </MapContainer>
              {showWeather && (
                <div className="absolute top-20 right-4 z-[400] w-64 bg-white/90 backdrop-blur p-4 rounded-xl shadow-2xl border border-white/50">
                  <div className="flex justify-between items-center mb-4"><h3 className="font-bold flex items-center gap-1"><Thermometer size={16} className="text-red-500" /> 1月預測</h3><button onClick={() => setShowWeather(false)}><X size={14} /></button></div>
                  <div className="space-y-2">
                    {WEATHER_DATA.map(w => (
                      <div key={w.day} className="flex justify-between items-center p-2 rounded bg-slate-50">
                        <span className="text-xs font-bold text-slate-400">D{w.day}</span>
                        {w.icon}
                        <span className="text-xs font-bold">{w.temp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
          {activeTab === 'itinerary' && (
            <div className="absolute inset-0 bg-white overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto space-y-8">
                {ITINERARY_DATA.map(day => (
                  <div key={day.day} className="border rounded-xl overflow-hidden shadow-sm">
                    <div className="p-4 text-white font-bold flex justify-between" style={{ backgroundColor: day.color }}>
                      <span>Day {day.day} - {day.title}</span>
                      <span>{day.date}</span>
                    </div>
                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                      <thead className="bg-slate-50"><tr><th className="px-4 py-2 text-left font-bold text-slate-500 uppercase">時間</th><th className="px-4 py-2 text-left font-bold text-slate-500 uppercase">地點</th><th className="px-4 py-2 text-left font-bold text-slate-500 uppercase">活動 / 備註</th></tr></thead>
                      <tbody className="divide-y divide-slate-100">
                        {day.events.map(e => (
                          <tr key={e.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3 font-mono text-slate-500">{e.time}</td>
                            <td className="px-4 py-3 font-bold">{e.location}</td>
                            <td className="px-4 py-3 text-slate-600">{e.activity} <br /><span className="text-[11px] text-slate-400 italic">{e.notes}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'export' && (
            <div className="absolute inset-0 bg-white overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Download className="text-blue-600" /> Markdown 匯出</h2>
                <pre className="bg-slate-900 text-slate-300 p-4 rounded-xl overflow-x-auto text-xs leading-relaxed">
                  {generateMarkdown()}
                </pre>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
