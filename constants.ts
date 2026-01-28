
import { DayPlan } from './types';

export const ITINERARY_DATA: DayPlan[] = [
  {
    day: 1,
    date: '2026/02/07 (六)',
    title: '抵達仙台、炭烤牛舌之夜',
    color: '#ef4444', // Red
    events: [
      {
        id: '1-1',
        day: 1,
        time: '16:00',
        location: '仙台機場 (SDJ)',
        activity: '抵達 & 取車',
        notes: '領取租車，準備出發',
        lat: 38.139,
        lng: 140.917,
        type: 'transport'
      },
      {
        id: '1-2',
        day: 1,
        time: '17:30',
        location: '御宿 野乃 仙台',
        activity: 'Check-in',
        notes: '寄送大行李至 Day 4 (作並一之坊)',
        lat: 38.262,
        lng: 140.876,
        type: 'stay',
        booking: {
          provider: 'Official Site',
          number: '08M9RYPH',
          price: '85,100円',
          payment: '現地での支払い',
          status: 'ゴールド (Gold)',
          people: 4,
          period: '2026/02/07 - 2026/02/08'
        }
      },
      {
        id: '1-3',
        day: 1,
        time: '19:00',
        location: '仙台市區',
        activity: '晚餐：炭烤牛舌',
        notes: '推薦：善治郎、利久或司',
        lat: 38.26,
        lng: 140.88,
        type: 'food'
      }
    ]
  },
  {
    day: 2,
    date: '2026/02/08 (日)',
    title: '藏王樹冰與雪怪車',
    color: '#3b82f6', // Blue
    events: [
      {
        id: '2-1',
        day: 2,
        time: '08:30',
        location: '御宿 野乃 仙台',
        activity: '出發',
        notes: '前往藏王',
        importantNotes: '🚗 Alphard雪駕要訣：下坡務必用S檔/M檔引擎煞車，冰上單靠腳煞停不住！4WD只幫起步，煞車距離無幫助。',
        lat: 38.262,
        lng: 140.876,
        type: 'stay'
      },
      {
        id: '2-2',
        day: 2,
        time: '10:20',
        location: 'ZAOBOO（蔵王ベースセンター）',
        activity: '停車 & 搭接駁車',
        notes: '停好車後搭 10:25 接駁車上山',
        travelTime: '30分',
        lat: 38.0938,
        lng: 140.5488,
        type: 'transport'
      },
      {
        id: '2-3',
        day: 2,
        time: '10:55',
        location: '宮城藏王澄川雪樂園',
        activity: '抵達 & 報到',
        notes: 'DX車輛到 slope house 報到。穿厚外套、毛帽、手套、雪靴（可現場借）。先上廁所！',
        lat: 38.135143,
        lng: 140.494848,
        type: 'sightseeing'
      },
      {
        id: '2-4',
        day: 2,
        time: '11:30',
        location: '雪怪車 (Wild Monster)',
        activity: '樹冰巡禮',
        notes: '上車時告知司機姓名「Liu」',
        lat: 38.135143,
        lng: 140.494848,
        type: 'sightseeing',
        booking: {
          provider: '樹冰予約',
          number: 'Yi-Cheng Liu / 11-17 Takahashi',
          price: '¥50,000',
          payment: 'AdultDXC x4 ¥46,000 + ONE COIN BUS x8 ¥4,000',
          status: '已確認',
          people: 4
        }
      },
      {
        id: '2-5',
        day: 2,
        time: '14:10',
        location: '澄川雪樂園',
        activity: '搭接駁車下山',
        notes: '搭 14:10 接駁車回 ZAOBOO（14:50抵達）',
        travelTime: '40分',
        lat: 38.135143,
        lng: 140.494848,
        type: 'transport'
      },
      {
        id: '2-6',
        day: 2,
        time: '15:00',
        location: '遠刈田溫泉街',
        activity: '午餐',
        notes: '手工蕎麥麵或漢堡排',
        lat: 38.085,
        lng: 140.57,
        type: 'food'
      },
      {
        id: '2-7',
        day: 2,
        time: '16:00',
        location: 'ゆと森倶楽部',
        activity: 'Check-in',
        notes: '全包式蔬菜料理 Buffet',
        lat: 38.09,
        lng: 140.56,
        type: 'stay',
        booking: {
          provider: 'Official Site',
          number: 'Confirmed',
          price: '已付',
          payment: 'Prepaid',
          status: 'Confirmed',
          people: 4,
          period: '2026/02/08 - 2026/02/09'
        }
      }
    ]
  },
  {
    day: 3,
    date: '2026/02/09 (一)',
    title: '狐狸村與天鵝湖',
    color: '#22c55e', // Green
    events: [
      {
        id: '3-1',
        day: 3,
        time: '09:00',
        location: 'ゆと森倶楽部',
        activity: '出發',
        notes: '⚠️ 勿走導航捷徑（縣道12→51號）！冬季結冰陡坡極危險',
        importantNotes: '🚗 安全路線：國道4號→白石市區→縣道254號（約50分鐘）。254號是狐狸村巴士路線，除雪頻率高、坡度緩。',
        travelTime: '50分',
        lat: 38.09,
        lng: 140.56,
        type: 'stay'
      },
      {
        id: '3-2',
        day: 3,
        time: '10:00',
        location: '藏王狐狸村',
        activity: '抱狐狸體驗',
        notes: '小心隨身物品，勿攜帶閃亮飾品',
        importantNotes: '⚠️ 停車場是大斜坡！進場前減速至5km/h以下。Alphard重2.2噸，結冰路面慣性大，煞車距離長。',
        lat: 38.04,
        lng: 140.53,
        type: 'sightseeing'
      },
      {
        id: '3-3',
        day: 3,
        time: '12:00',
        location: '東北自動車道',
        activity: '移動',
        notes: '往南行駛',
        lat: 37.8,
        lng: 140.4,
        type: 'transport'
      },
      {
        id: '3-4',
        day: 3,
        time: '14:00',
        location: '豬苗代湖 (長濱)',
        activity: '賞天鵝',
        notes: '西伯利亞飛來的天鵝與野鴨。⛩️ 備案：開成山大神宮（距飯店20分鐘）- 1876年建造，供奉日本唯一的伊勢神宮分靈',
        importantNotes: '⚠️ 此區有「地吹雪」風險，可能造成白化現象(Whiteout)能見度0公尺。遇白化請勿急煞，開雙黃燈與霧燈慢速前進。風雪過大建議放棄湖邊行程，改去開成山大神宮或直接前往飯店。',
        lat: 37.52,
        lng: 140.08,
        type: 'sightseeing'
      },
      {
        id: '3-5',
        day: 3,
        time: '16:30',
        location: '磐梯熱海溫泉 華之湯',
        activity: 'Check-in',
        notes: '30種浴池溫泉迷宮',
        lat: 37.48,
        lng: 140.27,
        type: 'stay',
        booking: {
          provider: 'Official Site',
          number: '09MCJ60H',
          price: '99,900円',
          payment: '現地での支払い',
          status: 'ゴールド (Gold)',
          people: 4,
          period: '2026/02/09 - 2026/02/10'
        }
      }
    ]
  },
  {
    day: 4,
    date: '2026/02/10 (二)',
    title: '威士忌與Outlets購物',
    color: '#a855f7', // Purple
    events: [
      {
        id: '4-1',
        day: 4,
        time: '09:00',
        location: '華之湯',
        activity: '出發',
        notes: '北上前往仙台作並',
        lat: 37.48,
        lng: 140.27,
        type: 'stay'
      },
      {
        id: '4-2',
        day: 4,
        time: '11:00',
        location: 'Nikka 威士忌宮城峽蒸溜所',
        activity: '參觀',
        notes: '威士忌試飲',
        lat: 38.3,
        lng: 140.65,
        type: 'sightseeing'
      },
      {
        id: '4-3',
        day: 4,
        time: '12:30',
        location: '仙台泉 Premium Outlets',
        activity: '午餐 & 購物',
        notes: '好逛好買',
        lat: 38.34,
        lng: 140.83,
        type: 'shopping'
      },
      {
        id: '4-4',
        day: 4,
        time: '15:30',
        location: '作並溫泉 一之坊',
        activity: 'Check-in',
        notes: '全包式 Order Buffet',
        lat: 38.31,
        lng: 140.62,
        type: 'stay',
        booking: {
          provider: 'Official Site',
          number: '09MCKVCF',
          price: '150,400円',
          payment: '現地での支払い',
          status: 'ゴールド (Gold)',
          people: 4,
          period: '2026/02/10 - 2026/02/11'
        }
      }
    ]
  },
  {
    day: 5,
    date: '2026/02/11 (三)',
    title: '世界遺產中尊寺與暖桌遊船',
    color: '#f97316', // Orange
    events: [
      {
        id: '5-1',
        day: 5,
        time: '08:30',
        location: '作並溫泉 一之坊',
        activity: '出發',
        notes: '請提早吃早餐！8:30 準時出發。預留除雪車擋道/路面結冰的20分鐘緩衝',
        importantNotes: '⚠️ 關鍵時間！Google說1h20m，但需預留緩衝，實際抓1h45m',
        travelTime: '1h45m',
        lat: 38.31,
        lng: 140.62,
        type: 'stay'
      },
      {
        id: '5-2',
        day: 5,
        time: '10:15',
        location: '中尊寺',
        activity: '抵達 & 計程車上山',
        notes: '停「町營停車場（第一停車場）」。不要爬月見坂！直接攔計程車載到山頂「坂の上駐車場」',
        importantNotes: '⚠️ 月見坂結冰大斜坡極危險！計程車戰術省力又安全',
        lat: 39.002,
        lng: 141.1,
        type: 'transport'
      },
      {
        id: '5-3',
        day: 5,
        time: '10:30',
        location: '中尊寺 金色堂',
        activity: '參觀世界遺產',
        notes: '重點：金色堂（國寶）、讚衡藏。下山可穿冰爪慢走或再叫計程車',
        importantNotes: '⏰ 必須 11:50 前回到停車場的車上！',
        lat: 39.002,
        lng: 141.1,
        type: 'sightseeing'
      },
      {
        id: '5-4',
        day: 5,
        time: '11:50',
        location: '中尊寺',
        activity: '離開',
        notes: '鄉間道路積雪可能較深',
        travelTime: '40分',
        lat: 39.002,
        lng: 141.1,
        type: 'transport'
      },
      {
        id: '5-5',
        day: 5,
        time: '12:30',
        location: '猊鼻溪',
        activity: '抵達 & 買票',
        notes: '⚠️ 船程90分鐘，船上沒廁所！長輩務必先上廁所。可買烤香魚或糰子墊肚子',
        lat: 38.99,
        lng: 141.25,
        type: 'sightseeing'
      },
      {
        id: '5-6',
        day: 5,
        time: '13:00',
        location: '猊鼻溪',
        activity: '暖桌遊船（90分鐘）',
        notes: '整趟行程最放鬆的時刻。聽船夫唱民謠。14:30 下船',
        lat: 38.99,
        lng: 141.25,
        type: 'sightseeing'
      },
      {
        id: '5-7',
        day: 5,
        time: '14:40',
        location: '猊鼻溪',
        activity: '出發往飯店',
        notes: '車程約1小時',
        travelTime: '1h',
        lat: 38.99,
        lng: 141.25,
        type: 'transport'
      },
      {
        id: '5-8',
        day: 5,
        time: '15:45',
        location: '湯之杜 志戶平',
        activity: 'Check-in',
        notes: '趁天亮 Check-in，享受飯店設施。家庭自助餐',
        lat: 39.42,
        lng: 141.08,
        type: 'stay',
        booking: {
          provider: 'Official Site',
          number: '09MCR7HK',
          price: '94,608円',
          payment: '現地での支払い',
          status: 'ゴールド (Gold)',
          people: 4,
          period: '2026/02/11 - 2026/02/12'
        }
      }
    ]
  },
  {
    day: 6,
    date: '2026/02/12 (四)',
    title: '銀山溫泉大正浪漫',
    color: '#ec4899', // Pink
    events: [
      {
        id: '6-1',
        day: 6,
        time: '09:00',
        location: '湯之杜 志戶平',
        activity: '出發',
        notes: '南下前往銀山',
        lat: 39.42,
        lng: 141.08,
        type: 'stay'
      },
      {
        id: '6-2',
        day: 6,
        time: '12:00',
        location: '銀山溫泉',
        activity: '大正浪漫散策',
        notes: '接駁車進入，拍照',
        importantNotes: '⚠️ 前往鳴子溫泉時，導航若顯示「國道347號(鍋越峠)」較快請無視！該路山路狹窄、積雪極深、易遇雪崩。請走「國道13號」往北→接「國道47號」往東。',
        lat: 38.57,
        lng: 140.53,
        type: 'sightseeing'
      },
      {
        id: '6-3',
        day: 6,
        time: '15:00',
        location: '鳴子溫泉 湯元 吉祥',
        activity: 'Check-in',
        notes: '硫磺泉與美味自助餐',
        lat: 38.74,
        lng: 140.71,
        type: 'stay',
        booking: {
          provider: 'Official Site',
          number: '09ME28RN',
          price: '88,000円',
          payment: '現地での支払い',
          status: 'ゴールド (Gold)',
          people: 4,
          period: '2026/02/12 - 2026/02/13'
        }
      }
    ]
  },
  {
    day: 7,
    date: '2026/02/13 (五)',
    title: '秋保大瀑布與名湯',
    color: '#14b8a6', // Teal
    events: [
      {
        id: '7-1',
        day: 7,
        time: '10:00',
        location: '鳴子溫泉',
        activity: '出發',
        notes: '前往秋保',
        importantNotes: '⚠️ 避開「國道108號(鬼首峠)」！豪雪地帶路面凍結、髮夾彎多。請走國道47號往東→國道4號往南。',
        lat: 38.74,
        lng: 140.71,
        type: 'stay'
      },
      {
        id: '7-2',
        day: 7,
        time: '13:00',
        location: '秋保大瀑布',
        activity: '觀瀑',
        notes: '日本三大名瀑',
        importantNotes: '⚠️ 停車場到瀑布底的樓梯冬天結冰嚴重如溜滑梯，每年都有遊客滑倒骨折！建議只在上方「瀧見台」展望台欣賞，千萬不要走下溪谷底部。',
        lat: 38.27,
        lng: 140.6,
        type: 'sightseeing'
      },
      {
        id: '7-3',
        day: 7,
        time: '14:00',
        location: '秋保溫泉 瑞鳳',
        activity: 'Check-in',
        notes: '宮城縣最強自助餐',
        lat: 38.22,
        lng: 140.72,
        type: 'stay',
        booking: {
          provider: 'Official Site',
          number: '09ME3C3C',
          price: '72,500円',
          payment: '現地での支払い',
          status: 'ゴールド (Gold)',
          people: 4,
          period: '2026/02/13 - 2026/02/14'
        }
      }
    ]
  },
  {
    day: 8,
    date: '2026/02/14 (六)',
    title: '鹽竈神社與松島絕景',
    color: '#6366f1', // Indigo
    events: [
      {
        id: '8-1',
        day: 8,
        time: '10:00',
        location: '秋保溫泉',
        activity: '出發',
        notes: '前往鹽釜',
        lat: 38.22,
        lng: 140.72,
        type: 'stay'
      },
      {
        id: '8-2',
        day: 8,
        time: '11:00',
        location: '鹽竈神社',
        activity: '參拜',
        notes: '欣賞海景',
        lat: 38.32,
        lng: 141.02,
        type: 'sightseeing'
      },
      {
        id: '8-3',
        day: 8,
        time: '12:30',
        location: '鹽釜壽司名店',
        activity: '午餐',
        notes: '龜喜壽司 (頂級鮪魚)',
        lat: 38.315,
        lng: 141.025,
        type: 'food'
      },
      {
        id: '8-4',
        day: 8,
        time: '15:00',
        location: '松島溫泉 一之坊',
        activity: 'Check-in',
        notes: '絕美海景露天風呂',
        lat: 38.37,
        lng: 141.06,
        type: 'stay',
        booking: {
          provider: 'Official Site',
          number: 'T1BE01C9F2FFA',
          price: '79,200円',
          payment: 'Prepaid',
          status: 'Confirmed',
          people: 2,
          period: '2026/02/14 - 2026/02/15'
        }
      },
      {
        id: '8-5',
        day: 8,
        time: '15:00',
        location: '松島溫泉 一之坊 (Room 2)',
        activity: 'Check-in',
        notes: '第二間房',
        lat: 38.37,
        lng: 141.06,
        type: 'stay'
      }
    ]
  },
  {
    day: 9,
    date: '2026/02/15 (日)',
    title: '松島日出與返台',
    color: '#eab308', // Yellow
    events: [
      {
        id: '9-1',
        day: 9,
        time: '06:30',
        location: '松島溫泉 一之坊',
        activity: '日出',
        notes: '松島灣絕景',
        lat: 38.37,
        lng: 141.06,
        type: 'sightseeing'
      },
      {
        id: '9-2',
        day: 9,
        time: '11:00',
        location: '松島',
        activity: '漫遊',
        notes: '五大堂、瑞嚴寺',
        lat: 38.37,
        lng: 141.06,
        type: 'sightseeing'
      },
      {
        id: '9-3',
        day: 9,
        time: '14:00',
        location: '仙台機場 (SDJ)',
        activity: '還車 & 報到',
        notes: '星宇航空 JX863',
        lat: 38.139,
        lng: 140.917,
        type: 'flight',
        flight: {
          airline: '星宇航空 STARLUX',
          flightNumber: 'JX863',
          departureTime: '17:00',
          arrivalTime: '20:00',
          departureAirport: 'SDJ 仙台',
          arrivalAirport: 'TPE 台北桃園',
          terminal: '',
          class: '經濟艙',
          baggage: '',
          status: 'OK',
          duration: '04:00'
        }
      }
    ]
  }
];

