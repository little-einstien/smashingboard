import React from 'react';
import './baby-keyboard-logo-responsive.css';

interface ResponsiveBabyKeyboardLogoProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge' | 'auto';
  className?: string;
  style?: React.CSSProperties;
  maxWidth?: string | number;
  maxHeight?: string | number;
  alt?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

const ResponsiveBabyKeyboardLogo: React.FC<ResponsiveBabyKeyboardLogoProps> = ({
  size = 'auto',
  className = '',
  style = {},
  maxWidth,
  maxHeight,
  alt = 'Baby Keyboard Smashing Game Logo',
  loading = 'lazy',
  onLoad,
  onError
}) => {
  const sizeClass = size !== 'auto' ? `baby-keyboard-logo--${size}` : '';
  const combinedClassName = `baby-keyboard-logo ${sizeClass} ${className}`.trim();
  
  const combinedStyle: React.CSSProperties = {
    ...style,
    ...(maxWidth && { maxWidth }),
    ...(maxHeight && { maxHeight })
  };

  return (
    <div className="logo-container">
      <object
        data="/app/components/BabyKeyboardLogo.svg"
        type="image/svg+xml"
        className={combinedClassName}
        style={combinedStyle}
        aria-label={alt}
        onLoad={onLoad}
        onError={onError}
      >
        {/* Fallback for browsers that don't support SVG */}
        <img
          src="/app/components/BabyKeyboardLogo.svg"
          alt={alt}
          className={combinedClassName}
          style={combinedStyle}
          loading={loading}
          onLoad={onLoad}
          onError={onError}
        />
      </object>
    </div>
  );
};

export default ResponsiveBabyKeyboardLogo;

// Usage examples:
export const LogoExamples = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Logo Size Examples</h2>
      
      {/* Small icon size */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Small (Icon)</h3>
        <ResponsiveBabyKeyboardLogo size="small" />
      </div>
      
      {/* Medium size */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Medium</h3>
        <ResponsiveBabyKeyboardLogo size="medium" />
      </div>
      
      {/* Large size */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Large</h3>
        <ResponsiveBabyKeyboardLogo size="large" />
      </div>
      
      {/* Custom size with maxWidth */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Custom Size (300px max width)</h3>
        <ResponsiveBabyKeyboardLogo maxWidth="300px" />
      </div>
      
      {/* Responsive container */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Responsive (50% of container)</h3>
        <div style={{ width: '400px', border: '1px solid #ccc', padding: '10px' }}>
          <ResponsiveBabyKeyboardLogo style={{ width: '50%' }} />
        </div>
      </div>
      
      {/* Grid layout */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Grid Layout</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
          gap: '20px',
          border: '1px solid #ccc',
          padding: '20px'
        }}>
          <ResponsiveBabyKeyboardLogo />
          <ResponsiveBabyKeyboardLogo />
          <ResponsiveBabyKeyboardLogo />
          <ResponsiveBabyKeyboardLogo />
        </div>
      </div>
      
      {/* Flexbox layout */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Flexbox Layout</h3>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-around', 
          alignItems: 'center',
          border: '1px solid #ccc',
          padding: '20px',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <ResponsiveBabyKeyboardLogo size="small" />
          <ResponsiveBabyKeyboardLogo size="medium" />
          <ResponsiveBabyKeyboardLogo size="large" />
        </div>
      </div>
    </div>
  );
};