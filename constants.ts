
import { DayPlan } from './types';

export const ITINERARY_DATA: DayPlan[] = [
  {
    day: 1,
    date: '2026/01/20 (二)',
    title: '抵達、燈飾與壽司迎賓',
    color: '#ef4444', // Red
    events: [
      {
        id: '1-1',
        day: 1,
        time: '12:00',
        location: '成田機場 (NRT)',
        activity: '抵達機場',
        notes: '第一航廈',
        lat: 35.772,
        lng: 140.392,
        type: 'flight',
        flight: {
          airline: 'EVA AIR 長榮航空',
          flightNumber: 'BR184',
          departureTime: '07:55',
          arrivalTime: '12:00',
          departureAirport: 'TPE 台北桃園',
          arrivalAirport: 'NRT 東京成田',
          terminal: '第一航廈',
          class: 'V / 經濟艙',
          baggage: '1PC',
          status: 'OK',
          duration: '03:05'
        }
      },
      {
        id: '1-2',
        day: 1,
        time: '13:00',
        location: 'ORIX 租車成田機場店',
        activity: '取車手續',
        notes: '預約號: 112072138 (PW: dcf3dd1a) / 68,420円 / Compact Hybrid (EA)',
        lat: 35.765,
        lng: 140.385,
        type: 'transport'
      },
      { id: '1-3', day: 1, time: '15:30', location: '讀賣樂園', activity: '寶石燈飾秀', notes: '必看絕美點燈', lat: 35.625, lng: 139.517, type: 'sightseeing' },
      { id: '1-4', day: 1, time: '20:00', location: '梅丘壽司之美登利', activity: '晚餐', notes: '新百合之丘OPA店', lat: 35.602, lng: 139.508, type: 'food' },
      {
        id: '1-5',
        day: 1,
        time: '21:30',
        location: 'Hotel Molino Shin-Yuri',
        activity: '住宿 Check-in',
        notes: '首晚歇息',
        lat: 35.602,
        lng: 139.508,
        type: 'stay',
        booking: {
          provider: 'Official Site',
          number: '0VM5XXCV',
          price: '30,114円',
          payment: '現地での支払い',
          status: 'ゴールド (Gold)',
          people: 2,
          period: '2026/01/20 - 2026/01/21'
        }
      }
    ]
  },
  {
    day: 2,
    date: '2026/01/21 (三)',
    title: '富士野生動物園全制霸',
    color: '#3b82f6', // Blue
    events: [
      { id: '2-0', day: 2, time: '08:00', location: 'Hotel Molino Shin-Yuri', activity: '飯店出發', notes: '自駕往御殿場方向', lat: 35.602, lng: 139.508, type: 'stay' },
      { id: '2-1', day: 2, time: '09:30', location: '富士野生動物園', activity: '叢林巴士、自駕Safari', notes: '親近野生動物', travelTime: '約 1 小時 30 分', lat: 35.247, lng: 138.838, type: 'sightseeing' },
      { id: '2-2', day: 2, time: '11:15', location: '富士野生動物園', activity: 'Super Jungle Bus', notes: '需提早報到', lat: 35.247, lng: 138.838, type: 'sightseeing' },
      { id: '2-3', day: 2, time: '16:00', location: 'Sawayaka 漢堡 炭焼きレストランさわやか 御殿場インター店', activity: '抽號碼牌', notes: '必吃漢堡排，需提前抽號', travelTime: '約 40 分', lat: 35.294, lng: 138.945, type: 'food' },
      { id: '2-4', day: 2, time: '17:00', location: '御殿場 Premium Outlets', activity: '逛街購物', notes: '精品與風景', importantNotes: '持長榮登機證換旅行袋', travelTime: '約 10 分', lat: 35.308, lng: 138.966, type: 'shopping' },
      { id: '2-5', day: 2, time: '21:00', location: '木之花之湯', activity: '溫泉享受', notes: '放鬆身心', lat: 35.305, lng: 138.968, type: 'sightseeing' },
      {
        id: '2-6',
        day: 2,
        time: '22:00',
        location: 'HOTEL CLAD',
        activity: '住宿',
        notes: '御殿場住宿',
        lat: 35.308,
        lng: 138.966,
        type: 'stay',
        booking: {
          provider: 'Official Site',
          number: '09MX8JW1',
          price: '29,080円',
          payment: 'オンラインカード決済',
          status: 'ゴールド (Gold)',
          people: 2,
          period: '2026/01/21 - 2026/01/22'
        }
      }
    ]
  },
  {
    day: 3,
    date: '2026/01/22 (四)',
    title: '圍爐裏燒烤與新宿之夜',
    color: '#22c55e', // Green
    events: [
      { id: '3-0', day: 3, time: '08:30', location: 'HOTEL CLAD', activity: '飯店出發', notes: '往山中湖', lat: 35.308, lng: 138.966, type: 'stay' },
      { id: '3-1', day: 3, time: '09:30', location: '山中湖 KABA BUS', activity: '水陸巴士', notes: '湖上體驗', lat: 35.423, lng: 138.875, type: 'sightseeing' },
      { id: '3-2', day: 3, time: '11:30', location: '新倉山淺間公園', activity: '參拜/拍照', notes: '忠靈塔必拍', lat: 35.491, lng: 138.804, type: 'sightseeing' },
      { id: '3-3', day: 3, time: '13:00', location: '山麓園 Sanrokuen', activity: '午餐', notes: '傳統圍爐裏燒烤', lat: 35.485, lng: 138.773, type: 'food' },
      {
        id: '3-4',
        day: 3,
        time: '16:30',
        location: '西鐵 Inn 新宿',
        activity: '還車/Check-in',
        notes: '入住西鐵 Inn',
        lat: 35.694,
        lng: 139.695,
        type: 'stay',
        booking: {
          provider: 'Official Site',
          number: '09MQGKHC',
          price: '42,200円',
          payment: '現地での支払い',
          status: 'ゴールド (Gold)',
          people: 2,
          period: '2026/01/22 - 2026/01/24'
        }
      },
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
    color: '#a855f7', // Purple
    events: [
      { id: '4-0', day: 4, time: '07:30', location: '西鐵 Inn 新宿', activity: '飯店出發', notes: '前往築地', lat: 35.694, lng: 139.695, type: 'stay' },
      { id: '4-1', day: 4, time: '08:00', location: '築地場外市場', activity: '吃早餐', notes: '海鮮大賞', lat: 35.665, lng: 139.771, type: 'food' },
      { id: '4-2', day: 4, time: '09:30', location: '小網神社', activity: '參拜', notes: '強運厄除、洗錢', lat: 35.685, lng: 139.777, type: 'sightseeing' },
      { id: '4-3', day: 4, time: '11:00', location: '銀座 炸豬排 檍', activity: '午餐', notes: '極上炸豬排', lat: 35.669, lng: 139.761, type: 'food' },
      { id: '4-4', day: 4, time: '12:30', location: '皇居二重橋', activity: '散步', notes: '皇室氣派', lat: 35.679, lng: 139.758, type: 'sightseeing' },
      { id: '4-5', day: 4, time: '14:30', location: '宮下公園', activity: '散步/咖啡', notes: '澀谷新地標星巴克', lat: 35.662, lng: 139.702, type: 'sightseeing' },
      { id: '4-6', day: 4, time: '16:00', location: 'SHIBUYA SKY', activity: '賞夕陽夜景', notes: '澀谷之巔', lat: 35.658, lng: 139.702, type: 'sightseeing' },
      { id: '4-7', day: 4, time: '17:30', location: 'AND THE FRIET', activity: '點心', notes: '澀谷 Hikarie B2F', lat: 35.658, lng: 139.703, type: 'food' },
      { id: '4-8', day: 4, time: '18:30', location: 'Peter Luger Steakhouse', activity: '頂級晚餐', notes: '惠比壽分店', lat: 35.643, lng: 139.715, type: 'food' },
      { id: '4-9', day: 4, time: '21:00', location: '西鐵 Inn 新宿', activity: '住宿', notes: '返回住宿', lat: 35.694, lng: 139.695, type: 'stay' }
    ]
  },
  {
    day: 5,
    date: '2026/01/24 (六)',
    title: '招財貓、吉祥寺與返台',
    color: '#f97316', // Orange
    events: [
      { id: '5-0', day: 5, time: '07:00', location: '西鐵 Inn 新宿', activity: '飯店出發', notes: '最後一天行程', lat: 35.694, lng: 139.695, type: 'stay' },
      { id: '5-1', day: 5, time: '07:30', location: '明治神宮', activity: '晨間散步', notes: '森林芬多精', lat: 35.676, lng: 139.699, type: 'sightseeing' },
      { id: '5-2', day: 5, time: '09:00', location: '豪德寺', activity: '參拜', notes: '招財貓起源', lat: 35.648, lng: 139.647, type: 'sightseeing' },
      { id: '5-3', day: 5, time: '10:30', location: '下北澤', activity: '逛街', notes: '古著與咖啡', lat: 35.662, lng: 139.667, type: 'shopping' },
      { id: '5-4', day: 5, time: '12:00', location: '根岸牛舌 吉祥寺店', activity: '午餐', notes: 'Negishi 精選', lat: 35.703, lng: 139.580, type: 'food' },
      { id: '5-5', day: 5, time: '13:00', location: '井之頭恩賜公園', activity: '散步', notes: '舒適綠意', lat: 35.700, lng: 139.576, type: 'sightseeing' },
      { id: '5-6', day: 5, time: '15:30', location: '成田機場 (NRT)', activity: '自駕前往機場', notes: '還車 (17:30截止)', lat: 35.772, lng: 140.392, type: 'transport' },
      {
        id: '5-7',
        day: 5,
        time: '20:20',
        location: '成田機場 (NRT)',
        activity: '搭機返台',
        notes: '第一航廈 BR195',
        lat: 35.772,
        lng: 140.392,
        type: 'flight',
        flight: {
          airline: 'EVA AIR 長榮航空',
          flightNumber: 'BR195',
          departureTime: '20:20',
          arrivalTime: '23:25',
          departureAirport: 'NRT 東京成田',
          arrivalAirport: 'TPE 台北桃園',
          terminal: '第一航廈',
          class: 'Q / 經濟艙',
          baggage: '2PC',
          status: 'OK',
          duration: '04:05'
        }
      }
    ]
  }
];
