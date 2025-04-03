/** @format */
"use client";

import Container from "@/components/Container";
import ForecastWeatherDetail from "@/components/ForecastWeatherDetail";
import Navbar from "@/components/Navbar";
import WeatherDetails from "@/components/WeatherDetails";
import WeatherIcon from "@/components/WeatherIcon";
import { convertKelvinToCelsius } from "@/utils/convertKelvinToCelsius";
import { convertWindSpeed } from "@/utils/convertWindSpeed";
import { getDayOrNightIcon } from "@/utils/getDayOrNightIcon";
import { metersToKilometers } from "@/utils/metersToKilometers";
import axios from "axios";
import { format, fromUnixTime, parseISO } from "date-fns";
import Image from "next/image";
import { useQuery } from "react-query";
import { loadingCityAtom, placeAtom } from "./atom";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import Toast from '@/components/Toast'
import ErrorBoundary from '@/components/ErrorBoundary'
import WeatherSkeleton from "@/components/WeatherSkeleton";
import dynamic from 'next/dynamic'
import { toast } from 'react-hot-toast'
import { Toaster } from 'react-hot-toast'

interface WeatherDetail {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  sys: {
    pod: string;
  };
  dt_txt: string;
}

interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherDetail[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

// Dynamically import the map component to avoid SSR issues
const WeatherMap = dynamic(() => import('@/components/WeatherMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] rounded-xl bg-gray-100 dark:bg-gray-800 
                    flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
    </div>
  )
})

