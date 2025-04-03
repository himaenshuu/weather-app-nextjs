/** @format */

import React from "react";
import { LuEye, LuSunrise, LuSunset } from "react-icons/lu";
import { FiDroplet } from "react-icons/fi";
import { MdAir } from "react-icons/md";
import { ImMeter } from "react-icons/im";

export interface WeatherDetailProps {
  visability: string;
  humidity: string;
  windSpeed: string;
  airPressure: string;
  sunrise: string;
  sunset: string;
  isLoading?: boolean;
}

export default function WeatherDetails({
  visability,
  humidity,
  windSpeed,
  airPressure,
  sunrise,
  sunset,
  isLoading = false
}: WeatherDetailProps) {
  if (isLoading) {
    return <WeatherDetailsSkeleton />;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full">
      <SingleWeatherDetail
        icon={<LuEye className="text-blue-500 dark:text-blue-300" />}
        information="Visibility"
        value={visability}
      />
      <SingleWeatherDetail
        icon={<FiDroplet className="text-blue-500 dark:text-blue-300" />}
        information="Humidity"
        value={humidity}
      />
      <SingleWeatherDetail
        icon={<MdAir className="text-green-500 dark:text-green-300" />}
        information="Wind Speed"
        value={windSpeed}
      />
      <SingleWeatherDetail
        icon={<ImMeter className="text-yellow-500 dark:text-yellow-300" />}
        information="Pressure"
        value={airPressure}
      />
      <SingleWeatherDetail
        icon={<LuSunrise className="text-orange-500 dark:text-orange-300" />}
        information="Sunrise"
        value={sunrise}
      />
      <SingleWeatherDetail
        icon={<LuSunset className="text-red-500 dark:text-red-300" />}
        information="Sunset"
        value={sunset}
      />
    </div>
  );
}

export interface SingleWeatherDetailProps {
  information: string;
  icon: React.ReactNode;
  value: string;
}

function SingleWeatherDetail(props: SingleWeatherDetailProps) {
  return (
    <div className="flex flex-col justify-between gap-2 items-center p-4 rounded-lg
                    bg-white/40 dark:bg-gray-800/40 backdrop-blur-lg
                    transition-all duration-200
                    hover:scale-105 hover:bg-white/60 dark:hover:bg-gray-800/60
                    group">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {props.information}
      </p>
      <div className="text-3xl transform transition-all duration-200 
                      group-hover:scale-110 group-hover:rotate-[5deg]
                      drop-shadow-md dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.25)]">
        {props.icon}
      </div>
      <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
        {props.value}
      </p>
    </div>
  );
}
