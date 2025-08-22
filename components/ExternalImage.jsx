import { useState, useEffect } from 'react';
import { ImageIcon, AlertCircle, RefreshCw } from 'lucide-react';

export default function ExternalImage({ 
  src, 
  alt, 
  className = "", 
  maxHeight = "16rem",
  fallbackText = "Gagal memuat gambar",
  showRetry = true 
}) {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const MAX_RETRIES = 2;
  
  // Proxy services untuk bypass CORS
  const PROXY_SERVICES = [
    (url) => `https://images.weserv.nl/?url=${encodeURIComponent(url.replace(/^https?:\/\//, ''))}`,
    (url) => `https://cors-anywhere.herokuapp.com/${url}`,
    (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  ];

  const handleImageError = () => {
    // console.error('Image failed to load:', imageSrc);
    
    if (retryCount < MAX_RETRIES && retryCount < PROXY_SERVICES.length) {
      const proxyUrl = PROXY_SERVICES[retryCount](src);
      console.log(`Trying proxy ${retryCount + 1}:`, proxyUrl);
      
      setRetryCount(prev => prev + 1);
      setImageSrc(proxyUrl);
      setIsLoading(true);
      setHasError(false);
    } else {
      setHasError(true);
      setIsLoading(false);
    }
  };

  const handleImageLoad = () => {
    console.log('Image loaded successfully:', imageSrc);
    setIsLoading(false);
    setHasError(false);
  };

  const handleRetry = () => {
    setRetryCount(0);
    setImageSrc(src);
    setIsLoading(true);
    setHasError(false);
  };

  useEffect(() => {
    setImageSrc(src);
    setIsLoading(true);
    setHasError(false);
    setRetryCount(0);
  }, [src]);

  if (hasError) {
    return (
      <div 
        className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 p-4 ${className}`}
        style={{ minHeight: maxHeight }}
      >
        <AlertCircle className="w-12 h-12 mb-2 text-gray-400" />
        <p className="text-sm font-medium mb-2">{fallbackText}</p>
        <p className="text-xs text-center text-gray-400 mb-3 max-w-xs break-all">
          {src}
        </p>
        {showRetry && (
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Coba Lagi
          </button>
        )}
        <a 
          href={src} 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-2 text-xs text-blue-600 hover:text-blue-800 hover:underline"
        >
          Buka link asli
        </a>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center animate-pulse"
          style={{ minHeight: maxHeight }}
        >
          <div className="flex flex-col items-center gap-2">
            <ImageIcon className="w-8 h-8 text-gray-400" />
            <span className="text-sm text-gray-500">Memuat gambar...</span>
          </div>
        </div>
      )}
      <img
        src={imageSrc}
        alt={alt}
        className={`w-full h-auto object-contain rounded-lg transition-all duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ maxHeight }}
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
  );
}