export default function Home() {
  const [place, setPlace] = useAtom(placeAtom);
  const [loadingCity, setLoadingCity] = useAtom(loadingCityAtom);
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: 'success' | 'error' | 'info' }>>([])
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('recentSearches') || '[]')
    }
    return []
  })

  const { isLoading, error, data, refetch } = useQuery<WeatherData>(
    ["weather", place],
    async () => {
      try {
        const { data } = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
        );
        return data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          throw new Error('Location not found');
        }
        throw new Error('Failed to fetch weather data');
      }
    },
    {
      retry: false,
      onError: (error) => {
        toast.error(error.message);
      }
    }
  );

  useEffect(() => {
    refetch();
  }, [place, refetch]);

  const firstData = data?.list[0];

  const uniqueDates = [
    ...new Set(
      data?.list.map(
        (entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]
      )
    )
  ];

  const firstDataForEachDate = uniqueDates.map((date) => {
    return data?.list.find((entry) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
      const entryTime = new Date(entry.dt * 1000).getHours();
      return entryDate === date && entryTime >= 6;
    });
  });

  // Add toast handler
  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now()
    setToasts(current => [...current, { id, message, type }])
  }

  // Handle search
  const handleSearch = async (city: string) => {
    try {
      setLoadingCity(true)
      setPlace(city)

      // Add to recent searches
      const updatedSearches = [city, ...recentSearches.filter(s => s !== city)].slice(0, 5)
      setRecentSearches(updatedSearches)
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches))

      addToast(`Weather updated for ${city}`, 'success')
    } catch (error) {
      addToast(error.message || 'Failed to fetch weather data', 'error')
    } finally {
      setLoadingCity(false)
    }
  }

  // Add proper cleanup
  useEffect(() => {
    return () => {
      // Cleanup any subscriptions or timers
    };
  }, []);

  // Handle offline status
  useEffect(() => {
    const handleOffline = () => {
      toast.error('You are offline. Please check your internet connection.');
    };

    window.addEventListener('offline', handleOffline);
    return () => window.removeEventListener('offline', handleOffline);
  }, []);

  if (isLoading)
    return (
      <div className="flex items-center min-h-screen justify-center dark:bg-gray-900 dark:text-gray-200">
        <p className="animate-bounce">Loading...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex items-center min-h-screen justify-center dark:bg-gray-900">
        <p className="text-red-400">{error.message}</p>
      </div>
    );

  return (
    <ErrorBoundary>
      <div className="flex flex-col gap-4 bg-gray-100 dark:bg-gray-900 min-h-screen dark:text-gray-200">
        <Toaster position="bottom-right" />
        <Navbar
          location={data?.city.name}
          onSearch={handleSearch}
          recentSearches={recentSearches}
        />
        <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
          {loadingCity ? (
            <WeatherSkeleton />
          ) : (
            <>
              <section className="space-y-4">
                <div className="space-y-2">
                  <h2 className="flex gap-1 text-2xl items-end">
                    <p className="dark:text-gray-200">
                      {format(parseISO(firstData?.dt_txt ?? ""), "EEEE")}
                    </p>
                    <p className="text-lg dark:text-gray-300">
                      ({format(parseISO(firstData?.dt_txt ?? ""), "dd.MM.yyyy")})
                    </p>
                  </h2>
                  <Container className="gap-10 px-6 items-center dark:bg-gray-800">
                    {/* Temperature section */}
                    <div className="flex flex-col px-4">
                      <span className="text-5xl">
                        {convertKelvinToCelsius(firstData?.main.temp ?? 296.37)}°
                      </span>
                      <p className="text-xs space-x-1 whitespace-nowrap">
                        <span>Feels like</span>
                        <span>
                          {convertKelvinToCelsius(firstData?.main.feels_like ?? 0)}°
                        </span>
                      </p>
                      <p className="text-xs space-x-2">
                        <span>
                          {convertKelvinToCelsius(firstData?.main.temp_min ?? 0)}°↓
                        </span>
                        <span>
                          {convertKelvinToCelsius(firstData?.main.temp_max ?? 0)}°↑
                        </span>
                      </p>
                    </div>

                    {/* Weather timeline */}
                    <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                      {data?.list.map((d, i) => (
                        <div
                          key={i}
                          className="flex flex-col justify-between gap-2 items-center text-xs font-semibold"
                        >
                          <p className="whitespace-nowrap">
                            {format(parseISO(d.dt_txt), "h:mm a")}
                          </p>
                          <WeatherIcon
                            iconName={getDayOrNightIcon(
                              d.weather[0].icon,
                              d.dt_txt
                            )}
                          />
                          <p>{convertKelvinToCelsius(d?.main.temp ?? 0)}°</p>
                        </div>
                      ))}
                    </div>
                  </Container>
                </div>

                <div className="flex gap-4">
                  {/* Weather icon and description */}
                  <Container className="w-fit justify-center flex-col px-4 items-center dark:bg-gray-800">
                    <p className="capitalize text-center">
                      {firstData?.weather[0].description}
                    </p>
                    <WeatherIcon
                      iconName={getDayOrNightIcon(
                        firstData?.weather[0].icon ?? "",
                        firstData?.dt_txt ?? ""
                      )}
                    />
                  </Container>

                  {/* Weather details */}
                  <Container className="bg-yellow-300/80 dark:bg-yellow-300/20 px-6 gap-4 justify-between overflow-x-auto">
                    <WeatherDetails
                      visability={metersToKilometers(firstData?.visibility ?? 10000)}
                      airPressure={`${firstData?.main.pressure} hPa`}
                      humidity={`${firstData?.main.humidity}%`}
                      sunrise={format(data?.city.sunrise ?? 1702949452, "H:mm")}
                      sunset={format(data?.city.sunset ?? 1702517657, "H:mm")}
                      windSpeed={convertWindSpeed(firstData?.wind.speed ?? 1.64)}
                    />
                  </Container>
                </div>
              </section>

              {/* Weather Map Section */}
              {data && (
                <section className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold dark:text-gray-200">
                      Weather Map
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {data.city.name}, {data.city.country}
                    </p>
                  </div>
                  <WeatherMap
                    center={[
                      data.city.coord.lon,
                      data.city.coord.lat
                    ]}
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                </section>
              )}

              {/* Forecast section */}
              <section className="flex w-full flex-col gap-4">
                <p className="text-2xl">Forecast (7 days)</p>
                {firstDataForEachDate.map((d, i) => (
                  <ForecastWeatherDetail
                    key={i}
                    description={d?.weather[0].description ?? ""}
                    weatehrIcon={d?.weather[0].icon ?? "01d"}
                    date={d ? format(parseISO(d.dt_txt), "dd.MM") : ""}
                    day={d ? format(parseISO(d.dt_txt), "EEEE") : ""}
                    feels_like={d?.main.feels_like ?? 0}
                    temp={d?.main.temp ?? 0}
                    temp_max={d?.main.temp_max ?? 0}
                    temp_min={d?.main.temp_min ?? 0}
                    airPressure={`${d?.main.pressure} hPa`}
                    humidity={`${d?.main.humidity}%`}
                    sunrise={format(
                      fromUnixTime(data?.city.sunrise ?? 1702517657),
                      "H:mm"
                    )}
                    sunset={format(
                      fromUnixTime(data?.city.sunset ?? 1702517657),
                      "H:mm"
                    )}
                    windSpeed={convertWindSpeed(d?.wind.speed ?? 1.64)}
                  />
                ))}
              </section>
            </>
          )}
        </main>

        {/* Toast Container */}
        <div className="fixed bottom-4 right-4 space-y-2 z-50">
          {toasts.map(toast => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={() => setToasts(current =>
                current.filter(t => t.id !== toast.id)
              )}
            />
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
}
