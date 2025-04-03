export default function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center min-h-[200px]">
            <div className="relative w-10 h-10">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full animate-pulse"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
            </div>
        </div>
    );
} 