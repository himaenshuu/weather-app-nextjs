export default function WeatherSkeleton() {
    return (
        <div className="space-y-8">
            {/* Date skeleton */}
            <div className="flex gap-2 items-end animate-pulse">
                <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>

            {/* Temperature and timeline skeleton */}
            <div className="animate-pulse">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                    <div className="flex flex-col md:flex-row gap-10">
                        {/* Temperature skeleton */}
                        <div className="space-y-2">
                            <div className="h-12 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>

                        {/* Timeline skeleton */}
                        <div className="flex gap-10 overflow-x-auto w-full justify-between">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex flex-col items-center gap-2">
                                    <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                                    <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Weather details skeleton */}
            <div className="flex gap-4">
                {/* Left container skeleton */}
                <div className="w-fit animate-pulse">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                        <div className="space-y-4">
                            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
                            <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto"></div>
                        </div>
                    </div>
                </div>

                {/* Right container skeleton */}
                <div className="flex-1 animate-pulse">
                    <div className="bg-yellow-300/80 dark:bg-yellow-300/20 rounded-xl p-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="flex flex-col items-center gap-2">
                                    <div className="h-4 w-16 bg-gray-200/50 dark:bg-gray-700/50 rounded"></div>
                                    <div className="h-8 w-8 bg-gray-200/50 dark:bg-gray-700/50 rounded-full"></div>
                                    <div className="h-4 w-12 bg-gray-200/50 dark:bg-gray-700/50 rounded"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 