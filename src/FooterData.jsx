import React, { useState, useEffect } from 'react';
import { Sun, CloudRain, CloudSnow, CloudFog, CloudLightning } from 'lucide-react';

// ==========================================
// CONFIGURATION
// ==========================================
const NOTION_DB_ID = '2b970823d45180fc9cb0e876e170c039'; 
const NOTION_KEY = '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'; 
// ==========================================

const SolidCloudIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M6.5 19C4.01472 19 2 16.9853 2 14.5C2 12.1564 3.79151 10.2313 6.07974 10.0194C6.54781 7.17213 9.02024 5 12 5C14.9798 5 17.4522 7.17213 17.9203 10.0194C20.2085 10.2313 22 12.1564 22 14.5C22 16.9853 19.9853 19 17.5 19H6.5Z" />
  </svg>
);

const getWeatherIcon = (code) => {
    const iconSize = 14;
    if (code === 0) return <Sun size={iconSize} />;
    if (code <= 3) return <SolidCloudIcon size={iconSize} />;
    if (code <= 48) return <CloudFog size={iconSize} />;
    if (code <= 67 || (code >= 80 && code <= 82)) return <CloudRain size={iconSize} />;
    if (code <= 77 || (code >= 85 && code <= 86)) return <CloudSnow size={iconSize} />;
    if (code >= 95) return <CloudLightning size={iconSize} />;
    return <SolidCloudIcon size={iconSize} />;
  };

const LiveFooterData = () => {
  const [locationData, setLocationData] = useState({
    city: 'HELSINKI',
    lat: 60.1699,
    lon: 24.9384,
    timezone: 'Europe/Helsinki'
  });
  
  const [weather, setWeather] = useState(null);
  const [time, setTime] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const notionRes = await fetch(`https://corsproxy.io/?https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${NOTION_KEY}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json'
          }
        });
        const notionData = await notionRes.json();
        let targetCity = 'HELSINKI';
        if (notionData.results && notionData.results.length > 0) {
           const cityValue = notionData.results[0].properties.City?.rich_text[0]?.plain_text;
           if (cityValue) targetCity = cityValue;
        }

        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${targetCity}&count=1&language=en&format=json`);
        const geoData = await geoRes.json();
        if (geoData.results && geoData.results.length > 0) {
          const location = geoData.results[0];
          const newLocation = {
            city: targetCity.toUpperCase(),
            lat: location.latitude,
            lon: location.longitude,
            timezone: location.timezone
          };
          setLocationData(newLocation);
          
          const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${newLocation.lat}&longitude=${newLocation.lon}&current_weather=true`);
          const weatherData = await weatherRes.json();
          setWeather(weatherData.current_weather);
        }
      } catch (error) {
        console.error("Signal lost:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      try {
        const timeString = now.toLocaleTimeString('en-US', { 
          timeZone: locationData.timezone, hour12: false, hour: '2-digit', minute: '2-digit' 
        });
        setTime(timeString);
      } catch (e) { setTime("00:00"); }
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [locationData]); 

  return (
    // Removed md:text-xs. Kept h-5 to align strictly with copyright text.
    <div 
      className="cursor-default flex items-center gap-2 h-5 text-sm"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
        <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-stone-600' : 'bg-orange-500'} animate-pulse flex-shrink-0`}></span>

        <span className={`uppercase tracking-wide transition-colors duration-300 ${isHovered ? 'text-orange-500' : ''}`}>
            {isLoading ? 'LOCATING...' : locationData.city}
        </span>

        <span className="text-stone-600 font-normal">
            {'//'}
        </span>

        {/* Reduced width from w-28 to w-24 to tighten the visual center */}
        <div className="relative h-5 overflow-hidden w-24">
            <div className={`absolute left-0 top-0 w-full h-full flex items-center transition-transform duration-500 ${isHovered ? '-translate-y-full' : 'translate-y-0'}`}>
                {time}
            </div>

            <div className={`absolute left-0 top-0 w-full h-full flex items-center gap-2 text-orange-500 transition-transform duration-500 ${isHovered ? 'translate-y-0' : '-translate-y-full'}`}>
                {weather ? (
                <>
                    <span>{weather.temperature}°</span>
                    <span className="text-stone-600">|</span>
                    {getWeatherIcon(weather.weathercode)}
                </>
                ) : (
                <span>NO DATA</span>
                )}
            </div>
        </div>
    </div>
  );
};

export default LiveFooterData;