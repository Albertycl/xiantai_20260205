
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
  ChevronDown,
  Info,
  Sun,
  CloudSnow,
  Thermometer,
  Wind,
  ExternalLink,
  Ticket,
  StickyNote,
  Edit3,
  Save,
  XCircle,
  ClipboardList,
  Check,
  Square,
  Lock,
  LogOut,
  AlertTriangle,
  User,
  Plus,
  Trash2,
  RotateCcw
} from 'lucide-react';
import { ITINERARY_DATA, DANGEROUS_ROUTES } from './constants';
import { fetchWeatherData } from './weatherService';
import { DayPlan, TripEvent, WeatherData } from './types';
import { saveNote, loadAllNotes, saveChecklistItem, loadAllChecklistItems, resetAllChecklistItems, saveCustomItem, loadCustomItems, deleteCustomItem, CustomChecklistItem } from './supabaseClient';
import { PACKING_CHECKLIST, ChecklistCategory } from './checklistData';

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
  const [activeTab, setActiveTab] = useState<'map' | 'itinerary' | 'export' | 'booking' | 'flight' | 'checklist'>('map');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showWeather, setShowWeather] = useState(false);
  const [showDangerousRoutes, setShowDangerousRoutes] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number | 'all'>(1);
  const [itineraryFilter, setItineraryFilter] = useState<number | 'all'>('all');
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<string | null>(null);
  const [eventDetails, setEventDetails] = useState<Record<string, string>>({});
  const [savingNote, setSavingNote] = useState<string | null>(null);

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<string>('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Valid users
  const VALID_USERS: Record<string, string> = {
    'yvonne': 'neihu',
    'albert': 'neihu'
  };

  // Checklist state
  const [checklistItems, setChecklistItems] = useState<Record<string, boolean>>({});
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['documents']));
  const [customItems, setCustomItems] = useState<CustomChecklistItem[]>([]);
  const [addingToCategory, setAddingToCategory] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemNote, setNewItemNote] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Load notes from Supabase on mount
  useEffect(() => {
    const loadNotes = async () => {
      const notes = await loadAllNotes();
      if (Object.keys(notes).length > 0) {
        setEventDetails(notes);
      } else {
        // Fallback to localStorage if no notes in DB yet
        const saved = localStorage.getItem('tripEventDetails');
        if (saved) setEventDetails(JSON.parse(saved));
      }
    };
    loadNotes();
  }, []);

  // Load checklist items from Supabase when user changes
  useEffect(() => {
    const loadChecklist = async () => {
      if (!currentUser) {
        setChecklistItems({});
        return;
      }
      const items = await loadAllChecklistItems(currentUser);
      if (Object.keys(items).length > 0) {
        setChecklistItems(items);
      } else {
        // Fallback to localStorage if no items in DB yet
        const saved = localStorage.getItem(`packingChecklist_${currentUser}`);
        if (saved) setChecklistItems(JSON.parse(saved));
        else setChecklistItems({});
      }
    };
    loadChecklist();
  }, [currentUser]);

  // Load custom items from Supabase when user changes
  useEffect(() => {
    const loadCustom = async () => {
      if (!currentUser) {
        setCustomItems([]);
        return;
      }
      const items = await loadCustomItems(currentUser);
      if (items.length > 0) {
        setCustomItems(items);
      } else {
        // Fallback to localStorage
        const saved = localStorage.getItem(`customChecklistItems_${currentUser}`);
        if (saved) setCustomItems(JSON.parse(saved));
        else setCustomItems([]);
      }
    };
    loadCustom();
  }, [currentUser]);

  // Check for saved authentication
  useEffect(() => {
    const authStatus = sessionStorage.getItem('tripAuth');
    const savedUser = sessionStorage.getItem('tripUser');
    if (authStatus === 'authenticated' && savedUser) {
      setIsAuthenticated(true);
      setCurrentUser(savedUser);
    }
  }, []);

  const handleLogin = () => {
    const lowerUsername = username.toLowerCase();
    if (VALID_USERS[lowerUsername] && VALID_USERS[lowerUsername] === password) {
      setIsAuthenticated(true);
      setCurrentUser(lowerUsername);
      sessionStorage.setItem('tripAuth', 'authenticated');
      sessionStorage.setItem('tripUser', lowerUsername);
      setShowLoginModal(false);
      setLoginError('');
      setUsername('');
      setPassword('');
    } else {
      setLoginError('帳號或密碼錯誤');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser('');
    setChecklistItems({});
    setCustomItems([]);
    sessionStorage.removeItem('tripAuth');
    sessionStorage.removeItem('tripUser');
  };

  const toggleChecklistItem = async (itemId: string) => {
    if (!isAuthenticated || !currentUser) {
      setShowLoginModal(true);
      return;
    }
    const newChecked = !checklistItems[itemId];
    const updated = { ...checklistItems, [itemId]: newChecked };
    setChecklistItems(updated);

    // Save to Supabase with user
    const success = await saveChecklistItem(itemId, newChecked, currentUser);
    if (!success) {
      // Fallback to localStorage if Supabase fails
      localStorage.setItem(`packingChecklist_${currentUser}`, JSON.stringify(updated));
    }
  };

  const getChecklistProgress = (category: ChecklistCategory) => {
    const categoryCustomItems = customItems.filter(item => item.category_id === category.id);
    const allCategoryItems = [...category.items, ...categoryCustomItems];
    const checkedCount = allCategoryItems.filter(item => checklistItems[item.id]).length;
    return { checked: checkedCount, total: allCategoryItems.length };
  };

  const getTotalProgress = () => {
    const allBuiltInItems = PACKING_CHECKLIST.flatMap(cat => cat.items);
    const allItems = [...allBuiltInItems, ...customItems];
    const checkedCount = allItems.filter(item => checklistItems[item.id]).length;
    return { checked: checkedCount, total: allItems.length };
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const expandAllCategories = () => {
    setExpandedCategories(new Set(PACKING_CHECKLIST.map(cat => cat.id)));
  };

  const collapseAllCategories = () => {
    setExpandedCategories(new Set());
  };

  const handleAddItem = async (categoryId: string) => {
    if (!newItemName.trim() || !currentUser) return;

    const newItem: CustomChecklistItem = {
      id: `custom-${currentUser}-${Date.now()}`,
      category_id: categoryId,
      name: newItemName.trim(),
      note: newItemNote.trim() || undefined
    };

    const updated = [...customItems, newItem];
    setCustomItems(updated);

    // Save to Supabase with user
    const success = await saveCustomItem(newItem, currentUser);
    if (!success) {
      localStorage.setItem(`customChecklistItems_${currentUser}`, JSON.stringify(updated));
    }

    setNewItemName('');
    setNewItemNote('');
    setAddingToCategory(null);
  };

  const handleDeleteItem = async (itemId: string) => {
    const updated = customItems.filter(item => item.id !== itemId);
    setCustomItems(updated);

    // Also remove from checked state
    const updatedChecks = { ...checklistItems };
    delete updatedChecks[itemId];
    setChecklistItems(updatedChecks);

    // Delete from Supabase
    const success = await deleteCustomItem(itemId);
    if (!success && currentUser) {
      localStorage.setItem(`customChecklistItems_${currentUser}`, JSON.stringify(updated));
    }
  };

  const handleResetAll = async () => {
    if (!currentUser) return;

    // Reset all checkboxes to unchecked
    const resetItems: Record<string, boolean> = {};

    // Reset built-in items
    PACKING_CHECKLIST.forEach(cat => {
      cat.items.forEach(item => {
        resetItems[item.id] = false;
      });
    });

    // Reset custom items
    customItems.forEach(item => {
      resetItems[item.id] = false;
    });

    setChecklistItems(resetItems);
    setShowResetConfirm(false);

    // Save to Supabase with user
    const success = await resetAllChecklistItems(currentUser);
    if (!success) {
      localStorage.setItem(`packingChecklist_${currentUser}`, JSON.stringify(resetItems));
    }
  };

  const getCustomItemsForCategory = (categoryId: string) => {
    return customItems.filter(item => item.category_id === categoryId);
  };

  const saveEventDetails = async (eventId: string, details: string) => {
    setSavingNote(eventId);
    const updated = { ...eventDetails, [eventId]: details };
    setEventDetails(updated);

    // Save to Supabase
    const success = await saveNote(eventId, details);
    if (success) {
      console.log('Note saved to Supabase');
    } else {
      // Fallback to localStorage if Supabase fails
      localStorage.setItem('tripEventDetails', JSON.stringify(updated));
      console.log('Saved to localStorage (Supabase unavailable)');
    }
    setSavingNote(null);
  };

  const getEventDetails = (event: TripEvent) => {
    return eventDetails[event.id] !== undefined ? eventDetails[event.id] : (event.details || '');
  };
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
    if (selectedDay === 'all') {
      // Center on Tokyo area with lower zoom to see all locations
      setMapConfig({ center: [35.5, 139.2], zoom: 8 });
    } else if (currentDayData && currentDayData.events.length > 0) {
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
        fixed md:relative z-[1000] h-full w-[65vw] max-w-72 md:max-w-80 bg-white border-r shadow-xl transition-all duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:w-0 md:opacity-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex justify-between items-center bg-slate-900 text-white">
            <div>
              <h1 className="text-base md:text-xl font-bold">2026 東北雪見・溫泉大縱走</h1>
              <p className="text-[10px] md:text-xs text-slate-400 tracking-wide">9天8夜 智能行程 & 氣候分析</p>
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
                  <div className="p-2 md:p-3 font-bold text-white flex items-center justify-between text-sm md:text-base" style={{ backgroundColor: day.color }}>
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <Calendar size={16} className="md:w-[18px] md:h-[18px]" />
                      <div className="flex flex-col">
                        <span>Day {day.day}</span>
                        <span className="text-[9px] md:text-[10px] font-normal opacity-80">{day.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-black/20 px-1.5 md:px-2 py-0.5 rounded text-[10px] md:text-[11px] font-normal backdrop-blur-sm">
                      {weather?.icon}
                      <span>{weather?.temp}</span>
                    </div>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {day.events.map((event, index) => (
                      <div key={event.id} className="group relative">
                        <div className="flex items-start">
                          <button
                            onClick={() => handleFocusLocation(event)}
                            className="flex-1 p-2 md:p-3 text-left hover:bg-slate-50 flex gap-2 md:gap-3 transition-colors items-start pr-1 md:pr-2"
                          >
                            <div className="flex flex-col items-center min-w-[28px] md:min-w-[32px]">
                              <span className="text-[10px] md:text-[11px] font-bold h-5 w-5 md:h-6 md:w-6 rounded-full flex items-center justify-center border text-white mb-1 shadow-sm" style={{ backgroundColor: day.color, borderColor: 'white' }}>
                                {index + 1}
                              </span>
                              {event.travelTime && (
                                <div className="text-[9px] text-slate-400 font-medium mb-0.5 flex items-center justify-center gap-0.5 whitespace-nowrap">
                                  <Car size={10} />
                                  {event.travelTime}
                                </div>
                              )}
                              <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">{event.time}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs md:text-sm font-semibold flex items-center justify-between gap-1">
                                <span className="truncate">{event.location}</span>
                                <span className="text-slate-300 group-hover:text-slate-600 shrink-0">
                                  {getEventIcon(event.type)}
                                </span>
                              </div>
                              <div className="text-[10px] md:text-xs text-slate-500 truncate">{event.activity}</div>
                              {event.importantNotes && (
                                <div className="text-[10px] text-red-500 font-bold mt-0.5">
                                  {event.importantNotes}
                                </div>
                              )}
                              <div className="flex items-center gap-1 mt-1 flex-wrap">
                                {event.booking && (
                                  <div className="flex items-center gap-1 text-[10px] text-amber-600 font-medium bg-amber-50 px-1.5 py-0.5 rounded">
                                    <Ticket size={10} />
                                    <span>已預訂</span>
                                  </div>
                                )}
                                {(event.details || eventDetails[event.id]) && (
                                  <div className="flex items-center gap-1 text-[10px] text-blue-600 font-medium bg-blue-50 px-1.5 py-0.5 rounded">
                                    <StickyNote size={10} />
                                    <span>有筆記</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </button>
                          <div className="flex flex-col items-center gap-0.5 md:gap-1 p-1 md:p-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedEvent(expandedEvent === event.id ? null : event.id);
                              }}
                              className={`p-1.5 rounded-lg transition-colors ${expandedEvent === event.id ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
                              title="顯示詳細資訊"
                            >
                              {expandedEvent === event.id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </button>
                            <a
                              href={getGoogleMapsUrl(event.location, event.lat, event.lng)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                              title="在 Google 地圖中開啟"
                            >
                              <ExternalLink size={14} />
                            </a>
                          </div>
                        </div>
                        {/* Expandable Details Section */}
                        {expandedEvent === event.id && (
                          <div className="px-3 pb-3 pt-0 ml-[44px] mr-2 animate-in slide-in-from-top-2 duration-200">
                            <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                                  <StickyNote size={12} />
                                  <span>筆記 / Notes</span>
                                </div>
                                {editingEvent === event.id ? (
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingEvent(null);
                                      }}
                                      className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                                      title="取消"
                                    >
                                      <XCircle size={14} />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingEvent(event.id);
                                    }}
                                    className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors"
                                    title="編輯筆記"
                                  >
                                    <Edit3 size={14} />
                                  </button>
                                )}
                              </div>
                              {event.notes && (
                                <div className="text-xs text-slate-600 mb-2">
                                  <span className="font-medium text-slate-500">備註：</span>{event.notes}
                                </div>
                              )}
                              {editingEvent === event.id ? (
                                <div className="space-y-2">
                                  <textarea
                                    className="w-full text-xs text-slate-700 bg-white p-2 rounded border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    rows={5}
                                    placeholder="輸入詳細筆記..."
                                    defaultValue={getEventDetails(event)}
                                    id={`details-${event.id}`}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <button
                                    onClick={async (e) => {
                                      e.stopPropagation();
                                      const textarea = document.getElementById(`details-${event.id}`) as HTMLTextAreaElement;
                                      await saveEventDetails(event.id, textarea.value);
                                      setEditingEvent(null);
                                    }}
                                    disabled={savingNote === event.id}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-bold rounded-lg transition-colors"
                                  >
                                    {savingNote === event.id ? (
                                      <>
                                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        儲存中...
                                      </>
                                    ) : (
                                      <>
                                        <Save size={12} />
                                        儲存
                                      </>
                                    )}
                                  </button>
                                </div>
                              ) : (
                                getEventDetails(event) ? (
                                  <div className="text-xs text-slate-700 whitespace-pre-wrap bg-white p-2 rounded border border-slate-200">
                                    {getEventDetails(event)}
                                  </div>
                                ) : (
                                  <div
                                    className="text-xs text-slate-400 italic bg-white p-2 rounded border border-dashed border-slate-200 cursor-pointer hover:border-blue-300 hover:text-blue-500 transition-colors"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingEvent(event.id);
                                    }}
                                  >
                                    點擊此處新增筆記...
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
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
              <button onClick={() => setActiveTab('checklist')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'checklist' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}>
                <ClipboardList size={16} /> <span className="hidden sm:inline">攜帶清單</span>
              </button>
              <button onClick={() => setActiveTab('export')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'export' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}>
                <Download size={16} /> <span className="hidden sm:inline">匯出資料</span>
              </button>
            </div>
          </div>
          <button
            onClick={() => setShowDangerousRoutes(!showDangerousRoutes)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-bold transition-all shadow-sm shrink-0 ${showDangerousRoutes ? 'bg-red-600 text-white border-red-600' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
          >
            <AlertTriangle size={16} />
            <span className="hidden sm:inline">危險路段</span>
          </button>
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
                <button
                  onClick={() => setSelectedDay('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center ${selectedDay === 'all' ? 'text-white shadow-lg scale-105 bg-slate-700' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
                >
                  <span>全部</span>
                  <span className={`text-[9px] font-normal ${selectedDay === 'all' ? 'opacity-80' : 'opacity-60'}`}>All</span>
                </button>
                {ITINERARY_DATA.map(day => (
                  <button
                    key={`selector-${day.day}`}
                    onClick={() => setSelectedDay(day.day)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex flex-col items-center ${selectedDay === day.day ? 'text-white shadow-lg scale-105' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
                    style={selectedDay === day.day ? { backgroundColor: day.color } : {}}
                  >
                    <span>Day {day.day}</span>
                    <span className={`text-[9px] font-normal ${selectedDay === day.day ? 'opacity-80' : 'opacity-60'}`}>{day.date.split(' ')[0].replace('2026/', '')}</span>
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

                {selectedDay === 'all' ? (
                  ITINERARY_DATA.map(day => (
                    <React.Fragment key={`day-${day.day}`}>
                      {day.events.map((event, eventIdx) => (
                        <Marker key={event.id} position={[event.lat, event.lng]} icon={createCustomIcon(day.color, eventIdx + 1)}>
                          <Popup>
                            <div className="p-4 min-w-[240px]">
                              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                                <span className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-black text-white shadow-sm" style={{ backgroundColor: day.color }}>{eventIdx + 1}</span>
                                <div className="flex flex-col">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-0.5">Day {day.day} · {day.date}</span>
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
                              {(event.notes || getEventDetails(event)) && (
                                <div className="mb-4 bg-blue-50 border border-blue-100 rounded-xl p-3">
                                  <div className="flex items-center gap-1.5 text-blue-700 font-bold text-xs mb-2">
                                    <StickyNote size={14} />
                                    <span>筆記</span>
                                  </div>
                                  {event.notes && (
                                    <div className="text-[11px] text-slate-600 mb-1">{event.notes}</div>
                                  )}
                                  {getEventDetails(event) && (
                                    <div className="text-[11px] text-slate-700 whitespace-pre-wrap bg-white p-2 rounded border border-blue-100 mt-2">{getEventDetails(event)}</div>
                                  )}
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
                        positions={day.events.map(e => [e.lat, e.lng])}
                        pathOptions={{ color: day.color, weight: 4, opacity: 0.7, dashArray: '10, 10' }}
                      />
                    </React.Fragment>
                  ))
                ) : currentDayData && (
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
                            {(event.notes || getEventDetails(event)) && (
                              <div className="mb-4 bg-blue-50 border border-blue-100 rounded-xl p-3">
                                <div className="flex items-center gap-1.5 text-blue-700 font-bold text-xs mb-2">
                                  <StickyNote size={14} />
                                  <span>筆記</span>
                                </div>
                                {event.notes && (
                                  <div className="text-[11px] text-slate-600 mb-1">{event.notes}</div>
                                )}
                                {getEventDetails(event) && (
                                  <div className="text-[11px] text-slate-700 whitespace-pre-wrap bg-white p-2 rounded border border-blue-100 mt-2">{getEventDetails(event)}</div>
                                )}
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

                {/* Dangerous Routes Warning Polylines */}
                {showDangerousRoutes && DANGEROUS_ROUTES.map(route => {
                  // Only show routes relevant to selected day, or all routes when viewing all days
                  const isRelevant = selectedDay === 'all' || (route.affectedDays && route.affectedDays.includes(selectedDay as number));
                  if (!isRelevant) return null;

                  const routeColor = route.status === 'closed' ? '#dc2626' : route.status === 'dangerous' ? '#f97316' : '#eab308';
                  const dashArray = route.status === 'closed' ? '5, 10' : '15, 10';

                  return (
                    <React.Fragment key={route.id}>
                      <Polyline
                        positions={route.coordinates}
                        pathOptions={{
                          color: routeColor,
                          weight: 6,
                          opacity: 0.8,
                          dashArray: dashArray
                        }}
                      />
                      <Marker
                        position={route.coordinates[Math.floor(route.coordinates.length / 2)]}
                        icon={new L.DivIcon({
                          html: `<div style="
                            background: ${routeColor};
                            width: 28px;
                            height: 28px;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            border: 3px solid white;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                          ">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                              <path d="M12 9v4"/>
                              <path d="M12 17h.01"/>
                            </svg>
                          </div>`,
                          className: '',
                          iconSize: [28, 28],
                          iconAnchor: [14, 14]
                        })}
                      >
                        <Popup>
                          <div className="p-4 min-w-[260px]">
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                              <span className={`h-8 w-8 rounded-full flex items-center justify-center text-white shadow-sm ${route.status === 'closed' ? 'bg-red-600' : route.status === 'dangerous' ? 'bg-orange-500' : 'bg-yellow-500'}`}>
                                <AlertTriangle size={16} />
                              </span>
                              <div className="flex flex-col">
                                <span className={`text-[10px] font-bold uppercase leading-none mb-0.5 ${route.status === 'closed' ? 'text-red-600' : route.status === 'dangerous' ? 'text-orange-500' : 'text-yellow-600'}`}>
                                  {route.status === 'closed' ? '🚫 冬季封閉' : route.status === 'dangerous' ? '⚠️ 極度危險' : '⚡ 注意安全'}
                                </span>
                                <span className="text-sm font-bold text-slate-700 leading-none">{route.name}</span>
                              </div>
                            </div>
                            <p className="text-xs text-slate-500 mb-2">{route.nameJa}</p>
                            <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-3">
                              <p className="text-xs text-slate-700 leading-relaxed">{route.description}</p>
                            </div>
                            {route.affectedDays && (
                              <div className="text-[10px] text-slate-400">
                                影響日期：Day {route.affectedDays.join(', Day ')}
                              </div>
                            )}
                          </div>
                        </Popup>
                      </Marker>
                    </React.Fragment>
                  );
                })}
              </MapContainer>

              {/* Dangerous Routes Legend */}
              {showDangerousRoutes && (
                <div className="absolute bottom-4 left-4 z-[400] bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/50 p-3 transition-all">
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
                    <AlertTriangle className="text-red-500" size={14} />
                    <span className="text-xs font-bold text-slate-700">冬季危險路段圖例</span>
                  </div>
                  <div className="space-y-1.5 text-[10px]">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-1 bg-red-600 rounded" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #dc2626 0, #dc2626 5px, transparent 5px, transparent 10px)' }}></div>
                      <span className="text-slate-600">🚫 冬季封閉</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-1 bg-orange-500 rounded" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #f97316 0, #f97316 10px, transparent 10px, transparent 15px)' }}></div>
                      <span className="text-slate-600">⚠️ 極度危險</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-1 bg-yellow-500 rounded" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #eab308 0, #eab308 10px, transparent 10px, transparent 15px)' }}></div>
                      <span className="text-slate-600">⚡ 注意安全</span>
                    </div>
                  </div>
                </div>
              )}

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
                      Day {day.day} ({day.date.split(' ')[0].replace('2026/', '')})
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

                {/* Desktop Table View */}
                <div className="hidden md:block border rounded-xl overflow-hidden shadow-sm">
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

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                  {ITINERARY_DATA
                    .filter(day => itineraryFilter === 'all' || day.day === itineraryFilter)
                    .flatMap(day => day.events.map((e, i) => ({ ...e, dayColor: day.color, order: i + 1, dayIdx: day.day })))
                    .map((event, idx) => {
                      const weather = weatherData.find(w => w.day === event.dayIdx);
                      return (
                        <div key={`mobile-card-${idx}`} className="bg-white border rounded-xl shadow-sm overflow-hidden">
                          <div className="p-3 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded text-xs font-bold text-white" style={{ backgroundColor: event.dayColor }}>
                                Day {event.dayIdx}
                              </span>
                              <span className="font-mono text-sm font-bold text-slate-600">{event.time}</span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-bold text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded-full">
                              {weather?.icon}
                              <span>{weather?.temp}</span>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="flex justify-between items-start gap-2 mb-2">
                              <div>
                                <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1">{event.location}</h3>
                                <div className="text-sm text-slate-500 font-medium">{event.activity}</div>
                              </div>
                              <a
                                href={getGoogleMapsUrl(event.location, event.lat, event.lng)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-slate-100 text-slate-400 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                              >
                                <ExternalLink size={16} />
                              </a>
                            </div>

                            {event.notes && (
                              <div className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded-lg mb-3 border border-slate-100">
                                {event.notes}
                              </div>
                            )}

                            {event.booking && (
                              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                                <div className="flex items-center justify-between mb-2 pb-2 border-b border-amber-100/50">
                                  <div className="flex items-center gap-1.5 text-amber-700 font-bold text-xs">
                                    <Ticket size={14} />
                                    <span>住宿預訂</span>
                                  </div>
                                  <span className="text-[10px] bg-white/50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-100">
                                    {event.booking.provider}
                                  </span>
                                </div>
                                <div className="space-y-2 text-xs">
                                  <div className="flex justify-between">
                                    <span className="text-slate-400">預約編號</span>
                                    <span className="font-mono font-bold text-slate-700">{event.booking.number}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-400">金額</span>
                                    <span className="font-bold text-slate-700">{event.booking.price}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-400">付款方式</span>
                                    <span className="text-slate-700">{event.booking.payment}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
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

          {activeTab === 'checklist' && (
            <div className="absolute inset-0 bg-slate-50 overflow-y-auto p-6 md:p-10">
              <div className="max-w-4xl mx-auto">
                {/* Header with auth status */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
                      <ClipboardList className="text-purple-600" /> 攜帶清單
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">出發前確認所有必需品</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Progress indicator */}
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border shadow-sm">
                      <div className="text-sm font-bold text-slate-700">
                        {getTotalProgress().checked} / {getTotalProgress().total}
                      </div>
                      <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                          style={{ width: `${(getTotalProgress().checked / getTotalProgress().total) * 100}%` }}
                        />
                      </div>
                      <div className="text-xs text-slate-400">
                        {Math.round((getTotalProgress().checked / getTotalProgress().total) * 100)}%
                      </div>
                    </div>
                    {/* Auth button */}
                    {isAuthenticated ? (
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-colors"
                      >
                        <User size={16} className="text-green-600" />
                        <span className="hidden sm:inline">{currentUser}</span>
                        <LogOut size={14} />
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowLoginModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold transition-colors"
                      >
                        <Lock size={16} />
                        <span>登入編輯</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Expand/Collapse All buttons */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-slate-500">
                    {isAuthenticated ? (
                      <span className="flex items-center gap-2 text-green-600 font-medium">
                        <Check size={16} /> 已登入，可勾選、新增、刪除項目
                      </span>
                    ) : (
                      <span className="text-slate-400">登入後可編輯清單</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {isAuthenticated && (
                      <button
                        onClick={() => setShowResetConfirm(true)}
                        className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1"
                      >
                        <RotateCcw size={12} />
                        重置全部
                      </button>
                    )}
                    <button
                      onClick={expandAllCategories}
                      className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      全部展開
                    </button>
                    <button
                      onClick={collapseAllCategories}
                      className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      全部收合
                    </button>
                  </div>
                </div>

                {/* Checklist categories */}
                <div className="space-y-4">
                  {PACKING_CHECKLIST.map((category) => {
                    const progress = getChecklistProgress(category);
                    const isExpanded = expandedCategories.has(category.id);
                    const isComplete = progress.checked === progress.total;

                    return (
                      <div
                        key={category.id}
                        className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${isComplete ? 'ring-2 ring-green-500 ring-offset-2' : ''}`}
                      >
                        {/* Category header */}
                        <button
                          onClick={() => toggleCategory(category.id)}
                          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{category.emoji}</span>
                            <div className="text-left">
                              <div className="font-bold text-slate-800 flex items-center gap-2">
                                {category.title}
                                {isComplete && (
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                                    完成
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-400">
                                {progress.checked} / {progress.total} 項目
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-300 ${isComplete ? 'bg-green-500' : 'bg-purple-500'}`}
                                style={{ width: `${(progress.checked / progress.total) * 100}%` }}
                              />
                            </div>
                            {isExpanded ? <ChevronDown size={20} className="text-slate-400" /> : <ChevronRight size={20} className="text-slate-400" />}
                          </div>
                        </button>

                        {/* Category items */}
                        {isExpanded && (
                          <div className="border-t border-slate-100">
                            <div className="p-3 bg-slate-50 text-xs text-slate-500">
                              {category.description}
                            </div>
                            <div className="divide-y divide-slate-100">
                              {/* Built-in items */}
                              {category.items.map((item) => {
                                const isChecked = checklistItems[item.id] || false;
                                return (
                                  <div
                                    key={item.id}
                                    className={`flex items-start gap-3 p-4 transition-colors ${isChecked ? 'bg-green-50/50' : 'hover:bg-slate-50'}`}
                                  >
                                    <button
                                      onClick={() => toggleChecklistItem(item.id)}
                                      className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                                        isChecked
                                          ? 'bg-green-500 border-green-500 text-white'
                                          : 'border-slate-300 hover:border-purple-500'
                                      }`}
                                    >
                                      {isChecked && <Check size={14} strokeWidth={3} />}
                                    </button>
                                    <div className="flex-1 min-w-0">
                                      <div className={`font-medium flex items-center gap-2 ${isChecked ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                                        {item.name}
                                        {item.important && (
                                          <AlertTriangle size={14} className="text-amber-500 flex-shrink-0" />
                                        )}
                                      </div>
                                      {item.note && (
                                        <div className={`text-xs mt-1 ${isChecked ? 'text-slate-400' : item.important ? 'text-amber-600 font-medium' : 'text-slate-500'}`}>
                                          {item.note}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}

                              {/* Custom items for this category */}
                              {getCustomItemsForCategory(category.id).map((item) => {
                                const isChecked = checklistItems[item.id] || false;
                                return (
                                  <div
                                    key={item.id}
                                    className={`flex items-start gap-3 p-4 transition-colors ${isChecked ? 'bg-green-50/50' : 'hover:bg-slate-50'}`}
                                  >
                                    <button
                                      onClick={() => toggleChecklistItem(item.id)}
                                      className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                                        isChecked
                                          ? 'bg-green-500 border-green-500 text-white'
                                          : 'border-slate-300 hover:border-purple-500'
                                      }`}
                                    >
                                      {isChecked && <Check size={14} strokeWidth={3} />}
                                    </button>
                                    <div className="flex-1 min-w-0">
                                      <div className={`font-medium flex items-center gap-2 ${isChecked ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                                        {item.name}
                                        <span className="text-[10px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded font-bold">自訂</span>
                                      </div>
                                      {item.note && (
                                        <div className={`text-xs mt-1 ${isChecked ? 'text-slate-400' : 'text-slate-500'}`}>
                                          {item.note}
                                        </div>
                                      )}
                                    </div>
                                    {isAuthenticated && (
                                      <button
                                        onClick={() => handleDeleteItem(item.id)}
                                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="刪除項目"
                                      >
                                        <Trash2 size={16} />
                                      </button>
                                    )}
                                  </div>
                                );
                              })}

                              {/* Add new item section */}
                              {isAuthenticated && (
                                <div className="p-4 bg-slate-50/50">
                                  {addingToCategory === category.id ? (
                                    <div className="space-y-3">
                                      <input
                                        type="text"
                                        value={newItemName}
                                        onChange={(e) => setNewItemName(e.target.value)}
                                        placeholder="項目名稱"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        autoFocus
                                      />
                                      <input
                                        type="text"
                                        value={newItemNote}
                                        onChange={(e) => setNewItemNote(e.target.value)}
                                        placeholder="備註 (選填)"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                      />
                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() => handleAddItem(category.id)}
                                          disabled={!newItemName.trim()}
                                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white text-sm font-bold rounded-lg transition-colors"
                                        >
                                          新增
                                        </button>
                                        <button
                                          onClick={() => {
                                            setAddingToCategory(null);
                                            setNewItemName('');
                                            setNewItemNote('');
                                          }}
                                          className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-bold rounded-lg transition-colors"
                                        >
                                          取消
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => setAddingToCategory(category.id)}
                                      className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
                                    >
                                      <Plus size={16} />
                                      新增項目
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Not logged in notice */}
                {!isAuthenticated && (
                  <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
                    <Lock size={20} className="text-amber-600" />
                    <div className="text-sm text-amber-800">
                      <span className="font-bold">提示：</span>請登入後才能勾選清單項目，變更會自動儲存至雲端。
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 z-[2000] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Lock size={24} />
                  <h3 className="text-xl font-bold">登入以編輯清單</h3>
                </div>
                <button
                  onClick={() => {
                    setShowLoginModal(false);
                    setLoginError('');
                    setUsername('');
                    setPassword('');
                  }}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">帳號</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="請輸入帳號"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">密碼</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="請輸入密碼"
                  />
                </div>
                {loginError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
                    {loginError}
                  </div>
                )}
                <button
                  onClick={handleLogin}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl"
                >
                  登入
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 z-[2000] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-red-500 p-6 text-white">
              <div className="flex items-center gap-3">
                <RotateCcw size={24} />
                <h3 className="text-xl font-bold">重置確認</h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-slate-600 mb-6">
                確定要重置所有勾選項目嗎？此操作會將所有項目設為未勾選狀態。
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleResetAll}
                  className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors"
                >
                  確定重置
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
