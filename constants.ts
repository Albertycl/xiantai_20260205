
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
      { id: '2-1', day: 2, time: '10:00', location: '富士野生動物園', activity: '叢林巴士、自駕Safari', notes: '10:00 開門 (冬季) / 親近野生動物', travelTime: '約 1 小時 30 分', lat: 35.247, lng: 138.838, type: 'sightseeing' },
      { id: '2-2', day: 2, time: '11:15', location: '富士野生動物園', activity: 'Super Jungle Bus', notes: '要出示門票 / 需提早報到', lat: 35.247, lng: 138.838, type: 'sightseeing' },
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
      { id: '3-0', day: 3, time: '08:30', location: 'HOTEL CLAD', activity: '飯店出發', notes: '務必準時出發，確保 10:00 能到橫濱', travelTime: '約 1.5 小時 (東名高速)', lat: 35.308, lng: 138.966, type: 'stay' },
      { id: '3-1', day: 3, time: '10:00', location: '橫濱紅磚倉庫', activity: '逛街/拍照', notes: '只有約 1 小時，專注拍照逛街', travelTime: '停車：紅磚倉庫停車場', lat: 35.459, lng: 139.642, type: 'sightseeing' },
      { id: '3-2', day: 3, time: '11:20', location: '前往地標塔', activity: '關鍵移動', notes: '務必準時離開，開車至地標塔停車場', travelTime: '約 10 分鐘', lat: 35.455, lng: 139.631, type: 'transport' },
      { id: '3-3', day: 3, time: '11:45', location: 'Sky Duck 售票處', activity: '集合報到', notes: '日本丸紀念公園 Sky Duck 售票處 / 神奈川縣橫濱市西區港未來2-1-1', lat: 35.454, lng: 139.632, type: 'sightseeing' },
      { id: '3-4', day: 3, time: '12:00', location: 'Sky Duck 水陸巴士', activity: '【D801】みなとハイカラコース', notes: '7,200円 (2位) / 約50-60分 / 僅日語導覽 / 無窗設計注意保暖 / 禁食物、僅可帶有蓋飲品', lat: 35.454, lng: 139.632, type: 'sightseeing' },
      { id: '3-5', day: 3, time: '13:00', location: 'Landmark Plaza', activity: '午餐', notes: 'Shake Shack、炸豬排等', lat: 35.455, lng: 139.631, type: 'food' },
      { id: '3-6', day: 3, time: '14:30', location: 'HARBS 下午茶', activity: '下午茶', notes: 'Landmark Plaza 3F 吃草莓蛋糕', lat: 35.455, lng: 139.631, type: 'food' },
      { id: '3-7', day: 3, time: '15:30', location: '前往東京新宿', activity: '移動', notes: '開車約 1 小時 (首都高)', lat: 35.694, lng: 139.695, type: 'transport' },
      {
        id: '3-8',
        day: 3,
        time: '16:30',
        location: '西鐵 Inn 新宿',
        activity: 'Check-in & 停車',
        notes: '1. 下行李 2. 停好車 3. 休息',
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
      { id: '3-9', day: 3, time: '17:30', location: '東京都廳 南展望室', activity: '賞夜景', notes: '免費夜景 (走路 10 分鐘)', lat: 35.689, lng: 139.691, type: 'sightseeing' },
      { id: '3-10', day: 3, time: '18:30', location: '牛舌の檸檬', activity: '晚餐', notes: '記得預約！極厚切牛舌', lat: 35.693, lng: 139.698, type: 'food' },
      { id: '3-11', day: 3, time: '20:00', location: '回憶橫丁', activity: '夜生活', notes: '昭和風情紅燈籠窄巷', lat: 35.693, lng: 139.699, type: 'sightseeing' },
      { id: '3-12', day: 3, time: '20:30', location: '歌舞伎町', activity: '夜生活', notes: '哥吉拉飯店、唐吉訶德', lat: 35.694, lng: 139.702, type: 'sightseeing' },
      { id: '3-13', day: 3, time: '21:30', location: '西鐵 Inn 新宿', activity: '休息', notes: '步行回飯店', lat: 35.694, lng: 139.695, type: 'stay' }
    ]
  },
  {
    day: 4,
    date: '2026/01/23 (五)',
    title: '強運、行軍與頂級牛排',
    color: '#a855f7', // Purple
    events: [
      { id: '4-0', day: 4, time: '07:30', location: '西鐵 Inn 新宿', activity: '飯店出發', notes: '先去伊勢丹排隊', lat: 35.694, lng: 139.695, type: 'stay' },
      { id: '4-1', day: 4, time: '09:30', location: '伊勢丹百貨 新宿店 B1', activity: '排隊買費南雪', notes: 'noix de beurre 10:00開門前到！', details: '10:00 開門前就要到排隊，這家很熱門！\n\n📍 位置：伊勢丹百貨 新宿店 (Isetan Shinjuku) 的 B1 地下街\n\n🧁 目標：「noix de beurre (ノワ・ドゥ・ブール)」的費南雪 (Financier)\n\n⚠️ 注意：店家非常熱門，建議開店前就去排隊', lat: 35.691, lng: 139.704, type: 'shopping' },
      { id: '4-2', day: 4, time: '10:30', location: '築地場外市場', activity: 'Brunch', notes: '海鮮大賞', lat: 35.665, lng: 139.771, type: 'food' },
      { id: '4-3', day: 4, time: '11:30', location: '小網神社', activity: '參拜', notes: '強運厄除、洗錢', lat: 35.685, lng: 139.777, type: 'sightseeing' },
      { id: '4-4', day: 4, time: '12:30', location: '銀座 炸豬排 檍', activity: '午餐', notes: '極上炸豬排', lat: 35.669, lng: 139.761, type: 'food' },
      { id: '4-5', day: 4, time: '13:30', location: 'SHIBUYA SKY', activity: '賞夕陽夜景', notes: '澀谷之巔', lat: 35.658, lng: 139.702, type: 'sightseeing' },
      { id: '4-6', day: 4, time: '14:00', location: '皇居二重橋', activity: '散步', notes: '皇室氣派', lat: 35.679, lng: 139.758, type: 'sightseeing' },
      { id: '4-7', day: 4, time: '15:30', location: '宮下公園', activity: '散步/咖啡', notes: '澀谷新地標星巴克', lat: 35.662, lng: 139.702, type: 'sightseeing' },
      { id: '4-8', day: 4, time: '18:00', location: 'AND THE FRIET', activity: '點心', notes: '澀谷 Hikarie B2F', lat: 35.658, lng: 139.703, type: 'food' },
      { id: '4-9', day: 4, time: '18:30', location: 'Peter Luger Steakhouse', activity: '頂級晚餐', notes: '惠比壽分店', lat: 35.643, lng: 139.715, type: 'food' },
      { id: '4-10', day: 4, time: '21:00', location: '西鐵 Inn 新宿', activity: '住宿', notes: '返回住宿', lat: 35.694, lng: 139.695, type: 'stay' }
    ]
  },
  {
    day: 5,
    date: '2026/01/24 (六)',
    title: '雙龍鳥居、巴西烤肉與返台',
    color: '#f97316', // Orange
    events: [
      { id: '5-0', day: 5, time: '07:45', location: '西鐵 Inn 新宿', activity: '提早退房/出發', notes: '行李全上車，把時間留給西邊的神社', lat: 35.694, lng: 139.695, type: 'stay' },
      { id: '5-1', day: 5, time: '08:15', location: '馬橋稻荷神社', activity: '必去！雙龍鳥居', notes: '東京三鳥居之一，觸摸昇龍祈求運勢高升', lat: 35.7076, lng: 139.6297, type: 'sightseeing' },
      { id: '5-2', day: 5, time: '09:30', location: '皆中稻荷神社', activity: '百發百中/偏財', notes: '新宿大久保，求偏財運御守', lat: 35.7006, lng: 139.6987, type: 'sightseeing' },
      { id: '5-3', day: 5, time: '10:30', location: '前往六本木', activity: '自駕移動', notes: '停六本木之丘 P1 或 P2 停車場', lat: 35.660, lng: 139.731, type: 'transport' },
      { id: '5-4', day: 5, time: '11:30', location: 'Barbacoa 六本木之丘店', activity: '午餐/準時入場', notes: 'Google 4.6分，West Walk 5F，無限巴西烤肉', lat: 35.6604, lng: 139.7292, type: 'food' },
      { id: '5-5', day: 5, time: '13:30', location: '出發往成田', activity: '關鍵移動', notes: '吃飽後直接從六本木上高速公路', lat: 35.660, lng: 139.731, type: 'transport' },
      { id: '5-6', day: 5, time: '15:00', location: '成田山 新勝寺', activity: '最後的郊區散步', notes: '去出世稻荷求事業財運，成田山公園適合散步', lat: 35.7847, lng: 140.3183, type: 'sightseeing' },
      { id: '5-7', day: 5, time: '17:00', location: '永旺夢樂城成田', activity: '備案/最後補給', notes: 'Aeon Mall，上飛機前買零食、加滿油', lat: 35.7727, lng: 140.3586, type: 'shopping' },
      { id: '5-8', day: 5, time: '17:40', location: '成田機場附近加油站', activity: '加油', notes: '日本還車規定要滿油還車', lat: 35.775, lng: 140.385, type: 'transport' },
      { id: '5-9', day: 5, time: '18:00', location: 'ORIX 租車成田機場店', activity: '還車', notes: '辦理還車手續，接駁車送至航廈', lat: 35.772, lng: 140.392, type: 'transport' },
      {
        id: '5-10',
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
