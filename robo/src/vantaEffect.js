import { useEffect, useRef } from 'react';
import NET from 'vanta/dist/vanta.net.min.js';

const useVantaEffect = () => {
  const vantaEffect = useRef(null);

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    vantaEffect.current = NET({
      el: document.body,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: height,
      minWidth: width,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0x7067ff,
      backgroundColor: 0x000000
    });

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
      }
    };
  }, []);

  return vantaEffect;
};

export default useVantaEffect;
