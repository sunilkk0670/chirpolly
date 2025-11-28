import React from 'react';

// ChirPolly logo with vibrant parrot sitting on the P
export const ParrotIcon: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) => {
  return (
    <img
      src="/chirpolly-logo.png"
      alt="ChirPolly - Learn Languages. Be Heard."
      style={{ mixBlendMode: 'multiply' }}
      {...props}
    />
  );
};
