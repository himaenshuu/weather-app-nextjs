'use client'

import { useEffect, useRef, useState } from 'react'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import XYZ from 'ol/source/XYZ'
import { fromLonLat } from 'ol/proj'
import 'ol/ol.css'

interface WeatherMapProps {
    center: [number, number] // [longitude, latitude]
    className?: string
}

const weatherLayers = [
    { id: 'temp_new', name: 'Temperature', icon: '🌡️' },
    { id: 'precipitation_new', name: 'Precipitation', icon: '🌧️' },
    { id: 'wind_new', name: 'Wind Speed', icon: '💨' },
    { id: 'clouds_new', name: 'Clouds', icon: '☁️' }
] as const

export default function WeatherMap({ center, className = '' }: WeatherMapProps) {
    const mapRef = useRef<HTMLDivElement>(null)
    const mapInstanceRef = useRef<Map | null>(null)
    const [activeLayer, setActiveLayer] = useState(weatherLayers[0].id)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!mapRef.current) return

        setIsLoading(true)

        try {
            // Initialize map
            const map = new Map({
                target: mapRef.current,
                layers: [
                    // Base map layer
                    new TileLayer({
                        source: new OSM()
                    }),
                    // Weather layer
                    new TileLayer({
                        source: new XYZ({
                            url: `https://tile.openweathermap.org/map/${activeLayer}/{z}/{x}/{y}.png?appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}`,
                            attributions: '© OpenWeatherMap'
                        }),
                        opacity: 0.6
                    })
                ],
                view: new View({
                    center: fromLonLat(center),
                    zoom: 10
                })
            })

            mapInstanceRef.current = map

            // Add event listener for map load
            map.once('postrender', () => {
                setIsLoading(false)
            })

            return () => {
                map.setTarget(undefined)
                mapInstanceRef.current = null
            }
        } catch (error) {
            console.error('Error initializing map:', error)
            setIsLoading(false)
        }
    }, [center])

    // Update weather layer when activeLayer changes
    useEffect(() => {
        if (!mapInstanceRef.current) return

        const map = mapInstanceRef.current
        const layers = map.getLayers()
        const weatherLayer = new TileLayer({
            source: new XYZ({
                url: `https://tile.openweathermap.org/map/${activeLayer}/{z}/{x}/{y}.png?appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}`,
                attributions: '© OpenWeatherMap'
            }),
            opacity: 0.6
        })

        // Remove old weather layer and add new one
        layers.removeAt(1)
        layers.insertAt(1, weatherLayer)
    }, [activeLayer])

    return (
        <div className="relative">
            {/* Map Container */}
            <div
                ref={mapRef}
                className={`w-full h-[400px] rounded-xl overflow-hidden shadow-lg ${className}`}
            />

            {/* Loading Overlay */}
            {isLoading && (
                <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 
                               flex items-center justify-center backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Loading map...
                        </p>
                    </div>
                </div>
            )}

            {/* Layer Controls */}
            <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 z-10">
                <div className="flex flex-col gap-1">
                    {weatherLayers.map((layer) => (
                        <button
                            key={layer.id}
                            onClick={() => setActiveLayer(layer.id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium
                         transition-colors duration-200
                         ${activeLayer === layer.id
                                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}
                        >
                            <span>{layer.icon}</span>
                            <span>{layer.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Attribution */}
            <div className="absolute bottom-0 right-0 bg-white/80 dark:bg-gray-800/80 text-xs px-2 py-1 rounded-tl-md">
                © OpenStreetMap contributors
            </div>
        </div>
    )
} 