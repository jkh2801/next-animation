import { isBrowser } from 'react-device-detect';
import { useEffect, useState } from 'react';
import WebBrickPage from '@domains/brick/WebBrickPage';

export default function BrickPage() {
  const [browser, setBrowser] = useState(false);
  useEffect(() => {
    setBrowser(isBrowser);
  }, []);
  return browser ? <WebBrickPage /> : <div></div>;
}
