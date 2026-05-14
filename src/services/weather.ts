import type { WeatherData } from '../types';

/**
 * 通过 wttr.in 免费 API 获取天气
 * 格式: ?format=j1 返回 JSON
 */
export async function fetchWeather(city?: string): Promise<WeatherData | null> {
  try {
    const url = city
      ? `https://wttr.in/${encodeURIComponent(city)}?format=j1`
      : `https://wttr.in?format=j1`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const data = await res.json();
    const current = data.current_condition?.[0];
    if (!current) return null;
    return {
      temp: current.temp_C,
      condition: current.weatherDesc?.[0]?.value || current.weatherCode,
      icon: weatherCodeToEmoji(current.weatherCode),
      humidity: current.humidity,
      wind: current.windSpeedKmph,
      location: data.nearest_area?.[0]?.areaName?.[0]?.value || '未知',
    };
  } catch {
    return null;
  }
}

function weatherCodeToEmoji(code: string): string {
  const map: Record<string, string> = {
    '113': '☀️', '116': '⛅', '119': '☁️', '122': '🌫️',
    '143': '🌫️', '176': '🌦️', '179': '🌨️', '182': '🌨️',
    '185': '🌨️', '200': '⛈️', '227': '🌬️', '230': '🌬️',
    '248': '🌫️', '260': '🌫️', '263': '🌧️', '266': '🌧️',
    '281': '🌧️', '284': '🌧️', '293': '🌧️', '296': '🌧️',
    '299': '🌧️', '302': '🌧️', '305': '🌧️', '308': '🌧️',
    '311': '🌧️', '314': '🌧️', '317': '🌧️', '320': '🌨️',
    '323': '🌨️', '326': '🌨️', '329': '🌨️', '332': '🌨️',
    '335': '🌨️', '338': '🌨️', '350': '🌨️', '353': '🌧️',
    '356': '🌧️', '359': '🌧️', '362': '🌨️', '365': '🌨️',
    '368': '🌨️', '371': '🌨️', '374': '🌨️', '377': '🌨️',
    '386': '⛈️', '389': '⛈️', '392': '⛈️', '395': '🌨️',
  };
  return map[code] || '🌤️';
}
