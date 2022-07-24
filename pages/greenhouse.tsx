import { isBrowser } from 'react-device-detect';
import { useEffect, useState } from 'react';
import WebGreenHousePage from '@domains/greenhouse/WebGreenHousePage';

export default function GhostLegPage() {
  const [browser, setBrowser] = useState(false);
  useEffect(() => {
    setBrowser(isBrowser);
  }, []);
  return browser ? <WebGreenHousePage /> : <div></div>;
}
