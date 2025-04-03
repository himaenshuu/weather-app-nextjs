/** @format */

import React from "react";
import Image from "next/image";
import { cn } from "@/utils/cn";

type Props = {};

export default function WeatherIcon(
  props: React.HTMLProps<HTMLDivElement> & { iconName: string }
) {
  return (
    <div 
      title={props.iconName} 
      {...props} 
      className={cn(
        "relative h-20 w-20",
        "dark:filter dark:brightness-110 dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.25)]",
        "transition-all duration-200",
        props.className
      )}
    >
      <Image
        width={100}
        height={100}
        alt="weather-icon"
        className="absolute h-full w-full"
        src={`https://openweathermap.org/img/wn/${props.iconName}@4x.png`}
      />
    </div>
  );
}
