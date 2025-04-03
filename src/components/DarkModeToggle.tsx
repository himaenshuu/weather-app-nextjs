'use client'

import { useState, useEffect } from 'react'
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'

export default function DarkModeToggle() {
    const [darkMode, setDarkMode] = useState(false)

    useEffect(() => {
        // Check initial dark mode preference
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setDarkMode(true)
            document.documentElement.classList.add('dark')
        } else {
            setDarkMode(false)
            document.documentElement.classList.remove('dark')
        }
    }, [])

    const toggleDarkMode = () => {
        if (darkMode) {
            document.documentElement.classList.remove('dark')
            localStorage.theme = 'light'
            setDarkMode(false)
        } else {
            document.documentElement.classList.add('dark')
            localStorage.theme = 'dark'
            setDarkMode(true)
        }
    }

    return (
        <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 
                        hover:bg-gray-300 dark:hover:bg-gray-600 
                        transition-all duration-200 
                        hover:scale-105 active:scale-95
                        ring-1 ring-gray-300 dark:ring-gray-500"
            aria-label="Toggle dark mode"
        >
            {darkMode ? (
                <SunIcon className="h-5 w-5 text-yellow-500 dark:text-yellow-300 
                                   transform transition-transform duration-500 rotate-0
                                   drop-shadow-[0_0_8px_rgba(255,255,0,0.3)]" />
            ) : (
                <MoonIcon className="h-5 w-5 text-gray-700 dark:text-gray-300
                                   transform transition-transform duration-500 rotate-0" />
            )}
        </button>
    )
} 