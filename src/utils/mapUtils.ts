export const getWeatherMapURL = (layer: string) => {
    return `https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}`
}

export const weatherLayers = [
    { id: 'temp_new', name: 'Temperature', icon: '🌡️' },
    { id: 'precipitation_new', name: 'Precipitation', icon: '🌧️' },
    { id: 'wind_new', name: 'Wind Speed', icon: '💨' },
    { id: 'clouds_new', name: 'Clouds', icon: '☁️' }
] as const 