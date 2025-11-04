import { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import Lottie from 'lottie-react';

interface SafeLottieProps {
  animationData: any;
  style?: React.CSSProperties;
  loop?: boolean;
  autoplay?: boolean;
  fallback?: React.ReactNode;
}

// Validate if data is a valid Lottie JSON structure
const isValidLottieData = (data: any): boolean => {
  if (!data || typeof data !== 'object') {
    return false;
  }
  
  try {
    // Basic validation: Lottie files should have v (version), fr (frame rate), w (width), h (height), and layers
    if (
      !(typeof data.v === 'string' || typeof data.v === 'number') ||
      typeof data.fr !== 'number' ||
      typeof data.w !== 'number' ||
      typeof data.h !== 'number' ||
      !Array.isArray(data.layers) ||
      data.layers.length === 0
    ) {
      return false;
    }
    
    // Validate layers structure - check for text layers that might be malformed
    for (const layer of data.layers) {
      if (!layer || typeof layer !== 'object') {
        return false;
      }
      
      // Check text layers - they need complete structure
      if (layer.ty === 5) { // Text layer type
        if (!layer.t || typeof layer.t !== 'object') {
          return false;
        }
        // Check if text document exists and has required properties
        if (!layer.t.d || typeof layer.t.d !== 'object' || !layer.t.d.k) {
          return false;
        }
        // Check text properties array
        const textProps = Array.isArray(layer.t.d.k) ? layer.t.d.k : [layer.t.d.k];
        for (const prop of textProps) {
          if (!prop || typeof prop !== 'object') {
            return false;
          }
          // Validate text style structure if present
          // Note: anchor point 'a' is optional in text styles
          if (prop.s && typeof prop.s === 'object') {
            // Check for required text style properties
            if (!prop.s.t && typeof prop.s.t !== 'string') {
              return false;
            }
          }
        }
      }
    }
    
    return true;
  } catch {
    return false;
  }
};

// Error Boundary component to catch Lottie rendering errors
class LottieErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode; animationData: any },
  { hasError: boolean; errorKey: number }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode; animationData: any }) {
    super(props);
    this.state = { hasError: false, errorKey: 0 };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error for debugging but don't crash the app
    console.warn('Lottie Error Boundary caught an error:', error.message);
  }

  componentDidUpdate(prevProps: { animationData: any }) {
    // Reset error boundary when animation data changes
    if (prevProps.animationData !== this.props.animationData && this.state.hasError) {
      this.setState({ hasError: false, errorKey: this.state.errorKey + 1 });
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default function SafeLottie({ 
  animationData, 
  style, 
  loop = true, 
  autoplay = true,
  fallback 
}: SafeLottieProps) {
  const [hasError, setHasError] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (animationData) {
      try {
        const valid = isValidLottieData(animationData);
        setIsValid(valid);
        setHasError(!valid);
      } catch (error) {
        setIsValid(false);
        setHasError(true);
      }
    } else {
      setIsValid(false);
      setHasError(false);
    }
  }, [animationData]);

  const defaultFallback = (
    <div style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
      {animationData ? 'Invalid animation data' : 'Loading...'}
    </div>
  );

  if (!animationData) {
    return fallback || defaultFallback;
  }

  if (hasError || !isValid) {
    return fallback || defaultFallback;
  }

  // Wrap Lottie in error boundary to catch any rendering errors
  return (
    <LottieErrorBoundary fallback={fallback || defaultFallback} animationData={animationData}>
      <Lottie
        animationData={animationData}
        style={style}
        loop={loop}
        autoplay={autoplay}
      />
    </LottieErrorBoundary>
  );
}

