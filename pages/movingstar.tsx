import { isBrowser } from 'react-device-detect';
import { useEffect, useState } from 'react';
import { WebMovingStarPage } from '@domains/movingstart/WebMovingStarPage';

export default function MovingStarPage() {
  const [browser, setBrowser] = useState(false);
  useEffect(() => {
    setBrowser(isBrowser);
  }, []);
  return browser ? <WebMovingStarPage /> : <div></div>;
}
