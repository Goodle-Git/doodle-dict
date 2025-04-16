import { useState, useEffect } from 'react';

const DEFAULT_SD_URL = 'https://8374-34-139-188-243.ngrok-free.app/generate';

export const useImageGenConfig = () => {
  const [useGemini, setUseGemini] = useState(() => {
    const saved = localStorage.getItem('useGemini');
    return saved !== null ? JSON.parse(saved) : true; // Default to true
  });

  const [stableDiffusionUrl, setStableDiffusionUrl] = useState(() => {
    const saved = localStorage.getItem('stableDiffusionUrl');
    return saved || DEFAULT_SD_URL;
  });

  const toggleImageGen = () => {
    setUseGemini(prev => !prev);
  };

  useEffect(() => {
    localStorage.setItem('useGemini', JSON.stringify(useGemini));
  }, [useGemini]);

  useEffect(() => {
    localStorage.setItem('stableDiffusionUrl', stableDiffusionUrl);
  }, [stableDiffusionUrl]);

  return { useGemini, toggleImageGen, stableDiffusionUrl, setStableDiffusionUrl };
};