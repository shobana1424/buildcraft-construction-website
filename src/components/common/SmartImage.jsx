import { useState } from 'react';
import { ImageOff } from 'lucide-react';

// Image with graceful fallback so the layout never breaks if a remote image is unavailable.
export default function SmartImage({ src, alt = '', className = '', ...rest }) {
  const [failed, setFailed] = useState(false);
  if (failed || !src) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-navy to-royal text-white/70 ${className}`} role="img" aria-label={alt}>
        <ImageOff className="h-8 w-8" />
      </div>
    );
  }
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={className} {...rest} />;
}
