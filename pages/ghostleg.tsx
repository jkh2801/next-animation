import { isBrowser } from 'react-device-detect';
import { useEffect, useState } from 'react';
import WebGhostLegPage from '@domains/ghostleg/WebGhostLegPage';

export default function GhostLegPage() {
  const [browser, setBrowser] = useState(false);
  useEffect(() => {
    setBrowser(isBrowser);
  }, []);
  return browser ? <WebGhostLegPage /> : <div></div>;
}