// 冬季危險/封閉路段警告
export interface DangerousRoute {
  id: string;
  name: string;
  nameJa: string;
  status: 'closed' | 'dangerous' | 'caution';
  description: string;
  coordinates: [number, number][];
  affectedDays?: number[];
}

export const DANGEROUS_ROUTES: DangerousRoute[] = [
  {
    id: 'eco-line',
    name: '藏王 Eco-Line',
    nameJa: '蔵王エコーライン',
    status: 'closed',
    description: '冬季全線封閉！連接宮城縣(遠刈田)與山形縣(藏王溫泉)的山頂橫貫公路。無法直接開過山頂去山形，必須原路下山。',
    coordinates: [
      [38.085, 140.57],  // 遠刈田溫泉
      [38.10, 140.52],
      [38.12, 140.47],
      [38.14, 140.43],
      [38.16, 140.40],   // 藏王溫泉方向
    ],
    affectedDays: [2]
  },
  {
    id: 'route-347',
    name: '國道 347 號 (鍋越峠)',
    nameJa: '国道347号',
    status: 'dangerous',
    description: '極度危險！山路狹窄、積雪極深，Alphard寬車身會車困難，易遇雪崩倒木。銀山→鳴子請走國道13號→國道47號。',
    coordinates: [
      [38.60, 140.41],   // 尾花澤側
      [38.62, 140.48],
      [38.64, 140.55],
      [38.66, 140.62],
      [38.68, 140.68],   // 加美/宮城側
    ],
    affectedDays: [6]
  },
  {
    id: 'route-108',
    name: '國道 108 號 (鬼首峠)',
    nameJa: '国道108号',
    status: 'dangerous',
    description: '危險路段！豪雪地帶，路面凍結嚴重，髮夾彎多。鳴子→秋保請走國道47號→國道4號。',
    coordinates: [
      [38.74, 140.71],   // 鳴子溫泉
      [38.78, 140.65],
      [38.82, 140.58],
      [38.86, 140.52],
      [38.90, 140.48],   // 鬼首方向
    ],
    affectedDays: [7]
  },
  {
    id: 'sumikawa-road',
    name: '縣道12號 (澄川雪樂園)',
    nameJa: '県道12号',
    status: 'caution',
    description: '高風險！海拔急升，路面為壓實雪壁。建議大雪時停車遠刈田，改搭免費接駁巴士「樹冰號」。',
    coordinates: [
      [38.085, 140.57],  // 遠刈田溫泉
      [38.10, 140.56],
      [38.11, 140.55],
      [38.125, 140.55],  // 澄川雪樂園
    ],
    affectedDays: [2]
  }
];
