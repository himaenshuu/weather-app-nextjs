import { useEffect, useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/solid'

interface ToastProps {
    message: string
    type: 'success' | 'error' | 'info'
    onClose: () => void
}

export default function Toast({ message, type, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
        }, 3000)

        return () => clearTimeout(timer)
    }, [onClose])

    const bgColor = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500'
    }[type]

    return (
        <div
            className={`transform transition-all duration-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                }`}
        >
            <div className={`${bgColor} text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2`}>
                <p className="flex-1">{message}</p>
                <button
                    onClick={() => setIsVisible(false)}
                    className="p-1 hover:opacity-80 transition-opacity"
                >
                    <XMarkIcon className="h-5 w-5" />
                </button>
            </div>
        </div>
    )
} 