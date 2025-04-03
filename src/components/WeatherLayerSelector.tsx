interface WeatherLayerOption {
    id: string
    name: string
    tile: string
    icon: React.ReactNode
}

const weatherLayers: WeatherLayerOption[] = [
    {
        id: 'temp_new',
        name: 'Temperature',
        tile: 'temp_new',
        icon: '🌡️'
    },
    {
        id: 'precipitation_new',
        name: 'Precipitation',
        tile: 'precipitation_new',
        icon: '🌧️'
    },
    {
        id: 'wind_new',
        name: 'Wind Speed',
        tile: 'wind_new',
        icon: '💨'
    },
    {
        id: 'clouds_new',
        name: 'Clouds',
        tile: 'clouds_new',
        icon: '☁️'
    }
]

interface Props {
    selectedLayer: string
    onLayerChange: (layer: string) => void
}

export default function WeatherLayerSelector({ selectedLayer, onLayerChange }: Props) {
    return (
        <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2">
            <div className="flex flex-col gap-1">
                {weatherLayers.map((layer) => (
                    <button
                        key={layer.id}
                        onClick={() => onLayerChange(layer.id)}
                        className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium",
                            "transition-colors duration-200",
                            selectedLayer === layer.id
                                ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                                : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                        )}
                    >
                        <span>{layer.icon}</span>
                        <span>{layer.name}</span>
                    </button>
                ))}
            </div>
        </div>
    )
} 