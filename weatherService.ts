import React from 'react';
import { Sun, CloudSnow, CloudRain, Cloud, CloudFog } from 'lucide-react';
import { DayPlan, WeatherData } from './types';

// WMO Weather interpretation codes (WW)
// 0: Clear sky
// 1, 2, 3: Mainly clear, partly cloudy, and overcast
// 45, 48: Fog and depositing rime fog
// 51, 53, 55: Drizzle: Light, moderate, and dense intensity
// 61, 63, 65: Rain: Slight, moderate and heavy intensity
// 71, 73, 75: Snow fall: Slight, moderate, and heavy intensity
// 80, 81, 82: Rain showers: Slight, moderate, and violent
// 85, 86: Snow showers slight and heavy
// 95: Thunderstorm: Slight or moderate
// 96, 99: Thunderstorm with slight and heavy hail

const getWeatherIcon = (code: number) => {
    if (code === 0 || code === 1) return React.createElement(Sun, { className: "text-orange-400" });
    if (code === 2 || code === 3) return React.createElement(Cloud, { className: "text-gray-400" });
    if (code >= 45 && code <= 48) return React.createElement(CloudFog, { className: "text-gray-400" });
    if (code >= 51 && code <= 67) return React.createElement(CloudRain, { className: "text-blue-400" });
    if (code >= 71 && code <= 77) return React.createElement(CloudSnow, { className: "text-blue-200" });
    if (code >= 80 && code <= 82) return React.createElement(CloudRain, { className: "text-blue-500" });
    if (code >= 85 && code <= 86) return React.createElement(CloudSnow, { className: "text-blue-300" });
    return React.createElement(Sun, { className: "text-orange-400" }); // Default
};

const getWeatherDesc = (code: number) => {
    if (code === 0) return '晴朗';
    if (code === 1) return '大致晴朗';
    if (code === 2) return '多雲';
    if (code === 3) return '陰天';
    if (code >= 45 && code <= 48) return '有霧';
    if (code >= 51 && code <= 55) return '毛毛雨';
    if (code >= 61 && code <= 65) return '下雨';
    if (code >= 71 && code <= 75) return '下雪';
    if (code >= 80 && code <= 82) return '陣雨';
    if (code >= 85 && code <= 86) return '陣雪';
    if (code >= 95) return '雷雨';
    return '晴朗';
};

const getFujiVisibility = (cloudCover: number) => {
    if (cloudCover < 30) return '極高';
    if (cloudCover < 50) return '高';
    if (cloudCover < 70) return '中';
    if (cloudCover < 90) return '低';
    return '極低';
};

export const fetchWeatherData = async (itinerary: DayPlan[]): Promise<WeatherData[]> => {
    const results: WeatherData[] = [];
    const today = new Date();

    // For each day in the itinerary
    for (const dayPlan of itinerary) {
        // Parse date from "2026/01/20 (二)" format
        const dateStr = dayPlan.date.split(' ')[0].replace(/\//g, '-'); // 2026-01-20
        const targetDate = new Date(dateStr);

        // Check if date is within 14 days (Open-Meteo forecast limit is usually 14-16 days)
        const diffTime = targetDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const isHistorical = diffDays > 14 || diffDays < 0;

        // Use first event location for coordinates, or default to Tokyo
        const firstEvent = dayPlan.events[0];
        const lat = firstEvent ? firstEvent.lat : 35.6895;
        const lng = firstEvent ? firstEvent.lng : 139.6917;

        let url = '';
        let queryDate = dateStr;

        if (isHistorical) {
            // Use 2025 data
            queryDate = dateStr.replace('2026', '2025');
            url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lng}&start_date=${queryDate}&end_date=${queryDate}&daily=weather_code,temperature_2m_max,temperature_2m_min,cloud_cover_mean&timezone=Asia%2FTokyo`;
        } else {
            // Use forecast
            url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&start_date=${dateStr}&end_date=${dateStr}&daily=weather_code,temperature_2m_max,temperature_2m_min,cloud_cover_mean&timezone=Asia%2FTokyo`;
        }

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.daily) {
                const maxTemp = Math.round(data.daily.temperature_2m_max[0]);
                const minTemp = Math.round(data.daily.temperature_2m_min[0]);
                const code = data.daily.weather_code[0];
                const cloudCover = data.daily.cloud_cover_mean[0];

                results.push({
                    day: dayPlan.day,
                    temp: `${minTemp}°C / ${maxTemp}°C`,
                    icon: getWeatherIcon(code),
                    desc: getWeatherDesc(code),
                    fujiVisibility: getFujiVisibility(cloudCover),
                    isHistorical
                });
            }
        } catch (error) {
            console.error(`Failed to fetch weather for day ${dayPlan.day}`, error);
            // Fallback or empty
            results.push({
                day: dayPlan.day,
                temp: '--°C / --°C',
                icon: React.createElement(Sun, { className: "text-gray-300" }),
                desc: '無資料',
                fujiVisibility: '-',
                isHistorical
            });
        }
    }

    return results;
};
