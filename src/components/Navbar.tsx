/** @format */
"use client";

import React from "react";
import { MdOutlineLocationOn, MdWbSunny } from "react-icons/md";
import { MdMyLocation } from "react-icons/md";
import SearchBox from "./SearchBox";
import { useState } from "react";
import axios from "axios";
import { loadingCityAtom, placeAtom } from "@/app/atom";
import { useAtom } from "jotai";
import DarkModeToggle from './DarkModeToggle'
import { toast } from 'react-hot-toast'

interface NavbarProps {
  location?: string;
  onSearch?: (city: string) => void;
  recentSearches?: string[];
}

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY;

export default function Navbar({ location, onSearch, recentSearches = [] }: NavbarProps) {
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [place, setPlace] = useAtom(placeAtom);
  const [_, setLoadingCity] = useAtom(loadingCityAtom);

  async function handleInputChange(value: string) {
    setCity(value);
    if (value.length >= 3) {
      try {
        setLoadingCity(true);
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/find?q=${value}&appid=${API_KEY}`
        );

        const suggestions = response.data.list.map((item: any) => item.name);
        setSuggestions(suggestions);
        setError("");
        setShowSuggestions(true);
      } catch (error) {
        setSuggestions([]);
        setShowSuggestions(false);
        toast.error('Failed to fetch location suggestions');
      } finally {
        setLoadingCity(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }

  function handleSuggestionClick(value: string) {
    setCity(value);
    setShowSuggestions(false);
    handleSearch(value);
  }

  function handleSearch(searchCity: string = city) {
    setLoadingCity(true);
    if (suggestions.length === 0 && searchCity.length > 0) {
      setError("Location not found");
      setLoadingCity(false);
    } else {
      setError("");
      setTimeout(() => {
        setLoadingCity(false);
        setPlace(searchCity);
        onSearch?.(searchCity);
        setShowSuggestions(false);
      }, 500);
    }
  }

  async function handleCurrentLocation() {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    try {
      setLoadingCity(true);
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
      );

      setPlace(response.data.name);
      onSearch?.(response.data.name);
      toast.success(`Location updated to ${response.data.name}`);
    } catch (error) {
      toast.error('Failed to get your current location');
    } finally {
      setLoadingCity(false);
    }
  }

  return (
    <>
      <nav className="shadow-sm sticky top-0 left-0 z-50 bg-white dark:bg-gray-900 dark:text-white">
        <div className="h-[80px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto">
          {/* Left side - Weather title and location */}
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-gray-500 text-3xl dark:text-gray-300">Weather</h2>
            <div className="flex items-center justify-center gap-1">
              <p className="text-slate-900/80 text-sm dark:text-gray-300">
                {location}
              </p>
            </div>
          </div>

          {/* Right side - Search section, location buttons, and dark mode toggle */}
          <div className="flex items-center gap-4">
            {/* Dark mode toggle */}
            <DarkModeToggle />

            {/* Search and location section */}
            <div className="flex items-center gap-2">
              <div className="relative hidden md:flex">
                <SearchBox
                  value={city}
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch();
                  }}
                  onChange={(e) => handleInputChange(e.target.value)}
                  recentSearches={recentSearches}
                  onRecentSearchClick={handleSuggestionClick}
                />
                {((showSuggestions && suggestions.length > 0) || error) && (
                  <SuggestionBox
                    {...{
                      showSuggestions,
                      suggestions,
                      handleSuggestionClick,
                      error
                    }}
                  />
                )}
              </div>

              {/* Location buttons with improved visibility */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCurrentLocation}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full
                           transition-all duration-200 group"
                  title="Your Current Location"
                >
                  <MdMyLocation
                    className="text-2xl text-gray-500 dark:text-gray-400
                             group-hover:text-blue-500 dark:group-hover:text-blue-400
                             transition-colors duration-200
                             drop-shadow-sm dark:drop-shadow-[0_0_2px_rgba(255,255,255,0.3)]"
                  />
                </button>
                <div className="p-2">
                  <MdOutlineLocationOn
                    className="text-2xl text-gray-500 dark:text-gray-400
                             drop-shadow-sm dark:drop-shadow-[0_0_2px_rgba(255,255,255,0.3)]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile search box */}
      <section className="flex max-w-7xl px-3 md:hidden">
        <div className="relative w-full">
          <SearchBox
            value={city}
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            onChange={(e) => handleInputChange(e.target.value)}
            recentSearches={recentSearches}
            onRecentSearchClick={handleSuggestionClick}
          />
          {((showSuggestions && suggestions.length > 0) || error) && (
            <SuggestionBox
              {...{
                showSuggestions,
                suggestions,
                handleSuggestionClick,
                error
              }}
            />
          )}
        </div>
      </section>
    </>
  );
}

function SuggestionBox({
  showSuggestions,
  suggestions,
  handleSuggestionClick,
  error
}: {
  showSuggestions: boolean;
  suggestions: string[];
  handleSuggestionClick: (item: string) => void;
  error: string;
}) {
  return (
    <div className="absolute top-[44px] left-0 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md min-w-[200px] w-full">
      {error && suggestions.length < 1 && (
        <p className="px-4 py-2 text-red-500">{error}</p>
      )}
      {suggestions.map((item, i) => (
        <button
          key={i}
          onClick={() => handleSuggestionClick(item)}
          className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {item}
        </button>
      ))}
    </div>
  );
}
